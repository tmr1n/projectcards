// components/ui/button-link.tsx
import Link from 'next/link'
import { ButtonPrimitive } from '@/components/ui/ButtonPrimitive'
import type { IButtonLinkProps } from '@/shared/types/button.types'

export function ButtonLink({
	text,
	href,
	icon,
	variant = 'primary',
	className
}: IButtonLinkProps) {
	return (
		<Link href={href}>
			<ButtonPrimitive variant={variant} className={className}>
				{icon && <span className='inline-flex text-xl pr-1'>{icon}</span>}
				{text}
			</ButtonPrimitive>
		</Link>
	)
}
