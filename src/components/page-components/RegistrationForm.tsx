import Link from 'next/link'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ButtonLink } from '@/components/buttons/ButtonLink'
import { ButtonSubmit } from '@/components/buttons/ButtonSubmit'
import { Checkbox } from '@/components/form-components/CheckboxComponent'
import { InputComponent } from '@/components/form-components/InputComponent'
import { LabelComponent } from '@/components/form-components/LabelComponent'
import { PasswordInput } from '@/components/form-components/PasswordInput'
import { registerSchema, type RegisterFormData } from '@/schemas/auth.schema'

// Conditions checked independently (used for hints below inputs)
const PASSWORD_HINTS = [
	{
		key: 'hasUppercase',
		test: (v: string) => /[A-Z]/.test(v),
		message: 'Пароль должен содержать одну большую букву.',
	},
	{
		key: 'hasSpecial',
		test: (v: string) => /[!@#$%^&*(),.?":{}|<>]/.test(v),
		message: 'Пароль должен содержать один специальный символ.',
	},
] as const

const USERNAME_HINTS = [
	{
		key: 'startsWithLatin',
		test: (v: string) => /^[A-Za-z]/.test(v),
		message:
			'Имена пользователей должны начинаться с букв A-Z и не могут содержать символы с диакритическими знаками.',
	},
	{
		key: 'onlyValidChars',
		test: (v: string) => /^[A-Za-z0-9_-]*$/.test(v),
		message: 'Имя пользователя может содержать только буквы, цифры, подчеркивания и дефисы',
	},
] as const

export function RegistrationForm() {
	const {
		register,
		handleSubmit,
		watch,
		formState: { errors, touchedFields, isSubmitted },
	} = useForm<RegisterFormData>({
		mode: 'onBlur',
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

	const passwordValue = watch('password') ?? ''
	const usernameValue = watch('username') ?? ''

	const isPasswordTouched = !!(touchedFields.password || isSubmitted)
	const isUsernameTouched = !!(touchedFields.username || isSubmitted)

	// --- Password hint logic ---
	const failingPwHints = PASSWORD_HINTS.filter(h => !h.test(passwordValue))
	// Hints show under input when 2 conditions fail (length may also be failing — shown in label)
	const showPasswordHints = isPasswordTouched && passwordValue.length > 0 && failingPwHints.length >= 2

	const passwordLabelError = (() => {
		if (!isPasswordTouched || passwordValue.length === 0) return null
		if (passwordValue.length < 8) return 'Слишком короткий пароль. Минимальная длина – 8 знаков.'
		// When hints are shown below, label is clear (unless only 1 hint remains → shown in label)
		if (showPasswordHints) return null
		if (failingPwHints.length === 1) return failingPwHints[0].message
		return null
	})()

	// --- Username hint logic ---
	const failingUnHints = USERNAME_HINTS.filter(h => !h.test(usernameValue))
	const showUsernameHints =
		isUsernameTouched && usernameValue.length > 0 && failingUnHints.length >= 2

	const usernameLabelError = (() => {
		if (!isUsernameTouched || usernameValue.length === 0) return null
		if (usernameValue.length < 3)
			return 'Имя пользователя слишком короткое. Оно должно содержать не менее 3 символов'
		if (showUsernameHints) return null
		if (failingUnHints.length === 1) return failingUnHints[0].message
		return null
	})()

	const emailError =
		touchedFields.email || isSubmitted ? (errors.email?.message ?? null) : null
	const confirmPasswordError =
		touchedFields.confirmPassword || isSubmitted
			? (errors.confirmPassword?.message ?? null)
			: null

	return (
		<div className='bg-white flex items-center justify-center pb-8 pr-8 pl-8 mt-8'>
			<form onSubmit={handleSubmit(onSubmit)} className='w-full max-w-lg flex flex-col gap-4'>
				{/* Email */}
				<div className='space-y-2'>
					<LabelComponent text='Email' error={emailError} />
					<InputComponent
						placeholder='user@mail.com'
						error={emailError}
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
					{showUsernameHints && (
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
					{showPasswordHints && (
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
					<LabelComponent text='Повторите пароль' error={confirmPasswordError} />
					<PasswordInput error={confirmPasswordError} {...register('confirmPassword')} />
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
