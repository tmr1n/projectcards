'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import type { IAuthPageLayoutProps } from '@/shared/types/layout.types'
import { useAuthStore } from '@/store/authStore'

// Логин/регистрация как «всплывашка»: размытый градиентный фон на весь экран,
// поверх — карточка с формой (бывшая правая половина). Левая панель убрана.
export function AuthPageLayout({
	topButtons,
	navigationTabs,
	children
}: IAuthPageLayoutProps) {
	const router = useRouter()
	const isAuthenticated = useAuthStore(state => state.isAuthenticated)

	useEffect(() => {
		if (isAuthenticated) router.replace('/dashboard')
	}, [isAuthenticated])

	// Залогиненному форму не показываем вовсе — иначе она мелькает до редиректа
	if (isAuthenticated) return null

	return (
		<div className='relative min-h-screen w-full bg-gradient-to-br from-violet-100 via-purple-100 to-fuchsia-200'>
			{/* Размытые декоративные пятна — эффект заблюренного фона */}
			<div aria-hidden className='pointer-events-none fixed inset-0'>
				<div className='absolute -top-24 -left-24 h-96 w-96 rounded-full bg-violet-300/50 blur-3xl' />
				<div className='absolute bottom-0 right-0 h-[28rem] w-[28rem] rounded-full bg-violet-300/50 blur-3xl' />
			</div>

			<div className='relative z-10 flex min-h-screen items-center justify-center p-4 md:p-8'>
				<div className='w-full max-w-xl overflow-hidden rounded-3xl bg-white shadow-2xl'>
					{topButtons && <div className='p-4 pb-0'>{topButtons}</div>}

					{navigationTabs && (
						<div className='mx-auto flex w-full max-w-lg flex-row justify-center gap-8'>
							{navigationTabs}
						</div>
					)}

					{/* Длинные формы скроллятся внутри карточки, а не всей страницей */}
					<div className='max-h-[75vh] overflow-y-auto'>{children}</div>
				</div>
			</div>
		</div>
	)
}
