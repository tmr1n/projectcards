'use client'

import { X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import type { ICloseButtonProps } from '@/shared/types/button.types'

export function CloseButton({ href }: ICloseButtonProps) {
	const router = useRouter()

	const handleClick = (e: React.MouseEvent) => {
		e.preventDefault()
		// запускаем кастомное событие для layout
		window.dispatchEvent(new Event('auth-exit-up'))
		// даём layout отреагировать и начать exit
		setTimeout(() => router.push(href), 50)
	}

	return (
		<button
			type='button'
			aria-label='Закрыть'
			onClick={handleClick}
			className='close-button'
		>
			<X
				color='#586380'
				size={32}
				strokeWidth={1.5}
				className='hover:scale-110 hover:opacity-80 duration-300 cursor-pointer'
			/>
		</button>
	)
}
