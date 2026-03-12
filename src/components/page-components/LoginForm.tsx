import Link from 'next/link'
import { type SubmitHandler } from 'react-hook-form'
import { FaYandex } from 'react-icons/fa'
import { FcGoogle } from 'react-icons/fc'
import { TiVendorMicrosoft } from 'react-icons/ti'
import { useValidation, type ILoginFormData } from '@/hooks/useValidation'
import { ButtonLink } from '@/components/buttons/ButtonLink'
import { ButtonSubmit } from '@/components/buttons/ButtonSubmit'
import { InputComponent } from '@/components/form-components/InputComponent'
import { LabelComponent } from '@/components/form-components/LabelComponent'
import { LineComponent } from '@/components/form-components/LineComponent'
import { PasswordInput } from '@/components/form-components/PasswordInput'
import type { ILoginFormProps } from '@/shared/types/auth.types'

export function LoginForm({}: ILoginFormProps) {
	const form = useValidation()
	const { register, handleSubmit, formState } = form
	const emailError = formState.errors.email?.message
	const passwordError = formState.errors.password?.message
	// ?. - если не существует или undefined, то не будет ошибки, а просто вернет undefined
	const onSubmit: SubmitHandler<ILoginFormData> = data => console.log(data)

	return (
		<div className=' bg-white flex items-center justify-center p-8 '>
			<form
				onSubmit={handleSubmit(onSubmit)}
				className='w-full max-w-lg flex flex-col gap-4'
			>
				<ButtonSubmit
					variant='secondary'
					text={'Продолжить с Google'}
					icon={<FcGoogle />}
					// href=''
				/>

				<ButtonSubmit
					variant='secondary'
					text={'Продолжить с Microsoft'}
					icon={<TiVendorMicrosoft />}
					// href=''
				/>

				<ButtonSubmit
					variant='secondary'
					text={'Продолжить с Yandex'}
					icon={<FaYandex />}
					// href=''
				/>

				<LineComponent text='или адрес эл. почты'></LineComponent>

				<div className='space-y-2'>
					<LabelComponent
						text={'Email или имя пользователя'}
						error={emailError || null}
					></LabelComponent>
					<InputComponent
						placeholder='Введите адрес эл. почты или имя пользователя'
						error={emailError || null}
						{...register('email', {
							pattern: {
								value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
								message: 'Недопустимый адрес эл. почты'
							}
						})}
					/>
				</div>

				<div className='space-y-2 pb-2'>
					<div className='flex items-center justify-between'>
						<LabelComponent
							text='Пароль'
							error={passwordError || null}
						></LabelComponent>
						<LabelComponent
							text={
								<>
									<Link
										href='/forgot-password'
										className='font-bold text-blue-600 hover:text-blue-800'
									>
										Забыли пароль?
									</Link>
								</>
							}
						></LabelComponent>
					</div>
					<PasswordInput
					// Тут должна быть обработка серверной ошибки(невеерный пароль)
					// error={passwordError || null}
					// {...register('password', { required: 'Обязательно' })}
					/>
				</div>

				<ButtonSubmit variant='primary' text={'Вход'} />

				<ButtonLink
					variant='secondary'
					text={'Впервые в LangCards? Зарегистрироваться'}
					href='/registration'
				/>
			</form>
		</div>
	)
}
