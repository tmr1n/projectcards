//подтверждение входа по email

'use client'

import React, { useState } from 'react'
import { ButtonLink } from '@/components/buttons/ButtonLink'
import { ButtonSubmit } from '@/components/buttons/ButtonSubmit'
import { FormLoader } from '@/components/ui/FormLoader'
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
		<rect
			x='2'
			y='2'
			width='96'
			height='66'
			rx='4'
			stroke='currentColor'
			strokeWidth='3'
		/>
		<polyline points='2,2 50,42 98,2' stroke='currentColor' strokeWidth='3' />
		<line
			x1='2'
			y1='68'
			x2='35'
			y2='38'
			stroke='currentColor'
			strokeWidth='2.5'
		/>
		<line
			x1='98'
			y1='68'
			x2='65'
			y2='38'
			stroke='currentColor'
			strokeWidth='2.5'
		/>
	</svg>
)

export default function page() {
	const pendingEmail = useAuthStore(state => state.pendingEmail)
	const [isLoading, setIsLoading] = useState(false)

	const handleResend = async () => {
		setIsLoading(true)
		try {
			// TODO: await resendConfirmationAction(pendingEmail)
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<div className='relative min-h-screen overflow-hidden flex items-center'>
			<FormLoader isLoading={isLoading} />
			{/* Background envelopes */}
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

			{/* Content */}
			<div className='flex flex-col p-15 gap-5 max-w-150 relative z-10'>
				<h1 className='text-black font-bold text-xl md:text-2xl'>
					Подтвердите адрес электронной почты, чтобы продолжить
				</h1>
				<p className='text-black text-m'>
					Мы отправили сообщение на адрес {pendingEmail} Подтвердите
					правильность этого адреса, нажав на ссылку в письме.
				</p>
				<p className='text-black text-sm'>
					Не получили электронное письмо? Проверьте папку спама или запросите
					повторную отправку.
				</p>
				<div className='flex flex-row'>
					<ButtonSubmit
						className='text-xs md:text-sm m-1'
						variant='primary'
						text='Отправить письмо повторно'
						disabled={isLoading}
						onClick={handleResend}
					/>
					<ButtonLink
						className='text-xs md:text-sm m-1'
						variant='third'
						text='Вернуться на главную'
						href='/'
					/>
				</div>
			</div>
		</div>
	)
}
