'use client'

//TODO Начинать декомпозицию.
import Image from 'next/image'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { ButtonSubmit } from '@/components/buttons/ButtonSubmit'
import { Field } from '@/components/form/Field'
import { PasswordInput } from '@/components/form/PasswordInput'

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

			<div className='w-[50%] bg-white flex items-center justify-center p-8'>
				<form
					onSubmit={handleSubmit(onSubmit)}
					className='w-full max-w-lg space-y-4 '
				>
					<div>
						<Field label='Email' placeholder='Введите email'></Field>
					</div>

					<div>
						<Field label='Имя пользователя' placeholder='andrew123'></Field>

						<PasswordInput label='Пароль'></PasswordInput>
						<PasswordInput label='Повторите пароль'></PasswordInput>
						{errors.exampleRequired && (
							<span className='text-red-500 text-sm mt-1'>
								{errors.exampleRequired.message}
							</span>
						)}
					</div>

					<ButtonSubmit
						variant='primary'
						text={'Зарегистрироваться'}
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
