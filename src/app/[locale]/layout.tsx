import { TopLoader } from '@/components/ui/TopLoader'
import { QueryProvider } from '@/providers/QueryProvider'
import '@/app/globals.css'
import type { Metadata } from 'next'
import { Geist, Geist_Mono, Nunito, Playfair_Display } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'

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

export const metadata: Metadata = {
	title: {
		template: '%s | LangCards',
		default: 'LangCards — учи с карточками'
	},
	description:
		'Учи любой материал с интерактивными карточками, практическими тестами и учебными активностями.',
	icons: {
		icon: '/images/Title-logo.svg'
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
				</NextIntlClientProvider>
			</body>
		</html>
	)
}
