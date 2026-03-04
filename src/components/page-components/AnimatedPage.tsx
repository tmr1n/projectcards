'use client'

import { motion, useAnimationControls } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import type { IAnimatedPageProps } from '@/shared/types/form.types'

export function AnimatedPage({ children }: IAnimatedPageProps) {
	const pathname = usePathname()
	const controls = useAnimationControls()

	useEffect(() => {
		// Плавное появление сверху + fade‑in
		controls.set({ opacity: 0, y: -50 })
		controls.start({
			opacity: 1,
			y: 0,
			transition: { duration: 0.35, ease: 'easeOut' } // чуть дольше и мягче
		})
	}, [pathname, controls])

	useEffect(() => {
		const handleExit = () => {
			// Fade‑out + уезд вверх — чуть дольше и плавнее
			controls.start({
				opacity: 0,
				y: -100,
				transition: { duration: 0.4, ease: 'easeInOut' } // 🎶
			})
		}
		window.addEventListener('start-exit', handleExit)
		return () => window.removeEventListener('start-exit', handleExit)
	}, [controls])

	return (
		<motion.div
			key={pathname}
			animate={controls}
			className='w-full h-full min-h-screen'
		>
			{children}
		</motion.div>
	)
}
