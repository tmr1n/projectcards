'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useEffect, useRef, useState } from 'react'
import { useUnauthorizedGuard } from '@/hooks/useUnauthorizedGuard'
import DeckCard from './DeckCard'
import DeckMini from './DeckMini'
import {
	deleteDeckAction,
	getDecksAction
} from '@/server-actions/decks.actions'
import type { IDeckWithCount } from '@/shared/types/deck.types'

export default function DecksList() {
	const t = useTranslations('dashboard')
	const [decks, setDecks] = useState<IDeckWithCount[]>([])
	const [loading, setLoading] = useState(true)
	const [current, setCurrent] = useState(0)
	const trackRef = useRef<HTMLDivElement>(null)
	const guard = useUnauthorizedGuard()
	useEffect(() => {
		getDecksAction()
			.then(res => {
				if (res.success) setDecks(res.data ?? [])
				else guard(res)
			})
			.finally(() => setLoading(false))
	}, [guard])

	// Реальное удаление: сперва с сервера, затем из локального состояния
	const removeById = async (id: string) => {
		await deleteDeckAction(id)
		setDecks(prev => prev.filter(d => d.id !== id))
		setCurrent(0)
	}

	const goTo = (index: number) => {
		setCurrent(index)
		if (!trackRef.current) return
		const card = trackRef.current.children[index] as HTMLElement
		trackRef.current.scrollTo({ left: card.offsetLeft, behavior: 'smooth' })
	}

	const next = () => goTo(Math.min(current + 1, carousel.length - 1))
	const prev = () => goTo(Math.max(current - 1, 0))

	const recent = decks.slice(0, 4)
	// «Продолжить учёбу»: показываем максимум 12, иначе «км точек» при куче колод
	const carousel = decks.slice(0, 12)

	// СОСТОЯНИЕ 1 — загрузка: показываем скелетон, а НЕ «нет модулей»
	if (loading) {
		return (
			<div className='p-4 md:p-20'>
				<h2 className='text-2xl font-bold mb-6'>{t('continueLearning')}</h2>
				<div className='w-full md:w-[60%] h-40 bg-gray-100 rounded-3xl animate-pulse' />
			</div>
		)
	}

	// СОСТОЯНИЕ 2 — загрузка завершена и данных реально нет
	if (decks.length === 0) {
		return (
			<div className='p-4 md:p-20'>
				<h2 className='text-2xl font-bold mb-6'>{t('continueLearning')}</h2>
				<p className='text-gray-400'>{t('noModules')}</p>
			</div>
		)
	}

	return (
		<div className='p-4 md:p-20'>
			<h2 className='text-2xl font-bold mb-6'>{t('continueLearning')}</h2>

			<div className='relative w-full md:w-[60%]'>
				<div className='relative'>
					<div ref={trackRef} className='flex gap-4 overflow-x-hidden'>
						{carousel.map(deck => (
							<DeckCard
								key={deck.id}
								id={deck.id}
								title={deck.title}
								canRemove={true}
								onHide={() => removeById(deck.id)}
							/>
						))}
					</div>

					{current > 0 && (
						<div className='absolute inset-y-0 left-0 w-16 bg-linear-to-r from-white to-transparent pointer-events-none rounded-l-3xl backdrop-blur-[2px] mask-[linear-gradient(to_right,white_40%,transparent)]' />
					)}
					{current < carousel.length - 1 && (
						<div className='absolute inset-y-0 right-0 w-16 bg-linear-to-l from-white to-transparent pointer-events-none rounded-r-3xl backdrop-blur-[2px] mask-[linear-gradient(to_left,white_40%,transparent)]' />
					)}
				</div>

				{current > 0 && (
					<button
						onClick={prev}
						className='absolute -left-4 top-1/2 -translate-y-1/2 w-9 h-9 bg-white border border-gray-300 shadow rounded-full flex items-center justify-center hover:bg-gray-100 transition cursor-pointer z-10'
					>
						<ChevronLeft size={18} />
					</button>
				)}
				{current < carousel.length - 1 && (
					<button
						onClick={next}
						className='absolute -right-4 top-1/2 -translate-y-1/2 w-9 h-9 bg-white border border-gray-300 shadow rounded-full flex items-center justify-center hover:bg-gray-100 transition cursor-pointer z-10'
					>
						<ChevronRight size={18} />
					</button>
				)}

				<div className='flex justify-center gap-2 mt-4'>
					{carousel.map((_, i) => (
						<button
							key={i}
							onClick={() => goTo(i)}
							className={`w-2.5 h-2.5 rounded-full transition-colors cursor-pointer ${i === current ? 'bg-violet-500' : 'bg-gray-300'}`}
						/>
					))}
				</div>
			</div>

			{recent.length > 0 && (
				<div className='mt-12'>
					<h2 className='text-2xl font-bold mb-6'>{t('recent')}</h2>
					<div className='grid grid-cols-1 gap-3 md:gap-1 md:grid-cols-[auto_auto] md:justify-start'>
						{recent.map(deck => (
							<DeckMini
								key={deck.id}
								id={deck.id}
								title={deck.title}
								cardCount={deck._count.cards}
							/>
						))}
					</div>
				</div>
			)}
		</div>
	)
}
