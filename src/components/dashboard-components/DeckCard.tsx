'use client'

import { EllipsisVertical, Trash2 } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import { useRef, useState } from 'react'
import { createPortal } from 'react-dom'

interface DeckCardProps {
	id: string
	title: string
	canRemove: boolean
	onHide: () => void
}

export default function DeckCard({
	id,
	title,
	canRemove,
	onHide
}: DeckCardProps) {
	const t = useTranslations('dashboard')
	const [open, setOpen] = useState(false)
	const [popupPos, setPopupPos] = useState({ top: 0, right: 0 })
	const btnRef = useRef<HTMLButtonElement>(null)

	const handleOpen = (e: React.MouseEvent) => {
		// Кнопка лежит внутри <Link> — без preventDefault клик уводил бы на карточку
		e.preventDefault()
		e.stopPropagation()
		if (btnRef.current) {
			const rect = btnRef.current.getBoundingClientRect()
			// Меню открываем ВНИЗ от кнопки: карточка обычно у верха экрана,
			// попап «вверх» уезжал за границу окна и был недостижим
			setPopupPos({
				top: rect.bottom + 6,
				right: window.innerWidth - rect.right
			})
		}
		setOpen(v => !v)
	}

	return (
		<>
			<Link
				href={`/flash-card?id=${id}`}
				className='min-w-[90%] md:min-w-[88%] p-6 bg-white shadow-[0_-2px_6px_rgba(0,0,0,0.08)] flex flex-col gap-4 rounded-3xl border border-gray-300 cursor-pointer'
			>
				<div className='flex justify-between items-center gap-2'>
					<h3 className='text-xl font-semibold flex-1 min-w-0 truncate'>
						{title}
					</h3>

					<button
						ref={btnRef}
						onClick={handleOpen}
						className='p-2 rounded-full hover:bg-gray-200 transition cursor-pointer shrink-0'
					>
						<EllipsisVertical />
					</button>
				</div>

				<span className='mt-2 px-4 py-2 w-fit bg-violet-500 text-white rounded-2xl cursor-pointer hover:bg-violet-600 transition'>
					{t('continueBtn')}
				</span>
			</Link>

			{open &&
				createPortal(
					<>
						<div
							className='fixed inset-0 z-40'
							onClick={() => setOpen(false)}
						/>
						<div
							className='fixed z-50 bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden min-w-40'
							style={{ top: popupPos.top, right: popupPos.right }}
						>
							<button
								disabled={!canRemove}
								onClick={() => {
									setOpen(false)
									onHide()
								}}
								className='w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-gray-100 transition disabled:opacity-40 disabled:cursor-not-allowed'
							>
								<Trash2 size={16} />
								{t('remove')}
							</button>
						</div>
					</>,
					document.body
				)}
		</>
	)
}
