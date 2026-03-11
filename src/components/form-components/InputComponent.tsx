import cn from 'clsx'
import React from 'react'
import type { IInputComponentProps } from '@/shared/types/form.types'

interface ExtendedInputProps extends IInputComponentProps {
	error?: string | null // добавляем error пропсу
}

const InputComponent = React.forwardRef<HTMLInputElement, ExtendedInputProps>(
	({ placeholder, className, error, ...props }, ref) => {
		const baseClasses = cn(
			'w-full h-12.5 px-4 py-3.5 border-2 border-transparent rounded-lg bg-[#f8f9fa] text-[16px] text-[#2d3748] leading-5.5 transition-all duration-300 ease-in-out',
			'placeholder:text-[#8e9aaf]',
			'focus:border-[#007bff] focus:bg-white focus:shadow-[0_0_0_3px_rgba(0,123,255,0.1)] focus:outline-none',
			// Стили ошибки
			error &&
				'border-red-500 bg-red-50/50 shadow-[0_0_0_3px_rgba(239,68,68,0.1)]',
			'focus:border-[#ff4757] focus:bg-white focus:shadow-[0_0_0_3px_rgba(255, 71, 87, 0.1)] focus:outline-none',
			className
		)

		return (
			<input
				ref={ref}
				className={baseClasses}
				placeholder={placeholder}
				{...props}
			/>
		)
	}
)

InputComponent.displayName = 'InputComponent'

export { InputComponent }
