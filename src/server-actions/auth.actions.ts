// ============================================================
// server-actions/auth.actions.ts — Server Actions для авторизации
// ============================================================
//
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ЧТО ТАКОЕ SERVER ACTIONS?
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//
// 'use server' (строка ниже) — директива Next.js.
// Она говорит: "все функции в этом файле выполняются ТОЛЬКО на сервере".
//
// Как это работает технически:
//   1. Ты вызываешь loginAction({ email, password }) в authStore (клиент)
//   2. Next.js НЕ выполняет функцию в браузере
//   3. Next.js делает зашифрованный POST-запрос к своему серверу
//   4. Сервер выполняет функцию и возвращает результат
//   5. Клиент получает результат как будто вызвал обычную async-функцию
//
// Зачем это лучше axios на клиенте?
//
//   axios на клиенте:
//     Browser → (запрос с токеном) → API бэкенд
//     Проблема: браузер видит запросы, CORS нужен, токен в DevTools
//
//   Server Action:
//     Browser → Next.js сервер → (запрос) → API бэкенд
//     Плюсы: нет CORS, запросы к бэкенду не видны в браузере
//
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ПОТОК ДАННЫХ (повторяет схему из lib/api.ts):
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//
//   authStore.ts           ← вызывает loginAction(email, password)
//       ↓
//   auth.actions.ts (этот файл) ← формирует payload, вызывает apiFetch
//       ↓
//   lib/api.ts             ← добавляет заголовки, делает fetch
//       ↓
//   Backend /api/v1/login  ← реальный HTTP запрос
//       ↓
//   lib/api.ts             ← парсит ответ или кидает ApiError
//       ↓
//   auth.actions.ts        ← возвращает данные или прокидывает ошибку
//       ↓
//   authStore.ts           ← сохраняет user + accessToken, или ловит ошибку
//
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

'use server'

import { apiFetch } from '@/lib/api'
// Типы берём из сгенерированной схемы бэкенда (bun run api:types).
// Меняется API → перегенерировали → типы обновились автоматически.
import type { components } from '@/shared/types/api-schema'

// ─────────────────────────────────────────────────────────────
// Payload-типы (что отправляем на бэкенд)
// ─────────────────────────────────────────────────────────────

type LoginPayload = components['schemas']['AuthRequest']
// { email: string, password: string }

type RegisterPayload = components['schemas']['RegistrationRequest']
// { name, email, password, password_confirmation, mailing_enabled, terms_accepted }

type UpdatePasswordPayload = components['schemas']['UpdatePasswordRequest']
// { old_password, password, password_confirmation }

// ─────────────────────────────────────────────────────────────
// Response-типы (что получаем от бэкенда)
// ─────────────────────────────────────────────────────────────

// POST /login → 200: токен + флаг верификации email
// ИЛИ данные для 2FA — бэкенд возвращает один из двух вариантов
type LoginResponse =
	| { access_token: string; email_is_verified: boolean }
	| {
			two_factor_token: string
			two_factor_email_enabled: boolean
			two_factor_google_authenticator_enabled: boolean
	  }

// POST /registration → 201: только job_id фоновой задачи, юзера нет.
// Пользователь после регистрации должен подтвердить email — не логиним сразу.
type RegisterResponse = { job_id?: string } | null

// ─────────────────────────────────────────────────────────────
// ACTION: loginAction
// ─────────────────────────────────────────────────────────────
//
// Принимает данные из authStore.login(email, password)
// Отправляет POST /login на бэкенд
// Возвращает { data: { user, tokens }, message, success }
//
// ⚠️  Ошибки (ApiError) НЕ ловим здесь — пусть прокидываются в authStore.
//    Там мы знаем что с ними делать (показать в форме).

export async function loginAction(
	payload: LoginPayload
): Promise<LoginResponse> {
	const res = await apiFetch<LoginResponse>('/login', {
		method: 'POST',
		body: payload,
	})
	return res.data
}

// ─────────────────────────────────────────────────────────────
// ACTION: registerAction
// ─────────────────────────────────────────────────────────────
//
// После успешной регистрации бэкенд запускает фоновую задачу
// (определение валюты/языка/timezone) и возвращает её job_id.
// Юзера в ответе нет — пользователь должен подтвердить email.

export async function registerAction(
	payload: RegisterPayload
): Promise<RegisterResponse> {
	const res = await apiFetch<RegisterResponse>('/registration', {
		method: 'POST',
		body: payload,
	})
	return res.data
}

// ─────────────────────────────────────────────────────────────
// ACTION: updatePasswordAction
// ─────────────────────────────────────────────────────────────
//
// Смена пароля для авторизованного пользователя.
// Требует старый пароль + новый + подтверждение.

export async function updatePasswordAction(
	payload: UpdatePasswordPayload,
	token: string
): Promise<void> {
	await apiFetch('/updatePassword', {
		method: 'POST',
		body: payload,
		token,
	})
}
// ─────────────────────────────────────────────────────────────
// ACTION: logoutAction
// ─────────────────────────────────────────────────────────────
//
// Сообщает бэкенду что пользователь вышел.
// Бэкенд инвалидирует refresh-токен (он больше не сможет обновить access).
//
// token — текущий accessToken из authStore, нужен для авторизации запроса.
//
// Ошибки глотаем намеренно (try/catch без rethrow):
//   даже если бэкенд недоступен — локально всё равно разлогиниваем.
//   Сессия на сервере рано или поздно истечёт сама.

export async function logoutAction(token: string): Promise<void> {
	try {
		await apiFetch('/logout', {
			method: 'POST',
			token // добавит заголовок Authorization: Bearer <token>
		})
	} catch {
		// Намеренно пустой catch: logout всегда успешен с точки зрения UI
	}
}

// ─────────────────────────────────────────────────────────────
// ACTION: refreshTokenAction
// ─────────────────────────────────────────────────────────────
//
// Обновляет истёкший accessToken.
//
// КАК РАБОТАЮТ ТОКЕНЫ (коротко):
//   accessToken  — живёт 15 минут. Используется в каждом API-запросе.
//   refreshToken — живёт 30 дней. Хранится в httpOnly cookie (бэкенд ставит).
//
// httpOnly cookie — браузер отправляет её автоматически при запросе к бэкенду,
// но JavaScript её прочитать не может. Это защита от XSS-атак.
//
// Алгоритм:
//   1. Запрос к бэкенду падает с 401 (accessToken истёк)
//   2. authStore вызывает refreshTokenAction()
//   3. Бэкенд видит refreshToken в cookie, выдаёт новый accessToken
//   4. authStore сохраняет новый accessToken и повторяет упавший запрос
//
// TODO: Реализовать логику повтора запроса в authStore когда будет бэкенд.

export async function refreshTokenAction(): Promise<{ access_token: string }> {
	// credentials: 'include' — передаёт httpOnly cookie с refresh-токеном.
	// Без этого бэкенд не поймёт кого обновлять.
	const res = await apiFetch<{ access_token: string }>('/refresh', {
		method: 'POST',
		credentials: 'include',
	})
	return res.data
}
