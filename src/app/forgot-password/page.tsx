'use client'

import { ArrowLeft, X } from 'lucide-react'
import { FirstSideComponent } from '@/components/FirstSideComponent'
import { ForgotPasswordForm } from '@/components/ForgotPasswordForm'

interface Props {}

export default function page({}: Props) {
	return (
		<div className='flex flex-row h-screen'>
			<FirstSideComponent text='У вас всё получится!' />
			<div className='w-[50%] overflow-y-auto flex flex-col'>
				<div className='flex justify-between p-4'>
					<ArrowLeft
						color='#586380'
						size={32}
						strokeWidth={1.5}
						href='/login'
						className='hover:scale-110 hover:opacity-80 duration-300 cursor-pointer'
					/>
					<X
						color='#586380'
						size={32}
						strokeWidth={1.5}
						href='/'
						className='hover:scale-110 hover:opacity-80 duration-300 cursor-pointer'
					/>
				</div>

				<ForgotPasswordForm example={''} exampleRequired={''} />
			</div>
		</div>
	)
}
