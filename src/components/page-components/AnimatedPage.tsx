'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { usePathname } from 'next/navigation'
import type { IAnimatedPageProps } from '@/shared/types/form.types'

export function AnimatedPage({ children }: IAnimatedPageProps) {
	const pathname = usePathname()

	return (
		<AnimatePresence mode='wait'>
			{' '}
			{/* ✅ mode="wait" + exitBeforeEnter */}
			<motion.div
				key={pathname}
				initial={{ opacity: 0, y: -50 }}
				animate={{ opacity: 1, y: 0 }}
				exit={{ opacity: 0, y: -100 }}
				transition={{ duration: 0.5 }}
				className='w-full h-full min-h-screen'
			>
				{children}
			</motion.div>
		</AnimatePresence>
	)
}
