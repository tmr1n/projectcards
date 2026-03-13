import Link from 'next/link'
import { buttonStyles } from '@/constants/button'
import type { IButtonLinkProps } from '@/shared/types/button.types'
import { cn } from '@/utils/utils'

export function ButtonLink({
	text,
	href,
	icon,
	variant = 'primary',
	className
}: IButtonLinkProps) {
	return (
		<Link href={href} className={cn(buttonStyles({ variant }), className)}>
			<div className='flex items-center justify-center'>
				{icon && <span className='inline-flex text-xl pr-1'>{icon}</span>}
				{text}
			</div>
		</Link>
	)
}
