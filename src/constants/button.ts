// constants/button.ts
import { cva } from 'class-variance-authority'

export const buttonStyles = cva(
	[
		'block flex w-full justify-center h-[65px] px-[0.875rem] py-[0.375rem]',
		'text-center text-base font-semibold',
		'border-0 rounded-[50px]',
		'transition-colors duration-300 ease-in-out cursor-pointer'
	],
	{
		variants: {
			variant: {
				primary: 'bg-blue-600 text-white hover:bg-[#7342bc]',
				secondary:
					'font-medium bg-white text-gray-600 border-solid border-2 border-[#eaeaea] hover:bg-[#f0f0f0] border-[#bfbfbf]',
				third:
					'text-sm border-0 font-bold text-blue-600 hover:text-blue-800 transition-colors'
			}
		},
		defaultVariants: {
			variant: 'primary'
		}
	}
)
