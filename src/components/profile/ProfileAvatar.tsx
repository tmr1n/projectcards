'use client'

import { Pencil, UserRound } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import { useAuthStore } from '@/store/authStore'
import { AvatarPicker } from './AvatarPicker'

export function ProfileAvatar() {
	const user = useAuthStore(state => state.user)
	const [pickerOpen, setPickerOpen] = useState(false)

	return (
		<>
			<button
				onClick={() => setPickerOpen(true)}
				className='relative group w-25 h-25 rounded-full overflow-hidden cursor-pointer shrink-0'
				aria-label='Change avatar'
			>
				{user?.avatarUrl ? (
					<Image
						src={user.avatarUrl}
						alt='avatar'
						fill
						className='object-cover'
					/>
				) : (
					<div className='w-full h-full bg-violet-700 flex items-center justify-center'>
						<UserRound size={48} color='white' strokeWidth={1.5} />
					</div>
				)}

				{/* Hover overlay */}
				<div className='absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-full'>
					<Pencil size={22} color='white' />
				</div>
			</button>

			{pickerOpen && <AvatarPicker onClose={() => setPickerOpen(false)} />}
		</>
	)
}
