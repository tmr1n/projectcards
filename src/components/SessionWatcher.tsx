'use client'

import { useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'

// Периодически и при возврате на вкладку проверяет срок access-токена.
// Если истёк — стор сбрасывает визуальную авторизацию (не ждём 401 от API).
export function SessionWatcher() {
	const checkSession = useAuthStore(s => s.checkSession)

	useEffect(() => {
		checkSession()
		const onFocus = () => checkSession()
		window.addEventListener('focus', onFocus)
		document.addEventListener('visibilitychange', onFocus)
		const id = setInterval(checkSession, 60_000)
		return () => {
			window.removeEventListener('focus', onFocus)
			document.removeEventListener('visibilitychange', onFocus)
			clearInterval(id)
		}
	}, [checkSession])

	return null
}
