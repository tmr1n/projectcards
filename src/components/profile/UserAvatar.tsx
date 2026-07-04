'use client'

import { UserRound } from 'lucide-react'
import Image from 'next/image'
import { useAuthStore } from '@/store/authStore'

export function UserAvatar({ size = 36 }: { size?: number }) {
	const user = useAuthStore(state => state.user)

	const style = {
		width: size,
		height: size,
		minWidth: size,
		minHeight: size
	}

	if (user?.avatarUrl) {
		return (
			<div style={style} className='rounded-full overflow-hidden'>
				<Image
					src={user.avatarUrl}
					alt='avatar'
					width={size}
					height={size}
					className='w-full h-full object-cover'
				/>
			</div>
		)
	}

	return (
		<div
			style={style}
			className='rounded-full bg-violet-700 flex items-center justify-center'
		>
			<UserRound size={size * 0.55} color='white' strokeWidth={1.5} />
		</div>
	)
}
