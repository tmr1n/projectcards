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
// ApiError — кастомный класс ошибки из lib/api.ts.
// Позволяет различать: ошибка поля формы (422) vs общая ошибка (500) vs 401.
import { ApiError } from '@/lib/api'
// Server Actions из src/server-actions/auth.actions.ts.
// Они выполняются на сервере, но вызываются как обычные async-функции.
import {
	loginAction,
	logoutAction,
	registerAction
} from '@/server-actions/auth.actions'
import type { IUser } from '@/shared/types/auth.types'

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

// STATE — данные, которые хранятся глобально
interface AuthState {
	// Объект текущего пользователя (из auth.types.ts).
	// null = пользователь не авторизован.
	user: IUser | null

	// JWT access-токен — строка, которую сервер выдаёт при входе.
	// Пример: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjMi..."
	// Отправляется в заголовке каждого API-запроса: Authorization: Bearer <token>
	// Живёт ~15 минут, потом надо обновлять через refreshToken.
	accessToken: string | null

	// Удобный флаг: авторизован ли пользователь.
	// Вместо того чтобы везде писать `user !== null`, пишем `isAuthenticated`.
	isAuthenticated: boolean

	// Идёт ли прямо сейчас запрос к серверу.
	// Пока true — показываем лоадер на кнопке (FormLoader).
	isLoading: boolean

	// Общее сообщение об ошибке от сервера.
	// Для ошибок не привязанных к конкретному полю: "Ошибка сети", "Сервер недоступен".
	// null = ошибок нет.
	error: string | null

	// Ошибки привязанные к конкретным полям формы.
	// Сервер возвращает их когда знает что именно не так:
	//   { email: "Email уже занят", username: "Имя пользователя занято" }
	//
	// Partial<Record<string, string>> означает:
	//   объект где ключи — строки (имена полей), значения — строки (тексты ошибок)
	//   Partial = все ключи опциональны (не обязательно должны быть оба)
	//
	// В форме читаем: serverFieldErrors?.email → передаём в label email-поля
	serverFieldErrors: Partial<Record<string, string>> | null
	pendingEmail: string | null
}

// ACTIONS — функции для изменения State
interface AuthActions {
	// Войти в систему. Принимает данные из LoginForm.
	login: (
		email: string,
		password: string,
		pendingEmail: string
	) => Promise<void>

	// Зарегистрироваться. Принимает данные из RegistrationForm.
	registration: (
		email: string,
		username: string,
		password: string,
		pendingEmail: string
	) => Promise<void>

	// Выйти: сбросить всё состояние в начальное.
	logout: () => void

	// Сбросить ошибку (например, когда пользователь начал вводить).
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

			login: async (email, password, pendingEmail) => {
				// Сбрасываем все ошибки от предыдущей попытки, включаем лоадер
				set({ isLoading: true, error: null, serverFieldErrors: null })

				try {
					// loginAction — Server Action из auth.actions.ts.
					// Выполняется на сервере, делает POST /login к бэкенду.
					// Возвращает IApiResponse<AuthResponse>:
					//   { data: { user: IUser, tokens: IAuthTokens }, message: string, success: true }
					const response = await loginAction({ email, password, pendingEmail })

					// set() — обновляет только перечисленные поля.
					// Остальные поля store НЕ затрагивает.
					set({
						user: response.data.user,
						accessToken: response.data.tokens.accessToken,
						isAuthenticated: true,
						isLoading: false,
						error: null,
						pendingEmail: email
					})
				} catch (err) {
					// ApiError — ошибка которую кинул lib/api.ts когда бэкенд вернул 4xx/5xx
					if (err instanceof ApiError) {
						set({
							// Если бэкенд прислал ошибки по полям — показываем их в формe
							// Если нет (общая ошибка типа "неверный пароль") — в баннер
							serverFieldErrors: err.fieldErrors
								? flattenFieldErrors(err.fieldErrors)
								: null,
							error: err.fieldErrors ? null : err.message,
							isLoading: false
						})
					} else {
						// Неожиданная ошибка: нет сети, Next.js недоступен и т.д.
						set({
							error: 'Ошибка входа. Проверьте соединение и попробуйте ещё раз.',
							isLoading: false
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

			registration: async (email, username, password, pendingEmail) => {
				set({ isLoading: true, error: null, serverFieldErrors: null })

				try {
					// registerAction — Server Action из auth.actions.ts.
					// Делает POST /registration к бэкенду.
					const response = await registerAction({
						email,
						username,
						password,
						pendingEmail
					})

					set({
						user: response.data.user,
						accessToken: response.data.tokens.accessToken,
						isAuthenticated: true,
						isLoading: false,
						error: null,
						pendingEmail: email
					})
				} catch (err) {
					if (err instanceof ApiError) {
						set({
							serverFieldErrors: err.fieldErrors
								? flattenFieldErrors(err.fieldErrors)
								: null,
							error: err.fieldErrors ? null : err.message,
							isLoading: false
						})
					} else {
						set({
							error:
								'Ошибка регистрации. Проверьте соединение и попробуйте ещё раз.',
							isLoading: false
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
