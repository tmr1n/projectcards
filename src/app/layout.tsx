import type { Metadata } from 'next'
import { Geist, Geist_Mono, Nunito } from 'next/font/google'
import './globals.css'

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

export const metadata: Metadata = {
	title: 'New cards era!',
	description:
		'Now you can learn any material with interactive cards, practice tests and learning activities.',
	icons: {
		icon: '/images/Title-logo.svg'
	}
}

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang='en'>
			<body
				className={`${geistSans.variable} ${geistMono.variable} ${nunitoSans.variable} antialiased`}
			>
				{children}
			</body>
		</html>
	)
}
