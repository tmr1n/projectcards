'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import Logo from '@/components/Logo'

export default function NotFound() {
	const t = useTranslations('errors')

	return (
		<div className='min-h-screen bg-white flex flex-col'>
			<div className='p-6'>
				<Logo size={44} />
			</div>

			<div className='flex-1 flex flex-col items-center justify-center px-6 pb-24'>
				<p className='text-8xl md:text-[10rem] font-bold text-gray-100 select-none leading-none'>
					{t('notFoundCode')}
				</p>

				<div className='mt-4 text-center space-y-3'>
					<h1 className='text-2xl md:text-3xl font-bold text-gray-900'>
						{t('notFoundTitle')}
					</h1>
					<p className='text-gray-500 max-w-sm'>
						{t('notFoundMessage')}
					</p>
				</div>

				<div className='mt-10 flex items-center gap-4'>
					<Link
						href='/'
						className='px-6 py-3 bg-violet-600 text-white text-sm font-semibold rounded-full hover:bg-violet-700 transition-colors'
					>
						{t('home')}
					</Link>
					<Link
						href='mailto:support@langcards.com'
						className='text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors'
					>
						{t('contactSupport')} →
					</Link>
				</div>
			</div>
		</div>
	)
}
