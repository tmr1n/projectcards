'use client'

import { motion } from 'framer-motion'
import { ButtonLink } from '@/components/buttons/ButtonLink'

const steps = [
	{
		number: '01',
		title: 'Создай колоду',
		description:
			'Дай название, выбери тему и собери карточки — это займёт меньше минуты.',
		bg: 'bg-black',
		numberColor: 'text-gray-600',
		titleColor: 'text-white',
		descColor: 'text-gray-400'
	},
	{
		number: '02',
		title: 'Добавь карточки',
		description: 'Введи термин и определение. Обе стороны — в твоих руках.',
		bg: 'bg-gray-100',
		numberColor: 'text-gray-300',
		titleColor: 'text-black',
		descColor: 'text-gray-500'
	},
	{
		number: '03',
		title: 'Изучай и запоминай',
		description: 'Листай карточки, проходи тесты, отслеживай прогресс.',
		bg: 'bg-black',
		numberColor: 'text-gray-600',
		titleColor: 'text-white',
		descColor: 'text-gray-400'
	}
]

export function HowItWorks() {
	return (
		<section className='bg-white px-6 md:px-20 py-20'>
			<div className='max-w-5xl mx-auto'>
				<motion.p
					className='text-xs font-semibold tracking-widest text-gray-400 uppercase mb-5 font-(family-name:--font-geist-sans)'
					initial={{ opacity: 0, y: 12 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, amount: 0.5 }}
					transition={{ duration: 0.5 }}
				>
					Как это работает
				</motion.p>

				<motion.h2
					className='text-4xl md:text-6xl font-bold text-black leading-tight mb-14 font-(family-name:--font-geist-sans)'
					initial={{ opacity: 0, y: 16 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, amount: 0.5 }}
					transition={{ duration: 0.5, delay: 0.1 }}
				>
					Три шага до{' '}
					<span className='font-(family-name:--font-playfair) italic text-gray-400'>
						результата.
					</span>
				</motion.h2>

				<div className='grid grid-cols-1 md:grid-cols-3 gap-5'>
					{steps.map((step, i) => (
						<motion.div
							key={i}
							className={`${step.bg} rounded-3xl p-8 flex flex-col justify-between min-h-60`}
							initial={{ opacity: 0, y: 32 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true, amount: 0.3 }}
							transition={{
								duration: 0.55,
								delay: i * 0.12,
								type: 'spring',
								stiffness: 100,
								damping: 18
							}}
						>
							<span
								className={`text-6xl font-bold ${step.numberColor} font-(family-name:--font-geist-sans) leading-none select-none`}
							>
								{step.number}
							</span>
							<div>
								<p
									className={`text-xl font-bold ${step.titleColor} mb-2 font-(family-name:--font-geist-sans)`}
								>
									{step.title}
								</p>
								<p
									className={`text-sm ${step.descColor} leading-relaxed font-(family-name:--font-geist-sans)`}
								>
									{step.description}
								</p>
							</div>
						</motion.div>
					))}
				</div>

				<motion.div
					className='mt-10 flex justify-center'
					initial={{ opacity: 0, y: 12 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, amount: 0.5 }}
					transition={{ duration: 0.5, delay: 0.4 }}
				>
					<div className='max-w-xs w-full'>
						<ButtonLink text='Попробовать бесплатно' href='/registration' />
					</div>
				</motion.div>
			</div>
		</section>
	)
}
