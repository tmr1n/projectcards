'use client'

import { useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'

export function ProfileUsername() {
	const user = useAuthStore(state => state.user)
	const fetchProfile = useAuthStore(state => state.fetchProfile)

	useEffect(() => {
		if (!user) fetchProfile()
	}, [])

	return (
		<span className='text-xl text-gray-700 font-semibold'>
			{user?.username ?? '...'}
		</span>
	)
}
