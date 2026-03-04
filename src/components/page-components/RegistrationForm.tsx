import Link from 'next/link'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { ButtonSubmit } from '@/components/buttons/ButtonSubmit'
import { InputComponent } from '@/components/form-components/InputComponent'
import { PasswordInput } from '@/components/form-components/PasswordInput'
import { ButtonLink } from '../buttons/ButtonLink'
import { Checkbox } from '../form-components/CheckboxComponent'
import { LabelComponent } from '../form-components/LabelComponent'
import type { IRegistrationFormProps } from '@/shared/types/auth.types'

export function RegistrationForm({}: IRegistrationFormProps) {
	const {
		register,
		handleSubmit,
		watch,
		formState: { errors }
	} = useForm<IRegistrationFormProps>()
	const onSubmit: SubmitHandler<IRegistrationFormProps> = data =>
		console.log(data)

	return (
		<div className=' bg-white flex items-center justify-center pb-8 pr-8 pl-8 mt-8 '>
			<form
				onSubmit={handleSubmit(onSubmit)}
				className='w-full max-w-lg flex flex-col gap-4'
			>
				<div className='space-y-2'>
					<LabelComponent text={'Email'}></LabelComponent>
					<InputComponent placeholder='user@mail.com'></InputComponent>
				</div>

				<div className='space-y-2'>
					<LabelComponent text={'Имя пользователя'}></LabelComponent>
					<InputComponent placeholder='andrew123'></InputComponent>
				</div>

				<div className='space-y-2'>
					<LabelComponent text={'Пароль'}></LabelComponent>
					<PasswordInput />
				</div>

				<div className='space-y-2'>
					<LabelComponent text={'Повторите пароль'}></LabelComponent>
					<PasswordInput />{' '}
				</div>

				{errors.exampleRequired && (
					<span className='text-red-500 text-sm mt-1'>
						{errors.exampleRequired.message}
					</span>
				)}

				<div className='pb-2 pt-4'>
					<Checkbox text='Я хочу получать новости, рекламные сообщения, обновления и советы о том, как использовать LangCards' />
					<Checkbox
						text={
							<>
								Я принимаю положения, которые содержат{' '}
								<Link
									href='/terms'
									className='underline text-blue-600 hover:text-blue-800'
								>
									Условия предоставления услуг
								</Link>{' '}
								и{' '}
								<Link
									href='/privacy'
									className='underline text-blue-600 hover:text-blue-800'
								>
									Политику конфиденциальности LangCards
								</Link>
							</>
						}
					/>
				</div>

				<ButtonSubmit variant='primary' text={'Зарегистрироваться'} />

				{/* //linkbutton */}
				<ButtonLink
					variant='secondary'
					text={'Уже есть учетная запись? Войти'}
					href='/login'
				/>
			</form>
		</div>
	)
}
