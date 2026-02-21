import { useForm, type SubmitHandler } from 'react-hook-form'
import { ButtonSubmit } from '@/components/buttons/ButtonSubmit'
import { Field } from '@/components/form/Field'
import { PasswordInput } from '@/components/form/PasswordInput'

interface ILoginFormProps {
	example: string
	exampleRequired: string
}

export function LoginForm({}: ILoginFormProps) {
	const {
		register,
		handleSubmit,
		watch,
		formState: { errors }
	} = useForm<ILoginFormProps>()
	const onSubmit: SubmitHandler<ILoginFormProps> = data => console.log(data)

	return (
		<div className=' bg-white flex items-center justify-center p-8 '>
			<form
				onSubmit={handleSubmit(onSubmit)}
				className='w-full max-w-lg space-y-4 '
			>
				<ButtonSubmit
					variant='secondary'
					text={'Продолжить с Google'}
				></ButtonSubmit>

				<ButtonSubmit
					variant='secondary'
					text={'Продолжить с Microsoft'}
				></ButtonSubmit>

				<ButtonSubmit
					variant='secondary'
					text={'Продолжить с Yandex'}
				></ButtonSubmit>

				<Field
					label='Email или имя пользователя'
					placeholder='user@mail.com'
				></Field>

				<PasswordInput label='Пароль'></PasswordInput>

				{errors.exampleRequired && (
					<span className='text-red-500 text-sm mt-1'>
						{errors.exampleRequired.message}
					</span>
				)}

				<ButtonSubmit
					variant='primary'
					text={'Вход'}
					type='submit'
				></ButtonSubmit>

				<ButtonSubmit
					variant='secondary'
					text={'Впервые в LangCards? Зарегистрироваться'}
				></ButtonSubmit>
			</form>
		</div>
	)
}
