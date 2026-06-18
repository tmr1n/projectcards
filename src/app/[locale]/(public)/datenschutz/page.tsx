import Link from 'next/link'
import { getTranslations } from 'next-intl/server'

export default async function DatenschutzPage({
	params
}: {
	params: Promise<{ locale: string }>
}) {
	const { locale } = await params
	const t = await getTranslations('datenschutz')

	const sections = [
		{ title: t('dataTitle'), body: t('data') },
		{ title: t('purposeTitle'), body: t('purpose') },
		{ title: t('thirdTitle'), body: t('third') },
		{ title: t('rightsTitle'), body: t('rights') },
		{ title: t('contactTitle'), body: t('contact') }
	]

	return (
		<div className='mx-auto max-w-2xl px-6 py-12'>
			<h1 className='mb-2 text-3xl font-semibold text-gray-900'>
				{t('title')}
			</h1>
			<p className='mb-2 text-sm text-amber-600'>{t('note')}</p>
			<p className='mb-10 leading-relaxed text-gray-700'>{t('intro')}</p>

			<div className='space-y-8 leading-relaxed text-gray-700'>
				{sections.map((s) => (
					<section key={s.title}>
						<h2 className='mb-1 text-lg font-semibold text-gray-900'>
							{s.title}
						</h2>
						<p>{s.body}</p>
					</section>
				))}
			</div>

			<Link
				href={`/${locale}`}
				className='mt-10 inline-block text-blue-600 hover:underline'
			>
				← {t('back')}
			</Link>
		</div>
	)
}
