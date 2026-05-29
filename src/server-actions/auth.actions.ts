'use server'

import { cookies } from 'next/headers'
import { ApiError, apiFetch } from '@/lib/api'
import type {
	ILoginPayload,
	ILoginResponse,
	IRegisterPayload,
	IRegisterResponse,
	IUpdatePasswordPayload,
	IUser
} from '@/shared/types/auth.types'

type TAuthActionResult<T> =
	| { success: true; data: T }
	| { success: false; message: string; fieldErrors?: unknown }

export async function loginAction(
	payload: ILoginPayload
): Promise<TAuthActionResult<ILoginResponse>> {
	try {
		const res = await apiFetch<ILoginResponse>('/login', {
			method: 'POST',
			body: payload
		})

		if ('access_token' in res.data) {
			const cookieStore = await cookies()
			cookieStore.set('token', res.data.access_token, {
				httpOnly: true,
				sameSite: 'lax',
				maxAge: 60 * 15 // 15 минут — совпадает со сроком JWT
			})
		}

		return { success: true, data: res.data }
	} catch (err) {
		if (err instanceof ApiError) {
			return {
				success: false,
				message: err.message,
				fieldErrors: err.fieldErrors
			}
		}
		return { success: false, message: 'Ошибка соединения' }
	}
}

export async function registerAction(
	payload: IRegisterPayload
): Promise<TAuthActionResult<IRegisterResponse>> {
	try {
		const res = await apiFetch<IRegisterResponse>('/registration', {
			method: 'POST',
			body: payload
		})
		return { success: true, data: res.data }
	} catch (err) {
		if (err instanceof ApiError) {
			return {
				success: false,
				message: err.message,
				fieldErrors: err.fieldErrors
			}
		}
		return { success: false, message: 'Ошибка соединения' }
	}
}

export async function updatePasswordAction(
	payload: IUpdatePasswordPayload,
	token: string
): Promise<void> {
	await apiFetch('/updatePassword', {
		method: 'POST',
		body: payload,
		token
	})
}

export async function logoutAction(token: string): Promise<void> {
	try {
		await apiFetch('/logout', {
			method: 'POST',
			token
		})
	} catch {
		// Намеренно пустой catch: logout всегда успешен с точки зрения UI
	}
	const cookieStore = await cookies()
	cookieStore.delete('token')
}

export async function refreshTokenAction(): Promise<{ access_token: string }> {
	const res = await apiFetch<{ access_token: string }>('/refresh', {
		method: 'POST',
		credentials: 'include'
	})
	return res.data
}

export async function oauthLoginAction(token: string): Promise<void> {
	const cookieStore = await cookies()
	cookieStore.set('token', token, {
		httpOnly: true,
		sameSite: 'lax',
		maxAge: 60 * 15
	})
}

export async function getProfileAction(token: string): Promise<IUser | null> {
	try {
		const res = await apiFetch<IUser>('/profile', { token })
		return res.data
	} catch {
		return null
	}
}

export async function updateUsernameAction(
	username: string,
	token: string
): Promise<TAuthActionResult<null>> {
	try {
		await apiFetch('/profile', { method: 'PATCH', body: { username }, token })
		return { success: true, data: null }
	} catch (err) {
		if (err instanceof ApiError) {
			return {
				success: false,
				message: err.message,
				fieldErrors: err.fieldErrors
			}
		}
		return { success: false, message: 'Ошибка соединения' }
	}
}
