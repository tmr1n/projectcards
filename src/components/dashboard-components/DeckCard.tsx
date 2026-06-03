'use client'

import { EllipsisVertical, EyeOff } from 'lucide-react'
import { useRef, useState } from 'react'
import { createPortal } from 'react-dom'

interface DeckCardProps {
	title: string
	progress: number
	canRemove: boolean
	onHide: () => void
}

export default function DeckCard({ title, progress, canRemove, onHide }: DeckCardProps) {
	const [open, setOpen] = useState(false)
	const [popupPos, setPopupPos] = useState({ bottom: 0, right: 0 })
	const btnRef = useRef<HTMLButtonElement>(null)

	const handleOpen = (e: React.MouseEvent) => {
		e.stopPropagation()
		if (btnRef.current) {
			const rect = btnRef.current.getBoundingClientRect()
			setPopupPos({
				bottom: window.innerHeight - rect.top + 6,
				right: window.innerWidth - rect.right,
			})
		}
		setOpen(v => !v)
	}

	return (
		<div className='min-w-[90%] md:min-w-[88%] p-6 bg-white shadow-[0_-2px_6px_rgba(0,0,0,0.08)] flex flex-col gap-4 rounded-3xl border border-gray-300 cursor-pointer'>
			<div className='flex justify-between items-center'>
				<h3 className='text-xl font-semibold'>{title}</h3>

				<button
					ref={btnRef}
					onClick={handleOpen}
					className='p-2 rounded-full hover:bg-gray-200 transition cursor-pointer'
				>
					<EllipsisVertical />
				</button>
			</div>

			<div className='w-[60%] h-4 bg-gray-200 rounded-full overflow-hidden'>
				<div
					className='h-full rounded-full bg-blue-500'
					style={{ width: `${progress}%` }}
				/>
			</div>
			<p className='text-gray-600 font-bold text-sm'>
				{progress}% вопросов пройдено
			</p>
			<button className='mt-2 px-4 py-2 w-fit bg-blue-500 text-white rounded-2xl cursor-pointer hover:bg-blue-600 transition'>
				Продолжить
			</button>

			{open && createPortal(
				<>
					<div className='fixed inset-0 z-40' onClick={() => setOpen(false)} />
					<div
						className='fixed z-50 bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden min-w-40'
						style={{ bottom: popupPos.bottom, right: popupPos.right }}
					>
						<button
							disabled={!canRemove}
							onClick={() => { setOpen(false); onHide() }}
							className='w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-gray-100 transition disabled:opacity-40 disabled:cursor-not-allowed'
						>
							<EyeOff size={16} />
							Удалить
						</button>
					</div>
				</>,
				document.body
			)}
		</div>
	)
}
