// LoginForm — форма входа в систему.
//
// СХЕМА РАБОТЫ ВАЛИДАЦИИ:
// 1. useForm({ resolver: zodResolver(loginSchema) })
//    → react-hook-form при каждом изменении поля вызывает Zod для проверки данных
// 2. Zod проверяет данные по loginSchema и заполняет formState.errors
// 3. watch('email') → следим за текущим значением поля в реальном времени
// 4. useDelayedError(errors.email?.message, emailValue, 500, isSubmitted)
//    → показываем ошибку через 500мс (не сразу), но убираем мгновенно при исправлении
//    → isSubmitted: если уже нажали Submit — показываем ошибки сразу и для пустых полей

'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { FaYandex } from 'react-icons/fa'
import { FcGoogle } from 'react-icons/fc'
import { useTranslations } from 'next-intl'
import { useDelayedError } from '@/hooks/useDelayedError'
import { ButtonLink } from '@/components/buttons/ButtonLink'
import { ButtonSubmit } from '@/components/buttons/ButtonSubmit'
import { InputComponent } from '@/components/form-components/InputComponent'
import { LabelComponent } from '@/components/form-components/LabelComponent'
import { LineComponent } from '@/components/form-components/LineComponent'
import { PasswordInput } from '@/components/form-components/PasswordInput'
import { ErrorBanner } from '@/components/ui/ErrorBanner'
import { FormLoader } from '@/components/ui/FormLoader'
import { loginSchema, type LoginFormData } from '@/schemas/auth.schema'
import { useAuthStore } from '@/store/authStore'

export function LoginForm() {
	const login = useAuthStore(state => state.login)
	const isLoading = useAuthStore(state => state.isLoading)
	const pendingEmail = useAuthStore(state => state.pendingEmail)
	const error = useAuthStore(state => state.error)
	const clearError = useAuthStore(state => state.clearError)
	const t = useTranslations('auth.login')

	const {
		register,
		handleSubmit,
		watch,
		formState: { errors, isSubmitted }
	} = useForm<LoginFormData>({
		mode: 'onChange',
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: '',
			password: ''
		}
	})

	const emailValue = watch('email') ?? ''
	const passwordValue = watch('password') ?? ''

	const emailLabelError = useDelayedError(
		errors.email?.message,
		emailValue,
		500,
		isSubmitted
	)
	const passwordLabelError = useDelayedError(
		errors.password?.message,
		passwordValue,
		500,
		isSubmitted
	)

	const router = useRouter()

	useEffect(() => {
		return () => clearError()
	}, [])

	const onSubmit = async (data: LoginFormData) => {
		await login(data.email, data.password)

		const { error, isAuthenticated } = useAuthStore.getState()

		if (error) return

		if (isAuthenticated) {
			router.push('/dashboard')
		} else {
			router.push('/email-confirmation')
		}
	}

	return (
		<div className='relative bg-white flex items-center justify-center p-8'>
			<FormLoader isLoading={isLoading} />

			<form
				onSubmit={handleSubmit(onSubmit)}
				className='w-full max-w-lg flex flex-col gap-4'
			>
				<ButtonSubmit
					variant='secondary'
					text={t('google')}
					icon={<FcGoogle />}
					onClick={() =>
						(window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`)
					}
				/>

				<ButtonSubmit
					variant='secondary'
					text={t('yandex')}
					icon={<FaYandex />}
					onClick={() =>
						(window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/yandex`)
					}
				/>

				<LineComponent text={t('divider')} />

				<div className='space-y-2'>
					<LabelComponent
						text={t('emailLabel')}
						error={emailLabelError}
					/>
					<InputComponent
						placeholder={t('emailPlaceholder')}
						error={emailLabelError}
						{...register('email', {
							onChange: () => {
								if (error) clearError()
							}
						})}
					/>
				</div>

				<div className='space-y-2 pb-2'>
					<div className='flex items-center justify-between'>
						<LabelComponent text={t('passwordLabel')} error={passwordLabelError} />

						<LabelComponent
							text={
								<Link
									href='/forgot-password'
									className='font-bold text-blue-600 hover:text-blue-800 transition-colors'
								>
									{t('forgotPassword')}
								</Link>
							}
						/>
					</div>

					<PasswordInput
						error={passwordLabelError}
						{...register('password', {
							onChange: () => {
								if (error) clearError()
							}
						})}
					/>
				</div>

				<ErrorBanner error={error} />

				<ButtonSubmit variant='primary' text={t('submit')} disabled={isLoading} />

				<ButtonLink
					variant='secondary'
					text={t('registerLink')}
					href='/registration'
				/>
			</form>
		</div>
	)
}
