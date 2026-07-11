'use client'

import { useRouter } from 'next/navigation'
import { BackButton } from './BackButton'

// Клиентская обёртка над BackButton: возвращает на предыдущую страницу
// (router.back()). Нужна на серверных страницах (terms/datenschutz),
// где нельзя передать onClick напрямую.
export function HistoryBackButton() {
	const router = useRouter()
	return <BackButton onClick={() => router.back()} />
}
