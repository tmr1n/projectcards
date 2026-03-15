// CheckboxComponent — кастомный чекбокс с современным дизайном.
//
// КАК РАБОТАЕТ:
// Нативный <input type="checkbox"> скрывается (sr-only = только для скрин-ридеров).
// Вместо него — кастомный <span> который реагирует на состояние через CSS-классы peer-*.
//
// peer-* — это Tailwind-паттерн: когда элемент имеет класс "peer",
// его сиблинги (братья/сёстры) могут менять стиль через peer-checked:, peer-focus: и т.д.
//
// group / group-hover: — похожий паттерн для родитель → потомок.
// Когда <label> получает hover, дочерний <span> меняет стиль через group-hover:.
//
// ИЗМЕНЕНИЯ: убран React.forwardRef (React 19), улучшен дизайн галочки.

import { useId } from 'react'
import type { ICheckbox } from '@/shared/types/form.types'
import { cn } from '@/utils/utils'

type TCheckboxProps = ICheckbox & {
	ref?: React.Ref<HTMLInputElement>
}

export function Checkbox({ text, ref, ...props }: TCheckboxProps) {
	// useId — генерирует уникальный id для связки <label htmlFor> ↔ <input id>
	// Это важно для доступности: клик по тексту активирует чекбокс
	const id = useId()

	return (
		<div className='flex items-start mb-4'>
			{/* group — маркер для group-hover: на дочерних элементах */}
			<label
				htmlFor={id}
				className='group flex items-start gap-3 cursor-pointer select-none'
			>
				{/* Скрытый нативный input — управляет состоянием (checked/unchecked) */}
				{/* sr-only = видим только скрин-ридерам, визуально отсутствует */}
				{/* peer — маркер для peer-checked:, peer-focus-visible: на сиблингах */}
				<input
					id={id}
					type='checkbox'
					className='sr-only peer'
					ref={ref}
					{...props}
				/>

				{/* Кастомная визуальная галочка */}
				<span
					aria-hidden // скрываем от скрин-ридеров (нативный input уже описан)
					className={cn(
						// Размер и форма
						'w-5 h-5 border-2 rounded-sm bg-white shrink-0 relative mt-0.5',
						// Плавные переходы всех свойств
						'transition-all duration-200 ease-in-out',
						// Цвет рамки:
						//   обычный → серый
						//   hover на label (group-hover) → синеватый
						'border-gray-300 group-hover:border-blue-400',
						// Когда peer (нативный input) отмечен → синий фон и рамка
						'peer-checked:bg-blue-600 peer-checked:border-blue-600',
						// Фокус с клавиатуры (Tab) → синее кольцо вокруг (доступность)
						'peer-focus-visible:ring-2 peer-focus-visible:ring-blue-500/30 peer-focus-visible:ring-offset-1',
						// SVG галочка внутри:
						//   [&>svg] — селектор прямого потомка svg
						//   По умолчанию scale-0 (сжата до нуля = невидима)
						//   Когда peer checked → scale-100 (нормальный размер, с анимацией)
						'[&>svg]:scale-0 [&>svg]:transition-transform [&>svg]:duration-150 [&>svg]:ease-out',
						'peer-checked:[&>svg]:scale-100'
					)}
				>
					{/* SVG галочка — белая поверх синего фона */}
					<svg
						viewBox='0 0 14 14'
						className='absolute inset-0 w-full h-full p-0.75 text-white'
						fill='none'
						stroke='currentColor'
						strokeWidth={2.5}
						strokeLinecap='round'
						strokeLinejoin='round'
						aria-hidden
					>
						<polyline points='2,8 6,11 12,3' />
					</svg>
				</span>

				{/* Текст рядом с чекбоксом (может быть строкой или JSX со ссылками) */}
				<span className='text-sm text-gray-700 font-nunito font-medium leading-relaxed mt-0.5'>
					{text}
				</span>
			</label>
		</div>
	)
}
