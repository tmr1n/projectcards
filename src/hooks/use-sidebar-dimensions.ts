// hooks/use-sidebar-dimensions.ts
import { useEffect, useRef } from 'react'
import type { SidebarDimensions } from '@/shared/types/sidebars-styles.types'

export const useSidebarDimensions = (
	ref: React.RefObject<HTMLDivElement | null>
): SidebarDimensions => {
	const dimensions = useRef<SidebarDimensions>({ width: 0, height: 0 })

	useEffect(() => {
		if (ref.current) {
			dimensions.current = {
				width: ref.current.offsetWidth,
				height: ref.current.offsetHeight
			}
		}
	}, [ref])

	return dimensions.current
}
