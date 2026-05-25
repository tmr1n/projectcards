import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import Logo from '@/components/Logo'
import BottomNav from '@/components/page-components/BottomNav'
import Sidebar from '@/components/page-components/Sidebar'

export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations('dashboard')
	return { title: t('title') }
}

export default function Dashboard() {
	return (
		<div className='h-screen flex'>
			<Sidebar />

			<div className='flex-1 bg-blue-100  flex flex-col'>
				{/* Mobile: logo left, avatar right */}
				<div className='flex justify-between items-center p-4 md:hidden'>
					<Logo size={55} />
					<Link href='/profile'>
						<div className='h-15 w-15 bg-blue-950 rounded-full cursor-pointer' />
					</Link>
				</div>

				<div className='flex-1' />

				{/* Mobile: bottom nav */}
				<div className='flex justify-center md:hidden'>
					<BottomNav />
				</div>
			</div>
		</div>
	)
}
