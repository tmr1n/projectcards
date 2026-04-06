'use client'

// error.tsx — специальный файл Next.js App Router для обработки RUNTIME ошибок.
//
// ВАЖНО: это НЕ связано с валидацией форм!
// Этот файл ловит ошибки РЕНДЕРА (когда компонент крашится) и загрузки данных.
//
// Компонент ОБЯЗАН быть 'use client' — Next.js требует это для error.tsx.
// error.tsx автоматически оборачивает страницы в React ErrorBoundary.

import { useEffect } from 'react'
import { useTranslations } from 'next-intl'

interface IErrorProps {
	error: Error & { digest?: string }
	reset: () => void
}

export default function Error({ error, reset }: IErrorProps) {
	const t = useTranslations('errors')

	useEffect(() => {
		console.error('Необработанная ошибка:', error)
	}, [error])

	return (
		<div className='flex flex-col items-center justify-center min-h-screen gap-6 p-8'>
			<div className='text-center max-w-md'>
				<p className='text-6xl mb-4'>⚠️</p>
				<h2 className='text-2xl font-bold text-gray-800 font-nunito mb-2'>
					{t('somethingWrong')}
				</h2>
				<p className='text-gray-500 font-nunito'>
					{t('somethingWrongMessage')}
				</p>
			</div>

			<div className='flex gap-3'>
				<button
					onClick={reset}
					className='px-6 py-2.5 bg-blue-600 text-white rounded-full font-semibold hover:bg-purple-600 transition-colors duration-200'
				>
					{t('retry')}
				</button>
				<a
					href='/'
					className='px-6 py-2.5 border-2 border-gray-300 text-gray-600 rounded-full font-semibold hover:bg-gray-50 transition-colors duration-200'
				>
					{t('home')}
				</a>
			</div>
		</div>
	)
}
