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
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useEffect, useRef, useState } from 'react'
import { getDeckAction } from '@/server-actions/decks.actions'
import { pushRecentDeck } from '@/hooks/useRecentDecks'
import type { ICard, IDeckWithCards } from '@/shared/types/deck.types'

function speak(text: string) {
	const utterance = new SpeechSynthesisUtterance(text)
	utterance.lang = 'de-DE'
	utterance.rate = 0.9
	window.speechSynthesis.cancel()
	window.speechSynthesis.speak(utterance)
}

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
				onClick={e => { e.stopPropagation(); onClick?.(e) }}
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

function TermCard({ card }: { card: ICard }) {
	const t = useTranslations('flashCard')
	const [starred, setStarred] = useState(false)

	return (
		<div className='bg-white rounded-2xl shadow-[0_0_12px_rgba(0,0,0,0.07)] p-4'>
			<div className='flex justify-end gap-1 mb-2'>
				<IconBtn tooltip={t('favorite')} onClick={() => setStarred(v => !v)}>
					<Star size={18} className={starred ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'} />
				</IconBtn>
				<IconBtn tooltip={t('pronounce')} onClick={() => speak(card.front)}>
					<Volume2 size={18} className='text-gray-400' />
				</IconBtn>
			</div>
			<div className='flex flex-col md:flex-row gap-3 md:gap-6'>
				<p className='flex-1 text-sm text-gray-800 font-medium leading-relaxed'>{card.front}</p>
				<div className='hidden md:block w-px bg-gray-200 shrink-0' />
				<div className='block md:hidden h-px bg-gray-200' />
				<p className='flex-1 text-sm text-gray-600 leading-relaxed'>{card.back}</p>
			</div>
		</div>
	)
}

function shuffle<T>(arr: T[]): T[] {
	return [...arr].sort(() => Math.random() - 0.5)
}

function buildQuestions(cards: ICard[]) {
	return cards.map(card => {
		const wrong = shuffle(cards.filter(c => c.id !== card.id)).slice(0, 3)
		const options = shuffle([card.back, ...wrong.map(c => c.back)])
		return { id: card.id, term: card.front, correct: card.back, options }
	})
}

type Question = ReturnType<typeof buildQuestions>[number]

function TestQuestion({
	question, index, total, selected, onSelect, result
}: {
	question: Question
	index: number
	total: number
	selected: string | null
	onSelect: (answer: string) => void
	result: 'correct' | 'wrong' | null
}) {
	const t = useTranslations('flashCard')

	return (
		<div className='bg-white rounded-2xl shadow-[0_0_12px_rgba(0,0,0,0.07)] p-6'>
			<p className='text-xs text-gray-400 font-semibold mb-1'>
				{t('termOf', { index: index + 1, total })}
			</p>
			<p className='text-base font-semibold text-gray-800 mb-5 leading-relaxed'>{question.term}</p>
			<p className='text-xs text-gray-400 uppercase tracking-wide mb-3'>{t('selectAnswer')}</p>
			<div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
				{question.options.map(opt => {
					let style = 'border border-gray-200 text-gray-800 hover:border-violet-400 hover:bg-violet-50'
					if (!result && selected === opt) style = 'border-2 border-violet-500 bg-violet-50 text-violet-800'
					if (result && selected === opt) {
						style = result === 'correct'
							? 'border-2 border-green-500 bg-green-50 text-green-800'
							: 'border-2 border-red-400 bg-red-50 text-red-800'
					}
					if (result === 'wrong' && opt === question.correct) style = 'border-2 border-green-500 bg-green-50 text-green-800'
					return (
						<button
							key={opt}
							disabled={!!result}
							onClick={() => onSelect(opt)}
							className={`text-left px-4 py-3 rounded-xl text-sm transition cursor-pointer disabled:cursor-default ${style}`}
						>
							{opt}
						</button>
					)
				})}
			</div>
		</div>
	)
}

function TestMode({ cards, onBack }: { cards: ICard[]; onBack: () => void }) {
	const t = useTranslations('flashCard')
	const [questions] = useState<Question[]>(() => buildQuestions(cards))
	const [answers, setAnswers] = useState<Record<string, string>>({})
	const [submitted, setSubmitted] = useState(false)

	if (cards.length < 2) {
		return (
			<div className='flex flex-col items-center gap-4 py-20'>
				<p className='text-gray-400'>{t('noCardsForTest')}</p>
				<button onClick={onBack} className='text-violet-600 font-semibold hover:underline'>
					{t('backToCards')}
				</button>
			</div>
		)
	}

	const allAnswered = questions.every(q => answers[q.id] != null)
	const results = submitted
		? questions.map(q => ({ ...q, selected: answers[q.id] ?? null, isCorrect: answers[q.id] === q.correct }))
		: null
	const correctCount = results?.filter(r => r.isCorrect).length ?? 0
	const wrongCount = results ? results.length - correctCount : 0

	if (submitted && results) {
		return (
			<div className='flex flex-col gap-6 w-full md:max-w-3xl mx-auto'>
				<div className='bg-white rounded-2xl shadow-[0_0_12px_rgba(0,0,0,0.07)] p-6'>
					<h3 className='text-xl font-bold mb-4'>{t('testResults')}</h3>
					<div className='flex items-center gap-8'>
						<div className='relative w-24 h-24 shrink-0'>
							<svg viewBox='0 0 36 36' className='w-full h-full -rotate-90'>
								<circle cx='18' cy='18' r='15.9' fill='none' stroke='#f97316' strokeWidth='3' />
								<circle cx='18' cy='18' r='15.9' fill='none' stroke='#22c55e' strokeWidth='3'
									strokeDasharray={`${(correctCount / questions.length) * 100} 100`}
									strokeLinecap='round'
								/>
							</svg>
							<span className='absolute inset-0 flex items-center justify-center text-sm font-bold text-gray-700'>
								{Math.round((correctCount / questions.length) * 100)}%
							</span>
						</div>
						<div className='flex flex-col gap-2'>
							<div className='flex items-center gap-3'>
								<span className='text-green-600 font-semibold'>{t('correct')}</span>
								<span className='bg-green-100 text-green-700 font-bold px-3 py-0.5 rounded-full text-sm'>{correctCount}</span>
							</div>
							<div className='flex items-center gap-3'>
								<span className='text-orange-500 font-semibold'>{t('wrong')}</span>
								<span className='bg-orange-100 text-orange-600 font-bold px-3 py-0.5 rounded-full text-sm'>{wrongCount}</span>
							</div>
						</div>
					</div>
				</div>

				<div className='flex flex-col gap-4'>
					{results.map((r, i) => (
						<TestQuestion key={r.id} question={r} index={i} total={questions.length}
							selected={r.selected} onSelect={() => {}} result={r.isCorrect ? 'correct' : 'wrong'} />
					))}
				</div>

				<button onClick={() => { setAnswers({}); setSubmitted(false) }}
					className='w-full py-3 rounded-2xl bg-violet-500 text-white font-semibold hover:bg-violet-600 transition cursor-pointer'>
					{t('retake')}
				</button>
				<button onClick={onBack}
					className='w-full py-3 rounded-2xl border border-gray-300 text-gray-600 font-semibold hover:bg-gray-50 transition cursor-pointer'>
					{t('backToCards')}
				</button>
			</div>
		)
	}

	return (
		<div className='flex flex-col gap-6 w-full md:max-w-3xl mx-auto'>
			{questions.map((q, i) => (
				<TestQuestion key={q.id} question={q} index={i} total={questions.length}
					selected={answers[q.id] ?? null}
					onSelect={ans => setAnswers(prev => ({ ...prev, [q.id]: ans }))}
					result={null} />
			))}
			<button disabled={!allAnswered} onClick={() => setSubmitted(true)}
				className='w-full py-3 rounded-2xl bg-violet-500 text-white font-semibold hover:bg-violet-600 transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed'>
				{t('submitTest')}
			</button>
		</div>
	)
}

export default function FlashCardPage() {
	const t = useTranslations('flashCard')
	const searchParams = useSearchParams()
	const deckId = searchParams.get('id')

	const [deck, setDeck] = useState<IDeckWithCards | null>(null)
	const [loading, setLoading] = useState(true)
	const [flipped, setFlipped] = useState(false)
	const [starred, setStarred] = useState(false)
	const [mode, setMode] = useState<'cards' | 'test'>('cards')
	const [cardIndex, setCardIndex] = useState(0)
	const [shuffled, setShuffled] = useState(false)
	const [displayCards, setDisplayCards] = useState<ICard[]>([])
	const [showScrollTop, setShowScrollTop] = useState(false)
	const scrollRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		if (!deckId) { setLoading(false); return }
		getDeckAction(deckId).then(res => {
			if (res.success) {
				setDeck(res.data)
				setDisplayCards(res.data.cards)
				pushRecentDeck({ id: res.data.id, title: res.data.title })
			}
			setLoading(false)
		})
	}, [deckId])

	const handleScroll = () => {
		if (!scrollRef.current) return
		const { scrollTop, scrollHeight, clientHeight } = scrollRef.current
		setShowScrollTop(scrollTop + clientHeight > scrollHeight - 300)
	}

	const scrollToTop = () => scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
	const currentCard = displayCards[cardIndex]

	const handleShuffle = () => {
		setDisplayCards(shuffled ? (deck?.cards ?? []) : shuffle([...(deck?.cards ?? [])]))
		setShuffled(v => !v)
		setCardIndex(0)
		setFlipped(false)
	}

	if (loading) {
		return (
			<div className='h-dvh flex items-center justify-center'>
				<div className='w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin' />
			</div>
		)
	}

	if (!deck || !deckId) {
		return (
			<div className='h-dvh flex flex-col items-center justify-center gap-4'>
				<p className='text-gray-500'>{t('moduleNotFound')}</p>
				<Link href='/modules' className='text-violet-600 font-semibold hover:underline'>
					{t('backToModules')}
				</Link>
			</div>
		)
	}

	return (
		<div className='h-dvh flex flex-col overflow-hidden'>
			<div className='flex items-center px-4 md:px-10 py-4 border-b border-gray-100 bg-white shrink-0'>
				<Link href='/dashboard' className='flex items-center gap-1.5 text-sm font-semibold text-violet-600 hover:text-violet-800 transition'>
					<ChevronLeft size={18} />
					{t('backToHome')}
				</Link>
			</div>

			<div className='flex-1 flex flex-col items-center overflow-hidden'>
				<div ref={scrollRef} onScroll={handleScroll} className='w-full flex-1 overflow-y-auto p-4 md:p-10'>
				<div className='w-full flex flex-col items-center'>
					<h2 className='text-2xl font-bold mb-6 self-start'>{deck.title}</h2>

					<div className='inline-flex bg-gray-100 rounded-2xl p-1 gap-1 mb-6'>
						{(['cards', 'test'] as const).map(m => (
							<button key={m} onClick={() => setMode(m)}
								className={`px-6 py-2 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${mode === m ? 'bg-white text-violet-600 shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}>
								{m === 'cards' ? t('cards') : t('test')}
							</button>
						))}
					</div>

					{mode === 'test' ? (
						<TestMode cards={deck.cards} onBack={() => setMode('cards')} />
					) : displayCards.length === 0 ? (
						<div className='flex flex-col items-center gap-4 py-20'>
							<p className='text-gray-400'>{t('noCards')}</p>
							<Link href={`/add-card?id=${deckId}`} className='text-violet-600 font-semibold hover:underline'>
								{t('addCards')}
							</Link>
						</div>
					) : (
						<>
							{currentCard && (
								<div className='w-full md:w-187.5 h-60 md:h-100 rounded-lg cursor-pointer perspective-[1000px]'
									onClick={() => setFlipped(v => !v)}>
									<div className={`relative w-full h-full transition-transform duration-500 transform-3d ${flipped ? 'transform-[rotateY(180deg)]' : ''}`}>
										<div className='absolute inset-0 bg-white shadow-[0_0_20px_rgba(0,0,0,0.12)] rounded-lg backface-hidden'>
											<div className='flex flex-row items-start justify-between p-4'>
												<IconBtn tooltip={t('hint')}><Lightbulb /></IconBtn>
												<div className='flex flex-row items-start gap-2 md:gap-4'>
													<IconBtn tooltip={t('pronounce')} onClick={() => speak(currentCard.front)}><Volume2 /></IconBtn>
													<IconBtn tooltip={t('favorite')} onClick={() => setStarred(v => !v)}>
														<Star size={24} className={starred ? 'fill-yellow-400 text-yellow-400' : ''} />
													</IconBtn>
												</div>
											</div>
											<p className='text-lg md:text-2xl text-center font-medium select-none justify-center items-center flex flex-1 px-6 h-[calc(100%-80px)]'>
												{currentCard.front}
											</p>
										</div>
										<div className='absolute inset-0 bg-white shadow-[0_0_20px_rgba(0,0,0,0.12)] rounded-lg backface-hidden transform-[rotateY(180deg)]'>
											<p className='flex items-center justify-center h-full text-xl md:text-2xl font-medium select-none text-gray-600 px-6 text-center'>
												{currentCard.back}
											</p>
										</div>
									</div>
								</div>
							)}

							<div className='flex items-center justify-between mt-6 w-full md:w-187.5'>
								<div className='w-10' />
								<div className='flex items-center gap-4'>
									<button onClick={() => { setCardIndex(i => Math.max(i - 1, 0)); setFlipped(false) }}
										disabled={cardIndex === 0}
										className='bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-full transition cursor-pointer disabled:opacity-40'>
										<ChevronLeft size={18} />
									</button>
									<span className='text-gray-800 font-bold py-2 px-4'>{cardIndex + 1}/{displayCards.length}</span>
									<button onClick={() => { setCardIndex(i => Math.min(i + 1, displayCards.length - 1)); setFlipped(false) }}
										disabled={cardIndex === displayCards.length - 1}
										className='bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-full transition cursor-pointer disabled:opacity-40'>
										<ChevronRight size={18} />
									</button>
								</div>
								<IconBtn tooltip={t('shuffle')} onClick={handleShuffle}>
									<Repeat className={shuffled ? 'text-violet-500' : ''} />
								</IconBtn>
							</div>

							<div className='mt-12 w-full md:w-187.5'>
								<h3 className='text-xl font-bold mb-4'>
									{t('termsInModule', { count: deck.cards.length })}
								</h3>
								<div className='flex flex-col gap-3 mb-4'>
									{deck.cards.map(c => <TermCard key={c.id} card={c} />)}
								</div>
								<Link className='mt-4 w-full flex items-center justify-center gap-2 py-3 px-6 rounded-2xl border border-gray-300 text-gray-600 hover:bg-gray-50 transition cursor-pointer text-sm font-medium'
									href={`/add-card?id=${deckId}`}>
									<Pencil size={16} />
									{t('addEditRemoveTerms')}
								</Link>
							</div>
						</>
					)}

					<div className='h-10' />
				</div>
				</div>
			</div>


			{showScrollTop && (
				<button onClick={scrollToTop}
					className='fixed bottom-6 right-6 w-11 h-11 bg-white border border-gray-200 shadow-md rounded-full flex items-center justify-center hover:bg-gray-50 transition cursor-pointer z-50'>
					<ArrowUp size={18} className='text-gray-600' />
				</button>
			)}
		</div>
	)
}
