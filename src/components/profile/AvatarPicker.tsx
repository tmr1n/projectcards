'use client'

import { Loader2, Upload } from 'lucide-react'
import Image from 'next/image'
import { useRef } from 'react'
import { useUploadThing } from '@/lib/uploadthing'
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
	const fileInputRef = useRef<HTMLInputElement>(null)

	const { startUpload, isUploading } = useUploadThing('avatarUploader', {
		onClientUploadComplete: async res => {
			const url = res[0]?.serverData?.url
			if (!url) return
			await updateAvatar(url)
			onClose()
		}
	})

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (file) startUpload([file])
	}

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
					{/* Загрузка своей фотки */}
					<button
						onClick={() => fileInputRef.current?.click()}
						disabled={isUploading}
						className='aspect-square rounded-2xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-1 hover:border-blue-400 hover:bg-blue-50 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
					>
						{isUploading ? (
							<Loader2 size={20} className='text-blue-500 animate-spin' />
						) : (
							<Upload size={20} className='text-gray-400' />
						)}
						<span className='text-[10px] text-gray-400'>
							{isUploading ? 'Загрузка...' : 'Загрузить'}
						</span>
					</button>

					<input
						ref={fileInputRef}
						type='file'
						accept='image/*'
						className='hidden'
						onChange={handleFileChange}
					/>

					{PRESET_AVATARS.map(url => (
						<button
							key={url}
							onClick={() => handleSelect(url)}
							disabled={isUploading}
							className='aspect-square rounded-2xl overflow-hidden ring-2 ring-transparent hover:ring-blue-500 transition-all cursor-pointer disabled:opacity-50'
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
					disabled={isUploading}
					className='text-sm text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50'
				>
					Отмена
				</button>
			</div>
		</div>
	)
}
