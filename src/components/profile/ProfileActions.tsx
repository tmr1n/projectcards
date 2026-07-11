'use client'

import { ChevronRight, Globe, KeyRound, LogOut, Pencil, Trash2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { LocaleSwitcher } from '@/components/LocaleSwitcher'
import { useAuthStore } from '@/store/authStore'

export function ProfileActions() {
	const t = useTranslations('profile.actions')
	const tModal = useTranslations('profile.deleteModal')
	const logout = useAuthStore(state => state.logout)
	const deleteAccount = useAuthStore(state => state.deleteAccount)
	const user = useAuthStore(state => state.user)
	const router = useRouter()

	// Демо-аккаунт (email вида demo-…@guest.langcards) удалять нельзя —
	// бэк это и так блокирует, а на фронте просто прячем кнопку.
	const isDemo = user?.email?.endsWith('@guest.langcards') ?? false

	const [showConfirm, setShowConfirm] = useState(false)
	const [isDeleting, setIsDeleting] = useState(false)

	const handleDelete = async () => {
		setIsDeleting(true)
		await deleteAccount()
		router.push('/')
	}

	return (
		<>
			<div className='w-full px-4 mt-8 flex flex-col gap-3 items-center'>
				<div className='rounded-2xl overflow-hidden border border-gray-100 divide-y divide-gray-100'>
					<Link
						href='/username-change'
						className='w-87.5 md:w-93.75 flex items-center gap-3 px-4 py-4 bg-white hover:bg-gray-50 transition-colors'
					>
						<span className='w-9 h-9 rounded-full bg-violet-50 flex items-center justify-center shrink-0'>
							<Pencil size={16} className='text-violet-600' />
						</span>
						<span className='flex-1 text-left text-sm font-medium text-gray-800'>
							{t('changeName')}
						</span>
						<ChevronRight size={16} className='text-gray-400' />
					</Link>

					{user?.hasPassword && (
						<Link
							href='/password-change?from=profile'
							className='w-full flex items-center gap-3 px-4 py-4 bg-white hover:bg-gray-50 transition-colors'
						>
							<span className='w-9 h-9 rounded-full bg-violet-50 flex items-center justify-center shrink-0'>
								<KeyRound size={16} className='text-violet-600' />
							</span>
							<span className='flex-1 text-left text-sm font-medium text-gray-800'>
								{t('changePassword')}
							</span>
							<ChevronRight size={16} className='text-gray-400' />
						</Link>
					)}
				</div>

				<div className='w-87.5 md:w-93.75 rounded-2xl border border-gray-100 bg-white px-4 py-3 flex items-center justify-between'>
					<div className='flex items-center gap-3'>
						<span className='w-9 h-9 rounded-full bg-violet-50 flex items-center justify-center shrink-0'>
							<Globe size={16} className='text-violet-600' />
						</span>
						<span className='text-sm font-medium text-gray-800'>
							{t('language')}
						</span>
					</div>
					<LocaleSwitcher />
				</div>

				<div className='rounded-2xl overflow-hidden border border-gray-100 divide-y divide-gray-100'>
					<button
						onClick={() => {
							logout()
							router.push('/')
						}}
						className='w-87.5 md:w-93.75 flex items-center gap-3 px-4 py-4 bg-white hover:bg-red-50 transition-colors cursor-pointer'
					>
						<span className='w-9 h-9 rounded-full bg-red-50 flex items-center justify-center shrink-0'>
							<LogOut size={16} className='text-red-500' />
						</span>
						<span className='flex-1 text-left text-sm font-medium text-red-500'>
							{t('logout')}
						</span>
					</button>

					{user && !isDemo && (
						<button
							onClick={() => setShowConfirm(true)}
							className='w-full flex items-center gap-3 px-4 py-4 bg-white hover:bg-red-50 transition-colors cursor-pointer'
						>
							<span className='w-9 h-9 rounded-full bg-red-50 flex items-center justify-center shrink-0'>
								<Trash2 size={16} className='text-red-500' />
							</span>
							<span className='flex-1 text-left text-sm font-medium text-red-500'>
								{t('deleteAccount')}
							</span>
						</button>
					)}
				</div>
			</div>

			{showConfirm && (
				<div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4'>
					<div className='bg-white rounded-2xl p-6 w-full max-w-sm flex flex-col gap-4'>
						<h2 className='text-lg font-bold text-gray-900'>
							{tModal('title')}
						</h2>
						<p className='text-sm text-gray-500'>{tModal('description')}</p>
						<button
							onClick={handleDelete}
							disabled={isDeleting}
							className='w-full py-3 rounded-xl bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors disabled:opacity-50 cursor-pointer'
						>
							{tModal('confirm')}
						</button>
						<button
							onClick={() => setShowConfirm(false)}
							disabled={isDeleting}
							className='w-full py-3 rounded-xl bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200 transition-colors disabled:opacity-50 cursor-pointer'
						>
							{tModal('cancel')}
						</button>
					</div>
				</div>
			)}
		</>
	)
}
