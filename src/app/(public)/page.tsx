'use client'

import { motion } from 'framer-motion'
import { ButtonLink } from '@/components/buttons/ButtonLink'

const wordVariants = {
	hidden: { opacity: 0, y: 10, filter: 'blur(10px)' },
	visible: (i: number) => ({
		opacity: 1,
		y: 0,
		filter: 'blur(0px)',
		transition: {
			delay: i * 0.1,
			type: 'spring' as const,
			stiffness: 120,
			damping: 18
		}
	})
}

const h1Text = 'How do you want to study?'
const h1Words = h1Text.split(' ')

const pText =
	'Освойте любой изучаемый материал с помощью интерактивных карточек, пробных тестов и учебных активностей.'
const pWords = pText.split(' ')

export default function Home() {
	return (
		<div className='flex flex-col items-center justify-center gap-4 p-4 pt-12.5'>
			<h1 className='text-[2.5rem] text-center md:text-[4rem] font-semibold text-black flex flex-wrap justify-center gap-x-[0.28em]'>
				{h1Words.map((word, i) => {
					const isStudy = word.replace(/\W/g, '').toLowerCase() === 'study'
					return (
						<motion.span
							key={i}
							custom={i}
							variants={wordVariants}
							initial='hidden'
							animate='visible'
							className={
								isStudy
									? 'font-(family-name:--font-playfair) italic'
									: 'font-(family-name:--font-geist-sans)'
							}
						>
							{word}
						</motion.span>
					)
				})}
			</h1>
			<p className='text-[1rem] md:text-[1.25rem] text-center text-black font-(family-name:--font-geist-sans) flex flex-wrap justify-center gap-x-[0.28em]'>
				{pWords.map((word, i) => (
					<motion.span
						key={i}
						custom={h1Words.length + i}
						variants={wordVariants}
						initial='hidden'
						animate='visible'
					>
						{word}
					</motion.span>
				))}
			</p>
			<motion.div
				initial={{ opacity: 0, y: 10 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{
					delay: (h1Words.length + pWords.length) * 0.1,
					type: 'spring',
					stiffness: 120,
					damping: 18
				}}
			>
				<ButtonLink
					text={'Зарегистрироваться бесплатно'}
					href='/registration'
				/>
			</motion.div>
		</div>
	)
}
