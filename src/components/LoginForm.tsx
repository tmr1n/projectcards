import { useForm, type SubmitHandler } from 'react-hook-form'
import { FaYandex } from 'react-icons/fa'
import { FcGoogle } from 'react-icons/fc'
import { TiVendorMicrosoft } from 'react-icons/ti'
import { ButtonSubmit } from '@/components/buttons/ButtonSubmit'
import { Field } from '@/components/form/Field'
import { PasswordInput } from '@/components/form/PasswordInput'
import { LineComponent } from './form/Line'

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
					icon={<FcGoogle />}
				></ButtonSubmit>

				<ButtonSubmit
					variant='secondary'
					text={'Продолжить с Microsoft'}
					icon={<TiVendorMicrosoft />}
				></ButtonSubmit>

				<ButtonSubmit
					variant='secondary'
					text={'Продолжить с Yandex'}
					icon={<FaYandex />}
				></ButtonSubmit>

				<LineComponent text='или адрес эл. почты'></LineComponent>

				<div className='pb-4'>
					<Field
						textLabel='Email или имя пользователя'
						placeholder='Введите адрес эл. почты или имя пользователя'
					></Field>

					<div className='flex justify-between'>
						<PasswordInput textLabel='Пароль'></PasswordInput>
						<span>Забыли пароль?</span>
					</div>
				</div>

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
