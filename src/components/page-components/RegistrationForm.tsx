// RegistrationForm — форма регистрации нового пользователя.
// Подробные комментарии по базовой валидации — смотри LoginForm.tsx.
//
// ОСОБЕННОСТЬ: два уровня показа ошибок для пароля и юзернейма:
// УРОВЕНЬ 1 — Label (над полем): одна приоритетная ошибка от Zod
// УРОВЕНЬ 2 — Hints (под полем): список всех нарушенных условий (при 2+ нарушениях)

'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslations } from 'next-intl'
import { useDelayedError } from '@/hooks/useDelayedError'
import { ButtonLink } from '@/components/buttons/ButtonLink'
import { ButtonSubmit } from '@/components/buttons/ButtonSubmit'
import { Checkbox } from '@/components/form-components/CheckboxComponent'
import { InputComponent } from '@/components/form-components/InputComponent'
import { LabelComponent } from '@/components/form-components/LabelComponent'
import { PasswordInput } from '@/components/form-components/PasswordInput'
import { ErrorBanner } from '@/components/ui/ErrorBanner'
import { FormLoader } from '@/components/ui/FormLoader'
import {
	PASSWORD_HINTS,
	PASSWORD_VALIDATION,
	USERNAME_HINTS
} from '@/constants/validation'
import { registerSchema, type RegisterFormData } from '@/schemas/auth.schema'
import { useAuthStore } from '@/store/authStore'

export function RegistrationForm() {
	const registration = useAuthStore(state => state.registration)
	const isLoading = useAuthStore(state => state.isLoading)
	const error = useAuthStore(state => state.error)
	const serverFieldErrors = useAuthStore(state => state.serverFieldErrors)
	const clearError = useAuthStore(state => state.clearError)
	const router = useRouter()
	const t = useTranslations('auth.registration')
	const tValidation = useTranslations('auth.validation')

	// Карта ключей hint → переводы
	const validationMessages: Record<string, string> = {
		hasUppercase: tValidation('passwordUppercase'),
		hasSpecial: tValidation('passwordSpecial'),
		startsWithLatin: tValidation('usernameLatinStart'),
		onlyValidChars: tValidation('usernameChars')
	}

	useEffect(() => {
		return () => clearError()
	}, [])

	const {
		register,
		handleSubmit,
		watch,
		formState: { errors, isSubmitted }
	} = useForm<RegisterFormData>({
		mode: 'onChange',
		resolver: zodResolver(registerSchema),
		defaultValues: {
			email: '',
			username: '',
			password: '',
			confirmPassword: '',
			newsletter: false,
			terms: false
		}
	})

	const onSubmit = async (data: RegisterFormData) => {
		await registration({
			name: data.username,
			email: data.email,
			password: data.password,
			password_confirmation: data.confirmPassword,
			mailing_enabled: data.newsletter ?? false,
			terms_accepted: data.terms ?? false,
		})

		const { error } = useAuthStore.getState()

		if (error) return

		router.push('/email-confirmation')
	}

	const emailValue = watch('email') ?? ''
	const usernameValue = watch('username') ?? ''
	const passwordValue = watch('password') ?? ''
	const confirmPasswordValue = watch('confirmPassword') ?? ''

	// ─── PASSWORD HINTS ─────────────────────────────────────────────────────────
	const failingPwHints = PASSWORD_HINTS.filter(h => !h.test(passwordValue))
	const showPasswordHints =
		passwordValue.length > 0 && failingPwHints.length >= 2

	const [showPasswordHintsDelayed, setShowPasswordHintsDelayed] =
		useState(false)
	useEffect(() => {
		if (!showPasswordHints) {
			setShowPasswordHintsDelayed(false)
			return
		}
		if (isSubmitted) {
			setShowPasswordHintsDelayed(true)
			return
		}
		const t = setTimeout(() => setShowPasswordHintsDelayed(true), 500)
		return () => clearTimeout(t)
	}, [showPasswordHints, isSubmitted])

	// ─── USERNAME HINTS ──────────────────────────────────────────────────────────
	const failingUnHints = USERNAME_HINTS.filter(h => !h.test(usernameValue))
	const showUsernameHints =
		usernameValue.length >= 3 && failingUnHints.length >= 2

	const [showUsernameHintsDelayed, setShowUsernameHintsDelayed] =
		useState(false)
	useEffect(() => {
		if (!showUsernameHints) {
			setShowUsernameHintsDelayed(false)
			return
		}
		if (isSubmitted) {
			setShowUsernameHintsDelayed(true)
			return
		}
		const t = setTimeout(() => setShowUsernameHintsDelayed(true), 500)
		return () => clearTimeout(t)
	}, [showUsernameHints, isSubmitted])

	// ─── LABEL ERRORS ────────────────────────────────────────────────────────────
	const rawPasswordLabelError = (() => {
		if (passwordValue.length === 0)
			return isSubmitted ? (errors.password?.message ?? null) : null
		if (showPasswordHintsDelayed)
			return passwordValue.length < PASSWORD_VALIDATION.minLength
				? PASSWORD_VALIDATION.minLengthMessage
				: null
		return errors.password?.message ?? null
	})()

	const rawUsernameLabelError = (() => {
		if (usernameValue.length === 0)
			return isSubmitted ? (errors.username?.message ?? null) : null
		if (showUsernameHintsDelayed) return null
		return errors.username?.message ?? null
	})()

	const emailLabelError = useDelayedError(
		errors.email?.message,
		emailValue,
		500,
		isSubmitted
	)
	const usernameLabelError = useDelayedError(
		rawUsernameLabelError,
		usernameValue,
		500,
		isSubmitted
	)
	const passwordLabelError = useDelayedError(
		rawPasswordLabelError,
		passwordValue,
		500,
		isSubmitted
	)
	const confirmPasswordLabelError = useDelayedError(
		errors.confirmPassword?.message,
		confirmPasswordValue,
		500,
		isSubmitted
	)

	return (
		<div className='relative bg-white flex items-center justify-center pb-8 pr-8 pl-8 mt-8'>
			<FormLoader isLoading={isLoading} />

			<form
				onSubmit={handleSubmit(onSubmit)}
				className='w-full max-w-lg flex flex-col gap-4'
			>
				{/* Email */}
				<div className='space-y-2'>
					<LabelComponent
						text={t('emailLabel')}
						error={serverFieldErrors?.email ?? emailLabelError}
					/>
					<InputComponent
						placeholder={t('emailPlaceholder')}
						error={serverFieldErrors?.email ?? emailLabelError}
						{...register('email', {
							onChange: () => {
								if (error) clearError()
							}
						})}
					/>
				</div>

				{/* Имя пользователя */}
				<div className='space-y-2'>
					<LabelComponent
						text={t('usernameLabel')}
						error={serverFieldErrors?.username ?? usernameLabelError}
					/>
					<InputComponent
						placeholder={t('usernamePlaceholder')}
						error={usernameLabelError}
						{...register('username', {
							onChange: () => {
								if (error) clearError()
							}
						})}
					/>
					{showUsernameHintsDelayed && failingUnHints.length > 0 && (
						<ul className='space-y-1 mt-1'>
							{failingUnHints.map(hint => (
								<li key={hint.key} className='text-xs text-[#ff4757]'>
									{validationMessages[hint.key]}
								</li>
							))}
						</ul>
					)}
				</div>

				{/* Пароль */}
				<div className='space-y-2'>
					<LabelComponent text={t('passwordLabel')} error={passwordLabelError} />
					<PasswordInput
						error={passwordLabelError}
						{...register('password', {
							onChange: () => {
								if (error) clearError()
							}
						})}
					/>
					{showPasswordHintsDelayed && failingPwHints.length > 0 && (
						<ul className='space-y-1 mt-1'>
							{failingPwHints.map(hint => (
								<li key={hint.key} className='text-xs text-[#ff4757]'>
									{validationMessages[hint.key]}
								</li>
							))}
						</ul>
					)}
				</div>

				{/* Повторите пароль */}
				<div className='space-y-2'>
					<LabelComponent
						text={t('confirmPasswordLabel')}
						error={confirmPasswordLabelError}
					/>
					<PasswordInput
						error={confirmPasswordLabelError}
						{...register('confirmPassword', {
							onChange: () => {
								if (error) clearError()
							}
						})}
					/>
				</div>

				{/* Чекбоксы */}
				<div className='pb-2 pt-4'>
					<Checkbox
						text={t('newsletter')}
						{...register('newsletter')}
					/>
					<Checkbox
						text={
							<>
								{t('terms', {
									termsLink: (
										<Link
											href='/terms'
											className='underline text-blue-600 hover:text-blue-800'
										>
											{t('termsLink')}
										</Link>
									),
									privacyLink: (
										<Link
											href='/privacy'
											className='underline text-blue-600 hover:text-blue-800'
										>
											{t('privacyLink')}
										</Link>
									)
								})}
							</>
						}
						{...register('terms', {
							onChange: () => {
								if (error) clearError()
							}
						})}
					/>
					{errors.terms && (
						<p className='text-sm text-[#ff4757] font-bold font-nunito mt-5 mb-2'>
							{errors.terms.message}
						</p>
					)}
				</div>

				<ErrorBanner error={error} />

				<ButtonSubmit
					variant='primary'
					text={t('submit')}
					disabled={isLoading}
				/>
				<ButtonLink
					variant='secondary'
					text={t('loginLink')}
					href='/login'
				/>
			</form>
		</div>
	)
}
