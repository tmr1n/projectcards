'use server'

import { cookies } from 'next/headers'
import { apiFetch } from '@/lib/api'
import type {
	ILoginPayload,
	ILoginResponse,
	IRegisterPayload,
	IRegisterResponse,
	IUpdatePasswordPayload
} from '@/shared/types/auth.types'

export async function loginAction(
	payload: ILoginPayload
): Promise<ILoginResponse> {
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
	return res.data
}

export async function registerAction(
	payload: IRegisterPayload
): Promise<IRegisterResponse> {
	const res = await apiFetch<IRegisterResponse>('/registration', {
		method: 'POST',
		body: payload
	})
	return res.data
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
