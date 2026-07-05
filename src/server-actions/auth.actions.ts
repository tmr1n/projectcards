'use server'

import { cookies } from 'next/headers'
import { getTranslations } from 'next-intl/server'
import { ApiError, apiFetch } from '@/lib/api'
import { translateApiError } from '@/lib/translateBackendError'
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

// «Ошибка соединения» на языке текущей локали (fetch упал / бэкенд недоступен)
async function connectionError(): Promise<{
	success: false
	message: string
}> {
	const t = await getTranslations('auth.errors')
	return { success: false, message: t('connection') }
}

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
			const translated = await translateApiError(err)
			return { success: false, ...translated }
		}
		return await connectionError()
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
			const translated = await translateApiError(err)
			return { success: false, ...translated }
		}
		return await connectionError()
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

export async function demoLoginAction(): Promise<
	TAuthActionResult<{ access_token: string }>
> {
	try {
		const res = await apiFetch<{ access_token: string }>('/demo', {
			method: 'POST',
			credentials: 'include'
		})

		const cookieStore = await cookies()
		cookieStore.set('token', res.data.access_token, {
			httpOnly: true,
			sameSite: 'lax',
			maxAge: 60 * 15
		})

		return { success: true, data: res.data }
	} catch (err) {
		if (err instanceof ApiError) {
			const translated = await translateApiError(err)
			return { success: false, ...translated }
		}
		return await connectionError()
	}
}

export async function getProfileAction(token: string): Promise<IUser | null> {
	try {
		const res = await apiFetch<IUser>('/profile', { token })
		return res.data
	} catch {
		return null
	}
}

export async function deleteAccountAction(token: string): Promise<void> {
	try {
		await apiFetch('/profile', { method: 'DELETE', token })
	} catch {
		// игнорируем — стор всё равно сбросит состояние
	}
	const cookieStore = await cookies()
	cookieStore.delete('token')
	cookieStore.delete('refresh_token')
}

export async function verifyEmailAction(
	token: string
): Promise<TAuthActionResult<null>> {
	try {
		await apiFetch('/verify-email', { method: 'POST', body: { token } })
		return { success: true, data: null }
	} catch (err) {
		if (err instanceof ApiError) {
			const translated = await translateApiError(err)
			return { success: false, ...translated }
		}
		return await connectionError()
	}
}

export async function resendVerificationAction(
	email: string
): Promise<TAuthActionResult<null>> {
	try {
		await apiFetch('/resend-verification', { method: 'POST', body: { email } })
		return { success: true, data: null }
	} catch (err) {
		if (err instanceof ApiError) {
			const translated = await translateApiError(err)
			return { success: false, ...translated }
		}
		return await connectionError()
	}
}

export async function sendResetLinkAction(
	email: string
): Promise<TAuthActionResult<null>> {
	try {
		await apiFetch('/forgot-password', { method: 'POST', body: { email } })
		return { success: true, data: null }
	} catch (err) {
		if (err instanceof ApiError) {
			const translated = await translateApiError(err)
			return { success: false, ...translated }
		}
		return await connectionError()
	}
}

export async function resetPasswordAction(
	token: string,
	password: string,
	passwordConfirmation: string
): Promise<TAuthActionResult<null>> {
	try {
		await apiFetch('/reset-password', {
			method: 'POST',
			body: { token, password, password_confirmation: passwordConfirmation }
		})
		return { success: true, data: null }
	} catch (err) {
		if (err instanceof ApiError) {
			const translated = await translateApiError(err)
			return { success: false, ...translated }
		}
		return await connectionError()
	}
}

export async function linkGoogleAccountAction(
	pendingToken: string,
	password: string
): Promise<TAuthActionResult<{ access_token: string }>> {
	try {
		const res = await apiFetch<{ access_token: string }>('/google/link-account', {
			method: 'POST',
			body: { token: pendingToken, password }
		})
		const cookieStore = await cookies()
		cookieStore.set('token', res.data.access_token, {
			httpOnly: true,
			sameSite: 'lax',
			maxAge: 60 * 15
		})
		return { success: true, data: res.data }
	} catch (err) {
		if (err instanceof ApiError) {
			const translated = await translateApiError(err)
			return { success: false, ...translated }
		}
		return await connectionError()
	}
}

export async function updateAvatarAction(
	avatarUrl: string,
	token: string
): Promise<TAuthActionResult<null>> {
	try {
		await apiFetch('/profile', { method: 'PATCH', body: { avatarUrl }, token })
		return { success: true, data: null }
	} catch (err) {
		if (err instanceof ApiError) {
			const translated = await translateApiError(err)
			return { success: false, ...translated }
		}
		return await connectionError()
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
			const translated = await translateApiError(err)
			return { success: false, ...translated }
		}
		return await connectionError()
	}
}
