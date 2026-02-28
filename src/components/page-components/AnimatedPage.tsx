'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'

interface AnimatedPageProps {
	children: React.ReactNode
}

export function AnimatedPage({ children }: AnimatedPageProps) {
	const pathname = usePathname()
	const [closeMode, setCloseMode] = useState(false)
	const [isVisible, setIsVisible] = useState(true)
	const router = useRouter()

	// Когда startClose() вызывается — запускаем анимацию выхода вверх
	const startClose = (redirectTo?: string) => {
		setCloseMode(true)
		setIsVisible(false)

		// ждём завершения анимации (0.25 сек) и только потом переходим
		setTimeout(() => {
			if (redirectTo) router.push(redirectTo)
		}, 250)
	}

	return (
		<AnimatePresence mode='wait'>
			{isVisible && (
				<motion.div
					key={pathname}
					initial={{ opacity: 0, y: -50 }}
					animate={{ opacity: 1, y: 0 }}
					exit={closeMode ? { opacity: 0, y: -100 } : { opacity: 0, y: 50 }}
					transition={{ duration: 0.25 }}
					className='w-full h-full min-h-screen'
				>
					{/* передаём функцию close внутрь контента через render props */}
					{typeof children === 'function'
						? (children as any)(startClose)
						: children}
				</motion.div>
			)}
		</AnimatePresence>
	)
}
