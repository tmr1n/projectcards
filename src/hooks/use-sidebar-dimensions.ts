// hooks/use-sidebar-dimensions.ts — измеряет размеры сайдбара.
// Результат используется для расчёта радиуса анимации clipPath в SidebarMenu.

import { useEffect, useRef } from 'react'
import type { ISidebarDimensions } from '@/shared/types/sidebars-styles.types'

export const useSidebarDimensions = (
	ref: React.RefObject<HTMLDivElement | null>
): ISidebarDimensions => {
	// useRef хранит значение между рендерами БЕЗ перерисовки компонента
	// (в отличие от useState который вызывает ре-рендер при изменении)
	const dimensions = useRef<ISidebarDimensions>({ width: 0, height: 0 })

	useEffect(() => {
		// Читаем реальные размеры DOM-элемента после рендера
		if (ref.current) {
			dimensions.current = {
				width: ref.current.offsetWidth,
				height: ref.current.offsetHeight
			}
		}
	}, [ref])

	return dimensions.current
}
