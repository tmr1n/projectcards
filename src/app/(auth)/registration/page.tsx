'use client'

import { CloseButton } from '@/components/buttons/CloseButton'
import { AuthPageLayout } from '@/components/layouts/AuthPageLayout'
import { AnimatedPage } from '@/components/page-components/AnimatedPage'
import { NavBar } from '@/components/page-components/NavBar'
import { RegistrationForm } from '@/components/page-components/RegistrationForm'
import type { IRegistration } from '@/shared/types/auth.types'

export default function Registration({}: IRegistration) {
	return (
		<AnimatedPage>
			<AuthPageLayout
				sideText='Самый лучший способ учиться, чтобы сохранить прогресс.'
				topButtons={
					<div className='flex justify-end gap-4'>
						<CloseButton href='/' />
					</div>
				}
				navigationTabs={
					<>
						<NavBar text='Зарегистрироваться' href='/registration' />
						<NavBar text='Вход' href='/login' />
					</>
				}
			>
				<RegistrationForm example={''} exampleRequired={''} />
			</AuthPageLayout>
		</AnimatedPage>
	)
}
