import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ButtonLink } from '@/components/buttons/ButtonLink'
import { ButtonSubmit } from '@/components/buttons/ButtonSubmit'
import { Checkbox } from '@/components/form-components/CheckboxComponent'
import { InputComponent } from '@/components/form-components/InputComponent'
import { LabelComponent } from '@/components/form-components/LabelComponent'
import { PasswordInput } from '@/components/form-components/PasswordInput'
import { PASSWORD_HINTS, USERNAME_HINTS, PASSWORD_VALIDATION } from '@/constants/validation'
import { useDelayedError } from '@/hooks/useDelayedError'
import { registerSchema, type RegisterFormData } from '@/schemas/auth.schema'

export function RegistrationForm() {
	const {
		register,
		handleSubmit,
		watch,
		formState: { errors },
	} = useForm<RegisterFormData>({
		mode: 'onChange',
		resolver: zodResolver(registerSchema),
		defaultValues: {
			email: '',
			username: '',
			password: '',
			confirmPassword: '',
			newsletter: false,
			terms: false,
		},
	})

	const onSubmit: SubmitHandler<RegisterFormData> = data => console.log(data)

	const emailValue = watch('email') ?? ''
	const usernameValue = watch('username') ?? ''
	const passwordValue = watch('password') ?? ''
	const confirmPasswordValue = watch('confirmPassword') ?? ''

	// --- Hint visibility (delayed show, instant clear) ---
	const failingPwHints = PASSWORD_HINTS.filter(h => !h.test(passwordValue))
	const showPasswordHints = passwordValue.length > 0 && failingPwHints.length >= 2

	const [showPasswordHintsDelayed, setShowPasswordHintsDelayed] = useState(false)
	useEffect(() => {
		if (!showPasswordHints) {
			setShowPasswordHintsDelayed(false)
			return
		}
		const t = setTimeout(() => setShowPasswordHintsDelayed(true), 500)
		return () => clearTimeout(t)
	}, [showPasswordHints])

	const failingUnHints = USERNAME_HINTS.filter(h => !h.test(usernameValue))
	const showUsernameHints = usernameValue.length >= 3 && failingUnHints.length >= 2

	const [showUsernameHintsDelayed, setShowUsernameHintsDelayed] = useState(false)
	useEffect(() => {
		if (!showUsernameHints) {
			setShowUsernameHintsDelayed(false)
			return
		}
		const t = setTimeout(() => setShowUsernameHintsDelayed(true), 500)
		return () => clearTimeout(t)
	}, [showUsernameHints])

	// --- Label error logic ---
	// When hints section is visible → label shows only the length error (if any)
	// Otherwise → label shows the first Zod error for that field
	const rawPasswordLabelError = (() => {
		if (passwordValue.length === 0) return null
		if (showPasswordHintsDelayed)
			return passwordValue.length < PASSWORD_VALIDATION.minLength
				? PASSWORD_VALIDATION.minLengthMessage
				: null
		return errors.password?.message ?? null
	})()

	const rawUsernameLabelError = (() => {
		if (usernameValue.length === 0) return null
		if (showUsernameHintsDelayed) return null
		return errors.username?.message ?? null
	})()

	const emailLabelError = useDelayedError(errors.email?.message, emailValue)
	const usernameLabelError = useDelayedError(rawUsernameLabelError, usernameValue)
	const passwordLabelError = useDelayedError(rawPasswordLabelError, passwordValue)
	const confirmPasswordLabelError = useDelayedError(
		errors.confirmPassword?.message,
		confirmPasswordValue
	)

	return (
		<div className='bg-white flex items-center justify-center pb-8 pr-8 pl-8 mt-8'>
			<form onSubmit={handleSubmit(onSubmit)} className='w-full max-w-lg flex flex-col gap-4'>
				{/* Email */}
				<div className='space-y-2'>
					<LabelComponent text='Email' error={emailLabelError} />
					<InputComponent
						placeholder='user@mail.com'
						error={emailLabelError}
						{...register('email')}
					/>
				</div>

				{/* Username */}
				<div className='space-y-2'>
					<LabelComponent text='Имя пользователя' error={usernameLabelError} />
					<InputComponent
						placeholder='andrew123'
						error={usernameLabelError}
						{...register('username')}
					/>
					{showUsernameHintsDelayed && failingUnHints.length > 0 && (
						<ul className='space-y-1 mt-1'>
							{failingUnHints.map(hint => (
								<li key={hint.key} className='text-xs text-[#ff4757]'>
									{hint.message}
								</li>
							))}
						</ul>
					)}
				</div>

				{/* Password */}
				<div className='space-y-2'>
					<LabelComponent text='Пароль' error={passwordLabelError} />
					<PasswordInput error={passwordLabelError} {...register('password')} />
					{showPasswordHintsDelayed && failingPwHints.length > 0 && (
						<ul className='space-y-1 mt-1'>
							{failingPwHints.map(hint => (
								<li key={hint.key} className='text-xs text-[#ff4757]'>
									{hint.message}
								</li>
							))}
						</ul>
					)}
				</div>

				{/* Confirm password */}
				<div className='space-y-2'>
					<LabelComponent text='Повторите пароль' error={confirmPasswordLabelError} />
					<PasswordInput
						error={confirmPasswordLabelError}
						{...register('confirmPassword')}
					/>
				</div>

				{/* Checkboxes */}
				<div className='pb-2 pt-4'>
					<Checkbox
						text='Я хочу получать новости, рекламные сообщения, обновления и советы о том, как использовать LangCards'
						{...register('newsletter')}
					/>
					<Checkbox
						text={
							<>
								Я принимаю положения, которые содержат{' '}
								<Link
									href='/terms'
									className='underline text-blue-600 hover:text-blue-800'
								>
									Условия предоставления услуг
								</Link>{' '}
								и{' '}
								<Link
									href='/privacy'
									className='underline text-blue-600 hover:text-blue-800'
								>
									Политику конфиденциальности LangCards
								</Link>
							</>
						}
						{...register('terms')}
					/>
					{errors.terms && (
						<p className='text-xs text-[#ff4757] font-medium -mt-2 mb-2'>
							{errors.terms.message}
						</p>
					)}
				</div>

				<ButtonSubmit variant='primary' text='Зарегистрироваться' />
				<ButtonLink
					variant='secondary'
					text='Уже есть учетная запись? Войти'
					href='/login'
				/>
			</form>
		</div>
	)
}
