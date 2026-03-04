'use client'

import { CloseButton } from '@/components/buttons/CloseButton'
import { AuthPageLayout } from '@/components/layouts/AuthPageLayout'
import { AnimatedPage } from '@/components/page-components/AnimatedPage'
import { LoginForm } from '@/components/page-components/LoginForm'
import { NavBar } from '@/components/page-components/NavBar'
import type { ILogin } from '@/shared/types/auth.types'

export default function Login({}: ILogin) {
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
				<LoginForm example={''} exampleRequired={''} />
			</AuthPageLayout>
		</AnimatedPage>
	)
}
