import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/utils/utils' // обычно cn = twMerge(clsx())

const buttonStyles = cva(
	[
		'block w-full h-[65px] px-[0.875rem] py-[0.375rem]',
		'text-center text-base font-semibold',
		'border-0 rounded-[50px]',
		'transition-colors duration-300 ease-in-out'
	],
	{
		variants: {
			variant: {
				primary: 'bg-blue-600 text-white hover:bg-[#7342bc]',
				secondary:
					'font-medium bg-white text-gray-600 border-solid border-2 border-[#dcdcdc] hover:bg-[#f0f0f0] border-[#bfbfbf]'
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
