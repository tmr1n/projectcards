'use client'

import { useTranslations } from 'next-intl'
import { CloseButton } from '@/components/buttons/CloseButton'
import { AuthPageLayout } from '@/components/layouts/AuthPageLayout'
import { LoginForm } from '@/components/page-components/LoginForm'
import { NavBar } from '@/components/page-components/NavBar'

export default function Login() {
	const t = useTranslations('auth.login')
	const tReg = useTranslations('auth.registration')

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
					<NavBar text={tReg('title')} href='/registration' />
					<NavBar text={t('title')} href='/login' />
				</>
			}
		>
			<LoginForm />
		</AuthPageLayout>
	)
}
