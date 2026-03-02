'use client'

import React from 'react'
import { buttonStyles } from '@/constants/button'
import { cn } from '@/utils/utils'

interface ButtonPrimitiveProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: 'primary' | 'secondary'
	className?: string
	children: React.ReactNode
}

export function ButtonPrimitive({
	variant = 'primary',
	className,
	children,
	...props
}: ButtonPrimitiveProps) {
	return (
		<button className={cn(buttonStyles({ variant }), className)} {...props}>
			<div className='flex items-center justify-center'>{children}</div>
		</button>
	)
}
