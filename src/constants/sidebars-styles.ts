// constants/sidebar-styles.ts
import { stagger, type Variants } from 'motion/react'

export const container: React.CSSProperties = {
	position: 'relative',
	width: 48,
	height: 48
}

export const nav: React.CSSProperties = {
	position: 'fixed',
	top: '20px',
	left: '16px',
	width: 300,
	height: '100vh',
	zIndex: 1000
}

export const background: React.CSSProperties = {
	backgroundColor: '#f5f5f5',
	position: 'absolute',
	inset: 0,
	borderRadius: 20
}

export const toggleContainer: React.CSSProperties = {
	outline: 'none',
	border: 'none',
	WebkitUserSelect: 'none',
	MozUserSelect: 'none',
	cursor: 'pointer',
	position: 'absolute',
	top: 0,
	left: 0,
	width: 48,
	height: 48,
	borderRadius: '50%',
	background: 'transparent',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center'
}

export const list: React.CSSProperties = {
	listStyle: 'none',
	padding: '25px 50px 25px 0',
	margin: 0,
	position: 'absolute',
	top: 80,
	right: 0,
	width: 280,
	height: 'calc(100% - 105px)',
	overflowY: 'auto'
}

export const listItem: React.CSSProperties = {
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'flex-start',
	padding: 0,
	margin: 0,
	listStyle: 'none',
	marginBottom: 20,
	cursor: 'pointer'
}

export const iconPlaceholder: React.CSSProperties = {
	width: 40,
	height: 40,
	borderRadius: '50%',
	flex: '40px 0',
	marginRight: 20
}

export const textPlaceholder: React.CSSProperties = {
	borderRadius: 5,
	width: 200,
	height: 20,
	flex: 1
}

export const navVariants: Variants = {
	open: {
		transition: { delayChildren: stagger(0.07, { startDelay: 0.2 }) }
	},
	closed: {
		transition: { delayChildren: stagger(0.05, { from: 'last' }) }
	}
}

export const itemVariants: Variants = {
	open: {
		y: 0,
		opacity: 1,
		transition: { y: { stiffness: 1000, velocity: -100 } }
	},
	closed: {
		y: 50,
		opacity: 0,
		transition: { y: { stiffness: 1000 } }
	}
}

export const sidebarVariants: Variants = {
	open: (height: number = 1000) => ({
		clipPath: `circle(${height * 2 + 200}px at 40px 40px)`,
		transition: { type: 'spring', stiffness: 20, restDelta: 2 }
	}),
	closed: {
		clipPath: 'circle(30px at 40px 40px)',
		transition: { delay: 0.2, type: 'spring', stiffness: 400, damping: 40 }
	}
}

export const colors = [
	'#FF008C',
	'#D309E1',
	'#9C1AFF',
	'#7700FF',
	'#4400FF'
] as const
