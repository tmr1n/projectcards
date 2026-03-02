'use client'

import React from 'react'
import { ButtonPrimitive } from '@/components/ui/ButtonPrimitive'

interface ButtonSubmitProps {
	text: string
	icon?: React.ReactNode
	variant?: 'primary' | 'secondary'
	className?: string
	href?: string
}

export function ButtonSubmit({
	text,
	icon,
	variant = 'primary',
	className
}: ButtonSubmitProps) {
	return (
		<ButtonPrimitive type='submit' variant={variant} className={className}>
			{icon && <span className='inline-flex text-xl pr-1'>{icon}</span>}
			{text}
		</ButtonPrimitive>
	)
}
