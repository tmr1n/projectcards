// ForgotPasswordForm — форма сброса пароля.
// Пользователь вводит email → получает ссылку для сброса на почту.

'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { useDelayedError } from '@/hooks/useDelayedError'
import { ButtonLink } from '@/components/buttons/ButtonLink'
import { ButtonSubmit } from '@/components/buttons/ButtonSubmit'
import { InputComponent } from '@/components/form-components/InputComponent'
import { LabelComponent } from '@/components/form-components/LabelComponent'
import { ErrorBanner } from '@/components/ui/ErrorBanner'
import { FormLoader } from '@/components/ui/FormLoader'
import {
	forgotPasswordSchema,
	type ForgotPasswordFormData
} from '@/schemas/auth.schema'

export function ForgotPasswordForm() {
	const [isLoading, setIsLoading] = useState(false)
	const [isSuccess, setIsSuccess] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const {
		register,
		handleSubmit,
		watch,
		formState: { errors, isSubmitted }
	} = useForm<ForgotPasswordFormData>({
		mode: 'onChange',
		resolver: zodResolver(forgotPasswordSchema),
		defaultValues: { email: '' }
	})

	const onSubmit: SubmitHandler<ForgotPasswordFormData> = async _data => {
		setIsLoading(true)
		setError(null)
		try {
			// TODO: await sendResetLinkAction(_data.email)
			setIsSuccess(true)
		} catch {
			setError('Не удалось отправить письмо. Попробуйте ещё раз.')
		} finally {
			setIsLoading(false)
		}
	}

	const emailValue = watch('email') ?? ''
	const emailLabelError = useDelayedError(
		errors.email?.message,
		emailValue,
		500,
		isSubmitted
	)

	if (isSuccess) {
		return (
			<div className='relative bg-white flex items-center justify-center p-8'>
				<div className='w-full max-w-lg flex flex-col gap-4'>
					<h1 className='text-3xl font-bold text-black font-nunito mb-4'>
						Проверьте электронную почту
					</h1>
					<p className='font-nunito text-black'>
						Мы отправили вам ссылку для сброса пароля, проверьте ваш почтовый
						ящик.
					</p>
					<ButtonLink text='На главную' href='/' />
				</div>
			</div>
		)
	}

	return (
		<div className='relative bg-white flex items-center justify-center p-8'>
			<FormLoader isLoading={isLoading} />

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
						{...register('email', {
							onChange: () => {
								if (error) setError(null)
							}
						})}
					/>
				</div>

				<ErrorBanner error={error} />

				<ButtonSubmit
					variant='primary'
					text='Отправить ссылку для сброса'
					disabled={isLoading}
				/>
			</form>
		</div>
	)
}
