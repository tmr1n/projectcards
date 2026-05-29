import '@/app/globals.css'
import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, getTranslations } from 'next-intl/server'
import { Geist, Geist_Mono, Nunito, Playfair_Display } from 'next/font/google'
import { notFound } from 'next/navigation'
import { CookieBanner } from '@/components/ui/CookieBanner'
import { TopLoader } from '@/components/ui/TopLoader'
import { routing } from '@/i18n/routing'
import { QueryProvider } from '@/providers/QueryProvider'

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin']
})

const nunitoSans = Nunito({
	variable: '--font-nunito-sans',
	subsets: ['latin']
})

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin']
})

const playfair = Playfair_Display({
	variable: '--font-playfair',
	subsets: ['latin'],
	style: ['normal', 'italic']
})

export async function generateMetadata({
	params
}: {
	params: Promise<{ locale: string }>
}): Promise<Metadata> {
	const { locale } = await params
	const t = await getTranslations({ locale, namespace: 'metadata' })

	return {
		title: {
			template: '%s | LangCards',
			default: t('title')
		},
		description: t('description'),
		icons: {
			icon: '/images/Title-logo.svg'
		}
	}
}

export default async function RootLayout({
	children,
	params
}: Readonly<{
	children: React.ReactNode
	params: Promise<{ locale: string }>
}>) {
	const { locale } = await params

	if (!routing.locales.includes(locale as 'ru' | 'en' | 'de')) {
		notFound()
	}

	const messages = await getMessages()

	return (
		<html lang={locale}>
			<body
				className={`${geistSans.variable} ${geistMono.variable} ${nunitoSans.variable} ${playfair.variable} antialiased`}
			>
				<NextIntlClientProvider messages={messages}>
					<TopLoader />
					<QueryProvider>{children}</QueryProvider>
					<CookieBanner />
				</NextIntlClientProvider>
			</body>
		</html>
	)
}
