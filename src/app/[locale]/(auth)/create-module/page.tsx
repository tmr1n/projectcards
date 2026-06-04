'use client'

import { closestCenter, DndContext, type DragEndEvent } from '@dnd-kit/core'
import {
	arrayMove,
	SortableContext,
	useSortable,
	verticalListSortingStrategy
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { ChevronLeft, GripVertical, Image, Plus, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

interface Card {
	id: number
	term: string
	definition: string
}

function SortableCard({
	card,
	index,
	canRemove,
	onRemove,
	onUpdate
}: {
	card: Card
	index: number
	canRemove: boolean
	onRemove: () => void
	onUpdate: (field: 'term' | 'definition', value: string) => void
}) {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging
	} = useSortable({ id: card.id })

	return (
		<div
			ref={setNodeRef}
			style={{ transform: CSS.Transform.toString(transform), transition }}
			className={`bg-white rounded-xl border-2 p-5 transition-colors ${isDragging ? 'border-blue-400 shadow-lg opacity-75' : 'border-gray-200'}`}
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
							Перетащите, чтобы поменять порядок
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
						value={card.term}
						onChange={e => onUpdate('term', e.target.value)}
						className='w-full border-b border-gray-300 focus:border-blue-500 outline-none pb-1 text-gray-800 text-sm transition'
					/>
					<span className='text-xs font-bold text-gray-400 uppercase tracking-wide'>
						Термин
					</span>
				</div>

				<div className='flex-1 flex flex-col gap-1'>
					<input
						value={card.definition}
						onChange={e => onUpdate('definition', e.target.value)}
						className='w-full border-b border-gray-300 focus:border-blue-500 outline-none pb-1 text-gray-800 text-sm transition'
					/>
					<span className='text-xs font-bold text-gray-400 uppercase tracking-wide'>
						Определение
					</span>
				</div>

				<button className='self-start md:self-center flex flex-col items-center justify-center w-16 h-14 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 transition cursor-pointer text-gray-400 hover:text-blue-500 shrink-0'>
					<Image size={18} />
					<span className='text-[10px] mt-1'>Изображение</span>
				</button>
			</div>
		</div>
	)
}

export default function CreateModulePage() {
	const [title, setTitle] = useState('')
	const [description, setDescription] = useState('')
	const [cards, setCards] = useState<Card[]>([
		{ id: 1, term: '', definition: '' }
	])

	const handleDragEnd = (e: DragEndEvent) => {
		const { active, over } = e
		if (over && active.id !== over.id) {
			setCards(prev => {
				const from = prev.findIndex(c => c.id === active.id)
				const to = prev.findIndex(c => c.id === over.id)
				return arrayMove(prev, from, to)
			})
		}
	}

	return (
		<div className='min-h-dvh bg-gray-50'>
			<div className='flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200'>
				<Link
					href='/modules'
					className='flex items-center gap-1 text-blue-600 font-semibold hover:text-blue-800 transition text-sm'
				>
					<ChevronLeft size={18} />
					Мои модули
				</Link>
				<button className='bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-full transition cursor-pointer text-sm'>
					Создать
				</button>
			</div>

			<div className='max-w-4xl mx-auto px-6 py-8 flex flex-col gap-4'>
				<div className='bg-white rounded-xl border border-gray-200 px-5 py-4'>
					<p className='text-xs text-gray-400 mb-1'>Название модуля</p>
					<input
						value={title}
						onChange={e => setTitle(e.target.value)}
						placeholder='Введите название...'
						className='w-full text-lg font-semibold outline-none text-gray-800 placeholder-gray-300'
					/>
				</div>

				<div className='bg-white rounded-xl border border-gray-200 px-5 py-4'>
					<input
						value={description}
						onChange={e => setDescription(e.target.value)}
						placeholder='Добавьте описание...'
						className='w-full outline-none text-gray-500 placeholder-gray-400 text-sm'
					/>
				</div>

				<DndContext
					collisionDetection={closestCenter}
					onDragEnd={handleDragEnd}
				>
					<SortableContext
						items={cards.map(c => c.id)}
						strategy={verticalListSortingStrategy}
					>
						<div className='flex flex-col gap-4'>
							{cards.map((card, i) => (
								<SortableCard
									key={card.id}
									card={card}
									index={i}
									canRemove={cards.length > 1}
									onRemove={() =>
										setCards(prev => prev.filter(c => c.id !== card.id))
									}
									onUpdate={(field, value) =>
										setCards(prev =>
											prev.map(c =>
												c.id === card.id ? { ...c, [field]: value } : c
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
								{ id: Date.now(), term: '', definition: '' }
							])
						}
						className='flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-xl text-blue-600 font-semibold hover:bg-blue-50 transition cursor-pointer text-sm shadow-sm'
					>
						<Plus size={18} />
						Добавить карточку
					</button>
					<div className='flex-1 flex justify-end'>
						<button className='bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-full transition cursor-pointer text-sm'>
							Создать
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}
