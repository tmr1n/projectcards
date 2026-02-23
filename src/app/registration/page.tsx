'use client'

import { useState } from 'react'
import { CloseButton } from '@/components/buttons/CloseButton'
import { AuthPageLayout } from '@/components/layouts/AuthPageLayout'
import { LoginForm } from '@/components/page-components/LoginForm'
import { NavBar } from '@/components/page-components/NavBar'
import { RegistrationForm } from '@/components/page-components/RegistrationForm'

export default function Registration() {
	const [tab, setTab] = useState<'register' | 'login'>('login')

	return (
		<AuthPageLayout
			sideText='Самый лучший способ учиться, чтобы сохранить прогресс.'
			topButtons={<CloseButton href='/' />}
			navigationTabs={
				<>
					<NavBar
						text='Зарегистрироваться'
						active={tab === 'register'}
						onClick={() => setTab('register')}
					/>
					<NavBar
						text='Вход'
						active={tab === 'login'}
						onClick={() => setTab('login')}
					/>
				</>
			}
		>
			{tab === 'register' ? (
				<RegistrationForm example='' exampleRequired='' />
			) : (
				<LoginForm example='' exampleRequired='' />
			)}
		</AuthPageLayout>
	)
}
