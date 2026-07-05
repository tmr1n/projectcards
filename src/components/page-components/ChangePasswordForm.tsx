'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDelayedError } from '@/hooks/useDelayedError'
import { ButtonLink } from '@/components/buttons/ButtonLink'
import { ButtonSubmit } from '@/components/buttons/ButtonSubmit'
import { LabelComponent } from '@/components/form-components/LabelComponent'
import { PasswordInput } from '@/components/form-components/PasswordInput'
import { ErrorBanner } from '@/components/ui/ErrorBanner'
import { FormLoader } from '@/components/ui/FormLoader'
import { BackButton } from '../buttons/BackButton'
import { PASSWORD_HINTS, PASSWORD_VALIDATION } from '@/constants/validation'
import {
	changePasswordSchema,
	type ChangePasswordFormData
} from '@/schemas/auth.schema'
import { resetPasswordAction, updatePasswordAction } from '@/server-actions/auth.actions'
import { useAuthStore } from '@/store/authStore'

export function ChangePasswordForm({
	fromProfile = false,
	resetToken
}: {
	fromProfile?: boolean
	resetToken?: string
}) {
	const accessToken = useAuthStore(state => state.accessToken)
	const [isLoading, setIsLoading] = useState(false)
	const [isSuccess, setIsSuccess] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const t = useTranslations('auth.changePassword')
	const tValidation = useTranslations('auth.validation')
	const tErrors = useTranslations('auth.errors')

	const validationMessages: Record<string, string> = {
		hasUppercase: tValidation('passwordUppercase'),
		hasSpecial: tValidation('passwordSpecial')
	}
	// Zod-схемы хранят КЛЮЧИ переводов — переводим их при показе
	const tv = (key?: string | null) => (key ? tValidation(key) : null)

	const {
		register,
		handleSubmit,
		watch,
		formState: { errors, isSubmitted }
	} = useForm<ChangePasswordFormData>({
		mode: 'onChange',
		resolver: zodResolver(changePasswordSchema),
		defaultValues: { password: '', confirmPassword: '' }
	})

	const onSubmit = async (data: ChangePasswordFormData) => {
		setIsLoading(true)
		setError(null)
		try {
			if (resetToken) {
				const result = await resetPasswordAction(resetToken, data.password, data.confirmPassword)
				if (!result.success) {
					setError(result.message)
					setIsLoading(false)
					return
				}
			} else {
				await updatePasswordAction(
					{ password: data.password, password_confirmation: data.confirmPassword, old_password: '' },
					accessToken ?? ''
				)
			}
			setIsSuccess(true)
		} catch {
			setError(tErrors('changePassword'))
		} finally {
			setIsLoading(false)
		}
	}

	const passwordValue = watch('password') ?? ''
	const confirmPasswordValue = watch('confirmPassword') ?? ''

	// ─── PASSWORD HINTS ──────────────────────────────────────────────────────────
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

	// ─── LABEL ERRORS ────────────────────────────────────────────────────────────
	const rawPasswordLabelError = (() => {
		if (passwordValue.length === 0) return null
		if (showPasswordHintsDelayed)
			return passwordValue.length < PASSWORD_VALIDATION.minLength
				? PASSWORD_VALIDATION.minLengthMessage
				: null
		return errors.password?.message ?? null
	})()

	const passwordLabelError = useDelayedError(
		tv(rawPasswordLabelError),
		passwordValue,
		500,
		isSubmitted
	)
	const confirmPasswordLabelError = useDelayedError(
		tv(errors.confirmPassword?.message),
		confirmPasswordValue,
		500,
		isSubmitted
	)

	if (isSuccess) {
		return (
			<div className='h-screen relative bg-white flex items-center justify-center p-8'>
				<div className='w-full max-w-lg flex flex-col gap-4'>
					<h1 className='text-3xl font-bold text-black mb-4'>
						{t('successTitle')}
					</h1>
					<p className='text-black'>{t('successMessage')}</p>
					<ButtonLink
						variant='primary'
						text={fromProfile ? t('back') : t('home')}
						href={fromProfile ? '/profile' : resetToken ? '/login' : '/'}
					/>
				</div>
			</div>
		)
	}

	return (
		<div className='min-h-screen flex flex-col'>
			{fromProfile && (
				<div className='flex items-center gap-4 justify-start p-4'>
					<BackButton href='/profile' />
				</div>
			)}
			<div className='flex-1 relative bg-white flex  justify-center p-8 pb-16'>
				<FormLoader isLoading={isLoading} />

				<form
					onSubmit={handleSubmit(onSubmit)}
					className='w-full max-w-lg flex flex-col gap-4 pt-15'
				>
					<h1 className='text-3xl font-bold text-black mb-4 font-nunito'>
						{t('title')}
					</h1>

					<div className='space-y-5'>
						<div className='space-y-2'>
							<LabelComponent
								text={t('passwordLabel')}
								error={passwordLabelError}
							/>
							<PasswordInput
								error={passwordLabelError}
								{...register('password', {
									onChange: () => {
										if (error) setError(null)
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

						<div className='space-y-2'>
							<LabelComponent
								text={t('confirmPasswordLabel')}
								error={confirmPasswordLabelError}
							/>
							<PasswordInput
								error={confirmPasswordLabelError}
								{...register('confirmPassword', {
									onChange: () => {
										if (error) setError(null)
									}
								})}
							/>
						</div>
					</div>

					<ErrorBanner error={error} />

					<ButtonSubmit
						variant='primary'
						text={t('submit')}
						className='mt-5'
						disabled={isLoading}
					/>
				</form>
			</div>
		</div>
	)
}
