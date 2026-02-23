'use client'

import { cva } from 'class-variance-authority'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface INavBarProps {
	text: string
	href: string // теперь обязательно, т.к. next/link требует

	onClick?: () => void
}

const navBarStyles = cva(
	'bg-transparent border-0 p-0 focus:outline-none cursor-pointer text-2xl font-bold font-nunito',
	{
		variants: {
			state: {
				active: 'text-black relative',
				inactive: 'text-gray-400'
			}
		},
		defaultVariants: {
			state: 'inactive'
		}
	}
)

export function NavBar({ text, href, onClick }: INavBarProps) {
	const pathname = usePathname()
	const active = pathname === href // авто-определение active состояния

	return (
		<Link href={href}>
			<button
				type='button'
				role='tab'
				aria-selected={active}
				onClick={onClick}
				className={navBarStyles({ state: active ? 'active' : 'inactive' })}
			>
				<span>{text}</span>
				{active && (
					<span
						aria-hidden
						className='absolute -bottom-2 left-0 right-0 h-0.75 bg-[#e372ff] rounded-xs shadow-[0_2px_8px_rgba(227,114,255,0.3)]'
					/>
				)}
			</button>
		</Link>
	)
}
