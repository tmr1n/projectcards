'use client'

import { X } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
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
			<div className="w-[50%] bg-[url('/images/Registration-img.png')] bg-cover bg-center ">
				<p className='text-[2.75rem] m-15  max-w-100 font-nunito wrap-break-word text-[#333333] font-bold hyphens-auto leading-[1.3] '>
					Щелкайте <br /> модули как орешки.
				</p>

				<Image
					className='m-15 mt-80'
					src='/images/Registration-logo.svg'
					alt='Project Cards Logo'
					width={150}
					height={113}
				/>
			</div>
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

				{tab === 'login' ? (
					<LoginForm example={''} exampleRequired={''} />
				) : (
					<RegistrationForm example={''} exampleRequired={''} />
				)}
			</div>
		</div>
	)
}
