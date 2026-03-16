// TopLoader — тонкая синяя полоса в самом верху страницы.
// Появляется при каждой навигации (переходе между страницами).
//
// КАК РАБОТАЕТ:
// usePathname() — хук Next.js, возвращает текущий URL (/login, /registration, ...)
// useEffect с зависимостью [pathname] — запускается при КАЖДОМ изменении URL.
// Когда pathname меняется → запускаем последовательность таймеров:
//   0мс   → сбрасываем прогресс до 0, показываем
//   150мс → прогресс 40% (быстрый старт)
//   350мс → прогресс 80% (замедляемся — имитируем загрузку)
//   550мс → прогресс 100% (завершение)
//   800мс → скрываем полосу

'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

export function TopLoader() {
	// progress — ширина полосы в процентах (0-100)
	const [progress, setProgress] = useState(0)
	// visible — показывать ли полосу вообще (скрываем после завершения анимации)
	const [visible, setVisible] = useState(false)

	// usePathname отслеживает текущий URL
	const pathname = usePathname()

	useEffect(() => {
		// Каждый раз когда URL меняется — перезапускаем анимацию
		setProgress(0)
		setVisible(true)

		// Имитируем прогресс загрузки с помощью последовательных таймеров
		const t1 = setTimeout(() => setProgress(40), 150) // быстрый старт
		const t2 = setTimeout(() => setProgress(80), 350) // замедляемся
		const t3 = setTimeout(() => setProgress(100), 550) // завершаем
		const t4 = setTimeout(() => setVisible(false), 800) // скрываем
		const t5 = setTimeout(() => setProgress(0), 900) // сбрасываем (после скрытия)

		// Функция очистки — важно! Если компонент размонтируется или pathname снова
		// сменится ДО завершения таймеров — отменяем предыдущие таймеры
		return () => {
			clearTimeout(t1)
			clearTimeout(t2)
			clearTimeout(t3)
			clearTimeout(t4)
			clearTimeout(t5)
		}
	}, [pathname]) // зависимость: запускаем при каждой смене pathname

	// Не рендерим компонент пока он не нужен (экономим ресурсы)
	if (!visible) return null

	return (
		// Фиксированная позиция — всегда вверху страницы поверх всего
		// pointer-events-none — полоса не блокирует клики по элементам под ней
		<div className='fixed top-0 left-0 right-0 z-9999 h-0.75 pointer-events-none'>
			{/* Ширина меняется через inline-style (не Tailwind) потому что значение динамическое */}
			{/* transition-[width] — плавное изменение ширины */}
			{/* rounded-r-full — скруглённый правый конец для более красивого вида */}
			<div
				className='h-full bg-blue-600 rounded-r-full transition-[width] duration-300 ease-out'
				style={{ width: `${progress}%` }}
			/>
		</div>
	)
}
