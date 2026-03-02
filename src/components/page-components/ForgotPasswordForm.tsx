import { useForm, type SubmitHandler } from 'react-hook-form'
import { ButtonSubmit } from '@/components/buttons/ButtonSubmit'
import { Input } from '@/components/form-components/Input'
import { LabelComponent } from '../form-components/LabelComponent'

interface IForgotPasswordFormProps {
	example: string
	exampleRequired: string
}

export function ForgotPasswordForm({}: IForgotPasswordFormProps) {
	const {
		register,
		handleSubmit,
		watch,
		formState: { errors }
	} = useForm<IForgotPasswordFormProps>()
	const onSubmit: SubmitHandler<IForgotPasswordFormProps> = data =>
		console.log(data)

	return (
		<div className=' bg-white flex items-center justify-center p-8 '>
			<form
				onSubmit={handleSubmit(onSubmit)}
				className='w-full max-w-lg flex flex-col gap-4'
			>
				<div>
					<h1 className='text-3xl font-bold text-black font-nunito mb-4'>
						Выполнить сброс пароля
					</h1>
					<p className='font-nunito text-black'>
						Введите адрес электронной почты, использованный при регистрации. Мы
						отправим вам ссылку для входа и сброса пароля. Если вы
						зарегистрировались с помощью адреса электронной почты родителей, мы
						отправим им эту ссылку.
					</p>
				</div>
				<div className='space-y-2'>
					<LabelComponent text={'Email'}></LabelComponent>
					<Input placeholder='user@mail.com'></Input>
				</div>

				<ButtonSubmit
					variant='primary'
					text={'Отправить ссылку для сброса'}
					href=''
				/>
			</form>
		</div>
	)
}
