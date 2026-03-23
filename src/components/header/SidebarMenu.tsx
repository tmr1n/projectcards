'use client'

import * as motion from 'motion/react-client'
import Link from 'next/link'
import { useRef, useState } from 'react'
import { useSidebarDimensions } from '@/hooks/use-sidebar-dimensions'
import {
	background,
	container,
	itemVariants,
	list,
	listItem,
	nav,
	navVariants,
	sidebarVariants,
	toggleContainer
} from '@/constants/sidebars-styles'
import type {
	IMenuToggleProps,
	IPathProps,
	ISidebarDimensions
} from '@/shared/types/sidebars-styles.types'

const navItems = [
	{ label: 'Главная', href: '/' },
	{ label: 'Регистрация', href: '/registration' },
	{ label: 'Войти', href: '/login' }
]

const Navigation = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => (
	<motion.ul
		style={{ ...list, pointerEvents: isOpen ? 'auto' : 'none' }}
		variants={navVariants}
	>
		{navItems.map((item, i) => (
			<MenuItem key={item.href} i={i} label={item.label} href={item.href} onClose={onClose} />
		))}
	</motion.ul>
)

const MenuItem = ({
	i,
	label,
	href,
	onClose
}: {
	i: number
	label: string
	href: string
	onClose: () => void
}) => (
	<motion.li
		style={listItem}
		variants={itemVariants}
		whileHover={{ scale: 1.03 }}
		whileTap={{ scale: 0.97 }}
	>
		<Link
			href={href}
			onClick={onClose}
			style={{
				display: 'flex',
				alignItems: 'center',
				gap: 14,
				textDecoration: 'none',
				width: '100%',
				padding: '4px 0'
			}}
		>
			<span
				style={{
					width: 8,
					height: 8,
					borderRadius: '50%',
					backgroundColor: ['#7342bc', '#4F46E5', '#2563EB'][i] ?? '#9CA3AF',
					flexShrink: 0
				}}
			/>
			<span
				style={{
					fontSize: 16,
					fontWeight: 600,
					color: '#111',
					fontFamily: 'var(--font-geist-sans)'
				}}
			>
				{label}
			</span>
		</Link>
	</motion.li>
)

const Path = (props: IPathProps) => (
	<motion.path
		fill='transparent'
		strokeWidth='3'
		stroke='hsl(0, 0%, 18%)'
		strokeLinecap='round'
		{...props}
	/>
)

const MenuToggle = ({ toggle }: IMenuToggleProps) => (
	<button style={{ ...toggleContainer, pointerEvents: 'auto' }} onClick={toggle}>
		<svg width='23' height='23' viewBox='0 0 23 23'>
			<Path
				variants={{
					closed: { d: 'M 2 2.5 L 20 2.5' },
					open: { d: 'M 3 16.5 L 17 2.5' }
				}}
			/>
			<Path
				d='M 2 9.423 L 20 9.423'
				variants={{ closed: { opacity: 1 }, open: { opacity: 0 } }}
				transition={{ duration: 0.1 }}
			/>
			<Path
				variants={{
					closed: { d: 'M 2 16.346 L 20 16.346' },
					open: { d: 'M 3 2.5 L 17 16.346' }
				}}
			/>
		</svg>
	</button>
)

export default function SidebarMenu() {
	const [isOpen, setIsOpen] = useState(false)
	const containerRef = useRef<HTMLDivElement>(null)
	const { height }: ISidebarDimensions = useSidebarDimensions(containerRef)

	return (
		<div style={container}>
			<motion.nav
				initial={false}
				animate={isOpen ? 'open' : 'closed'}
				custom={height}
				ref={containerRef}
				style={{ ...nav, pointerEvents: 'none' }}
			>
				<motion.div style={background} variants={sidebarVariants} />
				<Navigation isOpen={isOpen} onClose={() => setIsOpen(false)} />
				<MenuToggle toggle={() => setIsOpen(!isOpen)} />
			</motion.nav>
		</div>
	)
}
