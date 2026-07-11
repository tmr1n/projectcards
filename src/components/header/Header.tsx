'use client'

import { UserRound } from 'lucide-react'
import { motion, useMotionValueEvent, useScroll } from 'motion/react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { AnimatedLogo } from './AnimatedLogo'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import SidebarMenu from './SidebarMenu'
import { LocaleSwitcher } from '@/components/LocaleSwitcher'
import { useAuthStore } from '@/store/authStore'

const navLinkIds = [
	{ key: 'cards', id: null },
	{ key: 'decks', id: 'popular-decks' },
	{ key: 'howItWorks', id: 'how-it-works' }
]

function scrollToSection(id: string | null) {
	if (!id) {
		window.scrollTo({ top: 0, behavior: 'smooth' })
		return
	}
	const el = document.getElementById(id)
	if (el) el.scrollIntoView({ behavior: 'smooth' })
}

export function Header() {
	const { isAuthenticated, logout } = useAuthStore()
	const pathname = usePathname()
	const isHome = pathname === '/'
	const t = useTranslations('header')

	const { scrollY } = useScroll()
	const [hidden, setHidden] = useState(false)

	useMotionValueEvent(scrollY, 'change', current => {
		const previous = scrollY.getPrevious() ?? 0
		if (current > previous && current > 150 && window.innerWidth >= 768) {
			setHidden(true)
		} else {
			setHidden(false)
		}
	})

	return (
		<motion.header
			className='fixed top-0 left-0 right-0 px-4 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100'
			style={{ paddingTop: '20px', paddingBottom: '12px' }}
			animate={{ y: hidden ? -100 : 0, opacity: hidden ? 0 : 1 }}
			transition={{ duration: 0.3, ease: 'easeInOut' }}
		>
			<div className='flex items-center justify-between max-w-7xl mx-auto gap-6'>
				{/* Бургер (mobile) */}
				<div className='md:hidden shrink-0'>
					<SidebarMenu />
				</div>

				{/* Логотип — на мобилке центрируем абсолютом относительно
				    fixed-шапки (viewport-центр), чтобы боковые блоки (бургер /
				    язык+auth) не смещали его. Контейнер НЕ делаем relative —
				    иначе сместится fixed/absolute-позиционирование бургера. */}
				<Link
					href='/'
					className='shrink-0 absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0'
				>
					<AnimatedLogo className='hidden md:block cursor-pointer' />
					<motion.div
						className='block md:hidden'
						whileTap={{ rotate: 360 }}
						transition={{ duration: 0.6, ease: 'easeInOut' }}
					>
						<Image
							src='/images/Logo-adaptive.svg'
							alt='Project Cards Logo'
							width={50}
							height={50}
							className='cursor-pointer'
							priority
						/>
					</motion.div>
				</Link>

				{/* Nav (desktop, только на главной) */}
				{isHome && (
					<nav className='hidden md:flex items-center gap-1 flex-1 justify-center'>
						{navLinkIds.map((link, i) => (
							<button
								key={link.key}
								onClick={() => scrollToSection(link.id)}
								className='flex cursor-pointer items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium text-gray-500 hover:text-black hover:bg-gray-50 transition-colors font-(family-name:--font-geist-sans)'
							>
								{i === 1 && (
									<span className='w-1.5 h-1.5 rounded-full bg-black inline-block' />
								)}
								{t(`nav.${link.key}`)}
							</button>
						))}
					</nav>
				)}

				{/* Right: auth */}
				<div className='shrink-0 flex items-center gap-2'>
					<LocaleSwitcher />
					{isAuthenticated ? (
						<>
							<button
								onClick={logout}
								className='hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-violet-600 text-white text-sm font-medium hover:bg-violet-700 transition-colors cursor-pointer'
							>
								{t('logout')}
							</button>
							<button
								onClick={logout}
								className='md:hidden w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors'
								aria-label={t('logout')}
							>
								<UserRound size={18} />
							</button>
						</>
					) : (
						<>
							<Link
								href='/login'
								className='hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 transition-colors'
							>
								{t('login')}
							</Link>
							<Link
								href='/login'
								className='md:hidden w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center  text-gray-600 hover:bg-gray-50 transition-colors'
								aria-label={t('login')}
							>
								<UserRound size={18} />
							</Link>
						</>
					)}
				</div>
			</div>
		</motion.header>
	)
}
