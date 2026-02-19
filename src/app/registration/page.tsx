'use client'

import cn from 'clsx'
import Image from 'next/image'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { ButtonSubmit } from '@/components/buttons/ButtonSubmit'

interface Inputs {
	example: string
	exampleRequired: string
}

export default function Registration({}: Inputs) {
	const {
		register,
		handleSubmit,
		watch,
		formState: { errors }
	} = useForm<Inputs>()
	const onSubmit: SubmitHandler<Inputs> = data => console.log(data)
	return (
		<div className='flex flex-row h-screen'>
			{/* Левая половина с картинкой и логотипом */}
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

			{/* Правая половина с формой */}
			<div className='w-[50%] bg-white flex items-center justify-center p-8'>
				<form
					onSubmit={handleSubmit(onSubmit)}
					className='w-full max-w-sm space-y-4 '
				>
					<h2 className='text-2xl font-bold mb-6'>Регистрация</h2>

					{/* Первое поле */}
					<div>
						<label className='block mb-2 text-sm font-semibold text-[#586380] transition-colors duration-300 ease-in-out font-nunito'>
							Email
						</label>
						<input
							className={cn(
								'w-full h-12.5 px-4 py-3.5 border-2 border-transparent rounded-lg bg-[#f8f9fa] text-[16px] text-[#2d3748] leading-5.5 transition-all duration-300 ease-in-out',
								'placeholder:text-[#8e9aaf]',
								'focus:border-[#007bff] focus:bg-white focus:shadow-[0_0_0_3px_rgba(0,123,255,0.1)] focus:outline-none'
							)}
							placeholder='Введите email'
						/>
					</div>

					{/* Второе поле (обязательное) */}
					<div>
						<label className='block mb-2 text-sm font-semibold text-[#586380] transition-colors duration-300 ease-in-out font-nunito'>
							Имя пользователя
						</label>
						<input
							className={cn(
								'w-full h-12.5 px-4 py-3.5 border-2 border-transparent rounded-lg bg-[#f8f9fa] text-[16px] text-[#2d3748] leading-5.5 transition-all duration-300 ease-in-out',
								'placeholder:text-[#8e9aaf]',
								'focus:border-[#007bff] focus:bg-white focus:shadow-[0_0_0_3px_rgba(0,123,255,0.1)] focus:outline-none'
							)}
							placeholder='andrew123'
						/>

						<label className='block mb-2 text-sm font-semibold text-[#586380] transition-colors duration-300 ease-in-out font-nunito'>
							Пароль
						</label>
						<input
							className={cn(
								'w-full h-12.5 px-4 py-3.5 border-2 border-transparent rounded-lg bg-[#f8f9fa] text-[16px] text-[#2d3748] leading-5.5 transition-all duration-300 ease-in-out',
								'placeholder:text-[#8e9aaf]',
								'focus:border-[#007bff] focus:bg-white focus:shadow-[0_0_0_3px_rgba(0,123,255,0.1)] focus:outline-none'
							)}
							placeholder='••••••••'
						/>
						<label className='block mb-2 text-sm font-semibold text-[#586380] transition-colors duration-300 ease-in-out font-nunito'>
							Повторите пароль
						</label>
						<input
							className={cn(
								'w-full h-12.5 px-4 py-3.5 border-2 border-transparent rounded-lg bg-[#f8f9fa] text-[16px] text-[#2d3748] leading-5.5 transition-all duration-300 ease-in-out',
								'placeholder:text-[#8e9aaf]',
								'focus:border-[#007bff] focus:bg-white focus:shadow-[0_0_0_3px_rgba(0,123,255,0.1)] focus:outline-none'
							)}
							placeholder='••••••••'
						/>

						{errors.exampleRequired && (
							<span className='text-red-500 text-sm mt-1'>
								{errors.exampleRequired.message}
							</span>
						)}
					</div>

					<ButtonSubmit
						variant='primary'
						text={'Зарегистрироваться '}
						type='submit'
					></ButtonSubmit>

					<ButtonSubmit
						variant='secondary'
						text={'Уже есть учетная запись? Войти'}
					></ButtonSubmit>
				</form>
			</div>
		</div>
	)
}
