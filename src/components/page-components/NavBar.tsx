'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { navBarStyles } from '@/constants/navabr'
import type { INavBarProps } from '@/shared/types/form.types'

export function NavBar({ text, href, onClick }: INavBarProps) {
	const pathname = usePathname()
	const active = pathname === href // авто-определение active состояния

	return (
		<Link href={href} className='flex flex-col items-center gap-1'>
			<button
				type='button'
				role='tab'
				aria-selected={active}
				onClick={onClick}
				className={navBarStyles({ state: active ? 'active' : 'inactive' })}
			>
				<span>{text}</span>
			</button>
			{active && (
				<span
					aria-hidden
					className='w-full h-0.75 bg-[#e372ff] rounded-xs shadow-[0_2px_8px_rgba(227,114,255,0.3)]'
				/>
			)}
		</Link>
	)
}
