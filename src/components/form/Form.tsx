import { useForm, type SubmitHandler } from 'react-hook-form'
import { ButtonSubmit } from '@/components/buttons/ButtonSubmit'
import { Field } from '@/components/form/Field'
import { PasswordInput } from '@/components/form/PasswordInput'
import { Checkbox } from './Checkbox'

interface IFormProps {
	example: string
	exampleRequired: string
}

export function Form({}: IFormProps) {
	const {
		register,
		handleSubmit,
		watch,
		formState: { errors }
	} = useForm<IFormProps>()
	const onSubmit: SubmitHandler<IFormProps> = data => console.log(data)

	return (
		<div className='w-[50%] bg-white flex items-center justify-center p-8 overflow-y-auto'>
			<form
				onSubmit={handleSubmit(onSubmit)}
				className='w-full max-w-lg space-y-4 '
			>
				<Field label='Email' placeholder='Введите email'></Field>

				<Field label='Имя пользователя' placeholder='andrew123'></Field>

				<PasswordInput label='Пароль'></PasswordInput>
				<PasswordInput label='Повторите пароль'></PasswordInput>
				{errors.exampleRequired && (
					<span className='text-red-500 text-sm mt-1'>
						{errors.exampleRequired.message}
					</span>
				)}

				<div className='pb-2 pt-2'>
					<Checkbox text='Я хочу получать новости, рекламные сообщения, обновления и советы о том, как использовать LangCards'></Checkbox>
					<Checkbox text='Я принимаю положения, которые содержат Условия предоставления услуг и Политику конфиденциальности LangCards'></Checkbox>
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
