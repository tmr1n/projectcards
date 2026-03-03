import Link from 'next/link'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { FaYandex } from 'react-icons/fa'
import { FcGoogle } from 'react-icons/fc'
import { TiVendorMicrosoft } from 'react-icons/ti'
import { ButtonSubmit } from '@/components/buttons/ButtonSubmit'
import { Input } from '@/components/form-components/Input'
import { PasswordInput } from '@/components/form-components/PasswordInput'
import { ButtonLink } from '../buttons/ButtonLink'
import { LabelComponent } from '../form-components/LabelComponent'
import { LineComponent } from '../form-components/Line'

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
				className='w-full max-w-lg flex flex-col gap-4'
			>
				<ButtonSubmit
					variant='secondary'
					text={'Продолжить с Google'}
					icon={<FcGoogle />}
					// href=''
				/>

				<ButtonSubmit
					variant='secondary'
					text={'Продолжить с Microsoft'}
					icon={<TiVendorMicrosoft />}
					// href=''
				/>

				<ButtonSubmit
					variant='secondary'
					text={'Продолжить с Yandex'}
					icon={<FaYandex />}
					// href=''
				/>

				<LineComponent text='или адрес эл. почты'></LineComponent>

				<div className='space-y-2'>
					<LabelComponent text={'Email или имя пользователя'}></LabelComponent>
					<Input placeholder='Введите адрес эл. почты или имя пользователя'></Input>
				</div>

				<div className='space-y-2 pb-2'>
					<div className='flex items-center justify-between'>
						<LabelComponent text='Пароль'></LabelComponent>
						<LabelComponent
							text={
								<>
									<Link
										href='/forgot-password'
										className='font-bold text-blue-600 hover:text-blue-800'
									>
										Забыли пароль?
									</Link>
								</>
							}
						></LabelComponent>
					</div>
					<PasswordInput />
				</div>

				{errors.exampleRequired && (
					<span className='text-red-500 text-sm mt-1'>
						{errors.exampleRequired.message}
					</span>
				)}

				<ButtonSubmit variant='primary' text={'Вход'} />

				{/* //linkbutton */}
				<ButtonLink
					variant='secondary'
					text={'Впервые в LangCards? Зарегистрироваться'}
					href='/registration'
				/>
			</form>
		</div>
	)
}
