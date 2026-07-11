import { render, screen } from '@testing-library/react'
import { NextIntlClientProvider } from 'next-intl'
import { describe, expect, it } from 'vitest'
import DeckMini from './DeckMini'

// DeckMini дёргает t('cards') из неймспейса modules — даём минимальные сообщения
const messages = { modules: { cards: 'Karten' } }

function renderDeckMini(props: {
	id: string
	title: string
	cardCount: number
}) {
	return render(
		<NextIntlClientProvider locale='de' messages={messages}>
			<DeckMini {...props} />
		</NextIntlClientProvider>
	)
}

describe('DeckMini', () => {
	it('показывает название колоды', () => {
		renderDeckMini({ id: '1', title: 'Deutsch im Alltag', cardCount: 8 })
		expect(screen.getByText('Deutsch im Alltag')).toBeInTheDocument()
	})
	it('проверка видимости 8 Karten', () => {
		renderDeckMini({ id: '2', title: '8 Karten', cardCount: 8 })
		expect(screen.getByText('8 Karten')).toBeInTheDocument()
	})

	// 🫵 ТВОЯ ОЧЕРЕДЬ: напиши второй it(...), который проверяет,
	// что на карточке видно «8 Karten»
})
