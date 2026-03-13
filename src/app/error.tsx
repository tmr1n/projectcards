'use client'

// error.tsx — специальный файл Next.js App Router для обработки RUNTIME ошибок.
//
// ВАЖНО: это НЕ связано с валидацией форм!
// Этот файл ловит ошибки РЕНДЕРА (когда компонент крашится) и загрузки данных.
//
// Примеры когда срабатывает:
//   - throw new Error('Что-то пошло не так') внутри компонента
//   - Необработанная ошибка в Server Component (fetch упал, БД недоступна)
//   - Ошибка в useEffect без try/catch
//
// Примеры когда НЕ срабатывает:
//   - Ошибки валидации форм (это обрабатывается react-hook-form + Zod)
//   - 404 Not Found (для этого есть not-found.tsx)
//
// Компонент ОБЯЗАН быть 'use client' — Next.js требует это для error.tsx.
// error.tsx автоматически оборачивает страницы в React ErrorBoundary.

import { useEffect } from 'react'

// Пропсы которые Next.js передаёт автоматически
interface IErrorProps {
	error: Error & { digest?: string } // digest — уникальный ID ошибки в логах Next.js
	reset: () => void                   // функция для повторной попытки отрендерить страницу
}

export default function Error({ error, reset }: IErrorProps) {
	useEffect(() => {
		// В продакшне здесь подключают Sentry, Datadog или другой error-tracker.
		// Пока просто логируем в консоль для разработки.
		console.error('Необработанная ошибка:', error)
	}, [error])

	return (
		<div className='flex flex-col items-center justify-center min-h-screen gap-6 p-8'>
			<div className='text-center max-w-md'>
				<p className='text-6xl mb-4'>⚠️</p>
				<h2 className='text-2xl font-bold text-gray-800 font-nunito mb-2'>
					Что-то пошло не так
				</h2>
				<p className='text-gray-500 font-nunito'>
					Произошла непредвиденная ошибка. Можно попробовать обновить страницу
					или вернуться на главную.
				</p>
			</div>

			<div className='flex gap-3'>
				{/* reset() — пробует заново отрендерить ту же страницу */}
				<button
					onClick={reset}
					className='px-6 py-2.5 bg-blue-600 text-white rounded-full font-semibold hover:bg-purple-600 transition-colors duration-200'
				>
					Попробовать снова
				</button>
				<a
					href='/'
					className='px-6 py-2.5 border-2 border-gray-300 text-gray-600 rounded-full font-semibold hover:bg-gray-50 transition-colors duration-200'
				>
					На главную
				</a>
			</div>
		</div>
	)
}
