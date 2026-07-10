'use client'

import { closestCenter, DndContext, type DragEndEvent } from '@dnd-kit/core'
import {
	arrayMove,
	SortableContext,
	useSortable,
	verticalListSortingStrategy
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { ChevronLeft, GripVertical, Plus, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useEffect, useState, useTransition } from 'react'
import {
	createCardAction,
	deleteCardAction,
	getDeckAction,
	updateCardAction,
	updateDeckAction
} from '@/server-actions/decks.actions'

interface LocalCard {
	localId: string
	serverId: string | null
	term: string
	definition: string
}

function SortableCard({
	card,
	index,
	canRemove,
	dragLabel,
	termLabel,
	definitionLabel,
	onRemove,
	onUpdate
}: {
	card: LocalCard
	index: number
	canRemove: boolean
	dragLabel: string
	termLabel: string
	definitionLabel: string
	onRemove: () => void
	onUpdate: (field: 'term' | 'definition', value: string) => void
}) {
	const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
		useSortable({ id: card.localId })

	return (
		<div
			ref={setNodeRef}
			style={{ transform: CSS.Transform.toString(transform), transition }}
			className={`bg-white rounded-xl border-2 p-5 transition-colors ${isDragging ? 'border-violet-400 shadow-lg opacity-75' : 'border-gray-200'}`}
		>
			<div className='flex items-center justify-between mb-4'>
				<div className='flex items-center gap-2'>
					<span className='text-sm font-bold text-gray-500'>{index + 1}</span>
					<div className='relative group'>
						<button
							{...attributes}
							{...listeners}
							className='cursor-grab active:cursor-grabbing p-1 rounded hover:bg-gray-100 transition'
						>
							<GripVertical size={18} className='text-gray-400' />
						</button>
						<div className='absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 text-xs text-white bg-gray-800 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition pointer-events-none z-10'>
							{dragLabel}
						</div>
					</div>
				</div>
				<button
					onClick={onRemove}
					disabled={!canRemove}
					className='p-1.5 rounded-full hover:bg-gray-100 transition cursor-pointer text-gray-400 hover:text-red-500 disabled:opacity-30'
				>
					<Trash2 size={16} />
				</button>
			</div>

			<div className='flex flex-col md:flex-row gap-4'>
				<div className='flex-1 flex flex-col gap-1'>
					<input
						maxLength={1000}
						value={card.term}
						onChange={e => onUpdate('term', e.target.value)}
						className='w-full border-b border-gray-300 focus:border-violet-500 outline-none pb-1 text-gray-800 text-sm transition'
					/>
					<span className='text-xs font-bold text-gray-400 uppercase tracking-wide'>
						{termLabel}
					</span>
				</div>
				<div className='flex-1 flex flex-col gap-1'>
					<input
						maxLength={1000}
						value={card.definition}
						onChange={e => onUpdate('definition', e.target.value)}
						className='w-full border-b border-gray-300 focus:border-violet-500 outline-none pb-1 text-gray-800 text-sm transition'
					/>
					<span className='text-xs font-bold text-gray-400 uppercase tracking-wide'>
						{definitionLabel}
					</span>
				</div>
			</div>
		</div>
	)
}

export default function AddCardPage() {
	const t = useTranslations('addCard')
	const searchParams = useSearchParams()
	const deckId = searchParams.get('id')
	const router = useRouter()
	const [isPending, startTransition] = useTransition()

	const [title, setTitle] = useState('')
	const [description, setDescription] = useState('')
	const [cards, setCards] = useState<LocalCard[]>([])
	const [originalCards, setOriginalCards] = useState<LocalCard[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState('')

	useEffect(() => {
		if (!deckId) return
		getDeckAction(deckId).then(res => {
			if (res.success) {
				setTitle(res.data.title)
				setDescription(res.data.description ?? '')
				const loaded: LocalCard[] = res.data.cards.map(c => ({
					localId: c.id,
					serverId: c.id,
					term: c.front,
					definition: c.back
				}))
				setCards(loaded)
				setOriginalCards(loaded)
			}
			setLoading(false)
		})
	}, [deckId])

	const handleDragEnd = (e: DragEndEvent) => {
		const { active, over } = e
		if (over && active.id !== over.id) {
			setCards(prev => {
				const from = prev.findIndex(c => c.localId === active.id)
				const to = prev.findIndex(c => c.localId === over.id)
				return arrayMove(prev, from, to)
			})
		}
	}

	const handleDone = () => {
		if (!deckId) return

		startTransition(async () => {
			const ops: Promise<unknown>[] = []

			if (title.trim()) {
				ops.push(updateDeckAction(deckId, { title: title.trim(), description: description.trim() || undefined }))
			}

			const originalIds = new Set(originalCards.map(c => c.serverId).filter(Boolean))

			for (const card of cards) {
				if (card.serverId) {
					const original = originalCards.find(o => o.serverId === card.serverId)
					if (original && (original.term !== card.term || original.definition !== card.definition)) {
						ops.push(updateCardAction(card.serverId, { front: card.term, back: card.definition }))
					}
				} else {
					if (card.term.trim() && card.definition.trim()) {
						ops.push(createCardAction(deckId, { front: card.term, back: card.definition }))
					}
				}
			}

			const currentIds = new Set(cards.map(c => c.serverId).filter(Boolean))
			for (const id of originalIds) {
				if (id && !currentIds.has(id)) {
					ops.push(deleteCardAction(id))
				}
			}

			await Promise.all(ops)
			router.push(`/flash-card?id=${deckId}`)
		})
	}

	if (!deckId) {
		return (
			<div className='min-h-dvh flex items-center justify-center'>
				<p className='text-gray-500'>{t('moduleNotFound')}</p>
			</div>
		)
	}

	return (
		<div className='min-h-dvh bg-gray-50'>
			<div className='flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200'>
				<Link
					href={`/flash-card?id=${deckId}`}
					className='flex items-center gap-1 text-violet-600 font-semibold hover:text-violet-800 transition text-sm'
				>
					<ChevronLeft size={18} />
					{t('backToModule')}
				</Link>
				<button
					onClick={handleDone}
					disabled={isPending}
					className='bg-violet-600 hover:bg-violet-700 text-white font-bold px-6 py-2.5 rounded-full transition cursor-pointer text-sm disabled:opacity-50'
				>
					{isPending ? t('saving') : t('done')}
				</button>
			</div>

			{loading ? (
				<div className='max-w-4xl mx-auto px-6 py-8 flex flex-col gap-4'>
					{Array.from({ length: 3 }).map((_, i) => (
						<div key={i} className='bg-white rounded-xl h-28 animate-pulse' />
					))}
				</div>
			) : (
				<div className='max-w-4xl mx-auto px-6 py-8 flex flex-col gap-4'>
					<div className='bg-white rounded-xl border border-gray-200 px-5 py-4'>
						<p className='text-xs text-gray-400 mb-1'>{t('titleLabel')}</p>
						<input
							maxLength={100}
							value={title}
							onChange={e => setTitle(e.target.value)}
							placeholder={t('titleLabel')}
							className='w-full text-lg font-semibold outline-none text-gray-800 placeholder-gray-300'
						/>
					</div>

					<div className='bg-white rounded-xl border border-gray-200 px-5 py-4'>
						<input
							maxLength={500}
							value={description}
							onChange={e => setDescription(e.target.value)}
							placeholder={t('descriptionPlaceholder')}
							className='w-full outline-none text-gray-500 placeholder-gray-400 text-sm'
						/>
					</div>

					<DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
						<SortableContext
							items={cards.map(c => c.localId)}
							strategy={verticalListSortingStrategy}
						>
							<div className='flex flex-col gap-4'>
								{cards.map((card, i) => (
									<SortableCard
										key={card.localId}
										card={card}
										index={i}
										canRemove={cards.length > 1}
										dragLabel={t('dragToReorder')}
										termLabel={t('term')}
										definitionLabel={t('definition')}
										onRemove={() =>
											setCards(prev => prev.filter(c => c.localId !== card.localId))
										}
										onUpdate={(field, value) =>
											setCards(prev =>
												prev.map(c =>
													c.localId === card.localId ? { ...c, [field]: value } : c
												)
											)
										}
									/>
								))}
							</div>
						</SortableContext>
					</DndContext>

					<div className='flex items-center justify-between mt-2 pb-10'>
						<div className='flex-1' />
						<button
							onClick={() =>
								setCards(prev => [
									...prev,
									{ localId: `new-${Date.now()}`, serverId: null, term: '', definition: '' }
								])
							}
							className='flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-xl text-violet-600 font-semibold hover:bg-violet-50 transition cursor-pointer text-sm shadow-sm'
						>
							<Plus size={18} />
							{t('addCard')}
						</button>
						<div className='flex-1 flex justify-end'>
							<button
								onClick={handleDone}
								disabled={isPending}
								className='bg-violet-600 hover:bg-violet-700 text-white font-bold px-6 py-2.5 rounded-full transition cursor-pointer text-sm disabled:opacity-50'
							>
								{isPending ? t('saving') : t('done')}
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}
