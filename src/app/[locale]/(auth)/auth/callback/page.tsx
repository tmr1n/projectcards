'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'

export default function OAuthCallbackPage() {
	const searchParams = useSearchParams()
	const router = useRouter()
	const loginWithOAuth = useAuthStore(state => state.loginWithOAuth)

	useEffect(() => {
		const token = searchParams.get('token')
		if (!token) {
			router.push('/login')
			return
		}

		loginWithOAuth(token).then(() => {
			router.push('/dashboard')
		})
	}, [])

	return <div>Авторизация...</div>
}
