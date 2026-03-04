import { Check } from 'lucide-react'
import { useId } from 'react'
import type { ICheckbox } from '@/shared/types/form.types'

export function Checkbox({ text }: ICheckbox) {
	const id = useId()

	return (
		<div className='flex items-center mb-4'>
			<label
				htmlFor={id}
				className='flex items-start select-none ms-2 text-sm font-medium text-heading cursor-pointer'
			>
				<input id={id} type='checkbox' className='sr-only peer' />
				<span
					aria-hidden
					className='w-5 h-5  border-2 border-gray-300 rounded-sm bg-white shrink-0 relative mt-0.5 transition-all duration-200 ease-in-out
						peer-checked:bg-purple-500 peer-checked:border-purple-500 group-hover:border-gray-400
						peer-focus-visible:ring-4 peer-focus-visible:ring-purple-200/40
						peer-checked:[&>svg]:opacity-100'
				>
					<Check
						className='absolute left-1/2 top-1/2 w-3 h-3 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-150 opacity-0'
						size={10}
						strokeWidth={4}
						aria-hidden
					/>
				</span>
				<span className='text-gray-800 font-nunito ml-2 font-semibold'>
					{text}
				</span>
			</label>
		</div>
	)
}
