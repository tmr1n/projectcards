'use server'

import { apiFetch } from '@/lib/api'
import type {
	ILoginPayload,
	ILoginResponse,
	IRegisterPayload,
	IRegisterResponse,
	IUpdatePasswordPayload,
} from '@/shared/types/auth.types'

export async function loginAction(payload: ILoginPayload): Promise<ILoginResponse> {
	const res = await apiFetch<ILoginResponse>('/login', {
		method: 'POST',
		body: payload,
	})
	return res.data
}

export async function registerAction(payload: IRegisterPayload): Promise<IRegisterResponse> {
	const res = await apiFetch<IRegisterResponse>('/registration', {
		method: 'POST',
		body: payload,
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
		token,
	})
}

export async function logoutAction(token: string): Promise<void> {
	try {
		await apiFetch('/logout', {
			method: 'POST',
			token,
		})
	} catch {
		// Намеренно пустой catch: logout всегда успешен с точки зрения UI
	}
}

export async function refreshTokenAction(): Promise<{ access_token: string }> {
	const res = await apiFetch<{ access_token: string }>('/refresh', {
		method: 'POST',
		credentials: 'include',
	})
	return res.data
}
