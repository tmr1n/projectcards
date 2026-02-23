'use client'

import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface BackButtonProps {
	href?: string
	onClick?: () => void
}

export function BackButton({ href, onClick }: BackButtonProps) {
	if (href) {
		return (
			<Link href={href} aria-label='назад'>
				<ArrowLeft
					color='#586380'
					size={32}
					strokeWidth={1.5}
					className='hover:scale-110 hover:opacity-80 duration-300 cursor-pointer'
				/>
			</Link>
		)
	}

	return (
		<button
			onClick={onClick}
			aria-label='назад'
			className='hover:scale-110 hover:opacity-80 duration-300'
		>
			<ArrowLeft color='#586380' size={32} strokeWidth={1.5} />
		</button>
	)
}
