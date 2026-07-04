'use client'

import { Layers, Plus, Search } from 'lucide-react'
import Link from 'next/link'
import { default as NextLink } from 'next/link'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import Logo from '@/components/Logo'
import BottomNav from '@/components/page-components/BottomNav'
import Sidebar from '@/components/page-components/Sidebar'
import { UserAvatar } from '@/components/profile/UserAvatar'
import { getDecksAction } from '@/server-actions/decks.actions'
import type { IDeckWithCount } from '@/shared/types/deck.types'

function ModuleCard({ id, title, cardCount }: { id: string; title: string; cardCount: number }) {
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
			<div>
				<p className='font-semibold text-gray-800 text-sm leading-snug'>{title}</p>
			</div>
		</Link>
	)
}

export default function ModulesPage() {
	const t = useTranslations('modules')
	const [query, setQuery] = useState('')
	const [decks, setDecks] = useState<IDeckWithCount[]>([])
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		getDecksAction().then(res => {
			if (res.success) setDecks(res.data ?? [])
			setLoading(false)
		})
	}, [])

	const filtered = decks.filter(d =>
		d.title.toLowerCase().includes(query.toLowerCase())
	)

	return (
		<div className='h-dvh flex overflow-hidden'>
			<Sidebar />

			<div className='flex-1 flex flex-col overflow-hidden'>
				<div className='flex justify-between items-center p-4 md:hidden shrink-0'>
					<Logo size={55} />
					<NextLink href='/profile'>
						<UserAvatar size={60} />
					</NextLink>
				</div>

				<div className='flex-1 overflow-y-auto p-4 md:p-10'>
					<div className='flex items-center justify-between mb-6'>
						<h2 className='text-2xl font-bold'>{t('title')}</h2>
						<Link
							href='/create-module'
							className='flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold px-4 py-2.5 rounded-full transition'
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
								<div key={i} className='bg-gray-100 rounded-2xl h-32 animate-pulse' />
							))}
						</div>
					) : filtered.length > 0 ? (
						<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
							{filtered.map(d => (
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

					<div className='h-10' />
				</div>

				<div className='flex justify-center md:hidden shrink-0'>
					<BottomNav />
				</div>
			</div>
		</div>
	)
}
