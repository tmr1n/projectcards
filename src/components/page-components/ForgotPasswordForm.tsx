import { useForm, type SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ButtonSubmit } from '@/components/buttons/ButtonSubmit'
import { InputComponent } from '@/components/form-components/InputComponent'
import { LabelComponent } from '@/components/form-components/LabelComponent'
import { useDelayedError } from '@/hooks/useDelayedError'
import { forgotPasswordSchema, type ForgotPasswordFormData } from '@/schemas/auth.schema'

export function ForgotPasswordForm() {
	const {
		register,
		handleSubmit,
		watch,
		formState: { errors },
	} = useForm<ForgotPasswordFormData>({
		mode: 'onChange',
		resolver: zodResolver(forgotPasswordSchema),
		defaultValues: { email: '' },
	})

	const onSubmit: SubmitHandler<ForgotPasswordFormData> = data => console.log(data)

	const emailValue = watch('email') ?? ''
	const emailLabelError = useDelayedError(errors.email?.message, emailValue)

	return (
		<div className='bg-white flex items-center justify-center p-8'>
			<form
				onSubmit={handleSubmit(onSubmit)}
				className='w-full max-w-lg flex flex-col gap-4'
			>
				<div>
					<h1 className='text-3xl font-bold text-black font-nunito mb-4'>
						Выполнить сброс пароля
					</h1>
					<p className='font-nunito text-black'>
						Введите адрес электронной почты, использованный при регистрации. Мы
						отправим вам ссылку для входа и сброса пароля. Если вы
						зарегистрировались с помощью адреса электронной почты родителей, мы
						отправим им эту ссылку.
					</p>
				</div>

				<div className='space-y-2'>
					<LabelComponent text='Email' error={emailLabelError} />
					<InputComponent
						placeholder='user@mail.com'
						error={emailLabelError}
						{...register('email')}
					/>
				</div>

				<ButtonSubmit variant='primary' text='Отправить ссылку для сброса' />
			</form>
		</div>
	)
}
