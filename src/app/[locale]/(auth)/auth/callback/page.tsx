'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'

const DECK_COLORS = ['bg-indigo-200', 'bg-emerald-200', 'bg-rose-200', 'bg-amber-200']

function DeckCardSkeleton({ colorClass }: { colorClass: string }) {
	return (
		<div className='bg-white rounded-2xl overflow-hidden shrink-0 w-44 md:w-52 animate-pulse'>
			<div className={`h-28 ${colorClass}`} />
			<div className='p-3 space-y-2'>
				<div className='h-4 bg-gray-200 rounded-md w-3/4' />
				<div className='h-3 bg-gray-100 rounded-md w-1/2' />
			</div>
		</div>
	)
}

function SidebarSkeleton() {
	return (
		<div className='hidden md:flex flex-col w-64 bg-white h-screen shrink-0'>
			<div className='p-6'>
				<div className='h-10 w-24 bg-gray-200 rounded-lg animate-pulse' />
			</div>

			<nav className='flex-1 px-3 space-y-1'>
				{[0, 1, 2].map(i => (
					<div key={i} className='flex items-center gap-3 px-3 py-2 animate-pulse'>
						<div className='w-5 h-5 bg-gray-200 rounded-md shrink-0' />
						<div className='h-4 bg-gray-200 rounded-md flex-1' />
						{i === 0 && <div className='h-5 w-5 bg-blue-100 rounded-full' />}
					</div>
				))}

				<div className='pt-6 space-y-1'>
					<div className='h-3 bg-gray-100 rounded w-24 mx-3 mb-3 animate-pulse' />
					{[0, 1, 2].map(i => (
						<div key={i} className='flex items-center gap-3 px-3 py-2 animate-pulse'>
							<div className={`w-6 h-6 rounded shrink-0 ${['bg-gray-400', 'bg-indigo-400', 'bg-emerald-400'][i]}`} />
							<div className='h-4 bg-gray-200 rounded-md flex-1' />
						</div>
					))}
				</div>
			</nav>

			<div className='p-4 border-t-2 border-gray-100 animate-pulse'>
				<div className='flex items-center gap-3 px-2 py-1.5'>
					<div className='w-9 h-9 rounded-full bg-blue-200 shrink-0' />
					<div className='h-4 bg-gray-200 rounded-md flex-1' />
				</div>
			</div>
		</div>
	)
}

export default function OAuthCallbackPage() {
	const searchParams = useSearchParams()
	const router = useRouter()
	const loginWithOAuth = useAuthStore(state => state.loginWithOAuth)

	useEffect(() => {
		const token = searchParams.get('token')
		if (!token) {
			router.push('/login')
			return
		}
		loginWithOAuth(token).then(() => {
			router.push('/dashboard')
		})
	}, [])

	return (
		<div className='h-screen flex overflow-hidden'>
			<SidebarSkeleton />

			<div className='flex-1 bg-blue-100 flex flex-col overflow-hidden'>
				{/* Mobile: logo + avatar */}
				<div className='flex justify-between items-center p-4 md:hidden animate-pulse'>
					<div className='h-10 w-12 bg-blue-200 rounded-lg' />
					<div className='w-14 h-14 bg-blue-300 rounded-full' />
				</div>

				{/* Main content */}
				<div className='flex-1 px-4 py-6 md:px-8 md:py-8 space-y-7 overflow-hidden'>
					{/* Greeting */}
					<div className='animate-pulse space-y-2'>
						<div className='h-7 bg-blue-200 rounded-lg w-52' />
						<div className='h-4 bg-blue-200/70 rounded-md w-72' />
					</div>

					{/* Deck cards row */}
					<div>
						<div className='h-4 bg-blue-200 rounded-md w-36 mb-4 animate-pulse' />
						<div className='flex gap-4 overflow-hidden'>
							{DECK_COLORS.map((color, i) => (
								<DeckCardSkeleton key={i} colorClass={color} />
							))}
						</div>
					</div>

					{/* Stats / progress block */}
					<div className='animate-pulse space-y-3'>
						<div className='h-4 bg-blue-200 rounded-md w-44' />
						<div className='bg-white rounded-2xl p-4 space-y-4'>
							{[0, 1].map(i => (
								<div key={i} className='flex items-center gap-4'>
									<div className='w-11 h-11 bg-gray-100 rounded-xl shrink-0' />
									<div className='flex-1 space-y-2'>
										<div className='h-3 bg-gray-200 rounded w-2/3' />
										<div className='h-2 bg-gray-100 rounded-full w-full' />
									</div>
									<div className='h-4 w-10 bg-gray-100 rounded' />
								</div>
							))}
						</div>
					</div>
				</div>

				{/* Mobile: bottom nav */}
				<div className='flex justify-center md:hidden animate-pulse pb-5'>
					<div className='bg-blue-400/60 rounded-4xl w-80 h-18.75' />
				</div>
			</div>
		</div>
	)
}
