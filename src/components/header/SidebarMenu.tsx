'use client'

import { AnimatePresence, motion } from 'motion/react'
import { Menu, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link } from '@/i18n/navigation'

// Мобильное меню: аккуратная кнопка-гамбургер в стиле шапки + выезжающая
// слева панель (drawer) с блюр-подложкой. Ссылки — локале-осведомлённые.
export default function SidebarMenu() {
	const [open, setOpen] = useState(false)
	// Портал рендерим только на клиенте — на сервере document не существует
	const [mounted, setMounted] = useState(false)
	useEffect(() => setMounted(true), [])
	const t = useTranslations('sidebar')

	const items = [
		{ label: t('home'), href: '/' },
		{ label: t('registration'), href: '/registration' },
		{ label: t('login'), href: '/login' },
		{ label: t('terms'), href: '/terms' },
		{ label: t('privacy'), href: '/datenschutz' },
		{ label: 'Impressum', href: '/impressum' }
	]

	const close = () => setOpen(false)

	return (
		<>
			<button
				onClick={() => setOpen(true)}
				aria-label='Menu'
				className='w-10 h-10 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer'
			>
				<Menu size={20} />
			</button>

			{mounted &&
				createPortal(
					<AnimatePresence>
					{open && (
						<>
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								transition={{ duration: 0.2 }}
								onClick={close}
								className='fixed inset-0 z-[60] bg-black/30 backdrop-blur-sm'
							/>

							<motion.div
								initial={{ x: '-100%' }}
								animate={{ x: 0 }}
								exit={{ x: '-100%' }}
								transition={{ type: 'spring', stiffness: 320, damping: 34 }}
								className='fixed top-0 left-0 bottom-0 z-[70] w-72 max-w-[80%] bg-white shadow-2xl p-6 flex flex-col'
							>
								<div className='flex items-center justify-between mb-8'>
									<span className='text-lg font-bold text-gray-900'>
										LangCards
									</span>
									<button
										onClick={close}
										aria-label='Close'
										className='w-9 h-9 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors cursor-pointer'
									>
										<X size={20} />
									</button>
								</div>

								<nav className='flex flex-col gap-1'>
									{items.map(item => (
										<Link
											key={item.href}
											href={item.href}
											onClick={close}
											className='flex items-center gap-3 px-3 py-3 rounded-xl text-gray-700 font-medium hover:bg-violet-50 hover:text-violet-700 transition-colors'
										>
											<span className='w-2 h-2 rounded-full bg-violet-400 shrink-0' />
											{item.label}
										</Link>
									))}
								</nav>
							</motion.div>
						</>
					)}
				</AnimatePresence>,
				document.body
			)}
		</>
	)
}
