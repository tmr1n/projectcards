// interface Props {
// 	text: string
// }

// export function ButtonSubmit({ text }: Props) {
// 	return (
// 		<div className='flex justify-center'>
// 			<button className='block w-full h-16.25 px-3.5 py-1.5 text-center text-base font-semibold text-white bg-blue-600 cursor-pointer border-0 rounded-[50px] transition-colors duration-300 ease-in-out hover:bg-[#7342bc] '>
// 				{text}
// 			</button>
// 		</div>
// 	)
// }

// components/ui/button-submit.tsx

import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/utils/utils' // обычно cn = twMerge(clsx())

const buttonStyles = cva(
	[
		'block w-full h-[65px] px-[0.875rem] py-[0.375rem]',
		'text-center text-base font-semibold',
		'border-0 rounded-[50px]',
		'transition-colors duration-300 ease-in-out',
		'disabled:cursor-not-allowed disabled:bg-[#adb5bd]'
	],
	{
		variants: {
			variant: {
				primary: 'bg-blue-600 text-white hover:bg-[#7342bc]',
				danger: 'bg-red-600 text-white hover:bg-red-700',
				ghost: 'bg-transparent text-blue-600 hover:bg-blue-50'
			}
		},
		defaultVariants: {
			variant: 'primary'
		}
	}
)

type ButtonSubmitProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
	VariantProps<typeof buttonStyles> & {
		text: string
	}

export function ButtonSubmit({
	text,
	variant,
	className,
	...props
}: ButtonSubmitProps) {
	return (
		<div className='flex justify-center'>
			<button className={cn(buttonStyles({ variant }), className)} {...props}>
				{text}
			</button>
		</div>
	)
}
