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
import type { IUser } from '@/shared/types/auth.types'

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
}

// ACTIONS — функции для изменения State
interface AuthActions {
	// Войти в систему. Принимает данные из LoginForm.
	login: (email: string, password: string) => Promise<void>

	// Зарегистрироваться. Принимает данные из RegistrationForm.
	registration: (
		email: string,
		username: string,
		password: string
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
		set => ({
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

			// ─────────────────────────────────────────────────
			// ACTION: login
			// ─────────────────────────────────────────────────
			//
			// Вызывается из LoginForm при submit.
			// Последовательность:
			//   1. Устанавливаем isLoading = true (появляется лоадер)
			//   2. Делаем запрос к серверу (сейчас — заглушка)
			//   3. Сохраняем user + accessToken в store
			//   4. isAuthenticated становится true
			//   5. isLoading = false (лоадер пропадает)
			//
			// Если сервер вернул ошибку (неверный пароль и т.д.):
			//   3a. Сохраняем error — отображаем сообщение юзеру
			//   4a. isLoading = false

			login: async (email, password) => {
				// Сбрасываем ошибку от предыдущей попытки, включаем лоадер
				set({ isLoading: true, error: null })

				try {
					// ─────────────────────────────────────────
					// TODO: заменить на реальный Server Action
					// ─────────────────────────────────────────
					// import { loginAction } from '@/server-actions/auth.actions'
					// const response = await loginAction({ email, password })
					//
					// Ответ сервера будет иметь тип IApiResponse<IAuthTokens & { user: IUser }>
					// Смотри src/shared/types/api.types.ts и auth.types.ts

					// Временная заглушка (удалить когда будет сервер):
					console.log('login called:', { email, password })
					await new Promise(resolve => setTimeout(resolve, 800)) // имитируем задержку сети

					const fakeUser: IUser = {
						id: 'user-1',
						email,
						username: email.split('@')[0],
						createdAt: new Date().toISOString()
					}

					// set() — обновляет только перечисленные поля.
					// Остальные поля store НЕ затрагивает.
					set({
						user: fakeUser,
						accessToken: 'fake-access-token-from-server',
						isAuthenticated: true,
						isLoading: false,
						error: null
					})
				} catch (err) {
					// err может быть чем угодно, поэтому безопасно извлекаем message
					const message =
						err instanceof Error
							? err.message
							: 'Ошибка входа. Попробуйте ещё раз.'

					set({ error: message, isLoading: false })
				}
			},

			// ─────────────────────────────────────────────────
			// ACTION: register
			// ─────────────────────────────────────────────────
			//
			// Вызывается из RegistrationForm при submit.
			// Логика аналогична login, но принимает больше данных.

			registration: async (email, username, password) => {
				set({ isLoading: true, error: null })

				try {
					// TODO: заменить на реальный Server Action
					// import { registerAction } from '@/server-actions/auth.actions'
					// const response = await registerAction({ email, username, password })

					//TODO: Когда сервер реально вернёт { errors: { email: "Email уже занят" } }, нужно будет в registration action сделать set({ serverFieldErrors: { email: "Email уже занят" } }) — и оно автоматически появится в нужном label.

					console.log('register called:', { email, username, password })
					await new Promise(resolve => setTimeout(resolve, 800))

					const fakeUser: IUser = {
						id: 'user-2',
						email,
						username,
						createdAt: new Date().toISOString()
					}

					set({
						user: fakeUser,
						accessToken: 'fake-access-token-after-register',
						isAuthenticated: true,
						isLoading: false,
						error: null
					})
				} catch (err) {
					const message =
						err instanceof Error
							? err.message
							: 'Ошибка регистрации. Попробуйте ещё раз.'

					set({ error: message, isLoading: false })
				}
			},

			// ─────────────────────────────────────────────────
			// ACTION: logout
			// ─────────────────────────────────────────────────
			//
			// Сбрасываем state в начальные значения.
			// persist middleware автоматически очистит localStorage.

			logout: () => {
				set({
					user: null,
					accessToken: null,
					isAuthenticated: false,
					error: null
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
