'use client'

import { Layers, Plus, Search } from 'lucide-react'
import Link from 'next/link'
import { default as NextLink } from 'next/link'
import { useState } from 'react'
import Logo from '@/components/Logo'
import BottomNav from '@/components/page-components/BottomNav'
import Sidebar from '@/components/page-components/Sidebar'
import { UserAvatar } from '@/components/profile/UserAvatar'

const MOCK_MODULES = [
	{ id: 1, title: 'Verben mit präpositionen', cardCount: 28, progress: 23 },
	{ id: 2, title: 'TADES. NVV', cardCount: 15, progress: 24 },
	{ id: 3, title: 'Grammar', cardCount: 42, progress: 45 },
	{ id: 4, title: 'Vocabulary', cardCount: 60, progress: 67 },
	{ id: 5, title: 'Adjektive', cardCount: 19, progress: 10 },
	{ id: 6, title: 'English B2', cardCount: 35, progress: 88 }
]

function ModuleCard({
	title,
	cardCount,
	progress
}: {
	title: string
	cardCount: number
	progress: number
}) {
	return (
		<Link
			href='/flash-card'
			className='bg-white rounded-2xl border border-gray-200 p-5 flex flex-col gap-4 hover:shadow-md transition cursor-pointer'
		>
			<div className='flex items-start justify-between gap-2'>
				<div className='bg-blue-100 rounded-xl p-2.5 shrink-0'>
					<Layers size={20} className='text-blue-600' />
				</div>
				<span className='text-xs text-gray-400 font-medium mt-1'>
					{cardCount} карточек
				</span>
			</div>

			<div>
				<p className='font-semibold text-gray-800 text-sm leading-snug'>
					{title}
				</p>
			</div>

			<div className='flex flex-col gap-1.5'>
				<div className='w-full h-2 bg-gray-100 rounded-full overflow-hidden'>
					<div
						className='h-full bg-blue-500 rounded-full'
						style={{ width: `${progress}%` }}
					/>
				</div>
				<span className='text-xs text-gray-400'>{progress}% пройдено</span>
			</div>
		</Link>
	)
}

export default function ModulesPage() {
	const [query, setQuery] = useState('')

	const filtered = MOCK_MODULES.filter(m =>
		m.title.toLowerCase().includes(query.toLowerCase())
	)

	return (
		<div className='h-dvh flex overflow-hidden'>
			<Sidebar />

			<div className='flex-1 flex flex-col overflow-hidden'>
				{/* Mobile header */}
				<div className='flex justify-between items-center p-4 md:hidden shrink-0'>
					<Logo size={55} />
					<NextLink href='/profile'>
						<UserAvatar size={60} />
					</NextLink>
				</div>

				<div className='flex-1 overflow-y-auto p-4 md:p-10'>
					{/* Title row */}
					<div className='flex items-center justify-between mb-6'>
						<h2 className='text-2xl font-bold'>Мои модули</h2>
						<Link
							href='/create-module'
							className='flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-full transition'
						>
							<Plus size={16} />
							Новый модуль
						</Link>
					</div>

					{/* Search */}
					<div className='relative mb-6 max-w-md'>
						<Search
							size={16}
							className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400'
						/>
						<input
							value={query}
							onChange={e => setQuery(e.target.value)}
							placeholder='Поиск модуля...'
							className='w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-blue-400 transition bg-white'
						/>
					</div>

					{/* Grid */}
					{filtered.length > 0 ? (
						<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
							{filtered.map(m => (
								<ModuleCard key={m.id} {...m} />
							))}
						</div>
					) : (
						<div className='flex flex-col items-center justify-center py-20 text-center'>
							<Layers size={40} className='text-gray-300 mb-3' />
							<p className='text-gray-500 font-medium'>Модули не найдены</p>
							<p className='text-gray-400 text-sm mt-1'>
								Попробуйте другой запрос или создайте новый модуль
							</p>
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
