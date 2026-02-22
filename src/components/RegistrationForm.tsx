import Link from 'next/link'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { ButtonSubmit } from '@/components/buttons/ButtonSubmit'
import { Input } from '@/components/form/Input'
import { PasswordInput } from '@/components/form/PasswordInput'
import { Checkbox } from './form/Checkbox'
import { LabelComponent } from './form/LabelComponent'

interface IRegistrationFormProps {
	example: string
	exampleRequired: string
}

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
					<Input placeholder='user@mail.com'></Input>
				</div>

				<div className='space-y-2'>
					<LabelComponent text={'Имя пользователя'}></LabelComponent>
					<Input placeholder='andrew123'></Input>
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

				<ButtonSubmit
					variant='primary'
					text={'Зарегистрироваться'}
					type='submit'
				></ButtonSubmit>

				<ButtonSubmit
					variant='secondary'
					text={'Уже есть учетная запись? Войти'}
				></ButtonSubmit>
			</form>
		</div>
	)
}
