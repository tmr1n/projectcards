// shared/types/sidebar-styles.types.ts
import type { Variants } from 'motion/react'

export interface SidebarDimensions {
	width: number
	height: number
}

export interface MenuToggleProps {
	toggle: () => void
}

export interface MenuItemProps {
	i: number
}

export interface PathProps {
	d?: string
	variants: Variants
	transition?: { duration: number }
}
