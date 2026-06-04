'use server'

import { cookies } from 'next/headers'
import { ApiError, apiFetch } from '@/lib/api'
import type { ICard, IDeckWithCards, IDeckWithCount } from '@/shared/types/deck.types'

async function getToken() {
	const cookieStore = await cookies()
	return cookieStore.get('token')?.value
}

export async function getDecksAction() {
	try {
		const token = await getToken()
		const res = await apiFetch<IDeckWithCount[]>('/decks', { token })
		return { success: true as const, data: res.data }
	} catch {
		return { success: false as const, message: 'Не удалось загрузить модули' }
	}
}

export async function getDeckAction(id: string) {
	try {
		const token = await getToken()
		const res = await apiFetch<IDeckWithCards>(`/decks/${id}`, { token })
		return { success: true as const, data: res.data }
	} catch {
		return { success: false as const, message: 'Не удалось загрузить модуль' }
	}
}

export async function createDeckAction(payload: { title: string; description?: string }) {
	try {
		const token = await getToken()
		const res = await apiFetch<IDeckWithCards>('/decks', {
			method: 'POST',
			body: payload,
			token
		})
		return { success: true as const, data: res.data }
	} catch (err) {
		if (err instanceof ApiError) {
			return { success: false as const, message: err.message }
		}
		return { success: false as const, message: 'Не удалось создать модуль' }
	}
}

export async function updateDeckAction(id: string, payload: { title?: string; description?: string }) {
	try {
		const token = await getToken()
		const res = await apiFetch<IDeckWithCards>(`/decks/${id}`, {
			method: 'PATCH',
			body: payload,
			token
		})
		return { success: true as const, data: res.data }
	} catch (err) {
		if (err instanceof ApiError) {
			return { success: false as const, message: err.message }
		}
		return { success: false as const, message: 'Не удалось обновить модуль' }
	}
}

export async function deleteDeckAction(id: string) {
	try {
		const token = await getToken()
		await apiFetch(`/decks/${id}`, { method: 'DELETE', token })
		return { success: true as const }
	} catch {
		return { success: false as const, message: 'Не удалось удалить модуль' }
	}
}

export async function createCardAction(deckId: string, payload: { front: string; back: string }) {
	try {
		const token = await getToken()
		const res = await apiFetch<ICard>(`/decks/${deckId}/cards`, {
			method: 'POST',
			body: payload,
			token
		})
		return { success: true as const, data: res.data }
	} catch {
		return { success: false as const, message: 'Не удалось создать карточку' }
	}
}

export async function updateCardAction(id: string, payload: { front?: string; back?: string }) {
	try {
		const token = await getToken()
		const res = await apiFetch<ICard>(`/cards/${id}`, {
			method: 'PATCH',
			body: payload,
			token
		})
		return { success: true as const, data: res.data }
	} catch {
		return { success: false as const, message: 'Не удалось обновить карточку' }
	}
}

export async function deleteCardAction(id: string) {
	try {
		const token = await getToken()
		await apiFetch(`/cards/${id}`, { method: 'DELETE', token })
		return { success: true as const }
	} catch {
		return { success: false as const, message: 'Не удалось удалить карточку' }
	}
}
