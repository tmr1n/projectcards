'use client'

import { useState } from 'react'
import { CloseButton } from '@/components/buttons/CloseButton'
import { AuthPageLayout } from '@/components/layouts/AuthPageLayout'
import { LoginForm } from '@/components/page-components/LoginForm'
import { NavBar } from '@/components/page-components/NavBar'
import { RegistrationForm } from '@/components/page-components/RegistrationForm'

//import { useForm } from 'react-hook-form'
interface ILogin {}

export default function Login({}: ILogin) {
	//const { register, handleSubmit } = useForm()
	const [tab, setTab] = useState<'register' | 'login'>('register')
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
			{tab === 'login' ? (
				<LoginForm example={''} exampleRequired={''} />
			) : (
				<RegistrationForm example={''} exampleRequired={''} />
			)}
		</AuthPageLayout>
	)
}
