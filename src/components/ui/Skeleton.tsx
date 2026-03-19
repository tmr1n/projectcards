import { cn } from '@/utils/utils'

//TODO: Decompose

interface SkeletonProps {
	className?: string
}

/**
 * Базовый скелетон-примитив с shimmer-анимацией.
 *
 * Использование:
 *   <Skeleton className="h-6 w-48 rounded-md" />
 *
 * Для более сложных скелетонов страниц — используй готовые компоненты
 * из src/components/ui/skeletons/
 */
export function Skeleton({ className }: SkeletonProps) {
	return (
		<div
			aria-hidden='true'
			className={cn(
				'rounded-md',
				'bg-linear-to-r from-gray-100 via-gray-200 to-gray-100',
				'bg-size-[200%_100%]',
				'animate-skeleton',
				className
			)}
		/>
	)
}
