import { Skeleton } from '@/components/ui/Skeleton'

export function ChangeUsernamePageSkeleton() {
	return (
		<div className='min-h-screen flex flex-col' role='status' aria-label='Loading...'>
			{/* Back button */}
			<div className='flex items-center gap-4 justify-start p-4'>
				<Skeleton className='h-9 w-9 rounded-full' />
			</div>

			<div className='flex-1 flex justify-center p-8 pb-16'>
				<div className='w-full max-w-lg flex flex-col gap-4 pt-15'>
					{/* Title */}
					<Skeleton className='h-9 w-64 mb-4' />

					{/* Username field */}
					<div className='space-y-2'>
						<Skeleton className='h-4 w-40' />
						<Skeleton className='h-11 w-full rounded-xl' />
					</div>

					{/* Submit button */}
					<Skeleton className='h-11 w-full rounded-xl mt-5' />
				</div>
			</div>
		</div>
	)
}
