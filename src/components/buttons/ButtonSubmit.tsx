'use client'

import { ButtonPrimitive } from '@/components/buttons/ButtonPrimitive'
import type { IButtonSubmitProps } from '@/shared/types/button.types'

export function ButtonSubmit({
	text,
	icon,
	variant = 'primary',
	className,
	disabled
}: IButtonSubmitProps) {
	return (
		<ButtonPrimitive
			type='submit'
			variant={variant}
			className={className}
			disabled={disabled}
		>
			{icon && <span className='inline-flex text-xl pr-1'>{icon}</span>}
			{text}
		</ButtonPrimitive>
	)
}
