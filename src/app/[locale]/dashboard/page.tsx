import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import DecksList from '@/components/dashboard-components/DecksList'
import Logo from '@/components/Logo'
import BottomNav from '@/components/page-components/BottomNav'
import Sidebar from '@/components/page-components/Sidebar'
import { UserAvatar } from '@/components/profile/UserAvatar'

export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations('dashboard')
	return { title: t('title') }
}

export default function Dashboard() {
	return (
		<div className='h-dvh flex overflow-hidden'>
			<Sidebar />

			<div className='flex-1 bg-white flex flex-col overflow-hidden'>
				{/* Mobile: logo left, avatar right */}
				<div className='flex justify-between items-center p-4 md:hidden shrink-0'>
					<Logo size={55} />
					<Link href='/profile'>
						<UserAvatar size={60} />
					</Link>
				</div>

				<div className='flex-1 overflow-y-auto'>
					<DecksList />
				</div>

				{/* Mobile: bottom nav */}
				<div className='flex justify-center md:hidden shrink-0'>
					<BottomNav />
				</div>
			</div>
		</div>
	)
}
