'use client'

import { useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, EllipsisVertical } from 'lucide-react'

const MOCK_DECKS = [
	{ id: 1, title: 'Verben mit pr', progress: 23 },
	{ id: 2, title: 'TADES. NVV', progress: 24 },
	{ id: 3, title: 'Grammar', progress: 45 },
	{ id: 4, title: 'Vocabulary', progress: 67 },
]

export default function DecksList() {
	const [current, setCurrent] = useState(0)
	const trackRef = useRef<HTMLDivElement>(null)

	const goTo = (index: number) => {
		setCurrent(index)
		if (!trackRef.current) return
		const card = trackRef.current.children[index] as HTMLElement
		trackRef.current.scrollTo({ left: card.offsetLeft, behavior: 'smooth' })
	}

	const next = () => goTo(Math.min(current + 1, MOCK_DECKS.length - 1))
	const prev = () => goTo(Math.max(current - 1, 0))

	return (
		<div className='p-20'>
			<h2 className='text-2xl font-bold mb-4'>Продолжить учёбу</h2>

			<div className='relative w-[60%]'>
				{/* Track with blur fade edges */}
				<div className='relative'>
					<div
						ref={trackRef}
						className='flex gap-4 overflow-x-hidden'
					>
						{MOCK_DECKS.map((deck) => (
							<div
								key={deck.id}
								className='min-w-[88%] p-6 bg-white shadow flex flex-col gap-4 rounded-3xl border border-gray-300'
							>
								<div className='flex justify-between items-center'>
									<h3 className='text-xl font-semibold'>{deck.title}</h3>
									<button className='p-2 rounded-full hover:bg-gray-200 transition cursor-pointer'>
										<EllipsisVertical />
									</button>
								</div>
								<div className='w-[60%] h-4 bg-gray-200 rounded-full overflow-hidden'>
									<div
										className='h-full rounded-full bg-blue-500'
										style={{ width: `${deck.progress}%` }}
									/>
								</div>
								<p className='text-gray-600 font-bold text-sm'>
									{deck.progress}% вопросов пройдено
								</p>
								<button className='mt-2 px-4 py-2 w-fit bg-blue-500 text-white rounded-2xl cursor-pointer hover:bg-blue-600 transition'>
									Продолжить
								</button>
							</div>
						))}
					</div>

					{/* Left blur fade */}
					{current > 0 && (
						<div className='absolute inset-y-0 left-0 w-16 bg-linear-to-r from-white to-transparent pointer-events-none rounded-l-3xl backdrop-blur-[2px] mask-[linear-gradient(to_right,white_40%,transparent)]' />
					)}

					{/* Right blur fade */}
					{current < MOCK_DECKS.length - 1 && (
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
				{current < MOCK_DECKS.length - 1 && (
					<button
						onClick={next}
						className='absolute -right-4 top-1/2 -translate-y-1/2 w-9 h-9 bg-white border border-gray-300 shadow rounded-full flex items-center justify-center hover:bg-gray-100 transition cursor-pointer z-10'
					>
						<ChevronRight size={18} />
					</button>
				)}

				{/* Dots */}
				<div className='flex justify-center gap-2 mt-4'>
					{MOCK_DECKS.map((_, i) => (
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
		</div>
	)
}
