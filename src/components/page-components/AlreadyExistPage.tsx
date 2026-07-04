'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { linkGoogleAccountAction } from '@/server-actions/auth.actions'
import { useAuthStore } from '@/store/authStore'
import { CloseButton } from '@/components/buttons/CloseButton'
import { ButtonSubmit } from '@/components/buttons/ButtonSubmit'
import { PasswordInput } from '@/components/form-components/PasswordInput'
import { LabelComponent } from '@/components/form-components/LabelComponent'
import { ErrorBanner } from '@/components/ui/ErrorBanner'
import { FormLoader } from '@/components/ui/FormLoader'
import { useDelayedError } from '@/hooks/useDelayedError'

const schema = z.object({
	password: z.string().min(1, 'Введите пароль')
})

type FormData = z.infer<typeof schema>

function decodeJwtPayload(token: string): Record<string, string> | null {
	try {
		const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
		return JSON.parse(atob(base64))
	} catch {
		return null
	}
}

function maskEmail(email: string) {
	const [local, domain] = email.split('@')
	if (!domain) return email
	if (local.length <= 4) return `${local[0]}***@${domain}`
	const keep = 2
	return `${local.slice(0, keep)}${'*'.repeat(local.length - keep * 2)}${local.slice(-keep)}@${domain}`
}

export default function AlreadyExistPage({ token }: { token?: string }) {
	const t = useTranslations('auth.alreadyExist')
	const router = useRouter()
	const loginWithOAuth = useAuthStore(state => state.loginWithOAuth)

	const payload = token ? decodeJwtPayload(token) : null
	const email: string = payload?.email ?? ''
	const username: string = payload?.username ?? ''
	const avatarUrl: string | undefined = payload?.avatarUrl

	useEffect(() => {
		if (!token || !payload) router.replace('/login')
	}, [])

	const {
		register,
		handleSubmit,
		watch,
		setError,
		formState: { errors, isSubmitted, isSubmitting }
	} = useForm<FormData>({
		mode: 'onChange',
		resolver: zodResolver(schema)
	})

	const passwordValue = watch('password') ?? ''
	const passwordError = useDelayedError(errors.password?.message, passwordValue, 500, isSubmitted)

	const onSubmit = async (data: FormData) => {
		if (!token) return
		const result = await linkGoogleAccountAction(token, data.password)
		if (!result.success) {
			setError('root', { message: result.message })
			return
		}
		await loginWithOAuth(result.data.access_token)
		router.push('/dashboard')
	}

	if (!token || !payload) return null

	return (
		<div className='min-h-screen flex items-center justify-center bg-gray-100 p-4'>
			<div className='relative bg-white rounded-2xl shadow-lg w-full max-w-lg p-8'>
				<FormLoader isLoading={isSubmitting} />

				<div className='absolute top-4 right-4'>
					<CloseButton href='/login' />
				</div>

				<h1 className='text-2xl font-bold text-gray-900 mb-2'>{t('title')}</h1>
				<p className='text-gray-500 text-sm mb-6'>{t('description')}</p>

				<div className='flex flex-col items-center gap-1 mb-6'>
					{avatarUrl ? (
						<img
							src={avatarUrl}
							alt={username}
							className='w-16 h-16 rounded-full object-cover'
						/>
					) : (
						<div className='w-16 h-16 rounded-full bg-violet-200 flex items-center justify-center text-violet-700 text-2xl font-bold uppercase'>
							{username[0] ?? '?'}
						</div>
					)}
					<span className='font-semibold text-gray-900 mt-1'>{username}</span>
					<span className='text-gray-500 text-sm'>{maskEmail(email)}</span>
				</div>

				<form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
					<div className='space-y-2'>
						<div className='flex items-center justify-between'>
							<LabelComponent text={t('passwordLabel')} error={passwordError} />
							<LabelComponent
								text={
									<Link
										href='/forgot-password'
										className='font-bold text-violet-600 hover:text-violet-800 transition-colors'
									>
										{t('forgotPassword')}
									</Link>
								}
							/>
						</div>
						<PasswordInput
							error={passwordError}
							{...register('password')}
						/>
					</div>

					<ErrorBanner error={errors.root?.message ?? null} />

					<ButtonSubmit
						variant='primary'
						text={t('login')}
						disabled={isSubmitting}
					/>

					<ButtonSubmit
						variant='secondary'
						text={t('switchAccount')}
						onClick={() => router.push('/login')}
					/>
				</form>
			</div>
		</div>
	)
}
