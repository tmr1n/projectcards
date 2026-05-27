'use client'

import { ChevronRight, KeyRound, LogOut, Pencil, Trash2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'

export function ProfileActions() {
	const t = useTranslations('profile.actions')
	const logout = useAuthStore(state => state.logout)
	const router = useRouter()

	return (
		<div className='w-full px-4 mt-8 flex flex-col gap-3 items-center '>
			<div className='rounded-2xl overflow-hidden border border-gray-100 divide-y divide-gray-100 cursor-pointer'>
				<button className='w-[350px] md:w-[375px] flex items-center gap-3 px-4 py-4 bg-white hover:bg-gray-50 transition-colors cursor-pointer'>
					<span className='w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center shrink-0'>
						<Pencil size={16} className='text-blue-600' />
					</span>
					<span className='flex-1 text-left text-sm font-medium text-gray-800'>
						{t('changeName')}
					</span>
					<ChevronRight size={16} className='text-gray-400' />
				</button>

				<Link
					href='/password-change'
					className='w-full flex items-center gap-3 px-4 py-4 bg-white hover:bg-gray-50 transition-colors'
				>
					<span className='w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center shrink-0'>
						<KeyRound size={16} className='text-blue-600' />
					</span>
					<span className='flex-1 text-left text-sm font-medium text-gray-800'>
						{t('changePassword')}
					</span>
					<ChevronRight size={16} className='text-gray-400' />
				</Link>
			</div>

			<div className='rounded-2xl overflow-hidden border border-gray-100 divide-y divide-gray-100 '>
				<button
					onClick={() => {
						logout()
						router.push('/')
					}}
					className='w-[350px] md:w-[375px] flex items-center gap-3 px-4 py-4 bg-white hover:bg-red-50 transition-colors cursor-pointer'
				>
					<span className='w-9 h-9 rounded-full bg-red-50 flex items-center justify-center shrink-0'>
						<LogOut size={16} className='text-red-500' />
					</span>
					<span className='flex-1 text-left text-sm font-medium text-red-500'>
						{t('logout')}
					</span>
				</button>

				<button className='w-full flex items-center gap-3 px-4 py-4 bg-white hover:bg-red-50 transition-colors cursor-pointer'>
					<span className='w-9 h-9 rounded-full bg-red-50 flex items-center justify-center shrink-0'>
						<Trash2 size={16} className='text-red-500' />
					</span>
					<span className='flex-1 text-left text-sm font-medium text-red-500'>
						{t('deleteAccount')}
					</span>
				</button>
			</div>
		</div>
	)
}
