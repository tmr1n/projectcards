const STORAGE_KEY = 'recentDecks'
const MAX_RECENT = 5

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
}

// Чистим «последние модули» при выходе — иначе они утекают следующему юзеру на этом браузере
export function clearRecentDecks(): void {
	if (typeof window === 'undefined') return
	localStorage.removeItem(STORAGE_KEY)
}
