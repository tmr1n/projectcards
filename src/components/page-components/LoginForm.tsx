import Link from 'next/link'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { FaYandex } from 'react-icons/fa'
import { FcGoogle } from 'react-icons/fc'
import { TiVendorMicrosoft } from 'react-icons/ti'
import { ButtonLink } from '@/components/buttons/ButtonLink'
import { ButtonSubmit } from '@/components/buttons/ButtonSubmit'
import { InputComponent } from '@/components/form-components/InputComponent'
import { LabelComponent } from '@/components/form-components/LabelComponent'
import { LineComponent } from '@/components/form-components/LineComponent'
import { PasswordInput } from '@/components/form-components/PasswordInput'
import type { ILoginFormProps } from '@/shared/types/auth.types'

export function LoginForm({}: ILoginFormProps) {
	const { register, handleSubmit, watch, formState } = useForm<ILoginFormProps>(
		{ mode: 'onChange' } // Валидация будет происходить при каждом изменении поля. Вы можете изменить это на 'onSubmit', если хотите, чтобы валидация происходила только при отправке формы. Mode - это опция, которая определяет, когда должна выполняться валидация формы. 'onChange' означает, что валидация будет выполняться при каждом изменении поля, 'onSubmit' - только при отправке формы, 'onBlur' - при потере фокуса поля, и 'all' - при любом из этих событий.
	)

	const emailError = formState.errors['email']?.message // ?. - это оператор опциональной цепочки, который позволяет безопасно обращаться к вложенным свойствам объекта. Если formState.errors['email'] не существует или равно undefined, то emailError будет равно undefined вместо того, чтобы вызвать ошибку.
	const onSubmit: SubmitHandler<ILoginFormProps> = data => console.log(data)

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
					<LabelComponent text={'Email или имя пользователя'}></LabelComponent>
					<InputComponent
						placeholder='Введите адрес эл. почты или имя пользователя'
						{...register('email', {
							required: 'Это поле обязательно',
							pattern: {
								value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
								message: 'Введите корректный email'
							}
						})}
					/>
					{emailError && (
						<p className='text-red-500 text-sm mt-1'>{emailError}</p>
					)}
				</div>

				<div className='space-y-2 pb-2'>
					<div className='flex items-center justify-between'>
						<LabelComponent text='Пароль'></LabelComponent>
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
					<PasswordInput />
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
