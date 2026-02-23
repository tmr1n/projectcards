'use client'

import { X } from 'lucide-react'
import Link from 'next/link'

interface CloseButtonProps {
	href?: string
	onClick?: () => void
}

export function CloseButton({ href, onClick }: CloseButtonProps) {
	if (href) {
		return (
			<Link href={href} aria-label='закрыть'>
				<X
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
			aria-label='закрыть'
			className='hover:scale-110 hover:opacity-80 duration-300'
		>
			<X color='#586380' size={32} strokeWidth={1.5} />
		</button>
	)
}
