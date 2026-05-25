import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import BottomNav from '@/components/page-components/BottomNav'

export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations('dashboard')
	return { title: t('title') }
}

export default function Dashboard() {
	return (
		<div className='h-screen bg-blue-100 flex flex-col'>
			<div className='flex justify-end p-4'>
				<Link href='/profile'>
					<div className='h-15 w-15 bg-blue-950 rounded-full cursor-pointer' />
				</Link>
			</div>
			<div className='flex-1' />
			<div className='flex justify-center'>
				<BottomNav />
			</div>
		</div>
	)
}
