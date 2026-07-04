'use client'

import { Folder, House, LogOut, Plus } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import Logo from '@/components/Logo'
import { UserAvatar } from '@/components/profile/UserAvatar'
import { getRecentDecks, type RecentDeck } from '@/hooks/useRecentDecks'
import { useAuthStore } from '@/store/authStore'

export default function Sidebar() {
	const logout = useAuthStore(state => state.logout)
	const router = useRouter()
	const pathname = usePathname()
	const t = useTranslations('dashboard')

	const user = useAuthStore(state => state.user)
	const fetchProfile = useAuthStore(state => state.fetchProfile)
	const [recentDecks, setRecentDecks] = useState<RecentDeck[]>([])

	useEffect(() => {
		if (!user) fetchProfile()
		setRecentDecks(getRecentDecks())
	}, [])

	const navItems = [
		{ icon: House, label: t('nav.home'), href: '/dashboard' },
		{ icon: Plus, label: t('nav.addModule'), href: '/create-module' },
		{ icon: Folder, label: t('nav.modules'), href: '/modules' }
	] as const

	const activeIndex = navItems.findIndex(item => pathname.includes(item.href))

	return (
		<div className='hidden md:flex flex-col w-64 bg-white h-screen shrink-0'>
			<div className='p-6'>
				<Logo size={50} />
			</div>

			<nav className='flex-1 px-3 space-y-1 overflow-y-auto'>
				{navItems.map(({ icon: Icon, label, href }, i) => (
					<Link
						key={i}
						href={href}
						className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
							activeIndex === i
								? 'bg-violet-100 text-violet-700 font-semibold'
								: 'text-gray-400 hover:bg-gray-100'
						}`}
					>
						<Icon size={20} />
						<span className='flex-1 text-left'>{label}</span>
					</Link>
				))}

				{recentDecks.length > 0 && (
					<div className='pt-6'>
						<p className='px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2'>
							{t('lastModules')}
						</p>
						{recentDecks.map(deck => (
							<Link
								key={deck.id}
								href={`/flash-card?id=${deck.id}`}
								className='w-full flex font-semibold items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-400 hover:bg-gray-100 transition-colors cursor-pointer'
							>
								<span className='bg-violet-500 text-white text-xs font-bold w-6 h-6 rounded flex items-center justify-center shrink-0'>
									{deck.title.charAt(0).toUpperCase()}
								</span>
								<span className='truncate'>{deck.title}</span>
							</Link>
						))}
					</div>
				)}
			</nav>

			<div className='p-4 border-t-2 border-gray-300'>
				<div className='flex items-center gap-2'>
					<Link
						href='/profile'
						className='flex items-center gap-3 flex-1 px-2 py-1.5 rounded-lg hover:bg-gray-100 transition-colors'
					>
						<UserAvatar size={36} />
						<span className='text-m text-gray-700 font-semibold'>
							{user?.username ?? '...'}
						</span>
					</Link>
					<button
						onClick={() => {
							logout()
							router.push('/')
						}}
						className='text-gray-400 hover:text-red-500 transition-colors cursor-pointer p-1.5'
					>
						<LogOut size={18} />
					</button>
				</div>
			</div>
		</div>
	)
}
