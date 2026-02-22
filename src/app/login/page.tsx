'use client'

import { X } from 'lucide-react'
import { useState } from 'react'
import { FirstSideComponent } from '@/components/FirstSideComponent'
import { LoginForm } from '@/components/LoginForm'
import { NavBar } from '@/components/NavBar'
import { RegistrationForm } from '@/components/RegistrationForm'

//import { useForm } from 'react-hook-form'
interface ILogin {}

export default function Login({}: ILogin) {
	//const { register, handleSubmit } = useForm()
	const [tab, setTab] = useState<'register' | 'login'>('register')
	return (
		<div className='flex flex-row h-screen'>
			<FirstSideComponent
				text={
					<>
						Щелкайте <br /> модули как орешки.
					</>
				}
			/>
			<div className='w-[50%] overflow-y-auto flex flex-col'>
				<div className='flex justify-end p-4'>
					<X
						color='#586380'
						size={32}
						strokeWidth={1.5}
						className='hover:scale-110 hover:opacity-80 duration-300 cursor-pointer'
					/>
				</div>
				<div className='flex flex-row gap-8 justify-start max-w-lg w-full mx-auto '>
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
				</div>
				{/* //хуйня в том, что это другой href, поэтому по умолчанию не переключает
				navBar */}
				{tab === 'login' ? (
					<LoginForm example={''} exampleRequired={''} />
				) : (
					<RegistrationForm example={''} exampleRequired={''} />
				)}
			</div>
		</div>
	)
}
