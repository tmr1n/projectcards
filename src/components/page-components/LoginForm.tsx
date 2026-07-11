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
import { AnimatePresence, motion } from 'motion/react'
import { CheckCircle2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { FcGoogle } from 'react-icons/fc'
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
	const loginAsDemo = useAuthStore(state => state.loginAsDemo)
	const isLoading = useAuthStore(state => state.isLoading)
	const pendingEmail = useAuthStore(state => state.pendingEmail)
	const error = useAuthStore(state => state.error)
	const clearError = useAuthStore(state => state.clearError)
	const t = useTranslations('auth.login')
	const tValidation = useTranslations('auth.validation')
	// Zod-схемы хранят КЛЮЧИ переводов — переводим их при показе
	const tv = (key?: string | null) => (key ? tValidation(key) : null)

	// Тост «успешно зарегистрирован»: приходим сюда с ?registered=1 после
	// регистрации, показываем зелёную плашку и прячем через 4 секунды.
	// Читаем из window.location (не useSearchParams) — чтобы не требовать
	// <Suspense> и не ломать next build.
	const [showToast, setShowToast] = useState(false)
	useEffect(() => {
		const registered = new URLSearchParams(window.location.search).get(
			'registered'
		)
		if (!registered) return
		setShowToast(true)
		const timer = setTimeout(() => setShowToast(false), 4000)
		return () => clearTimeout(timer)
	}, [])

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
		tv(errors.email?.message),
		emailValue,
		500,
		isSubmitted
	)
	const passwordLabelError = useDelayedError(
		tv(errors.password?.message),
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
			{/* Тост успешной регистрации (?registered=1) — центр сверху, авто-скрытие 4с.
			    Внешний div центрирует, motion.div анимирует, чтобы transform не конфликтовал. */}
			<div className='fixed top-6 left-1/2 -translate-x-1/2 z-[80] pointer-events-none'>
				<AnimatePresence>
					{showToast && (
						<motion.div
							initial={{ opacity: 0, y: -20 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -20 }}
							transition={{ duration: 0.25 }}
							className='flex items-center gap-2 rounded-xl bg-green-500 px-5 py-3 text-sm font-medium text-white shadow-lg'
						>
							<CheckCircle2 size={18} />
							{t('registeredSuccess')}
						</motion.div>
					)}
				</AnimatePresence>
			</div>

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
						(window.location.href = `${process.env.NEXT_PUBLIC_API_URL ?? 'https://cards-api-production-92cf.up.railway.app/api/v1'}/google`)
					}
				/>

				<button
					type='button'
					disabled={isLoading}
					onClick={async () => {
						await loginAsDemo()
						const { error, isAuthenticated } = useAuthStore.getState()
						if (!error && isAuthenticated) router.push('/dashboard')
					}}
					className='w-full cursor-pointer rounded-xl border border-gray-300 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50'
				>
					{t('demo')}
				</button>

				<LineComponent text={t('divider')} />

				<div className='space-y-2'>
					<LabelComponent text={t('emailLabel')} error={emailLabelError} />
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
					{/* «Passwort vergessen?» скрыт: на проде нет мейлера (Railway блокирует SMTP),
					    ссылка вела бы к ошибке. Локально флоу работает через Mailpit. */}
					<LabelComponent
						text={t('passwordLabel')}
						error={passwordLabelError}
					/>

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

				<ButtonSubmit
					variant='primary'
					text={t('submit')}
					disabled={isLoading}
				/>

				<ButtonLink
					variant='secondary'
					text={t('registerLink')}
					href='/registration'
				/>
			</form>
		</div>
	)
}
