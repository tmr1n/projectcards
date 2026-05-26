import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { BackButton } from '@/components/buttons/BackButton'
import { ProfileActions } from '@/components/profile/ProfileActions'

export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations('profile')
	return { title: t('title') }
}

export default function Profile() {
	return (
		<div className=''>
			<div className='flex items-center gap-4 mb-6 justify-start p-4'>
				<BackButton href='/dashboard' />
			</div>
			<div className='flex items-center gap-5 flex-col'>
				<div className='w-25 h-25 rounded-full bg-blue-700 shrink-0' />
				<span className='text-xl text-gray-700 font-semibold'>Tom Cook</span>
			</div>
			<ProfileActions />
		</div>
	)
}
