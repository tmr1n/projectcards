// hooks/useInputStyles.ts
import cn from 'clsx'

interface UseInputStylesProps {
	error?: string | null
}

export const useInputStyles = ({ error }: UseInputStylesProps) => {
	return cn(
		'w-full h-12.5 px-4 py-3.5 border-2 border-transparent rounded-lg bg-[#f8f9fa] text-[16px] text-[#2d3748] leading-5.5 transition-all duration-300 ease-in-out',
		'placeholder:text-[#8e9aaf]',
		// Состояние ошибки
		error &&
			'border-red-500 bg-red-50/50 shadow-[0_0_0_3px_rgba(255,71,87,0.1)]',
		// Фокус (красный при ошибке, синий без)
		error
			? 'focus:border-[#ff4757] focus:bg-white focus:shadow-[0_0_0_3px_rgba(255,71,87,0.1)]'
			: 'focus:border-[#007bff] focus:bg-white focus:shadow-[0_0_0_3px_rgba(0,123,255,0.1)]',
		'focus:outline-none pr-0' // pr-0 для PasswordInput будет переопределен
	)
}
