const STORAGE_KEY = 'recentDecks'
const MAX_RECENT = 5

// Событие для живого обновления Sidebar («Последние модули») при изменении списка
export const RECENT_DECKS_CHANGED = 'recent-decks-changed'

function notifyChange(): void {
	if (typeof window !== 'undefined') {
		window.dispatchEvent(new Event(RECENT_DECKS_CHANGED))
	}
}

export interface RecentDeck {
	id: string
	title: string
}

export function getRecentDecks(): RecentDeck[] {
	if (typeof window === 'undefined') return []
	try {
		const raw = localStorage.getItem(STORAGE_KEY)
		return raw ? (JSON.parse(raw) as RecentDeck[]) : []
	} catch {
		return []
	}
}

export function pushRecentDeck(deck: RecentDeck): void {
	if (typeof window === 'undefined') return
	const current = getRecentDecks().filter(d => d.id !== deck.id)
	const next = [deck, ...current].slice(0, MAX_RECENT)
	localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
	notifyChange()
}

// Удаление одной колоды из «последних» (напр. при удалении модуля из БД)
export function removeRecentDeck(id: string): void {
	if (typeof window === 'undefined') return
	const next = getRecentDecks().filter(d => d.id !== id)
	localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
	notifyChange()
}

// Чистим «последние модули» при выходе — иначе они утекают следующему юзеру на этом браузере
export function clearRecentDecks(): void {
	if (typeof window === 'undefined') return
	localStorage.removeItem(STORAGE_KEY)
}
