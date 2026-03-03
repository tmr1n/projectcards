'use client'

import { buttonStyles } from '@/constants/button'
import type { IButtonPrimitiveProps } from '@/shared/types/button.types'
import { cn } from '@/utils/utils'

export function ButtonPrimitive({
	variant = 'primary',
	className,
	children,
	...props
}: IButtonPrimitiveProps) {
	return (
		<button className={cn(buttonStyles({ variant }), className)} {...props}>
			<div className='flex items-center justify-center'>{children}</div>
		</button>
	)
}
