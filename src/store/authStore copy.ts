import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { ApiError } from '@/lib/api'
import {
	loginAction,
	logoutAction,
	registerAction
} from '@/server-actions/auth.actions'
import type { IUser } from '@/shared/types/auth.types'

function flattenFieldErrors(
	errors: Record<string, string[]>
): Record<string, string> {
	return Object.fromEntries(
		Object.entries(errors).map(([field, messages]) => [field, messages[0]])
	)
}

interface AuthState {
	//Описыаем данные, что у нас будут в State
	user: IUser | null
	accessToken: string | null
	isAuthenticated: boolean //флаг
	isLoading: boolean // флаг на спинер
	error: string | null
	serverFieldErrors: Partial<Record<string, string>> | null //серверная ошибка
}

interface AuthActions {
	//описываем Actions, которые мы можем совершать
	//тут мы говорим, что у нас есть ф-ция логина, куда мы принимаем данные из LoginForm
	login: (email: string, password: string) => Promise<void>

	//аналогично, только из RegistraionForm
	registration: (
		email: string,
		username: string,
		password: string
	) => Promise<void>

	//выход, сброс состояния в начальное
	logout: () => void
	//сброс ошибки, если к примеру пользователь начнет что-то вводить
	clearError: () => void
}

export const useAuthStore = create<AuthState & AuthActions>()(
	// создаем стор
	// это middleware, он говорит нам о том, что данные будут сохранены в localStorage
	persist(
		(set, get) => ({
			// эти значения установлены по умолчанию вплоть до момента логина пользователя.
			user: null,
			accessToken: null,
			isAuthenticated: false,
			isLoading: false,
			error: null,
			serverFieldErrors: null,

			//Action login
			//вызывается при Submit в Loginform
			login: async (email, password) => {
				//isLoading: true - появляется loader
				set({ isLoading: true, error: null, serverFieldErrors: null })

				try {
					//вызываем LoginAction, куда мы отправяем email и password
					const response = await loginAction({ email, password })
					//   Бэкенд вернул { data: { user, tokens }, success: true }

					set({
						//Сохраняем user + accessToken в store
						//isLoading = false, лоадер пропадает
						user: response.data.user,
						accessToken: response.data.tokens.accessToken,
						isAuthenticated: true,
						isLoading: false,
						error: null
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
							error: 'Ошибка входа. Проверьте соединение и попробуйте ещё раз.',
							isLoading: false
						})
					}
				}
			},

			//аналогично - принимаем сюда данные

			registration: async (email, username, password) => {
				set({ isLoading: true, error: null, serverFieldErrors: null })

				//отправляем их на бэк
				try {
					const response = await registerAction({ email, username, password })
					// Возвращает { data: { user, tokens }, message, success }
					//записываем в store
					set({
						user: response.data.user,
						accessToken: response.data.tokens.accessToken,
						isAuthenticated: true,
						isLoading: false,
						error: null
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

			//достаём текущий токен и передаём в logoutAction
			logout: () => {
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
			// Вызывается когда пользователь начал вводить после ошибки.
			// Убирает красное сообщение об ошибке сервера.

			clearError: () => set({ error: null, serverFieldErrors: null })
		}),
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
