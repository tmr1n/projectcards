import { cva } from 'class-variance-authority'

export const navBarStyles = cva(
	'bg-transparent border-0 p-0 focus:outline-none cursor-pointer text-xl md:text-2xl font-bold font-nunito',
	{
		variants: {
			state: {
				active: 'text-black',
				inactive: 'text-gray-400'
			}
		},
		defaultVariants: {
			state: 'inactive'
		}
	}
)
