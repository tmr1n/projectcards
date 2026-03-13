'use client'

import { CloseButton } from '@/components/buttons/CloseButton'
import { AuthPageLayout } from '@/components/layouts/AuthPageLayout'
import { NavBar } from '@/components/page-components/NavBar'
import { RegistrationForm } from '@/components/page-components/RegistrationForm'
export default function Registration() {
	return (
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
			<RegistrationForm />
		</AuthPageLayout>
	)
}
