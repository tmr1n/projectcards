// ============================================================
// authStore.ts — Глобальное хранилище состояния авторизации
// ============================================================
//
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ЧТО ТАКОЕ STORE (Хранилище)?
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//
//  Представь: LoginForm, Header, Dashboard — три разных
//  компонента, каждый хочет знать: "пользователь залогинен?"
//
//  БЕЗ Store:
//    Пришлось бы передавать данные через props вниз по дереву:
//    App → Layout → Header → UserAvatar (и везде пробрасывать)
//    Это называется "prop drilling" — боль и ужас.
//
//  СО Store (Zustand):
//    Любой компонент напрямую вызывает useAuthStore()
//    и сразу получает актуальные данные. Никакого прокидывания.
//
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ЧТО ТАКОЕ ZUSTAND?
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//
//  Zustand (нем. "состояние") — самая простая библиотека
//  глобального состояния для React.
//
//  Сравни с альтернативами:
//  ┌─────────────────┬──────────────┬───────────────────────┐
//  │ Библиотека      │ Сложность    │ Размер                │
//  ├─────────────────┼──────────────┼───────────────────────┤
//  │ Redux Toolkit   │ Высокая      │ ~47kb (много кода)    │
//  │ React Context   │ Средняя      │ 0kb (встроен в React) │
//  │ Zustand         │ Низкая       │ ~1kb (наш выбор ✓)    │
//  └─────────────────┴──────────────┴───────────────────────┘
//
//  Главное преимущество Zustand перед React Context:
//  — НЕ нужен Provider (не нужно оборачивать App)
//  — Быстрее: компонент перерисовывается только если изменилось
//    именно то поле, которое он читает
//
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// КАК ИСПОЛЬЗОВАТЬ В КОМПОНЕНТЕ (краткая шпаргалка):
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//
//  // Получить данные:
//  const user = useAuthStore(state => state.user)
//  const isAuthenticated = useAuthStore(state => state.isAuthenticated)
//
//  // Получить действие (функцию):
//  const login = useAuthStore(state => state.login)
//  const logout = useAuthStore(state => state.logout)
//
//  // Использовать:
//  await login(email, password)   // в LoginForm на submit
//  logout()                       // в Header на кнопку "Выйти"
//
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { ApiError } from '@/lib/api'
import {
	loginAction,
	logoutAction,
	registerAction
} from '@/server-actions/auth.actions'
import type { components } from '@/shared/types/api-schema'

type RegisterPayload = components['schemas']['RegistrationRequest']

// ─────────────────────────────────────────────────────────────
// ВСПОМОГАТЕЛЬНАЯ ФУНКЦИЯ
// ─────────────────────────────────────────────────────────────
//
// Бэкенд возвращает ошибки полей как массивы строк:
//   { email: ['Email уже занят', 'Проверьте формат'] }
//
// В store хранятся как одна строка на поле:
//   { email: 'Email уже занят' }
//
// Берём только первое сообщение — остальные обычно дублируют смысл.

function flattenFieldErrors(
	errors: Record<string, string[]>
): Record<string, string> {
	return Object.fromEntries(
		Object.entries(errors).map(([field, messages]) => [field, messages[0]])
	)
}

// ─────────────────────────────────────────────────────────────
// ТИПЫ STORE
// ─────────────────────────────────────────────────────────────
//
// Store делится на две части:
//   AuthState   = данные (что хранится)
//   AuthActions = функции (что можно делать с данными)
//
// Разделяем их по двум интерфейсам для читаемости.

interface AuthState {
	// null пока нет эндпоинта /profile — после логина объект юзера не приходит
	user: null

	accessToken: string | null
	isAuthenticated: boolean
	isLoading: boolean
	error: string | null
	serverFieldErrors: Partial<Record<string, string>> | null

	// Email сохраняем чтобы показать его на странице подтверждения email
	pendingEmail: string | null

	// Токен для прохождения 2FA — приходит вместо access_token если включена двухфакторка
	twoFactorToken: string | null
}

interface AuthActions {
	login: (email: string, password: string) => Promise<void>
	registration: (payload: RegisterPayload) => Promise<void>
	logout: () => void
	clearError: () => void
}

// ─────────────────────────────────────────────────────────────
// СОЗДАНИЕ STORE
// ─────────────────────────────────────────────────────────────
//
// create<T>()(callback) — главная функция Zustand.
//
// Двойные скобки create<T>()() — это из-за middleware (persist).
// Без middleware было бы create<T>(callback).
//
// persist(callback, config) — middleware, которое автоматически
// сохраняет state в localStorage. Благодаря этому пользователь
// остаётся залогиненным после перезагрузки страницы.
//
// (set, get) — аргументы callback:
//   set(partialState)    — обновить поля в store (как setState)
//   get()                — прочитать текущий state внутри action
//   (get здесь не нужен, но полезно знать что он есть)

export const useAuthStore = create<AuthState & AuthActions>()(
	persist(
		(set, get) => ({
			// ─────────────────────────────────────────────────
			// НАЧАЛЬНОЕ СОСТОЯНИЕ
			// Эти значения устанавливаются когда приложение
			// только запускается (и пользователь не залогинен).
			// ─────────────────────────────────────────────────

			user: null,
			accessToken: null,
			isAuthenticated: false,
			isLoading: false,
			error: null,
			serverFieldErrors: null,
			pendingEmail: null,
			twoFactorToken: null,

			// ─────────────────────────────────────────────────
			// ACTION: login
			// ─────────────────────────────────────────────────
			//
			// Вызывается из LoginForm при submit.
			// Последовательность:
			//   1. isLoading = true → появляется лоадер
			//   2. Вызываем loginAction (Server Action) → запрос к бэкенду
			//   3. Бэкенд вернул { data: { user, tokens }, success: true }
			//   4. Сохраняем user + accessToken в store
			//   5. isLoading = false, лоадер пропадает
			//
			// Если бэкенд вернул ошибку:
			//   err instanceof ApiError → ошибка с HTTP-кодом
			//     statusCode 422 → ошибки полей (email занят, неверный пароль)
			//       → serverFieldErrors → появится в label нужного поля
			//     другой код → общая ошибка → error → красный баннер
			//   обычная Error → нет сети / Next.js упал → общая ошибка

			login: async (email, password) => {
				set({ isLoading: true, error: null, serverFieldErrors: null })

				try {
					const response = await loginAction({ email, password })

					// Бэкенд возвращает один из двух вариантов:
					// 1. Обычный логин: { access_token, email_is_verified }
					// 2. Двухфакторка: { two_factor_token, ... }
					if ('two_factor_token' in response) {
						// 2FA — сохраняем токен, форма проверит и перенаправит
						set({
							twoFactorToken: response.two_factor_token,
							pendingEmail: email,
							isLoading: false,
						})
					} else {
						// Обычный логин — email_is_verified определяет куда редиректить.
						// Форма сама читает isAuthenticated и делает router.push.
						set({
							accessToken: response.access_token,
							isAuthenticated: response.email_is_verified,
							pendingEmail: email,
							isLoading: false,
							error: null,
						})
					}
				} catch (err) {
					if (err instanceof ApiError) {
						set({
							serverFieldErrors: err.fieldErrors
								? flattenFieldErrors(err.fieldErrors)
								: null,
							error: err.fieldErrors ? null : err.message,
							isLoading: false,
						})
					} else {
						set({
							error: 'Ошибка входа. Проверьте соединение и попробуйте ещё раз.',
							isLoading: false,
						})
					}
				}
			},

			// ─────────────────────────────────────────────────
			// ACTION: registration
			// ─────────────────────────────────────────────────
			//
			// Вызывается из RegistrationForm при submit.
			// Логика обработки ошибок аналогична login.
			// Бэкенд может вернуть serverFieldErrors:
			//   { email: "Email уже занят", username: "Имя уже занято" }
			// Они автоматически появятся в label нужных полей формы.

			registration: async (payload) => {
				set({ isLoading: true, error: null, serverFieldErrors: null })

				try {
					// После регистрации бэкенд возвращает только job_id фоновой задачи.
					// Юзера нет — нужно подтвердить email прежде чем логинить.
					await registerAction(payload)

					set({
						pendingEmail: payload.email,
						isLoading: false,
						error: null,
					})
				} catch (err) {
					if (err instanceof ApiError) {
						set({
							serverFieldErrors: err.fieldErrors
								? flattenFieldErrors(err.fieldErrors)
								: null,
							error: err.fieldErrors ? null : err.message,
							isLoading: false,
						})
					} else {
						set({
							error: 'Ошибка регистрации. Проверьте соединение и попробуйте ещё раз.',
							isLoading: false,
						})
					}
				}
			},

			// ─────────────────────────────────────────────────
			// ACTION: logout
			// ─────────────────────────────────────────────────
			//
			// Сообщает бэкенду о выходе (инвалидирует refresh-токен),
			// затем сбрасывает state в начальные значения.
			// persist middleware автоматически очистит localStorage.

			logout: () => {
				// Достаём текущий токен чтобы передать в logoutAction
				const { accessToken } = get()

				// Вызываем Server Action (не ждём результата — logout всегда успешен)
				// logoutAction глотает ошибки внутри себя (см. auth.actions.ts)
				if (accessToken) void logoutAction(accessToken)

				set({
					user: null,
					accessToken: null,
					isAuthenticated: false,
					error: null,
					serverFieldErrors: null
				})
			},

			// ─────────────────────────────────────────────────
			// ACTION: clearError
			// ─────────────────────────────────────────────────
			//
			// Вызывается когда пользователь начал вводить после ошибки.
			// Убирает красное сообщение об ошибке сервера.

			clearError: () => set({ error: null, serverFieldErrors: null })
		}),

		// ─────────────────────────────────────────────────────
		// КОНФИГУРАЦИЯ persist middleware
		// ─────────────────────────────────────────────────────
		//
		// persist сохраняет state в localStorage автоматически.
		// При следующем открытии страницы — восстанавливает его.
		//
		// name: ключ в localStorage. Открой DevTools → Application
		//   → Local Storage → увидишь запись "langcards-auth".
		//
		// partialize: говорит "сохраняй только эти поля".
		//   isLoading и error не сохраняем — они временные.
		//   Сохраняем только user, accessToken, isAuthenticated.

		{
			name: 'langcards-auth',
			partialize: state => ({
				user: state.user,
				accessToken: state.accessToken,
				isAuthenticated: state.isAuthenticated
			})
		}
	)
)
