'use client'

import { motion, useMotionValueEvent, useScroll } from 'motion/react'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { ButtonLink } from '../buttons/ButtonLink'
import SidebarMenu from './SidebarMenu'

export function Header() {
	const { scrollY } = useScroll()
	const [hidden, setHidden] = useState(false)

	useMotionValueEvent(scrollY, 'change', current => {
		const previous = scrollY.getPrevious() ?? 0
		if (current > previous && current > 150) {
			setHidden(true)
		} else {
			setHidden(false)
		}
	})

	return (
		<motion.header
			className='fixed top-0 left-0 right-0 px-2 py-2 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200'
			style={{ paddingTop: '20px' }} // для корректной анимации вверх
			animate={{
				y: hidden ? -100 : 0, // -100 вместо -140 под твой header
				opacity: hidden ? 0 : 1
			}}
			transition={{ duration: 0.3, ease: 'easeInOut' }}
		>
			<div className='flex items-center justify-between max-w-7xl mx-auto'>
				{/* Бургер */}
				<div className='md:hidden w-12 h-12 shrink-0'>
					<SidebarMenu />
				</div>

				{/* Логотип */}
				<div className='flex-1 flex justify-center md:justify-start mx-4'>
					<Link href='/' className='inline-flex items-center'>
						<Image
							src='/images/Logo.svg'
							alt='Project Cards Logo'
							width={113}
							height={76}
							className='hidden md:block cursor-pointer'
						/>
						<Image
							src='/images/Logo-adaptive.svg'
							alt='Project Cards Logo'
							width={50}
							height={50}
							className='block md:hidden cursor-pointer'
						/>
					</Link>
				</div>

				{/* Кнопка */}
				<div className='shrink-0 ml-auto'>
					<ButtonLink text='Вход' href='/login' />
				</div>
			</div>
		</motion.header>
	)
}
