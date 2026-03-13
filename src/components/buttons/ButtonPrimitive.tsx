// ButtonPrimitive — базовый компонент кнопки.
// Все остальные кнопки (ButtonLink, ButtonSubmit) используют его внутри.
//
// ИЗМЕНЕНИЕ: перенесён из components/ui/ → components/buttons/
// Раньше был в ui/, но все кнопки живут в buttons/ — логичнее держать в одном месте.
// Файл ui/ButtonPrimitive.tsx оставлен для обратной совместимости.

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
		// cn() объединяет базовые стили из CVA (buttonStyles) с кастомным className
		<button className={cn(buttonStyles({ variant }), className)} {...props}>
			{/* div для центрирования содержимого (иконка + текст) */}
			<div className='flex items-center justify-center'>{children}</div>
		</button>
	)
}
