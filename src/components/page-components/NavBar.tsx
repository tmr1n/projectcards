import { cva } from 'class-variance-authority'

interface INavBarProps {
	text: string
	active?: boolean
	onClick?: () => void
}

const navBarStyles = cva(
	'bg-transparent border-0 p-0 focus:outline-none cursor-pointer text-2xl font-bold font-nunito',
	{
		variants: {
			state: {
				// active includes relative positioning so the custom underline can be absolutely positioned
				active: 'text-black relative',
				inactive: 'text-gray-400'
			}
		},
		defaultVariants: {
			state: 'inactive'
		}
	}
)

export function NavBar({ text, active = false, onClick }: INavBarProps) {
	const state = active ? 'active' : 'inactive'

	return (
		<button
			type='button'
			role='tab'
			aria-selected={active}
			onClick={onClick}
			className={navBarStyles({ state })}
		>
			<span>{text}</span>
			{active && (
				<span
					aria-hidden
					className='absolute -bottom-2 left-0 right-0 h-0.75 bg-[#e372ff] rounded-xs shadow-[0_2px_8px_rgba(227,114,255,0.3)]'
				/>
			)}
		</button>
	)
}
