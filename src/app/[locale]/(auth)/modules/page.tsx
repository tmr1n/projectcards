'use client'

import { ChevronLeft, ChevronRight, Layers, Plus, Search } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { useEffect, useState } from 'react'
import { useUnauthorizedGuard } from '@/hooks/useUnauthorizedGuard'
import Logo from '@/components/Logo'
import BottomNav from '@/components/page-components/BottomNav'
import Sidebar from '@/components/page-components/Sidebar'
import { UserAvatar } from '@/components/profile/UserAvatar'
import { getDecksAction } from '@/server-actions/decks.actions'
import type { IDeckWithCount } from '@/shared/types/deck.types'

function ModuleCard({
	id,
	title,
	cardCount
}: {
	id: string
	title: string
	cardCount: number
}) {
	const t = useTranslations('modules')
	return (
		<Link
			href={`/flash-card?id=${id}`}
			className='bg-white rounded-2xl border border-gray-200 p-5 flex flex-col gap-4 hover:shadow-md transition cursor-pointer'
		>
			<div className='flex items-start justify-between gap-2'>
				<div className='bg-violet-100 rounded-xl p-2.5 shrink-0'>
					<Layers size={20} className='text-violet-600' />
				</div>
				<span className='text-xs text-gray-400 font-medium mt-1'>
					{cardCount} {t('cards')}
				</span>
			</div>
			<div className='min-w-0'>
				<p className='font-semibold text-gray-800 text-sm leading-snug truncate'>
					{title}
				</p>
			</div>
		</Link>
	)
}

export default function ModulesPage() {
	const t = useTranslations('modules')
	const [query, setQuery] = useState('')
	const [decks, setDecks] = useState<IDeckWithCount[]>([])
	const [loading, setLoading] = useState(true)

	const [page, setPage] = useState(1)
	const [totalPages, setTotalPages] = useState(1)
	const [debouncedQuery, setDebouncedQuery] = useState('')

	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedQuery(query)
			setPage(1) // новый поиск → всегда на первую страницу
		}, 400)
		return () => clearTimeout(timer) // каждая новая буква сбрасывает таймер
	}, [query])
	const guard = useUnauthorizedGuard()

	useEffect(() => {
		setLoading(true)
		getDecksAction({ page, search: debouncedQuery, limit: 9 }).then(res => {
			if (res.success) {
				setDecks(res.data ?? [])
				setTotalPages(res.meta?.totalPages ?? 1)
			} else guard(res)
			setLoading(false)
		})
	}, [page, debouncedQuery, guard])

	return (
		<div className='h-dvh flex overflow-hidden'>
			<Sidebar />

			<div className='flex-1 flex flex-col overflow-hidden'>
				<div className='flex justify-between items-center p-4 md:hidden shrink-0'>
					<Logo size={55} />
					<Link href='/profile'>
						<UserAvatar size={60} />
					</Link>
				</div>

				<div className='flex-1 overflow-y-auto p-4 md:p-10'>
					<div className='flex items-center justify-between mb-6'>
						<h2 className='text-2xl font-bold'>{t('title')}</h2>
						{/* На мобилке кнопка скрыта — там «+» уже есть в BottomNav */}
						<Link
							href='/create-module'
							className='hidden md:flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold px-4 py-2.5 rounded-full transition'
						>
							<Plus size={16} />
							{t('newModule')}
						</Link>
					</div>

					<div className='relative mb-6 max-w-md'>
						<Search
							size={16}
							className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400'
						/>
						<input
							value={query}
							onChange={e => setQuery(e.target.value)}
							placeholder={t('searchPlaceholder')}
							className='w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-violet-400 transition bg-white'
						/>
					</div>

					{loading ? (
						<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
							{Array.from({ length: 6 }).map((_, i) => (
								<div
									key={i}
									className='bg-gray-100 rounded-2xl h-32 animate-pulse'
								/>
							))}
						</div>
					) : decks.length > 0 ? (
						<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
							{decks.map(d => (
								<ModuleCard
									key={d.id}
									id={d.id}
									title={d.title}
									cardCount={d._count.cards}
								/>
							))}
						</div>
					) : (
						<div className='flex flex-col items-center justify-center py-20 text-center'>
							<Layers size={40} className='text-gray-300 mb-3' />
							<p className='text-gray-500 font-medium'>{t('notFound')}</p>
							<p className='text-gray-400 text-sm mt-1'>{t('notFoundHint')}</p>
						</div>
					)}

					{totalPages > 1 && (
						<div className='flex items-center justify-center gap-4 mt-8'>
							<button
								onClick={() => setPage(p => p - 1)}
								disabled={page <= 1}
								aria-label={t('prevPage')}
								className='w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer'
							>
								<ChevronLeft size={18} />
							</button>
							<span className='text-sm text-gray-500'>
								{t('pageOf', { page, total: totalPages })}
							</span>
							<button
								onClick={() => setPage(p => p + 1)}
								disabled={page >= totalPages}
								aria-label={t('nextPage')}
								className='w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer'
							>
								<ChevronRight size={18} />
							</button>
						</div>
					)}

					<div className='h-10' />
				</div>

				<div className='flex justify-center md:hidden shrink-0'>
					<BottomNav />
				</div>
			</div>
		</div>
	)
}
