'use server'

import { cookies } from 'next/headers'
import { getTranslations } from 'next-intl/server'
import { ApiError, apiFetch } from '@/lib/api'
import type { ICard, IDeckWithCards, IDeckWithCount } from '@/shared/types/deck.types'

async function getToken() {
	const cookieStore = await cookies()
	return cookieStore.get('token')?.value
}

// Локализованная ошибка (ключи — modules.errors в messages/*.json)
async function deckError(key: string) {
	const t = await getTranslations('modules.errors')
	return { success: false as const, message: t(key) }
}

export async function getDecksAction() {
	try {
		const token = await getToken()
		const res = await apiFetch<IDeckWithCount[]>('/decks', { token })
		return { success: true as const, data: res.data }
	} catch {
		return await deckError('loadAll')
	}
}

export async function getDeckAction(id: string) {
	try {
		const token = await getToken()
		const res = await apiFetch<IDeckWithCards>(`/decks/${id}`, { token })
		return { success: true as const, data: res.data }
	} catch {
		return await deckError('loadOne')
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
		return await deckError('create')
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
		return await deckError('update')
	}
}

export async function deleteDeckAction(id: string) {
	try {
		const token = await getToken()
		await apiFetch(`/decks/${id}`, { method: 'DELETE', token })
		return { success: true as const }
	} catch {
		return await deckError('delete')
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
		return await deckError('cardCreate')
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
		return await deckError('cardUpdate')
	}
}

export async function deleteCardAction(id: string) {
	try {
		const token = await getToken()
		await apiFetch(`/cards/${id}`, { method: 'DELETE', token })
		return { success: true as const }
	} catch {
		return await deckError('cardDelete')
	}
}
