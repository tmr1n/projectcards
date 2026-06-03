'use client'

import {
	ArrowUp,
	ChevronLeft,
	ChevronRight,
	Lightbulb,
	Pencil,
	Repeat,
	Star,
	Volume2
} from 'lucide-react'
import NextLink from 'next/link'
import { useRef, useState } from 'react'
import Logo from '@/components/Logo'
import BottomNav from '@/components/page-components/BottomNav'
import Sidebar from '@/components/page-components/Sidebar'
import { UserAvatar } from '@/components/profile/UserAvatar'

const MOCK_TERMS = [
	{
		id: 1,
		term: 'fragen nach (+ D) — Die Journalistin fragt nach den Konsequenzen der Gesetzesänderung.',
		translation: 'спрашивать о',
		learned: true
	},
	{
		id: 2,
		term: 'sich erholen von (+ D) — Von dem Schock muss ich mich erst erholen.',
		translation: 'восстанавливаться от / оправляться от',
		learned: true
	},
	{
		id: 3,
		term: 'achten auf (+ A) — Du solltest mehr auf deine Gesundheit achten.',
		translation: 'обращать внимание на',
		learned: true
	},
	{
		id: 4,
		term: 'warten auf (+ A) — Ich warte seit einer Stunde auf den Bus.',
		translation: 'ждать',
		learned: false
	},
	{
		id: 5,
		term: 'denken an (+ A) — Ich denke oft an meine Kindheit.',
		translation: 'думать о',
		learned: false
	},
	{
		id: 6,
		term: 'sich freuen auf (+ A) — Ich freue mich auf den Urlaub.',
		translation: 'радоваться (предстоящему)',
		learned: false
	}
]

function IconBtn({
	onClick,
	tooltip,
	children,
	className = ''
}: {
	onClick?: (e: React.MouseEvent) => void
	tooltip: string
	children: React.ReactNode
	className?: string
}) {
	return (
		<div className='relative group'>
			<button
				onClick={e => {
					e.stopPropagation()
					onClick?.(e)
				}}
				className={`rounded-full p-2 hover:bg-gray-100 transition cursor-pointer ${className}`}
			>
				{children}
			</button>
			<div className='absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 text-xs text-white bg-gray-800 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition pointer-events-none z-10'>
				{tooltip}
			</div>
		</div>
	)
}

function TermCard({
	term,
	translation
}: {
	term: string
	translation: string
}) {
	const [starred, setStarred] = useState(false)

	return (
		<div className='bg-white rounded-2xl shadow-[0_0_12px_rgba(0,0,0,0.07)] p-4'>
			<div className='flex justify-end gap-1 mb-2'>
				<IconBtn tooltip='В избранное' onClick={() => setStarred(v => !v)}>
					<Star
						size={18}
						className={
							starred ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'
						}
					/>
				</IconBtn>
				<IconBtn tooltip='Произношение'>
					<Volume2 size={18} className='text-gray-400' />
				</IconBtn>
				<IconBtn tooltip='Редактировать'>
					<Pencil size={18} className='text-gray-400' />
				</IconBtn>
			</div>
			<div className='flex flex-col md:flex-row gap-3 md:gap-6'>
				<p className='flex-1 text-sm text-gray-800 font-medium leading-relaxed'>
					{term}
				</p>
				<div className='hidden md:block w-px bg-gray-200 shrink-0' />
				<div className='block md:hidden h-px bg-gray-200' />
				<p className='flex-1 text-sm text-gray-600 leading-relaxed'>
					{translation}
				</p>
			</div>
		</div>
	)
}

const flashCard = () => {
	const [flipped, setFlipped] = useState(false)
	const [starred, setStarred] = useState(false)
	const [mode, setMode] = useState<'cards' | 'test'>('cards')
	const [showScrollTop, setShowScrollTop] = useState(false)
	const scrollRef = useRef<HTMLDivElement>(null)

	const handleScroll = () => {
		if (!scrollRef.current) return
		const { scrollTop, scrollHeight, clientHeight } = scrollRef.current
		setShowScrollTop(scrollTop + clientHeight > scrollHeight - 300)
	}

	const scrollToTop = () =>
		scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' })

	const learned = MOCK_TERMS.filter(t => t.learned)
	const unlearned = MOCK_TERMS.filter(t => !t.learned)

	return (
		<div className='h-dvh flex overflow-hidden'>
			<Sidebar />

			<div className='flex-1 flex flex-col overflow-hidden'>
				{/* Mobile header */}
				<div className='flex justify-between items-center p-4 md:hidden shrink-0'>
					<Logo size={55} />
					<NextLink href='/profile'>
						<UserAvatar size={60} />
					</NextLink>
				</div>

			<div
				ref={scrollRef}
				onScroll={handleScroll}
				className='flex-1 overflow-y-auto p-4 md:p-10'
			>
				<h2 className='text-2xl font-bold mb-6'>Verben mit pr</h2>
				<div className='inline-flex bg-gray-100 rounded-2xl p-1 gap-1 mb-6'>
					{(['cards', 'test'] as const).map(m => (
						<button
							key={m}
							onClick={() => setMode(m)}
							className={`px-6 py-2 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
								mode === m
									? 'bg-white text-blue-600 shadow-sm'
									: 'text-gray-500 hover:text-gray-800'
							}`}
						>
							{m === 'cards' ? 'Карточки' : 'Тест'}
						</button>
					))}
				</div>

				<div
					className='w-full md:w-187.5 h-60 md:h-100 rounded-lg cursor-pointer perspective-[1000px]'
					onClick={() => setFlipped(v => !v)}
				>
					<div
						className={`relative w-full h-full transition-transform duration-500 transform-3d ${flipped ? 'transform-[rotateY(180deg)]' : ''}`}
					>
						{/* Front */}
						<div className='absolute inset-0 bg-white shadow-[0_0_20px_rgba(0,0,0,0.12)] rounded-lg [backface-visibility:hidden]'>
							<div className='flex flex-row items-start justify-between p-4'>
								<IconBtn tooltip='Подсказка'>
									<Lightbulb />
								</IconBtn>
								<div className='flex flex-row items-start gap-2 md:gap-4'>
									<IconBtn tooltip='Редактировать'>
										<Pencil />
									</IconBtn>
									<IconBtn tooltip='Произношение'>
										<Volume2 />
									</IconBtn>
									<IconBtn
										tooltip='В избранное'
										onClick={() => setStarred(v => !v)}
									>
										<Star
											size={24}
											className={
												starred ? 'fill-yellow-400 text-yellow-400' : ''
											}
										/>
									</IconBtn>
								</div>
							</div>
							<p className='text-lg md:text-2xl text-center font-medium select-none justify-center items-center flex flex-1 px-6 h-[calc(100%-80px)]'>
								sich erholen von (+ D) — Von dem Schock muss ich mich erst
								erholen.
							</p>
						</div>

						{/* Back */}
						<div className='absolute inset-0 bg-white shadow-[0_0_20px_rgba(0,0,0,0.12)] rounded-lg [backface-visibility:hidden] [transform:rotateY(180deg)]'>
							<p className='flex items-center justify-center h-full text-xl md:text-2xl font-medium select-none text-gray-400 px-6 text-center'>
								Перевод / объяснение
							</p>
						</div>
					</div>
				</div>

				<div className='flex items-center justify-between mt-6 w-full md:w-187.5'>
					<div className='w-10' />
					<div className='flex items-center gap-4'>
						<button className='bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-full transition cursor-pointer'>
							<ChevronLeft size={18} />
						</button>
						<span className='text-gray-800 font-bold py-2 px-4'>1/20</span>
						<button className='bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-full transition cursor-pointer'>
							<ChevronRight size={18} />
						</button>
					</div>
					<IconBtn tooltip='Перемешать'>
						<Repeat />
					</IconBtn>
				</div>

				{/* Terms list */}
				<div className='mt-12 w-full md:w-187.5'>
					<h3 className='text-xl font-bold mb-4'>
						Термины в модуле ({MOCK_TERMS.length})
					</h3>

					<div className='bg-gray-50 rounded-2xl p-4 md:p-5 mb-4'>
						<div className='flex items-center justify-between mb-1'>
							<span className='text-orange-500 font-bold'>
								Изучено ({learned.length})
							</span>
							<button className='flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 transition cursor-pointer'>
								<Star size={14} />
								Выбрать {learned.length}
							</button>
						</div>
						<p className='text-sm text-gray-500 mb-4'>
							Вы начали изучать эти термины. Продолжайте!
						</p>
						<div className='flex flex-col gap-3'>
							{learned.map(t => (
								<TermCard
									key={t.id}
									term={t.term}
									translation={t.translation}
								/>
							))}
						</div>
					</div>

					<div className='bg-gray-50 rounded-2xl p-4 md:p-5'>
						<div className='flex items-center justify-between mb-4'>
							<span className='text-gray-700 font-bold'>
								Не изучено ({unlearned.length})
							</span>
						</div>
						<div className='flex flex-col gap-3'>
							{unlearned.map(t => (
								<TermCard
									key={t.id}
									term={t.term}
									translation={t.translation}
								/>
							))}
						</div>
					</div>

					<button className='mt-4 w-full flex items-center justify-center gap-2 py-3 px-6 rounded-2xl border border-gray-300 text-gray-600 hover:bg-gray-50 transition cursor-pointer text-sm font-medium'>
						<Pencil size={16} />
						Добавить или удалить термины
					</button>
				</div>

				<div className='h-10' />
			</div>

			{/* Mobile bottom nav */}
			<div className='flex justify-center md:hidden shrink-0'>
				<BottomNav />
			</div>
		</div>

			{/* Scroll to top */}
			{showScrollTop && (
				<button
					onClick={scrollToTop}
					className='fixed bottom-6 right-6 w-11 h-11 bg-white border border-gray-200 shadow-md rounded-full flex items-center justify-center hover:bg-gray-50 transition cursor-pointer z-50'
				>
					<ArrowUp size={18} className='text-gray-600' />
				</button>
			)}
		</div>
	)
}

export default flashCard
