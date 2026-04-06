'use client'

import { X } from 'lucide-react'
import { useAuthTransition } from '@/app/[locale]/(auth)/layout'
import type { ICloseButtonProps } from '@/shared/types/button.types'

export function CloseButton({ href }: ICloseButtonProps) {
	const { navigateOut } = useAuthTransition()

	return (
		<button
			onClick={() => navigateOut(href)}
			aria-label='Закрыть'
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
