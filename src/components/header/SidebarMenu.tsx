// components/ui/SidebarMenu.tsx
'use client'

import * as motion from 'motion/react-client'
import { useRef, useState } from 'react'
import { useSidebarDimensions } from '@/hooks/use-sidebar-dimensions'
import {
	background,
	colors,
	container,
	iconPlaceholder,
	itemVariants,
	list,
	listItem,
	nav,
	navVariants,
	sidebarVariants,
	textPlaceholder,
	toggleContainer
} from '@/constants/sidebars-styles'
import type {
	MenuItemProps,
	MenuToggleProps,
	PathProps,
	SidebarDimensions
} from '@/shared/types/sidebars-styles.types'

const Navigation = () => (
	<motion.ul style={list} variants={navVariants}>
		{[0, 1, 2, 3, 4].map(i => (
			<MenuItem i={i} key={i} />
		))}
	</motion.ul>
)

const MenuItem = ({ i }: MenuItemProps) => {
	const border = `2px solid ${colors[i]}`
	return (
		<motion.li
			style={listItem}
			variants={itemVariants}
			whileHover={{ scale: 1.1 }}
			whileTap={{ scale: 0.95 }}
		>
			<div style={{ ...iconPlaceholder, border }} />
			<div style={{ ...textPlaceholder, border }} />
		</motion.li>
	)
}

const Path = (props: PathProps) => (
	<motion.path
		fill='transparent'
		strokeWidth='3'
		stroke='hsl(0, 0%, 18%)'
		strokeLinecap='round'
		{...props}
	/>
)

const MenuToggle = ({ toggle }: MenuToggleProps) => (
	<button style={toggleContainer} onClick={toggle}>
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
	const { height }: SidebarDimensions = useSidebarDimensions(containerRef)

	return (
		<div style={container}>
			<motion.nav
				initial={false}
				animate={isOpen ? 'open' : 'closed'}
				custom={height}
				ref={containerRef}
				style={nav}
			>
				<motion.div style={background} variants={sidebarVariants} />
				<Navigation />
				<MenuToggle toggle={() => setIsOpen(!isOpen)} />
			</motion.nav>
		</div>
	)
}
