import cn from 'clsx'
import type { ILabelProps } from '@/shared/types/form.types'

export function LabelComponent({ text, error, className = '' }: ILabelProps) {
	const baseClasses = cn(
		'block text-sm font-medium font-nunito',
		error ? 'text-[#ff4757] !font-bold' : 'text-[#586380]',
		className
	)

	// Показываем ТОЛЬКО ошибку при её наличии
	const labelContent = error ? error : text

	return <label className={baseClasses}>{labelContent}</label>
}
