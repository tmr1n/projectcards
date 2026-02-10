import { ButtonMain } from '@/components/buttons/ButtonMain'

export default function Home() {
	return (
		<div className='flex flex-col items-center justify-center gap-4 p-4'>
			<h1 className='text-[2.75rem] font-bold text-black font-nunito '>
				Как вы хотите заниматься?
			</h1>
			<p className='text-[1.25rem] text-center text-black font-nunito'>
				Освойте любой изучаемый материал с помощью интерактивных карточек,
				<br />
				пробных тестов и учебных активностей.
			</p>
			<ButtonMain text={'Зарегистрироваться бесплатно'}></ButtonMain>
		</div>
	)
}
