import { Skeleton } from '@/components/ui/Skeleton'

export function ProfilePageSkeleton() {
	return (
		<div role='status' aria-label='Loading...'>
			{/* Back button */}
			<div className='flex items-center gap-4 mb-6 justify-start p-4'>
				<Skeleton className='h-9 w-9 rounded-full' />
			</div>

			{/* Avatar + username */}
			<div className='flex items-center gap-5 flex-col'>
				<Skeleton className='w-25 h-25 rounded-full' />
				<Skeleton className='h-6 w-36' />
			</div>

			{/* Action buttons */}
			<div className='w-full px-4 mt-8 flex flex-col gap-3 items-center'>
				{/* First group */}
				<div className='rounded-2xl overflow-hidden border border-gray-100 divide-y divide-gray-100'>
					{[0, 1].map(i => (
						<div key={i} className='w-87.5 md:w-93.75 flex items-center gap-3 px-4 py-4 bg-white'>
							<Skeleton className='w-9 h-9 rounded-full shrink-0' />
							<Skeleton className='h-4 flex-1' />
							<Skeleton className='h-4 w-4 rounded' />
						</div>
					))}
				</div>

				{/* Second group */}
				<div className='rounded-2xl overflow-hidden border border-gray-100 divide-y divide-gray-100'>
					{[0, 1].map(i => (
						<div key={i} className='w-87.5 md:w-93.75 flex items-center gap-3 px-4 py-4 bg-white'>
							<Skeleton className='w-9 h-9 rounded-full shrink-0' />
							<Skeleton className='h-4 flex-1' />
						</div>
					))}
				</div>
			</div>
		</div>
	)
}
