// AnimatedPage.tsx — РАБОЧИЙ (только initial)
'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { usePathname } from 'next/navigation'
import type { IAnimatedPageProps } from '@/shared/types/form.types'

export function AnimatedPage({ children }: IAnimatedPageProps) {
	const pathname = usePathname()

	return (
		<AnimatePresence>
			<motion.div
				key={pathname}
				initial={{ opacity: 0, y: -50 }} // ✅ Только появление СВЕРХУ
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.25 }}
				className='w-full h-full min-h-screen'
			>
				{children}
			</motion.div>
		</AnimatePresence>
	)
}
