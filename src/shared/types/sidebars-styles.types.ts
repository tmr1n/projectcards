// sidebar-styles.types.ts — типы для компонентов боковой навигации (мобильное меню).
// Правило: интерфейсы = I-префикс, типы = T-префикс.

import type { Variants } from 'motion/react'

// Размеры сайдбара — нужны для расчёта радиуса анимации clipPath
export interface ISidebarDimensions {
	width: number
	height: number
}

// Пропсы кнопки бургера (открыть/закрыть меню)
export interface IMenuToggleProps {
	toggle: () => void
}

// Пропсы одного пункта меню.
// i — индекс элемента, определяет его цвет (из массива colors)
export interface IMenuItemProps {
	i: number
}

// Пропсы для SVG-пути в иконке бургера.
// variants — объект анимации (open/closed состояния)
export interface IPathProps {
	d?: string
	variants: Variants
	transition?: { duration: number }
}
