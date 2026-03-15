import { Skeleton } from '@/components/ui/Skeleton'

/**
 * Скелетон главной страницы (public/page.tsx).
 *
 * Зеркалит реальный layout страницы:
 *   - Заголовок h1 (2 строки)
 *   - Абзац описания (3 строки)
 *   - Кнопка CTA
 */
export function HomePageSkeleton() {
	return (
		<div
			role='status'
			aria-label='Загрузка страницы...'
			className='flex flex-col items-center justify-center gap-4 p-4 pt-12.5 min-h-screen'
		>
			{/* h1 — две строки разной ширины */}
			<div className='flex flex-col items-center gap-3 w-full max-w-lg'>
				<Skeleton className='h-10 md:h-12 w-[85%]' />
				<Skeleton className='h-10 md:h-12 w-[55%]' />
			</div>

			{/* paragraph — три строки */}
			<div className='flex flex-col items-center gap-2.5 w-full max-w-md mt-1'>
				<Skeleton className='h-5 md:h-6 w-full' />
				<Skeleton className='h-5 md:h-6 w-[92%]' />
				<Skeleton className='h-5 md:h-6 w-[65%]' />
			</div>

			{/* кнопка CTA */}
			<Skeleton className='h-11 w-60 rounded-full mt-2' />
		</div>
	)
}
