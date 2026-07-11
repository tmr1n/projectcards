import Link from 'next/link'
import { ScrollToTop } from '@/components/ScrollToTop'
import { Footer } from '@/components/landing/Footer'

export default async function ImpressumPage({
	params
}: {
	params: Promise<{ locale: string }>
}) {
	const { locale } = await params

	return (
		<>
			<ScrollToTop />
			<div className='mx-auto px-6 py-12 flex justify-center'>
				<div className='overflow-x-auto'>
					<h1 className='mb-6 text-3xl font-semibold text-gray-900'>
						Impressum
					</h1>

					<div className='space-y-8 leading-relaxed text-gray-700'>
						<section>
							<h2 className='mb-1 text-lg font-semibold text-gray-900'>
								Angaben gemäß § 5 DDG
							</h2>
							<p>
								Artem Nemtsov
								<br />
								Geierstraße 4a
								<br />
								22305 Hamburg
							</p>
						</section>

						<section>
							<h2 className='mb-1 text-lg font-semibold text-gray-900'>
								Kontakt
							</h2>
							<p>E-Mail: artemart1337@gmail.com</p>
						</section>

						<section>
							<h2 className='mb-1 text-lg font-semibold text-gray-900'>
								Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV
							</h2>
							<p>Artem Nemtsov, Anschrift wie oben</p>
						</section>

						<p className='text-sm text-gray-500'>
							Dieses Projekt ist ein privates, nicht-kommerzielles Lernprojekt.
						</p>
					</div>

					<Link
						href={`/${locale}`}
						className='mt-10 inline-block text-violet-600 hover:underline'
					>
						← Zurück zur Startseite
					</Link>
				</div>
			</div>
			<Footer />
		</>
	)
}
