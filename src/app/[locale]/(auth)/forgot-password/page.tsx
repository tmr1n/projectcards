'use client'

import { useTranslations } from 'next-intl'
import { BackButton } from '@/components/buttons/BackButton'
import { CloseButton } from '@/components/buttons/CloseButton'
import { AuthPageLayout } from '@/components/layouts/AuthPageLayout'
import { ForgotPasswordForm } from '@/components/page-components/ForgotPasswordForm'

export default function ForgotPassword() {
	const t = useTranslations('auth.forgotPassword')

	return (
		<AuthPageLayout
			sideText={t('sideText')}
			topButtons={
				<div className='flex justify-between gap-4'>
					<BackButton href='/login' />
					<CloseButton href='/' />
				</div>
			}
		>
			<ForgotPasswordForm />
		</AuthPageLayout>
	)
}
