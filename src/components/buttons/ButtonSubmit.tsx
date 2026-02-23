import { cva, type VariantProps } from 'class-variance-authority'
import Link from 'next/link'
import { cn } from '@/utils/utils' // обычно cn = twMerge(clsx())

const buttonStyles = cva(
	[
		'block w-full h-[65px] px-[0.875rem] py-[0.375rem]',
		'text-center text-base font-semibold',
		'border-0 rounded-[50px]',
		'transition-colors duration-300 ease-in-out cursor-pointer'
	],
	{
		variants: {
			variant: {
				primary: 'bg-blue-600 text-white hover:bg-[#7342bc]',
				secondary:
					'font-medium bg-white text-gray-600 border-solid border-2 border-[#eaeaea] hover:bg-[#f0f0f0] border-[#bfbfbf]'
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
		icon?: React.ReactNode
		href: string
	}

export function ButtonSubmit({
	text,
	icon,
	variant,
	className,
	href,
	...props
}: ButtonSubmitProps) {
	return (
		<Link href={href}>
			<div className='flex justify-center items-center flex-row'>
				<button className={cn(buttonStyles({ variant }), className)} {...props}>
					<div className='flex items-center justify-center'>
						<span className='inline-flex text-xl pr-1'>{icon}</span>
						{text}
					</div>
				</button>
			</div>
		</Link>
	)
}
