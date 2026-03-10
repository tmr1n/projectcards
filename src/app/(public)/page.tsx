'use client'

import { motion } from 'framer-motion'
import { ButtonLink } from '@/components/buttons/ButtonLink'

export default function Home() {
	return (
		<div className='flex flex-col items-center justify-center gap-4 p-4 pt-12.5'>
			<motion.h1
				className='text-[2.5rem] text-center md:text-[2.75rem] font-bold text-black font-nunito'
				initial={{ opacity: 0, y: 50, scale: 0.95 }}
				animate={{ opacity: 1, y: 0, scale: 1 }}
				transition={{ duration: 0.6, ease: 'easeOut' }}
			>
				Как вы хотите заниматься?
			</motion.h1>
			<motion.p
				className='text-[1rem] md:text-[1.25rem] text-center text-black font-nunito'
				initial={{ opacity: 0, y: 50, scale: 0.95 }}
				animate={{ opacity: 1, y: 0, scale: 1 }}
				transition={{ duration: 0.6, ease: 'easeOut' }}
			>
				Освойте любой изучаемый материал с помощью интерактивных карточек,
				<br />
				пробных тестов и учебных активностей.
			</motion.p>
			<ButtonLink text={'Зарегистрироваться бесплатно'} href='/registration' />
		</div>
	)
}
