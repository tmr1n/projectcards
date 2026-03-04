import cn from 'clsx'
import type { IInputComponentProps } from '@/shared/types/form.types'

export function InputComponent({ placeholder }: IInputComponentProps) {
	return (
		<input
			className={cn(
				'w-full h-12.5 px-4 py-3.5 border-2 border-transparent rounded-lg bg-[#f8f9fa] text-[16px] text-[#2d3748] leading-5.5 transition-all duration-300 ease-in-out',
				'placeholder:text-[#8e9aaf]',
				'focus:border-[#007bff] focus:bg-white focus:shadow-[0_0_0_3px_rgba(0,123,255,0.1)] focus:outline-none'
			)}
			placeholder={placeholder}
		/>
	)
}
