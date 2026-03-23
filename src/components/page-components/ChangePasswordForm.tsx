'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDelayedError } from '@/hooks/useDelayedError'
import { ButtonSubmit } from '@/components/buttons/ButtonSubmit'
import { LabelComponent } from '@/components/form-components/LabelComponent'
import { PasswordInput } from '@/components/form-components/PasswordInput'
import { FormLoader } from '@/components/ui/FormLoader'
import { PASSWORD_HINTS, PASSWORD_VALIDATION } from '@/constants/validation'
import {
	changePasswordSchema,
	type ChangePasswordFormData
} from '@/schemas/auth.schema'

export function ChangePasswordForm() {
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

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
			// TODO: await changePasswordAction(data.password)
			console.log('Новый пароль:', data.password)
		} catch {
			setError('Не удалось сменить пароль. Попробуйте ещё раз.')
		} finally {
			setIsLoading(false)
		}
	}

	const passwordValue = watch('password') ?? ''
	const confirmPasswordValue = watch('confirmPassword') ?? ''

	// ─── PASSWORD HINTS ──────────────────────────────────────────────────────────
	const failingPwHints = PASSWORD_HINTS.filter(h => !h.test(passwordValue))
	const showPasswordHints = passwordValue.length > 0 && failingPwHints.length >= 2

	const [showPasswordHintsDelayed, setShowPasswordHintsDelayed] = useState(false)
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
		<div className='h-screen relative bg-white flex items-center justify-center p-8'>
			<FormLoader isLoading={isLoading} />

			<form
				onSubmit={handleSubmit(onSubmit)}
				className='w-full max-w-lg flex flex-col gap-4'
			>
				<h1 className='text-3xl font-bold text-black mb-4'>
					Введите новый пароль
				</h1>

				<div className='space-y-5'>
					<div className='space-y-2'>
						<LabelComponent text='Пароль' error={passwordLabelError} />
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
										{hint.message}
									</li>
								))}
							</ul>
						)}
					</div>

					<div className='space-y-2'>
						<LabelComponent
							text='Повторите пароль'
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

				{error && <p className='text-red-500 text-sm'>{error}</p>}

				<ButtonSubmit variant='primary' text='Сменить пароль' className='mt-5' />
			</form>
		</div>
	)
}
