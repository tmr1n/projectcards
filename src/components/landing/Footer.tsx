'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

export function Footer() {
	const t = useTranslations('landing.footer')

	const links = [
		{ label: t('home'), href: '/' },
		{ label: t('registration'), href: '/registration' },
		{ label: t('login'), href: '/login' }
	]

	return (
		<footer className='bg-white border-t border-gray-100 px-6 md:px-20 py-14'>
			<div className='max-w-5xl mx-auto'>
				<div className='flex flex-col md:flex-row md:items-start md:justify-between gap-10'>
					{/* Brand */}
					<motion.div
						initial={{ opacity: 0, y: 16 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, amount: 0.4 }}
						transition={{ duration: 0.5 }}
					>
						<Link href='/'>
							<Image
								src='/images/Logo.svg'
								alt='Project Cards'
								width={113}
								height={76}
								className='mb-4 cursor-pointer'
							/>
						</Link>
						<p className='text-gray-400 text-sm font-(family-name:--font-geist-sans) max-w-xs leading-relaxed'>
							{t('description')}
						</p>
					</motion.div>

					{/* Links */}
					<motion.div
						className='flex gap-16'
						initial={{ opacity: 0, y: 16 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, amount: 0.4 }}
						transition={{ duration: 0.5, delay: 0.1 }}
					>
						<div className='flex flex-col gap-3'>
							<p className='text-xs font-semibold tracking-widest text-gray-300 uppercase font-(family-name:--font-geist-sans)'>
								{t('product')}
							</p>
							{links.map((link, i) => (
								<motion.div
									key={link.href}
									initial={{ opacity: 0, x: -8 }}
									whileInView={{ opacity: 1, x: 0 }}
									viewport={{ once: true, amount: 0.5 }}
									transition={{ duration: 0.35, delay: 0.15 + i * 0.07 }}
								>
									<Link
										href={link.href}
										className='text-gray-400 text-sm hover:text-black transition-colors font-(family-name:--font-geist-sans)'
									>
										{link.label}
									</Link>
								</motion.div>
							))}
						</div>
					</motion.div>
				</div>

				<motion.div
					className='mt-12 border-t border-gray-100 pt-6 flex items-center justify-between'
					initial={{ opacity: 0 }}
					whileInView={{ opacity: 1 }}
					viewport={{ once: true, amount: 0.5 }}
					transition={{ duration: 0.5, delay: 0.3 }}
				>
					<p className='text-gray-300 text-xs font-(family-name:--font-geist-sans)'>
						{t('copyright', { year: new Date().getFullYear() })}
					</p>
				</motion.div>
			</div>
		</footer>
	)
}
