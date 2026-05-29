'use client'

import { Upload } from 'lucide-react'
import Image from 'next/image'
import { useAuthStore } from '@/store/authStore'

const PRESET_AVATARS = [
	'/avatars/1.svg',
	'/avatars/2.svg',
	'/avatars/3.svg',
	'/avatars/4.svg',
	'/avatars/5.svg'
]

export function AvatarPicker({ onClose }: { onClose: () => void }) {
	const updateAvatar = useAuthStore(state => state.updateAvatar)

	const handleSelect = async (url: string) => {
		await updateAvatar(url)
		onClose()
	}

	return (
		<div
			className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4'
			onClick={onClose}
		>
			<div
				className='bg-white rounded-2xl p-6 w-full max-w-sm flex flex-col gap-4'
				onClick={e => e.stopPropagation()}
			>
				<h2 className='text-base font-bold text-gray-900'>Выберите аватар</h2>

				<div className='grid grid-cols-3 gap-3'>
					{/* Заглушка загрузки */}
					<div className='aspect-square rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-1 opacity-40 cursor-not-allowed select-none'>
						<Upload size={20} className='text-gray-400' />
						<span className='text-[10px] text-gray-400'>Загрузить</span>
					</div>

					{PRESET_AVATARS.map(url => (
						<button
							key={url}
							onClick={() => handleSelect(url)}
							className='aspect-square rounded-2xl overflow-hidden ring-2 ring-transparent hover:ring-blue-500 transition-all cursor-pointer'
						>
							<Image
								src={url}
								alt='avatar'
								width={120}
								height={120}
								className='w-full h-full object-cover'
							/>
						</button>
					))}
				</div>

				<button
					onClick={onClose}
					className='text-sm text-gray-400 hover:text-gray-600 transition-colors'
				>
					Отмена
				</button>
			</div>
		</div>
	)
}
