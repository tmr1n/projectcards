import { Skeleton } from '@/components/ui/Skeleton'

// Повторяет новый auth-дизайн: размытый градиентный фон + белая карточка-модалка
export function LoginPageSkeleton() {
	return (
		<div
			className='relative min-h-screen w-full bg-gradient-to-br from-violet-100 via-purple-100 to-fuchsia-200'
			role='status'
			aria-label='Loading...'
		>
			<div className='relative z-10 flex min-h-screen items-center justify-center p-4 md:p-8'>
				<div className='w-full max-w-xl overflow-hidden rounded-3xl bg-white shadow-2xl'>
					{/* Close button */}
					<div className='flex justify-end p-4 pb-0'>
						<Skeleton className='h-9 w-9 rounded-full' />
					</div>

					{/* Nav tabs */}
					<div className='mx-auto flex w-full max-w-lg flex-row justify-center gap-8'>
						<Skeleton className='h-8 w-28' />
						<Skeleton className='h-8 w-16' />
					</div>

					{/* Form */}
					<div className='flex items-center justify-center p-8'>
						<div className='w-full max-w-lg flex flex-col gap-4'>
							{/* Google button */}
							<Skeleton className='h-11 w-full rounded-xl' />
							{/* Demo button */}
							<Skeleton className='h-11 w-full rounded-xl' />

							{/* Divider */}
							<div className='flex items-center gap-3'>
								<Skeleton className='h-px flex-1' />
								<Skeleton className='h-4 w-40 rounded' />
								<Skeleton className='h-px flex-1' />
							</div>

							{/* Email field */}
							<div className='space-y-2'>
								<Skeleton className='h-4 w-24' />
								<Skeleton className='h-11 w-full rounded-xl' />
							</div>

							{/* Password field */}
							<div className='space-y-2 pb-2'>
								<Skeleton className='h-4 w-16' />
								<Skeleton className='h-11 w-full rounded-xl' />
							</div>

							{/* Submit */}
							<Skeleton className='h-11 w-full rounded-xl' />

							{/* Register link */}
							<Skeleton className='h-11 w-full rounded-xl' />
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
