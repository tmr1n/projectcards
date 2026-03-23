'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'

const featuredDecks = [
	{
		label: 'Японский язык',
		count: '120 карточек',
		bg: 'bg-amber-50',
		accent: 'bg-amber-400',
		tag: '@японский'
	},
	{
		label: 'Анатомия человека',
		count: '84 карточки',
		bg: 'bg-sky-50',
		accent: 'bg-sky-400',
		tag: '@медицина'
	},
	{
		label: 'История России',
		count: '96 карточек',
		bg: 'bg-rose-50',
		accent: 'bg-rose-400',
		tag: '@история'
	}
]

export function FeaturedDecks() {
	const [active, setActive] = useState(0)
	const deck = featuredDecks[active]

	return (
		<section className='bg-white px-6 md:px-20 py-20'>
			<div className='max-w-5xl mx-auto'>
				{/* Label */}
				<motion.p
					className='text-xs font-semibold tracking-widest text-gray-400 uppercase mb-5 font-(family-name:--font-geist-sans)'
					initial={{ opacity: 0, y: 12 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, amount: 0.5 }}
					transition={{ duration: 0.45 }}
				>
					Популярные колоды
				</motion.p>

				{/* Heading + badge */}
				<div className='flex items-start justify-between mb-8 gap-4'>
					<motion.h2
						className='text-4xl md:text-6xl font-bold text-black leading-tight font-(family-name:--font-geist-sans)'
						initial={{ opacity: 0, y: 16 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, amount: 0.5 }}
						transition={{ duration: 0.5, delay: 0.1 }}
					>
						Готовые колоды для{' '}
						<span className='font-(family-name:--font-playfair) italic text-gray-400'>
							быстрого старта.
						</span>
					</motion.h2>

					<motion.div
						className='hidden md:flex shrink-0 items-center gap-2 bg-gray-100 rounded-full px-4 py-2 mt-2 overflow-hidden'
						initial={{ opacity: 0, scale: 0.9 }}
						whileInView={{ opacity: 1, scale: 1 }}
						viewport={{ once: true, amount: 0.5 }}
						transition={{ duration: 0.4, delay: 0.2 }}
					>
						<AnimatePresence mode='wait'>
							<motion.span
								key={deck.tag}
								className='text-sm font-medium text-gray-500 font-(family-name:--font-geist-sans)'
								initial={{ opacity: 0, y: 6 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -6 }}
								transition={{ duration: 0.2 }}
							>
								{deck.tag}
							</motion.span>
						</AnimatePresence>
					</motion.div>
				</div>

				{/* Card */}
				<motion.div
					className='relative rounded-3xl overflow-hidden h-72 md:h-96'
					initial={{ opacity: 0, y: 24 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, amount: 0.3 }}
					transition={{ duration: 0.55, delay: 0.15, type: 'spring', stiffness: 90, damping: 20 }}
				>
					<AnimatePresence mode='wait'>
						<motion.div
							key={active}
							className={`absolute inset-0 ${deck.bg}`}
							initial={{ opacity: 0, scale: 0.97 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 1.02 }}
							transition={{ duration: 0.3 }}
						>
							{/* Decorative accent */}
							<div className={`absolute top-8 left-8 w-16 h-16 rounded-2xl ${deck.accent} opacity-80`} />
							<div className='absolute top-8 left-8 w-8 h-8 rounded-xl bg-black opacity-60 mt-10 ml-4' />

							{/* Deck info center */}
							<div className='absolute inset-0 flex flex-col items-center justify-center gap-2'>
								<p className='text-2xl md:text-4xl font-bold text-gray-800 font-(family-name:--font-geist-sans)'>
									{deck.label}
								</p>
								<p className='text-sm text-gray-500 font-(family-name:--font-geist-sans)'>
									{deck.count}
								</p>
							</div>
						</motion.div>
					</AnimatePresence>

					{/* Dots */}
					<div className='absolute top-5 right-5 flex gap-1.5 z-10'>
						{featuredDecks.map((_, i) => (
							<button
								key={i}
								onClick={() => setActive(i)}
								className={`w-2 h-2 rounded-full transition-colors ${i === active ? 'bg-gray-600' : 'bg-gray-300'}`}
							/>
						))}
					</div>

					{/* Arrows */}
					<div className='absolute bottom-5 right-5 flex gap-2 z-10'>
						<button
							onClick={() => setActive(i => (i - 1 + featuredDecks.length) % featuredDecks.length)}
							className='w-9 h-9 rounded-full border border-gray-300 bg-white/70 flex items-center justify-center text-gray-600 hover:bg-white transition-colors'
						>
							‹
						</button>
						<button
							onClick={() => setActive(i => (i + 1) % featuredDecks.length)}
							className='w-9 h-9 rounded-full border border-gray-300 bg-white/70 flex items-center justify-center text-gray-600 hover:bg-white transition-colors'
						>
							›
						</button>
					</div>
				</motion.div>
			</div>
		</section>
	)
}
