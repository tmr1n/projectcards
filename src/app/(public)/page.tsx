'use client'

import {
	motion,
	MotionValue,
	useScroll,
	useSpring,
	useTransform
} from 'framer-motion'
import { useRef } from 'react'
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
	{ bg: 'bg-gray-600', fanX: -240, fanR: -22, fanY: 20, stackR: -3, endX: -100, endR: -18, endY: 30, delay: 0.72 },
	{ bg: 'bg-gray-400', fanX: -160, fanR: -13, fanY: 10, stackR: -2, endX: -20,  endR: -8,  endY: 12, delay: 0.64 },
	{ bg: 'bg-gray-500', fanX: -80,  fanR: -6,  fanY: 4,  stackR: -1, endX: 60,   endR: -2,  endY: 3,  delay: 0.56 },
	{ bg: 'bg-gray-200', fanX: 0,    fanR: 0,   fanY: 0,  stackR: 0,  endX: 140,  endR: 4,   endY: 8,  delay: 0.2  },
	{ bg: 'bg-gray-300', fanX: 80,   fanR: 6,   fanY: 4,  stackR: 1,  endX: 220,  endR: 10,  endY: 18, delay: 0.56 },
	{ bg: 'bg-black',    fanX: 160,  fanR: 13,  fanY: 10, stackR: 2,  endX: 300,  endR: 16,  endY: 30, delay: 0.64 },
	{ bg: 'bg-gray-400', fanX: 240,  fanR: 22,  fanY: 20, stackR: 3,  endX: 380,  endR: 22,  endY: 44, delay: 0.72 }
]

type CardDatum = (typeof cardData)[0]

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
		[0, 0.3, 0.48, 0.6, 0.82, 1],
		[card.fanX, card.fanX, 0, 0, card.endX, card.endX]
	)
	const y = useTransform(
		progress,
		[0, 0.3, 0.48, 0.6, 0.82, 1],
		[card.fanY, card.fanY, 0, 160, 160 + card.endY, 160 + card.endY]
	)
	const rotate = useTransform(
		progress,
		[0, 0.3, 0.48, 0.6, 0.82, 1],
		[card.fanR, card.fanR, card.stackR, card.stackR, card.endR, card.endR]
	)

	const zIndex = index === 3 ? 7 : cardData.length - Math.abs(index - 3)

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ delay: card.delay, duration: 0.5 }}
			className={`absolute left-1/2 top-1/2 w-40 h-44 ${card.bg} rounded-2xl shadow-md -ml-20 -mt-22`}
			style={{ x, y, rotate, zIndex }}
		/>
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
		<div ref={containerRef} className='relative h-[400vh]'>
			<div className='sticky top-0 h-screen overflow-hidden bg-white'>

				{/* Hero: h1 → spacer (cards) → p → button */}
				<motion.div
					className='absolute inset-0 flex flex-col items-center justify-center gap-5 px-4 z-10 pointer-events-none'
					style={{ opacity: heroOpacity, y: heroY }}
				>
					<h1 className='text-[3rem] text-center md:text-[4rem] font-bold text-black flex flex-wrap justify-center gap-x-[0.3em] leading-tight -mt-10'>
						{h1Words.map((word, i) => {
							const isLast = i === h1Words.length - 1
							return (
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
							)
						})}
					</h1>

					{/* Spacer — holds space for cards */}
					<div className='h-52 w-full shrink-0' />

					<p className='text-[1rem] md:text-[1.25rem] text-center text-black font-(family-name:--font-geist-sans) flex flex-wrap justify-center gap-x-[0.28em] max-w-2xl mt-15'>
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
						<ButtonLink text='Зарегистрироваться бесплатно' href='/registration' />
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
							Создавай колоды, добавляй карточки и изучай материал в своём темпе.
						</motion.p>
						<motion.div style={{ opacity: newTextOpacity, y: newTextY }}>
							<ButtonLink text='Начать бесплатно' href='/registration' />
						</motion.div>
					</div>
				</div>

			</div>
		</div>
	)
}
