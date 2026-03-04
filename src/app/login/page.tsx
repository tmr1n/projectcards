'use client'

import { X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { AuthPageLayout } from '@/components/layouts/AuthPageLayout'
import { LoginForm } from '@/components/page-components/LoginForm'
import { NavBar } from '@/components/page-components/NavBar'
import type { ILogin } from '@/shared/types/auth.types'

export default function Login({}: ILogin) {
	const pathname = usePathname()

	console.log('🔥 PATHNAME:', pathname) // ← ДОБАВИ
	return (
		<AuthPageLayout
			sideText='Самый лучший способ учиться, чтобы сохранить прогресс.'
			topButtons={
				<div className='flex justify-end gap-4'>
					<Link href='/' className='p-2'>
						<X size={32} />
					</Link>
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
	)
}
