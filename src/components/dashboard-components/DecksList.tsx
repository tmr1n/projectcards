'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useRef, useState } from 'react'
import DeckCard from './DeckCard'
import DeckMini from './DeckMini'

const MOCK_DECKS = [
	{ id: 1, title: 'Verben mit pr', progress: 23 },
	{ id: 2, title: 'TADES. NVV', progress: 24 },
	{ id: 3, title: 'Grammar', progress: 45 },
	{ id: 4, title: 'Vocabulary', progress: 67 }
]

export default function DecksList() {
	const [decks, setDecks] = useState(MOCK_DECKS)
	const [current, setCurrent] = useState(0)
	const trackRef = useRef<HTMLDivElement>(null)

	const removeById = (id: number) => {
		setDecks(prev => {
			const next = prev.filter(d => d.id !== id)
			setCurrent(c => Math.min(c, next.length - 1))
			return next
		})
	}

	const goTo = (index: number) => {
		setCurrent(index)
		if (!trackRef.current) return
		const card = trackRef.current.children[index] as HTMLElement
		trackRef.current.scrollTo({ left: card.offsetLeft, behavior: 'smooth' })
	}

	const next = () => goTo(Math.min(current + 1, decks.length - 1))
	const prev = () => goTo(Math.max(current - 1, 0))

	return (
		<div className='p-4 md:p-20'>
			<h2 className='text-2xl font-bold mb-6'>Продолжить учёбу</h2>

			<div className='relative w-full md:w-[60%]'>
				{/* Track with blur fade edges */}
				<div className='relative'>
					<div ref={trackRef} className='flex gap-4 overflow-x-hidden'>
						{decks.map(deck => (
							<DeckCard
								key={deck.id}
								title={deck.title}
								progress={deck.progress}
								canRemove={decks.length > 2}
									onHide={() => removeById(deck.id)}
							/>
						))}
					</div>

					{/* Left blur fade */}
					{current > 0 && (
						<div className='absolute inset-y-0 left-0 w-16 bg-linear-to-r from-white to-transparent pointer-events-none rounded-l-3xl backdrop-blur-[2px] mask-[linear-gradient(to_right,white_40%,transparent)]' />
					)}

					{/* Right blur fade */}
					{current < decks.length - 1 && (
						<div className='absolute inset-y-0 right-0 w-16 bg-linear-to-l from-white to-transparent pointer-events-none rounded-r-3xl backdrop-blur-[2px] mask-[linear-gradient(to_left,white_40%,transparent)]' />
					)}
				</div>

				{/* Back button */}
				{current > 0 && (
					<button
						onClick={prev}
						className='absolute -left-4 top-1/2 -translate-y-1/2 w-9 h-9 bg-white border border-gray-300 shadow rounded-full flex items-center justify-center hover:bg-gray-100 transition cursor-pointer z-10'
					>
						<ChevronLeft size={18} />
					</button>
				)}

				{/* Forward button */}
				{current < decks.length - 1 && (
					<button
						onClick={next}
						className='absolute -right-4 top-1/2 -translate-y-1/2 w-9 h-9 bg-white border border-gray-300 shadow rounded-full flex items-center justify-center hover:bg-gray-100 transition cursor-pointer z-10'
					>
						<ChevronRight size={18} />
					</button>
				)}

				{/* Dots */}
				<div className='flex justify-center gap-2 mt-4'>
					{decks.map((_, i) => (
						<button
							key={i}
							onClick={() => goTo(i)}
							className={`w-2.5 h-2.5 rounded-full transition-colors cursor-pointer ${
								i === current ? 'bg-blue-500' : 'bg-gray-300'
							}`}
						/>
					))}
				</div>
			</div>

			<div className='mt-12'>
				<h2 className='text-2xl font-bold mb-6'>Недавние</h2>
				<div className='grid grid-cols-1 gap-3 md:gap-1 md:grid-cols-[auto_auto] md:justify-start'>
					<DeckMini />
					<DeckMini />
					<DeckMini />
					<DeckMini />
				</div>
			</div>
		</div>
	)
}
