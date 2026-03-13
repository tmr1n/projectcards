// SidebarMenu — мобильное боковое меню с кнопкой бургера.
//
// ИСПРАВЛЕН БАГ: когда меню закрыто, оно блокировало клики на элементы за ним.
//
// ПРИЧИНА БАГА:
// nav имел width: 300px и height: 100vh — огромная область перехватывала все клики,
// даже когда визуально меню было "свёрнуто" (фон был clipPath-ом скрыт).
//
// ИСПРАВЛЕНИЕ:
// nav → pointer-events: 'none' (не перехватывает клики)
// MenuToggle → pointer-events: 'auto' (всегда кликабельна — явно переопределяем)
// Navigation → pointer-events меняется в зависимости от isOpen
//
// КАК pointer-events: none РАБОТАЕТ:
// - Элемент С pointer-events: none не реагирует на клики
// - НО его дочерние элементы МОГУТ реагировать если у них явно задан pointer-events: auto
// - Клики "проваливаются" сквозь элемент с none к элементам под ним

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
	IMenuItemProps,
	IMenuToggleProps,
	IPathProps,
	ISidebarDimensions
} from '@/shared/types/sidebars-styles.types'

// Navigation принимает isOpen — чтобы управлять pointer-events списка
const Navigation = ({ isOpen }: { isOpen: boolean }) => (
	<motion.ul
		// pointer-events: auto только когда меню открыто — иначе не блокируем клики
		style={{ ...list, pointerEvents: isOpen ? 'auto' : 'none' }}
		variants={navVariants}
	>
		{[0, 1, 2, 3, 4].map(i => (
			<MenuItem i={i} key={i} />
		))}
	</motion.ul>
)

const MenuItem = ({ i }: IMenuItemProps) => {
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
	// pointerEvents: 'auto' — явно переопределяем, т.к. родитель nav имеет 'none'
	// Без этого кнопка тоже была бы некликабельной (pointer-events наследуется)
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
				style={{
					...nav,
					// КЛЮЧЕВОЕ ИСПРАВЛЕНИЕ: nav не перехватывает клики.
					// Конкретные дочерние элементы сами управляют своей кликабельностью.
					pointerEvents: 'none',
				}}
			>
				<motion.div style={background} variants={sidebarVariants} />
				{/* Передаём isOpen чтобы Navigation управляла pointer-events */}
				<Navigation isOpen={isOpen} />
				<MenuToggle toggle={() => setIsOpen(!isOpen)} />
			</motion.nav>
		</div>
	)
}
