// components/form-components/InputBase.tsx
import React from 'react'
import { useInputStyles } from '@/hooks/useInputStyles'
import type { IInputComponentProps } from '@/shared/types/form.types'

interface InputBaseProps extends IInputComponentProps {
	error?: string | null
	className?: string
}

const InputBase = React.forwardRef<HTMLInputElement, InputBaseProps>(
	({ placeholder, error, className, ...props }, ref) => {
		const inputClasses = useInputStyles({ error })

		return (
			<input
				ref={ref}
				className={inputClasses + ' ' + className}
				placeholder={placeholder}
				{...props}
			/>
		)
	}
)

InputBase.displayName = 'InputBase'
export { InputBase }
