'use client'

import {
	animate,
	motion,
	MotionValue,
	useMotionValue,
	useScroll,
	useSpring,
	useTransform
} from 'framer-motion'
import { useRef } from 'react'
import { useTranslations } from 'next-intl'
import { ButtonLink } from '@/components/buttons/ButtonLink'

const cardData = [
	{
		bg: 'bg-stone-800',
		fanX: -240,
		fanR: -22,
		fanY: 20,
		stackR: -3,
		endX: -100,
		endR: -18,
		endY: 30,
		delay: 0.72,
		label: 'こんにちは',
		textColor: 'text-stone-200'
	},
	{
		bg: 'bg-stone-200',
		fanX: -160,
		fanR: -13,
		fanY: 10,
		stackR: -2,
		endX: -20,
		endR: -8,
		endY: 12,
		delay: 0.64,
		label: 'Bonjour',
		textColor: 'text-stone-700'
	},
	{
		bg: 'bg-zinc-800',
		fanX: -80,
		fanR: -6,
		fanY: 4,
		stackR: -1,
		endX: 60,
		endR: -2,
		endY: 3,
		delay: 0.56,
		label: 'Hola',
		textColor: 'text-zinc-200'
	},
	{
		bg: 'bg-stone-100',
		fanX: 0,
		fanR: 0,
		fanY: 0,
		stackR: 0,
		endX: 140,
		endR: 4,
		endY: 8,
		delay: 0.2,
		label: 'Hello',
		textColor: 'text-stone-700'
	},
	{
		bg: 'bg-neutral-900',
		fanX: 80,
		fanR: 6,
		fanY: 4,
		stackR: 1,
		endX: 220,
		endR: 10,
		endY: 18,
		delay: 0.56,
		label: 'Ciao',
		textColor: 'text-neutral-200'
	},
	{
		bg: 'bg-stone-300',
		fanX: 160,
		fanR: 13,
		fanY: 10,
		stackR: 2,
		endX: 300,
		endR: 16,
		endY: 30,
		delay: 0.64,
		label: 'Hallo',
		textColor: 'text-stone-800'
	},
	{
		bg: 'bg-zinc-200',
		fanX: 240,
		fanR: 22,
		fanY: 20,
		stackR: 3,
		endX: 380,
		endR: 22,
		endY: 44,
		delay: 0.72,
		label: '你好',
		textColor: 'text-zinc-700'
	}
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

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ delay: card.delay, duration: 0.5 }}
			className='absolute left-1/2 top-1/2 w-40 h-44 -ml-20 -mt-22 cursor-pointer'
			style={{ x, y: combinedY, rotate, zIndex }}
			onHoverStart={() =>
				animate(hoverY, -10, { type: 'spring', stiffness: 400, damping: 25 })
			}
			onHoverEnd={() =>
				animate(hoverY, 0, { type: 'spring', stiffness: 400, damping: 25 })
			}
		>
			<div
				className={`w-full h-full ${card.bg} rounded-2xl shadow-sm flex items-center justify-center`}
			>
				<span
					className={`text-lg font-semibold ${card.textColor} font-(family-name:--font-geist-sans)`}
				>
					{card.label}
				</span>
			</div>
		</motion.div>
	)
}

export function HeroSection() {
	const containerRef = useRef<HTMLDivElement>(null)
	const t = useTranslations('landing.hero')
	const tSecond = useTranslations('landing.second')

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
		<div ref={containerRef} className='relative h-[250vh]'>
			<div className='sticky top-0 h-screen overflow-hidden bg-white -mt-5'>
				{/* Hero */}
				<motion.div
					className='absolute inset-0 flex flex-col items-center justify-center gap-5 px-4 z-10 pointer-events-none mb-15'
					style={{ opacity: heroOpacity, y: heroY }}
				>
					<motion.h1
						className='text-4xl text-center md:text-[3.5rem] font-bold text-black leading-tight translate-y-5 pointer-events-auto select-text'
						initial={{ opacity: 0, y: 16, filter: 'blur(6px)' }}
						animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
						transition={{ duration: 0.7, type: 'spring', stiffness: 90, damping: 20 }}
					>
						<span className='font-(family-name:--font-geist-sans)'>
							{t('title')}{' '}
						</span>
						<br className='hidden md:block' />
						<span className='font-(family-name:--font-playfair) italic'>
							{t('subtitle')}
						</span>
					</motion.h1>

					{/* Spacer — holds space for cards */}
					<div className='h-52 w-full shrink-0' />

					<motion.p
						className='text-[1rem] md:text-[1.25rem] text-center text-gray-600 font-(family-name:--font-geist-sans) max-w-2xl mt-5 leading-relaxed pointer-events-auto select-text'
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.35, duration: 0.6, type: 'spring', stiffness: 90, damping: 20 }}
					>
						{t('description')}
					</motion.p>

					<motion.div
						className='pointer-events-auto'
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.55, type: 'spring', stiffness: 120, damping: 18 }}
					>
						<ButtonLink
							text={t('cta')}
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

				{/* Second screen text */}
				<div className='absolute left-8 md:left-20 top-0 bottom-0 flex items-center z-20 max-w-xs'>
					<div>
						<motion.p
							className='text-xs font-semibold tracking-widest text-gray-400 uppercase mb-4 font-(family-name:--font-geist-sans)'
							style={{ opacity: labelOpacity }}
						>
							{tSecond('label')}
						</motion.p>
						<motion.h2
							className='text-4xl md:text-5xl font-bold text-black leading-tight mb-5 font-(family-name:--font-geist-sans)'
							style={{ opacity: newTextOpacity, y: newTextY, x: newTextX }}
						>
							{tSecond('title')}{' '}
							<span className='text-gray-400 font-(family-name:--font-playfair) italic'>
								{tSecond('subtitle')}
							</span>
						</motion.h2>
						<motion.p
							className='text-gray-500 text-sm mb-8 font-(family-name:--font-geist-sans) leading-relaxed'
							style={{ opacity: newTextOpacity, y: newTextY }}
						>
							{tSecond('description')}
						</motion.p>
						<motion.div style={{ opacity: newTextOpacity, y: newTextY }}>
							<ButtonLink text={tSecond('cta')} href='/registration' />
						</motion.div>
					</div>
				</div>
			</div>
		</div>
	)
}
