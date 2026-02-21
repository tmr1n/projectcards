'use client'

//TODO Начинать декомпозицию.
import Image from 'next/image'
import { Form } from '@/components/form/Form'
import { NavBar } from '@/components/NavBar'

interface Inputs {}

export default function Registration({}: Inputs) {
	return (
		<div className='flex flex-row h-screen'>
			<div className="w-[50%] bg-[url('/images/Registration-img.png')] bg-cover bg-center flex flex-col justify-between p-8">
				<p className='text-[2.75rem] max-w-sm font-nunito wrap-break-word text-[#333333] font-bold leading-[1.3]'>
					Самый лучший способ учиться, чтобы сохранить прогресс.
				</p>

				<Image
					src='/images/Registration-logo.svg'
					alt='Project Cards Logo'
					width={150}
					height={113}
				/>
			</div>

			<div className=' w-[50%] overflow-y-auto flex flex-col   '>
				<div className='flex flex-row gap-8 justify-start max-w-lg w-full mx-auto mt-8 '>
					<NavBar text='Зарегистрироваться'></NavBar>
					<NavBar text='Вход'></NavBar>
				</div>

				<Form example={''} exampleRequired={''}></Form>
			</div>
		</div>
	)
}
