'use client'

import { useTranslations } from 'next-intl'
import { CloseButton } from '@/components/buttons/CloseButton'
import { AuthPageLayout } from '@/components/layouts/AuthPageLayout'
import { NavBar } from '@/components/page-components/NavBar'
import { RegistrationForm } from '@/components/page-components/RegistrationForm'

export default function Registration() {
	const t = useTranslations('auth.registration')
	const tLogin = useTranslations('auth.login')

	return (
		<AuthPageLayout
			sideText={t('sideText')}
			topButtons={
				<div className='flex justify-end gap-4'>
					<CloseButton href='/' />
				</div>
			}
			navigationTabs={
				<>
					<NavBar text={t('title')} href='/registration' />
					<NavBar text={tLogin('title')} href='/login' />
				</>
			}
		>
			<RegistrationForm />
		</AuthPageLayout>
	)
}
