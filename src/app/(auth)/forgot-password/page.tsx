'use client'

import { BackButton } from '@/components/buttons/BackButton'
import { CloseButton } from '@/components/buttons/CloseButton'
import { AuthPageLayout } from '@/components/layouts/AuthPageLayout'
import { ForgotPasswordForm } from '@/components/page-components/ForgotPasswordForm'

export default function ForgotPassword() {
	return (
		<AuthPageLayout
			sideText='У вас всё получится!'
			topButtons={
				<div className='flex justify-between gap-4'>
					<BackButton href='/login' />
					<CloseButton href='/' />
				</div>
			}
		>
			<ForgotPasswordForm example='' exampleRequired='' />
		</AuthPageLayout>
	)
}
