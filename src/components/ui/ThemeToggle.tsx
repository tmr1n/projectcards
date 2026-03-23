'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export function ThemeToggle() {
	const { resolvedTheme, setTheme } = useTheme()
	const [mounted, setMounted] = useState(false)

	useEffect(() => setMounted(true), [])

	if (!mounted) return <div className='w-9 h-9' />

	const isDark = resolvedTheme === 'dark'

	return (
		<button
			onClick={() => setTheme(isDark ? 'light' : 'dark')}
			className='w-9 h-9 rounded-full flex items-center justify-center border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-600 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors'
			aria-label='Переключить тему'
		>
			<AnimatePresence mode='wait' initial={false}>
				<motion.span
					key={isDark ? 'moon' : 'sun'}
					initial={{ opacity: 0, rotate: -30, scale: 0.7 }}
					animate={{ opacity: 1, rotate: 0, scale: 1 }}
					exit={{ opacity: 0, rotate: 30, scale: 0.7 }}
					transition={{ duration: 0.2 }}
					className='text-base leading-none'
				>
					{isDark ? '☀️' : '🌙'}
				</motion.span>
			</AnimatePresence>
		</button>
	)
}
