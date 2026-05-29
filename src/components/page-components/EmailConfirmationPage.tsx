'use client'

import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import React from 'react'
import { ButtonLink } from '@/components/buttons/ButtonLink'
import { ButtonSubmit } from '@/components/buttons/ButtonSubmit'
import { FormLoader } from '@/components/ui/FormLoader'
import { verifyEmailAction, resendVerificationAction } from '@/server-actions/auth.actions'
import { useAuthStore } from '@/store/authStore'

const EnvelopeSVG = ({
	className,
	style
}: {
	className?: string
	style?: React.CSSProperties
}) => (
	<svg
		className={className}
		style={style}
		viewBox='0 0 100 70'
		fill='none'
		xmlns='http://www.w3.org/2000/svg'
		strokeLinecap='round'
		strokeLinejoin='round'
	>
		<rect x='2' y='2' width='96' height='66' rx='4' stroke='currentColor' strokeWidth='3' />
		<polyline points='2,2 50,42 98,2' stroke='currentColor' strokeWidth='3' />
		<line x1='2' y1='68' x2='35' y2='38' stroke='currentColor' strokeWidth='2.5' />
		<line x1='98' y1='68' x2='65' y2='38' stroke='currentColor' strokeWidth='2.5' />
	</svg>
)

type TState = 'waiting' | 'verifying' | 'success' | 'error'

export function EmailConfirmationPage({ token }: { token?: string }) {
	const pendingEmail = useAuthStore(state => state.pendingEmail)
	const t = useTranslations('auth.emailConfirmation')

	const [state, setState] = useState<TState>(token ? 'verifying' : 'waiting')
	const [error, setError] = useState<string | null>(null)
	const [resendLoading, setResendLoading] = useState(false)
	const [resendSent, setResendSent] = useState(false)

	useEffect(() => {
		if (!token) return

		verifyEmailAction(token).then(result => {
			if (result.success) {
				setState('success')
			} else {
				setError(result.message)
				setState('error')
			}
		})
	}, [token])

	const handleResend = async () => {
		if (!pendingEmail) return
		setResendLoading(true)
		await resendVerificationAction(pendingEmail)
		setResendLoading(false)
		setResendSent(true)
	}

	if (state === 'verifying') {
		return (
			<div className='min-h-screen flex items-center justify-center'>
				<FormLoader isLoading />
			</div>
		)
	}

	if (state === 'success') {
		return (
			<div className='relative min-h-screen flex items-center'>
				<div className='flex flex-col p-15 gap-5 max-w-150 relative z-10'>
					<h1 className='text-black font-bold text-xl md:text-2xl'>
						{t('successTitle')}
					</h1>
					<p className='text-black text-m'>{t('successMessage')}</p>
					<ButtonLink variant='primary' text={t('login')} href='/login' />
				</div>
			</div>
		)
	}

	if (state === 'error') {
		return (
			<div className='relative min-h-screen flex items-center'>
				<div className='flex flex-col p-15 gap-5 max-w-150 relative z-10'>
					<h1 className='text-black font-bold text-xl md:text-2xl'>
						{t('errorTitle')}
					</h1>
					<p className='text-black text-m'>{error}</p>
					<ButtonLink variant='primary' text={t('home')} href='/' />
				</div>
			</div>
		)
	}

	return (
		<div className='relative min-h-screen overflow-hidden flex items-center'>
			<FormLoader isLoading={resendLoading} />

			<div
				className='absolute inset-0 pointer-events-none select-none'
				aria-hidden='true'
			>
				<EnvelopeSVG className='absolute w-80 opacity-[0.055] text-black animate-float top-1/2 right-8 -translate-y-1/2' />
				<EnvelopeSVG
					className='absolute w-44 opacity-[0.04] text-black top-16 left-12'
					style={{ animation: 'float 6.5s ease-in-out 1.2s infinite' }}
				/>
				<EnvelopeSVG
					className='absolute w-24 opacity-[0.03] text-black bottom-20 right-1/3'
					style={{ animation: 'float 4.8s ease-in-out 2.5s infinite' }}
				/>
			</div>

			<div className='flex flex-col p-15 gap-5 max-w-150 relative z-10'>
				<h1 className='text-black font-bold text-xl md:text-2xl'>{t('title')}</h1>
				<p className='text-black text-m'>
					{t('message', { email: pendingEmail ?? '' })}
				</p>
				<p className='text-black text-sm'>
					{resendSent ? t('resendSent') : t('hint')}
				</p>
				<div className='flex flex-row'>
					<ButtonSubmit
						className='text-xs md:text-sm m-1'
						variant='primary'
						text={t('resend')}
						disabled={resendLoading || resendSent}
						onClick={handleResend}
					/>
					<ButtonLink
						className='text-xs md:text-sm m-1'
						variant='third'
						text={t('home')}
						href='/'
					/>
				</div>
			</div>
		</div>
	)
}
