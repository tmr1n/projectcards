'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDelayedError } from '@/hooks/useDelayedError'
import { ButtonLink } from '@/components/buttons/ButtonLink'
import { ButtonSubmit } from '@/components/buttons/ButtonSubmit'
import { InputComponent } from '@/components/form-components/InputComponent'
import { LabelComponent } from '@/components/form-components/LabelComponent'
import { ErrorBanner } from '@/components/ui/ErrorBanner'
import { FormLoader } from '@/components/ui/FormLoader'
import { BackButton } from '../buttons/BackButton'
import {
	changeUsernameSchema,
	type ChangeUsernameFormData
} from '@/schemas/auth.schema'
import { updateUsernameAction } from '@/server-actions/auth.actions'
import { useAuthStore } from '@/store/authStore'

export function ChangeUsernameForm() {
	const accessToken = useAuthStore(state => state.accessToken)
	const fetchProfile = useAuthStore(state => state.fetchProfile)
	const user = useAuthStore(state => state.user)
	const [isLoading, setIsLoading] = useState(false)
	const [isSuccess, setIsSuccess] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const t = useTranslations('auth.changeUsername')
	const tErrors = useTranslations('auth.errors')
	const tValidation = useTranslations('auth.validation')
	// Zod-схемы хранят КЛЮЧИ переводов — переводим их при показе
	const tv = (key?: string | null) => (key ? tValidation(key) : null)

	const {
		register,
		handleSubmit,
		watch,
		formState: { errors, isSubmitted }
	} = useForm<ChangeUsernameFormData>({
		mode: 'onChange',
		resolver: zodResolver(changeUsernameSchema),
		defaultValues: { username: user?.username ?? '' }
	})

	const onSubmit = async (data: ChangeUsernameFormData) => {
		setIsLoading(true)
		setError(null)
		try {
			await updateUsernameAction(data.username, accessToken ?? '')
			await fetchProfile()
			setIsSuccess(true)
		} catch {
			setError(tErrors('changeUsername'))
		} finally {
			setIsLoading(false)
		}
	}

	const usernameValue = watch('username') ?? ''

	const usernameLabelError = useDelayedError(
		tv(errors.username?.message),
		usernameValue,
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
					<ButtonLink variant='primary' text={t('home')} href='/profile' />
				</div>
			</div>
		)
	}

	return (
		<div className='min-h-screen flex flex-col'>
			<div className='flex items-center gap-4 justify-start p-4'>
				<BackButton href='/profile' />
			</div>
			<div className='flex-1 relative bg-white flex justify-center p-8 pb-16'>
				<FormLoader isLoading={isLoading} />

				<form
					onSubmit={handleSubmit(onSubmit)}
					className='w-full max-w-lg flex flex-col gap-4 pt-15'
				>
					<h1 className='text-3xl font-bold text-black mb-4 font-nunito'>
						{t('title')}
					</h1>

					<div className='space-y-2'>
						<LabelComponent
							text={t('usernameLabel')}
							error={usernameLabelError}
						/>
						<InputComponent
							maxLength={20}
							error={usernameLabelError}
							{...register('username', {
								onChange: () => {
									if (error) setError(null)
								}
							})}
						/>
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
