import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations('profile')
	return { title: t('title') }
}

export default function page() {
	return (
		<div className=''>
			<div className='bg-gray-300 mr-10 p-30 w-2 h-screen'></div>
		</div>
	)
}
