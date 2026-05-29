import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { BackButton } from '@/components/buttons/BackButton'
import { ProfileActions } from '@/components/profile/ProfileActions'
import { ProfileAvatar } from '@/components/profile/ProfileAvatar'
import { ProfileUsername } from '@/components/profile/ProfileUsername'

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
				<ProfileAvatar />
				<ProfileUsername />
			</div>
			<ProfileActions />
		</div>
	)
}
