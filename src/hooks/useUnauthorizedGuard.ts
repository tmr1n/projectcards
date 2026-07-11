'use client'

import { useRouter } from 'next/navigation'
import { useCallback } from 'react'
import { useAuthStore } from '@/store/authStore'

// Ловит истёкшую авторизацию (сервер вернул 401): чистит стор и уводит на логин.
// Без этого юзер остаётся «залогинен», но данные не грузятся — «модули не найдены»
// без объяснения (истёк 15-мин access-токен).
export function useUnauthorizedGuard() {
	const router = useRouter()
	const logout = useAuthStore(state => state.logout)

	return useCallback(
		(res: { unauthorized?: boolean }) => {
			if (res.unauthorized) {
				logout()
				router.replace('/login')
			}
		},
		[router, logout]
	)
}
