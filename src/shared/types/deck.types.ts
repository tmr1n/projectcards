export interface ICard {
	id: string
	front: string
	back: string
	deckId: string
	createdAt: string
}

export interface IDeck {
	id: string
	title: string
	description: string | null
	userId: string
	createdAt: string
	updatedAt: string
}

export interface IDeckWithCards extends IDeck {
	cards: ICard[]
}

export interface IDeckWithCount extends IDeck {
	_count: { cards: number }
}
