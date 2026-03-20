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
import type { IApiResponse } from '@/shared/types/api.types'
import type { IAuthTokens, IUser } from '@/shared/types/auth.types'

// ─────────────────────────────────────────────────────────────
// Типы данных (payload = то что отправляем на бэкенд)
// ─────────────────────────────────────────────────────────────

interface LoginPayload {
	// Поле называется email, но принимает и username — бэкенд сам разберётся.
	// Поэтому в loginSchema поле тоже называется email (см. auth.schema.ts).
	email: string
	password: string
}

interface RegisterPayload {
	email: string
	username: string
	password: string
}

// Тип данных которые вернёт бэкенд при логине/регистрации.
// Это поле data внутри IApiResponse<T>.
// Итоговый ответ: { data: AuthResponse, message: "...", success: true }
interface AuthResponse {
	user: IUser
	tokens: IAuthTokens // { accessToken: string, refreshToken: string }
}

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
): Promise<IApiResponse<AuthResponse>> {
	// apiFetch из lib/api.ts — собирает запрос и делает fetch
	// Токен не передаём — при логине он ещё не известен
	return apiFetch<AuthResponse>('/login', {
		method: 'POST',
		body: payload // apiFetch сам сделает JSON.stringify
	})
}

// ─────────────────────────────────────────────────────────────
// ACTION: registerAction
// ─────────────────────────────────────────────────────────────
//
// Принимает данные из authStore.registration(email, username, password)
// Отправляет POST /registration на бэкенд
// Возвращает те же данные что и loginAction (user + tokens)

export async function registerAction(
	payload: RegisterPayload
): Promise<IApiResponse<AuthResponse>> {
	return apiFetch<AuthResponse>('/registration', {
		method: 'POST',
		body: payload
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

export async function refreshTokenAction(): Promise<
	IApiResponse<{ accessToken: string }>
> {
	// credentials: 'include' — говорит fetch передать cookies к бэкенду.
	// Без этого httpOnly refresh-токен не будет отправлен!
	return apiFetch<{ accessToken: string }>('/refresh', {
		method: 'POST',
		credentials: 'include'
	})
}
