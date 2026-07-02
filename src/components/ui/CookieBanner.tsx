'use client'

import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'

const COOKIE_KEY = 'langcards-cookie-consent'

export function CookieBanner() {
	const t = useTranslations('cookies')
	const [visible, setVisible] = useState(false)

	useEffect(() => {
		if (!localStorage.getItem(COOKIE_KEY)) {
			setVisible(true)
		}
	}, [])

	const handleAccept = () => {
		localStorage.setItem(COOKIE_KEY, 'accepted')
		setVisible(false)
	}

	if (!visible) return null

	return (
		<div className='fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-6 md:max-w-sm'>
			<div className='bg-white border border-gray-200 rounded-2xl shadow-lg p-4 flex flex-col gap-3'>
				<p className='text-sm text-gray-600'>{t('message')}</p>
				<button
					onClick={handleAccept}
					className='w-full py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors cursor-pointer'
				>
					{t('accept')}
				</button>
			</div>
		</div>
	)
}
