'use client'

import {
	animate,
	motion,
	MotionValue,
	useMotionValue,
	useMotionValueEvent,
	useScroll,
	useSpring,
	useTransform
} from 'framer-motion'
import { useRef, useState } from 'react'
import { ButtonLink } from '@/components/buttons/ButtonLink'

const wordVariants = {
	hidden: { opacity: 0, y: 10, filter: 'blur(10px)' },
	visible: (i: number) => ({
		opacity: 1,
		y: 0,
		filter: 'blur(0px)',
		transition: {
			delay: i * 0.1,
			type: 'spring' as const,
			stiffness: 120,
			damping: 18
		}
	})
}

const h1Text = 'Карточки? Карточки! Запомни что угодно!'
const h1Words = h1Text.split(' ')

const pText =
	'Освойте любой изучаемый материал с помощью интерактивных карточек, пробных тестов и учебных активностей.'
const pWords = pText.split(' ')

const cardData = [
	{
		bg: 'bg-gray-600',
		fanX: -240,
		fanR: -22,
		fanY: 20,
		stackR: -3,
		endX: -100,
		endR: -18,
		endY: 30,
		delay: 0.72,
		label: 'こんにちは',
		textColor: 'text-white'
	},
	{
		bg: 'bg-gray-400',
		fanX: -160,
		fanR: -13,
		fanY: 10,
		stackR: -2,
		endX: -20,
		endR: -8,
		endY: 12,
		delay: 0.64,
		label: 'Bonjour',
		textColor: 'text-white'
	},
	{
		bg: 'bg-gray-500',
		fanX: -80,
		fanR: -6,
		fanY: 4,
		stackR: -1,
		endX: 60,
		endR: -2,
		endY: 3,
		delay: 0.56,
		label: 'Hola',
		textColor: 'text-white'
	},
	{
		bg: 'bg-gray-200',
		fanX: 0,
		fanR: 0,
		fanY: 0,
		stackR: 0,
		endX: 140,
		endR: 4,
		endY: 8,
		delay: 0.2,
		label: 'Hello',
		textColor: 'text-gray-700',
		backLabel: 'Привет'
	},
	{
		bg: 'bg-gray-300',
		fanX: 80,
		fanR: 6,
		fanY: 4,
		stackR: 1,
		endX: 220,
		endR: 10,
		endY: 18,
		delay: 0.56,
		label: 'Ciao',
		textColor: 'text-gray-700'
	},
	{
		bg: 'bg-black',
		fanX: 160,
		fanR: 13,
		fanY: 10,
		stackR: 2,
		endX: 300,
		endR: 16,
		endY: 30,
		delay: 0.64,
		label: 'Hallo',
		textColor: 'text-white'
	},
	{
		bg: 'bg-gray-400',
		fanX: 240,
		fanR: 22,
		fanY: 20,
		stackR: 3,
		endX: 380,
		endR: 22,
		endY: 44,
		delay: 0.72,
		label: '你好',
		textColor: 'text-white'
	}
]

type CardDatum = (typeof cardData)[0]

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

function Card({
	card,
	progress,
	index
}: {
	card: CardDatum
	progress: MotionValue<number>
	index: number
}) {
	const x = useTransform(
		progress,
		[0, 0.2, 0.34, 0.48, 0.7, 1],
		[card.fanX, card.fanX, 0, 0, card.endX, card.endX]
	)
	const y = useTransform(
		progress,
		[0, 0.2, 0.34, 0.48, 0.7, 1],
		[card.fanY, card.fanY, 0, 160, 160 + card.endY, 160 + card.endY]
	)
	const rotate = useTransform(
		progress,
		[0, 0.2, 0.34, 0.48, 0.7, 1],
		[card.fanR, card.fanR, card.stackR, card.stackR, card.endR, card.endR]
	)

	const hoverY = useMotionValue(0)
	const combinedY = useTransform(() => y.get() + hoverY.get())

	const zIndex = index === 3 ? 7 : cardData.length - Math.abs(index - 3)

	const isCenter = index === 3
	const [canFlip, setCanFlip] = useState(true)
	useMotionValueEvent(progress, 'change', v => {
		if (isCenter) setCanFlip(v < 0.55)
	})

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ delay: card.delay, duration: 0.5 }}
			className='absolute left-1/2 top-1/2 w-40 h-44 -ml-20 -mt-22 cursor-pointer'
			style={{ x, y: combinedY, rotate, zIndex, perspective: 800 }}
			onHoverStart={() =>
				animate(hoverY, -10, { type: 'spring', stiffness: 400, damping: 25 })
			}
			onHoverEnd={() =>
				animate(hoverY, 0, { type: 'spring', stiffness: 400, damping: 25 })
			}
		>
			{isCenter ? (
				<motion.div
					className='relative w-full h-full'
					style={{ transformStyle: 'preserve-3d' }}
					whileHover={canFlip ? { rotateY: 180 } : {}}
					transition={{ type: 'spring', stiffness: 100, damping: 18 }}
				>
					<div
						className={`absolute inset-0 ${card.bg} rounded-2xl shadow-md flex items-center justify-center`}
						style={{ backfaceVisibility: 'hidden' }}
					>
						<span
							className={`text-2xl font-bold ${card.textColor} font-(family-name:--font-geist-sans)`}
						>
							{card.label}
						</span>
					</div>
					<div
						className={`absolute inset-0 ${card.bg} rounded-2xl shadow-md flex items-center justify-center`}
						style={{
							backfaceVisibility: 'hidden',
							transform: 'rotateY(180deg)'
						}}
					>
						<span
							className={`text-2xl font-bold ${card.textColor} font-(family-name:--font-playfair) italic`}
						>
							{card.backLabel}
						</span>
					</div>
				</motion.div>
			) : (
				<div
					className={`w-full h-full ${card.bg} rounded-2xl shadow-md flex items-center justify-center`}
				>
					<span
						className={`text-lg font-semibold ${card.textColor} font-(family-name:--font-geist-sans)`}
					>
						{card.label}
					</span>
				</div>
			)}
		</motion.div>
	)
}

function FeaturedDecks() {
	const [active, setActive] = useState(0)
	const deck = featuredDecks[active]

	return (
		<section className='bg-white px-6 md:px-20 py-20'>
			<div className='max-w-5xl mx-auto'>
				{/* Label */}
				<p className='text-xs font-semibold tracking-widest text-gray-400 uppercase mb-5 font-(family-name:--font-geist-sans)'>
					Популярные колоды
				</p>

				{/* Heading + badge */}
				<div className='flex items-start justify-between mb-8 gap-4'>
					<h2 className='text-4xl md:text-6xl font-bold text-black leading-tight font-(family-name:--font-geist-sans)'>
						Готовые колоды для{' '}
						<span className='font-(family-name:--font-playfair) italic text-gray-400'>
							быстрого старта.
						</span>
					</h2>
					<div className='hidden md:flex shrink-0 items-center gap-2 bg-gray-100 rounded-full px-4 py-2 mt-2'>
						<span className='text-sm font-medium text-gray-500 font-(family-name:--font-geist-sans)'>
							{deck.tag}
						</span>
					</div>
				</div>

				{/* Card */}
				<div className={`relative rounded-3xl overflow-hidden ${deck.bg} h-72 md:h-96`}>
					{/* Decorative accent */}
					<div className={`absolute top-8 left-8 w-16 h-16 rounded-2xl ${deck.accent} opacity-80`} />
					<div className={`absolute top-8 left-8 w-8 h-8 rounded-xl bg-black opacity-60 mt-10 ml-4`} />

					{/* Deck info center */}
					<div className='absolute inset-0 flex flex-col items-center justify-center gap-2'>
						<p className='text-2xl md:text-4xl font-bold text-gray-800 font-(family-name:--font-geist-sans)'>
							{deck.label}
						</p>
						<p className='text-sm text-gray-500 font-(family-name:--font-geist-sans)'>
							{deck.count}
						</p>
					</div>

					{/* Dots */}
					<div className='absolute top-5 right-5 flex gap-1.5'>
						{featuredDecks.map((_, i) => (
							<button
								key={i}
								onClick={() => setActive(i)}
								className={`w-2 h-2 rounded-full transition-colors ${i === active ? 'bg-gray-600' : 'bg-gray-300'}`}
							/>
						))}
					</div>

					{/* Изучить + arrows */}
					<div className='absolute bottom-5 left-5'>
						<ButtonLink text='Изучить' href='/registration' />
					</div>
					<div className='absolute bottom-5 right-5 flex gap-2'>
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
				</div>
			</div>
		</section>
	)
}

export default function Home() {
	const containerRef = useRef<HTMLDivElement>(null)

	const { scrollYProgress } = useScroll({
		target: containerRef,
		offset: ['start start', 'end end']
	})

	const progress = useSpring(scrollYProgress, {
		stiffness: 80,
		damping: 25,
		restDelta: 0.001
	})

	const heroOpacity = useTransform(progress, [0.2, 0.34], [1, 0])
	const heroY = useTransform(progress, [0.2, 0.34], [0, -24])

	const newTextOpacity = useTransform(progress, [0.65, 0.82], [0, 1])
	const newTextY = useTransform(progress, [0.65, 0.82], [40, 0])
	const newTextX = useTransform(progress, [0.65, 0.82], [-24, 0])
	const labelOpacity = useTransform(progress, [0.6, 0.76], [0, 1])

	return (
		<>
		<div ref={containerRef} className='relative h-[250vh]'>
			<div
				className='sticky top-0 h-screen overflow-hidden bg-white -mt-5
			'
			>
				{/* Hero: h1 → spacer (cards) → p → button */}
				<motion.div
					className='absolute inset-0 flex flex-col items-center justify-center gap-5 px-4 z-10 pointer-events-none mb-15'
					style={{ opacity: heroOpacity, y: heroY }}
				>
					<h1 className='text-4xl text-center md:text-[3.5rem] font-bold text-black flex flex-wrap justify-center gap-x-[0.3em] leading-tight translate-y-5'>
						{h1Words.map((word, i) => {
							const isLast = i === h1Words.length - 1
							return (
								<>
									<motion.span
										key={i}
										custom={i}
										variants={wordVariants}
										initial='hidden'
										animate='visible'
										className={
											isLast
												? 'font-(family-name:--font-playfair) italic'
												: 'font-(family-name:--font-geist-sans)'
										}
									>
										{word}
									</motion.span>
									{i === 1 && (
										<span key='br' className='hidden md:block md:basis-full' />
									)}
								</>
							)
						})}
					</h1>

					{/* Spacer — holds space for cards */}
					<div className='h-52 w-full shrink-0' />

					<p className='text-[1rem] md:text-[1.25rem] text-center text-black font-(family-name:--font-geist-sans) flex flex-wrap justify-center gap-x-[0.28em] max-w-2xl mt-5'>
						{pWords.map((word, i) => (
							<motion.span
								key={i}
								custom={h1Words.length + i}
								variants={wordVariants}
								initial='hidden'
								animate='visible'
							>
								{word}
							</motion.span>
						))}
					</p>

					<motion.div
						className='pointer-events-auto'
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{
							delay: (h1Words.length + pWords.length) * 0.1,
							type: 'spring',
							stiffness: 120,
							damping: 18
						}}
					>
						<ButtonLink
							text='Зарегистрироваться бесплатно'
							href='/registration'
						/>
					</motion.div>
				</motion.div>

				{/* Cards */}
				<div className='absolute inset-0 mb-15'>
					{cardData.map((card, i) => (
						<Card key={i} card={card} progress={progress} index={i} />
					))}
				</div>

				{/* New section text */}
				<div className='absolute left-8 md:left-20 top-0 bottom-0 flex items-center z-20 max-w-xs'>
					<div>
						<motion.p
							className='text-xs font-semibold tracking-widest text-gray-400 uppercase mb-4 font-(family-name:--font-geist-sans)'
							style={{ opacity: labelOpacity }}
						>
							Карточки
						</motion.p>
						<motion.h2
							className='text-4xl md:text-5xl font-bold text-black leading-tight mb-5 font-(family-name:--font-geist-sans)'
							style={{ opacity: newTextOpacity, y: newTextY, x: newTextX }}
						>
							Учи как хочешь.{' '}
							<span className='text-gray-400 font-(family-name:--font-playfair) italic'>
								Когда хочешь.
							</span>
						</motion.h2>
						<motion.p
							className='text-gray-500 text-sm mb-8 font-(family-name:--font-geist-sans) leading-relaxed'
							style={{ opacity: newTextOpacity, y: newTextY }}
						>
							Создавай колоды, добавляй карточки и изучай материал в своём
							темпе.
						</motion.p>
						<motion.div style={{ opacity: newTextOpacity, y: newTextY }}>
							<ButtonLink text='Начать бесплатно' href='/registration' />
						</motion.div>
					</div>
				</div>
			</div>
		</div>

		{/* Featured Decks Section */}
		<FeaturedDecks />
		</>
	)
}
