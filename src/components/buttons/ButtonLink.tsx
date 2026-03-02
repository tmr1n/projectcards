// components/ui/button-link.tsx
import Link from 'next/link'
import React from 'react'
import { ButtonPrimitive } from '@/components/ui/ButtonPrimitive'

interface ButtonLinkProps {
	text: string
	href: string
	icon?: React.ReactNode
	variant?: 'primary' | 'secondary' // ✅ Правильное имя
	className?: string
}

export function ButtonLink({
	text,
	href,
	icon,
	variant = 'primary',
	className
}: ButtonLinkProps) {
	return (
		<Link href={href}>
			<ButtonPrimitive variant={variant} className={className}>
				{icon && <span className='inline-flex text-xl pr-1'>{icon}</span>}
				{text}
			</ButtonPrimitive>
		</Link>
	)
}
