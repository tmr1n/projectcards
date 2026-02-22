import type { ReactNode } from 'react'

interface ILabelProps {
	text: string | ReactNode
}

export function LabelComponent({ text }: ILabelProps) {
	return (
		<label className='block text-sm font-semibold text-[#586380] transition-colors duration-300 ease-in-out font-nunito'>
			{text}
		</label>
	)
}
