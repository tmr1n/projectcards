'use client'

import { CloseButton } from '@/components/buttons/CloseButton'
import { AuthPageLayout } from '@/components/layouts/AuthPageLayout'
import { LoginForm } from '@/components/page-components/LoginForm'
import { NavBar } from '@/components/page-components/NavBar'

export default function Login() {
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
			<LoginForm />
		</AuthPageLayout>
	)
}
