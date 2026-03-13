// InputBase — базовый компонент поля ввода.
// На него опираются InputComponent и PasswordInput.
//
// ИЗМЕНЕНИЯ:
//
// 1. Убран forwardRef (React 19)
//    Раньше для передачи ref дочернему DOM-элементу нужен был React.forwardRef.
//    В React 19 — ref передаётся как обычный проп, просто деструктурируем его.
//
// 2. Убран хук useInputStyles → заменён на CVA-функцию inputVariants
//    Хук без состояния/эффектов — антипаттерн.
//    CVA (class-variance-authority) — функция для управления вариантами стилей.

import type React from 'react'
import { inputVariants } from '@/constants/input'
import { cn } from '@/utils/utils'
import type { IInputComponentProps } from '@/shared/types/form.types'

// Расширяем пропсы — добавляем ref как обычный проп (React 19 style)
type TInputBaseProps = IInputComponentProps & {
	ref?: React.Ref<HTMLInputElement>
}

export function InputBase({ placeholder, error, className, ref, ...props }: TInputBaseProps) {
	// cn() — утилита: объединяет классы и разрешает конфликты Tailwind
	// inputVariants({ error: Boolean(error) }) — выбирает нужные классы из CVA
	// Boolean(error): null/undefined/'' → false, строка с текстом → true
	return (
		<input
			ref={ref}
			className={cn(inputVariants({ error: Boolean(error) }), className)}
			placeholder={placeholder}
			{...props}
		/>
	)
}
