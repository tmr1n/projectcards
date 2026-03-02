import { ButtonLink } from '@/components/buttons/ButtonLink'

export default function Home() {
	return (
		<div className='flex flex-col items-center justify-center gap-4 p-4 pt-12.5'>
			<h1 className='text-[2.5rem] text-center md:text-[2.75rem] font-bold text-black font-nunito '>
				Как вы хотите заниматься?
			</h1>
			<p className='text-[1rem] md:text-[1.25rem] text-center text-black font-nunito'>
				Освойте любой изучаемый материал с помощью интерактивных карточек,
				<br />
				пробных тестов и учебных активностей.
			</p>
			<ButtonLink text={'Зарегистрироваться бесплатно'} href='/registration' />
		</div>
	)
}
