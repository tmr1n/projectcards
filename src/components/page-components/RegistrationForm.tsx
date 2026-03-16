// RegistrationForm — форма регистрации нового пользователя.
// Подробные комментарии по базовой валидации — смотри LoginForm.tsx.
//
// ОСОБЕННОСТЬ: два уровня показа ошибок для пароля и юзернейма:
// УРОВЕНЬ 1 — Label (над полем): одна приоритетная ошибка от Zod
// УРОВЕНЬ 2 — Hints (под полем): список всех нарушенных условий (при 2+ нарушениях)

'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDelayedError } from '@/hooks/useDelayedError'
import { ButtonLink } from '@/components/buttons/ButtonLink'
import { ButtonSubmit } from '@/components/buttons/ButtonSubmit'
import { Checkbox } from '@/components/form-components/CheckboxComponent'
import { InputComponent } from '@/components/form-components/InputComponent'
import { LabelComponent } from '@/components/form-components/LabelComponent'
import { PasswordInput } from '@/components/form-components/PasswordInput'
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
		await registration(data.email, data.username, data.password)
		//TODO: После успешного входа — router.push('/dashboard')
		//TODO: После успешной регистрации — можно сразу залогинить пользователя или показать сообщение "Регистрация успешна, войдите в аккаунт" - получается редирект на Login и всплывашка "Регистрация успешна, войдите в аккаунт" (задача на будущее)
	}

	const emailValue = watch('email') ?? ''
	const usernameValue = watch('username') ?? ''
	const passwordValue = watch('password') ?? ''
	const confirmPasswordValue = watch('confirmPassword') ?? ''

	// ─── PASSWORD HINTS ─────────────────────────────────────────────────────────
	// Фильтруем: оставляем только условия которые НЕ выполнены
	const failingPwHints = PASSWORD_HINTS.filter(h => !h.test(passwordValue))
	// Показываем блок hints когда нарушены 2+ условия
	const showPasswordHints =
		passwordValue.length > 0 && failingPwHints.length >= 2

	// Задержанный показ: появляется через 500мс, исчезает мгновенно
	// После isSubmitted — показываем hints сразу без задержки
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
	// Hints только если длина >= 3 (иначе label покажет ошибку длины)
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

	// Пароль: если hints показаны → label = ошибка длины (если есть), иначе null
	const rawPasswordLabelError = (() => {
		if (passwordValue.length === 0) return null
		if (showPasswordHintsDelayed)
			return passwordValue.length < PASSWORD_VALIDATION.minLength
				? PASSWORD_VALIDATION.minLengthMessage
				: null
		return errors.password?.message ?? null
	})()

	// Username: если hints показаны → label пустой (hints покрывают всё)
	const rawUsernameLabelError = (() => {
		if (usernameValue.length === 0) return null
		if (showUsernameHintsDelayed) return null
		return errors.username?.message ?? null
	})()

	// Применяем задержку + forceShow после Submit ко всем label-ошибкам
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
						text='Email'
						error={serverFieldErrors?.email ?? emailLabelError}
					/>
					<InputComponent
						placeholder='user@mail.com'
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
						text='Имя пользователя'
						error={serverFieldErrors?.username ?? usernameLabelError}
					/>
					<InputComponent
						placeholder='andrew123'
						error={usernameLabelError}
						{...register('username', {
							onChange: () => {
								if (error) clearError()
							}
						})}
					/>
					{/* Hints: список нарушенных условий формата под полем */}
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

				{/* Пароль */}
				<div className='space-y-2'>
					<LabelComponent text='Пароль' error={passwordLabelError} />
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
									{hint.message}
								</li>
							))}
						</ul>
					)}
				</div>

				{/* Повторите пароль */}
				<div className='space-y-2'>
					<LabelComponent
						text='Повторите пароль'
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
						{...register('terms', {
							onChange: () => {
								if (error) clearError()
							}
						})}
					/>
					{/* Ошибка terms: показываем только после попытки Submit */}
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
