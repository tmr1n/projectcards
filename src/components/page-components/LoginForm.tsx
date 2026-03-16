// LoginForm — форма входа в систему.
//
// СХЕМА РАБОТЫ ВАЛИДАЦИИ:
// 1. useForm({ resolver: zodResolver(loginSchema) })
//    → react-hook-form при каждом изменении поля вызывает Zod для проверки данных
// 2. Zod проверяет данные по loginSchema и заполняет formState.errors
// 3. watch('email') → следим за текущим значением поля в реальном времени
// 4. useDelayedError(errors.email?.message, emailValue, 500, isSubmitted)
//    → показываем ошибку через 500мс (не сразу), но убираем мгновенно при исправлении
//    → isSubmitted: если уже нажали Submit — показываем ошибки сразу и для пустых полей

'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { FaYandex } from 'react-icons/fa'
import { FcGoogle } from 'react-icons/fc'
import { TiVendorMicrosoft } from 'react-icons/ti'
import { useDelayedError } from '@/hooks/useDelayedError'
import { ButtonLink } from '@/components/buttons/ButtonLink'
import { ButtonSubmit } from '@/components/buttons/ButtonSubmit'
import { InputComponent } from '@/components/form-components/InputComponent'
import { LabelComponent } from '@/components/form-components/LabelComponent'
import { LineComponent } from '@/components/form-components/LineComponent'
import { PasswordInput } from '@/components/form-components/PasswordInput'
import { FormLoader } from '@/components/ui/FormLoader'
import { loginSchema, type LoginFormData } from '@/schemas/auth.schema'
import { useAuthStore } from '@/store/authStore'

export function LoginForm() {
	const login = useAuthStore(state => state.login)
	const isLoading = useAuthStore(state => state.isLoading)

	const error = useAuthStore(state => state.error)
	const clearError = useAuthStore(state => state.clearError)

	// useForm — главный хук react-hook-form:
	//   register  — привязывает <input> к форме (value, onChange, onBlur, ref)
	//   handleSubmit — оборачивает onSubmit: блокирует при ошибках валидации
	//   watch     — подписывается на текущее значение поля (нужно для useDelayedError)
	//   errors    — объект с ошибками { email: { message: 'текст' } }
	//   isSubmitted — true после первой попытки нажать Submit
	const {
		register,
		handleSubmit,
		watch,
		formState: { errors, isSubmitted }
	} = useForm<LoginFormData>({
		// mode: 'onChange' — Zod запускается при каждом нажатии клавиши
		// (альтернатива: 'onBlur' — только при потере фокуса)
		mode: 'onChange',
		// zodResolver "переводит" результат Zod в формат react-hook-form
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: '',
			password: ''
		}
	})

	// watch() возвращает актуальное значение поля прямо сейчас
	// ?? '' — если undefined (до первого ввода), используем пустую строку
	const emailValue = watch('email') ?? ''
	const passwordValue = watch('password') ?? ''

	// useDelayedError — пропускаем ошибку через задержку для лучшего UX
	// errors.email?.message — ?. безопасный доступ: если errors.email нет → undefined
	// isSubmitted — после Submit показываем ошибки немедленно и даже для пустых полей
	const emailLabelError = useDelayedError(
		errors.email?.message,
		emailValue,
		500,
		isSubmitted
	)
	const passwordLabelError = useDelayedError(
		errors.password?.message,
		passwordValue,
		500,
		isSubmitted
	)

	// onSubmit — вызывается handleSubmit ТОЛЬКО если Zod сказал что данные валидны
	const onSubmit = async (data: LoginFormData) => {
		await login(data.email, data.password)
		//TODO: После успешного входа — router.push('/dashboard')
	}

	return (
		// relative — нужен для FormLoader (он позиционируется absolute внутри)
		<div className='relative bg-white flex items-center justify-center p-8'>
			{/* Лоадер покрывает форму во время отправки */}
			<FormLoader isLoading={isLoading} />

			<form
				onSubmit={handleSubmit(onSubmit)}
				className='w-full max-w-lg flex flex-col gap-4'
			>
				{/* TODO: Кнопки OAuth — войти через соц. сети (пока не реализованы) */}
				<ButtonSubmit
					variant='secondary'
					text='Продолжить с Google'
					icon={<FcGoogle />}
				/>
				<ButtonSubmit
					variant='secondary'
					text='Продолжить с Microsoft'
					icon={<TiVendorMicrosoft />}
				/>
				<ButtonSubmit
					variant='secondary'
					text='Продолжить с Yandex'
					icon={<FaYandex />}
				/>

				<LineComponent text='или адрес эл. почты' />

				{/* Поле: Email или имя пользователя */}
				<div className='space-y-2'>
					{/* LabelComponent: если есть error → показывает его текст красным */}
					<LabelComponent
						text='Email или имя пользователя'
						error={emailLabelError}
					/>
					{/* register('email') → привязывает input к react-hook-form */}
					<InputComponent
						placeholder='Введите адрес эл. почты или имя пользователя'
						error={emailLabelError}
						{...register('email', {
							onChange: () => {
								if (error) clearError()
							}
						})}
					/>
				</div>

				{/* Поле: Пароль */}
				<div className='space-y-2 pb-2'>
					<div className='flex items-center justify-between'>
						<LabelComponent text='Пароль' error={passwordLabelError} />

						<LabelComponent
							text={
								<Link
									href='/forgot-password'
									className='font-bold text-blue-600 hover:text-blue-800 transition-colors'
								>
									Забыли пароль?
								</Link>
							}
						/>
					</div>

					<PasswordInput
						error={passwordLabelError}
						{...register('password', {
							onChange: () => {
								if (error) clearError()
							}
						})}
					/>
				</div>

				{error && <p className='text-red-500 text-sm'>{error}</p>}

				<ButtonSubmit variant='primary' text='Вход' />

				<ButtonLink
					variant='secondary'
					text='Впервые в LangCards? Зарегистрироваться'
					href='/registration'
				/>
			</form>
		</div>
	)
}
