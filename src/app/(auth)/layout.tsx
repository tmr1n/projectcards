'use client'

import { AnimatePresence, easeInOut, easeOut, motion } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function AuthLayout({
	children
}: {
	children: React.ReactNode
}) {
	const pathname = usePathname()
	const [exitVariant, setExitVariant] = useState<'normal' | 'up'>('normal')

	// слушаем событие “уйти вверх” от CloseButton
	useEffect(() => {
		const onExitUp = () => setExitVariant('up')
		window.addEventListener('auth-exit-up', onExitUp)
		return () => window.removeEventListener('auth-exit-up', onExitUp)
	}, [])

	// анимации
	const variants = {
		initial: { opacity: 0, y: -40 },
		animate: {
			opacity: 1,
			y: 0,
			transition: { duration: 0.35, ease: easeOut }
		},
		exit:
			exitVariant === 'up'
				? {
						opacity: 0,
						y: -100,
						transition: { duration: 0.4, ease: easeInOut }
					}
				: { opacity: 0, transition: { duration: 0.25, ease: easeInOut } }
	}

	return (
		<AnimatePresence mode='wait'>
			<motion.div
				key={pathname}
				variants={variants}
				initial='initial'
				animate='animate'
				exit='exit'
				className='w-full h-full min-h-screen'
			>
				{children}
			</motion.div>
		</AnimatePresence>
	)
}
