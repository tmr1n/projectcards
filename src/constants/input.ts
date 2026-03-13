// constants/input.ts — стили для полей ввода через CVA.
//
// ЧТО ТАКОЕ CVA (class-variance-authority)?
// Это функция которая генерирует className на основе вариантов (variants).
// Похожа на buttonStyles в constants/button.ts, только для инпутов.
//
// ЗАЧЕМ убрали хук useInputStyles?
// Хук (useInputStyles) — это React-концепция для переиспользования ЛОГИКИ.
// Но здесь нет никакой логики — только строка с классами.
// Для стилей правильнее использовать CVA или простую функцию (не хук).
// Хук без состояния/эффектов = антипаттерн.

import { cva } from 'class-variance-authority'

export const inputVariants = cva(
	// Базовые стили — применяются ВСЕГДА независимо от вариантов
	[
		'w-full h-[50px] px-4 py-3.5',           // размер и отступы
		'border-2 border-transparent rounded-lg', // рамка (прозрачная по умолчанию)
		'bg-[#f8f9fa] text-[16px] text-[#2d3748]', // фон и текст
		'transition-all duration-300 ease-in-out', // плавные переходы
		'placeholder:text-[#8e9aaf]',             // цвет placeholder
		'outline-none',                           // убираем стандартный outline браузера
	],
	{
		variants: {
			// Вариант error: boolean — определяет цвет рамки и фона
			error: {
				// error=true → красная рамка, красноватый фон, красное кольцо при фокусе
				true: [
					'border-red-500 bg-red-50/50',
					'shadow-[0_0_0_3px_rgba(255,71,87,0.1)]',
					'focus:border-[#ff4757] focus:bg-white',
					'focus:shadow-[0_0_0_3px_rgba(255,71,87,0.15)]',
				],
				// error=false → синяя рамка при фокусе (нормальное состояние)
				false: [
					'focus:border-[#007bff] focus:bg-white',
					'focus:shadow-[0_0_0_3px_rgba(0,123,255,0.1)]',
				],
			},
		},
		// Что применяется если вариант не передан явно
		defaultVariants: {
			error: false,
		},
	}
)
