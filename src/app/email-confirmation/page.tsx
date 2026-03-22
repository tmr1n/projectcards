'use client'

import { ButtonLink } from '@/components/buttons/ButtonLink'
import { ButtonSubmit } from '@/components/buttons/ButtonSubmit'

interface Props {}

export default function page({}: Props) {
	return (
		<div className='flex flex-col p-15 gap-5 md: max-w-[40%]'>
			<h1 className='text-black font-bold text-2xl '>
				Подтвердите адрес электронной почты, чтобы продолжить
			</h1>
			<p className='text-black text-m'>
				Мы отправили сообщение на адрес {} Подтвердите правильность этого
				адреса, нажав на ссылку в письме
			</p>
			<p className='text-black text-sm'>
				Не получили электронное письмо? Проверьте папку спама или запросите
				повторную отправку.
			</p>
			<div className='flex flex-row'>
				<ButtonSubmit
					className='text-sm m-1'
					variant='primary'
					text='Отправить письмо повторно'
				/>
				<ButtonLink
					variant='third'
					text='Уже есть учетная запись? Войти'
					href='/login'
				/>
			</div>
		</div>
	)
}
