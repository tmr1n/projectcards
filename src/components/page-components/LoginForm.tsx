import Link from 'next/link'
import { type SubmitHandler } from 'react-hook-form'
import { FaYandex } from 'react-icons/fa'
import { FcGoogle } from 'react-icons/fc'
import { TiVendorMicrosoft } from 'react-icons/ti'
import { ButtonLink } from '@/components/buttons/ButtonLink'
import { ButtonSubmit } from '@/components/buttons/ButtonSubmit'
import { InputComponent } from '@/components/form-components/InputComponent'
import { LabelComponent } from '@/components/form-components/LabelComponent'
import { LineComponent } from '@/components/form-components/LineComponent'
import { PasswordInput } from '@/components/form-components/PasswordInput'
import { useDelayedError } from '@/hooks/useDelayedError'
import { useValidation, type LoginFormData } from '@/hooks/useValidation'

export function LoginForm() {
	const { register, handleSubmit, watch, formState: { errors } } = useValidation()

	const onSubmit: SubmitHandler<LoginFormData> = data => console.log(data)

	const emailValue = watch('email') ?? ''
	const emailLabelError = useDelayedError(errors.email?.message, emailValue)

	return (
		<div className='bg-white flex items-center justify-center p-8'>
			<form
				onSubmit={handleSubmit(onSubmit)}
				className='w-full max-w-lg flex flex-col gap-4'
			>
				<ButtonSubmit variant='secondary' text='Продолжить с Google' icon={<FcGoogle />} />
				<ButtonSubmit
					variant='secondary'
					text='Продолжить с Microsoft'
					icon={<TiVendorMicrosoft />}
				/>
				<ButtonSubmit variant='secondary' text='Продолжить с Yandex' icon={<FaYandex />} />

				<LineComponent text='или адрес эл. почты' />

				<div className='space-y-2'>
					<LabelComponent text='Email или имя пользователя' error={emailLabelError} />
					<InputComponent
						placeholder='Введите адрес эл. почты или имя пользователя'
						error={emailLabelError}
						{...register('email')}
					/>
				</div>

				<div className='space-y-2 pb-2'>
					<div className='flex items-center justify-between'>
						<LabelComponent text='Пароль' />
						<LabelComponent
							text={
								<Link
									href='/forgot-password'
									className='font-bold text-blue-600 hover:text-blue-800'
								>
									Забыли пароль?
								</Link>
							}
						/>
					</div>
					{/* Password errors come from the server (wrong password) */}
					<PasswordInput {...register('password')} />
				</div>

				<ButtonSubmit variant='primary' text='Вход' />

				<ButtonLink
					variant='secondary'
					text='Впервые в LangCards? Зарегистрироваться'
					href='/registration'
				/>
			</form>
		</div>
	)
}
