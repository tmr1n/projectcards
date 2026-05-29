import { Skeleton } from '@/components/ui/Skeleton'

function SidePanel() {
	return (
		<div className='hidden md:flex md:w-[50%] flex-col justify-between p-8 bg-gray-100'>
			<div className='flex flex-col gap-3 max-w-sm'>
				<Skeleton className='h-10 w-[90%]' />
				<Skeleton className='h-10 w-[65%]' />
			</div>
			<Skeleton className='h-16 w-36 rounded-xl' />
		</div>
	)
}

export function RegistrationPageSkeleton() {
	return (
		<div className='flex flex-row h-screen' role='status' aria-label='Загрузка...'>
			<SidePanel />

			<div className='w-full md:w-[50%] flex flex-col overflow-y-auto'>
				{/* Close button */}
				<div className='flex justify-end p-4'>
					<Skeleton className='h-9 w-9 rounded-full' />
				</div>

				{/* Nav tabs */}
				<div className='flex flex-row gap-8 justify-center max-w-lg w-full mx-auto'>
					<Skeleton className='h-8 w-28' />
					<Skeleton className='h-8 w-16' />
				</div>

				{/* Form */}
				<div className='flex items-center justify-center pb-8 pr-8 pl-8 mt-8'>
					<div className='w-full max-w-lg flex flex-col gap-4'>
						{/* Email */}
						<div className='space-y-2'>
							<Skeleton className='h-4 w-16' />
							<Skeleton className='h-11 w-full rounded-xl' />
						</div>

						{/* Username */}
						<div className='space-y-2'>
							<Skeleton className='h-4 w-32' />
							<Skeleton className='h-11 w-full rounded-xl' />
						</div>

						{/* Password */}
						<div className='space-y-2'>
							<Skeleton className='h-4 w-16' />
							<Skeleton className='h-11 w-full rounded-xl' />
						</div>

						{/* Confirm password */}
						<div className='space-y-2'>
							<Skeleton className='h-4 w-32' />
							<Skeleton className='h-11 w-full rounded-xl' />
						</div>

						{/* Newsletter checkbox */}
						<div className='flex items-start gap-3'>
							<Skeleton className='h-5 w-5 rounded shrink-0 mt-0.5' />
							<Skeleton className='h-4 w-full' />
						</div>

						{/* Terms checkbox */}
						<div className='flex items-start gap-3'>
							<Skeleton className='h-5 w-5 rounded shrink-0 mt-0.5' />
							<Skeleton className='h-4 w-4/5' />
						</div>

						{/* Submit */}
						<Skeleton className='h-11 w-full rounded-xl mt-1' />

						{/* Login link */}
						<Skeleton className='h-11 w-full rounded-xl' />
					</div>
				</div>
			</div>
		</div>
	)
}
