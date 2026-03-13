// PasswordInput — поле ввода пароля с кнопкой показать/скрыть.
//
// ИЗМЕНЕНИЯ: убран React.forwardRef (React 19).
// ref теперь просто деструктурируется из пропсов и передаётся в InputBase.

import { Eye, EyeOff } from 'lucide-react'
import type React from 'react'
import { useState } from 'react'
import { InputBase } from './InputBase'
import type { IPasswordInputProps } from '@/shared/types/form.types'

type TPasswordInputProps = IPasswordInputProps & {
	ref?: React.Ref<HTMLInputElement>
}

export function PasswordInput({ error, ref, ...props }: TPasswordInputProps) {
	// useState — локальное состояние: пароль виден или скрыт
	const [showPassword, setShowPassword] = useState(false)

	return (
		<div className='relative'>
			{/* type меняется динамически: 'password' скрывает символы, 'text' — показывает */}
			<InputBase
				ref={ref}
				type={showPassword ? 'text' : 'password'}
				error={error}
				placeholder='••••••••'
				className='pr-12' // отступ справа чтобы текст не залезал под кнопку глаза
				{...props}
			/>

			{/* Кнопка переключения видимости пароля */}
			<button
				type='button' // ВАЖНО: type='button' чтобы не отправлять форму при клике!
				onClick={() => setShowPassword(prev => !prev)} // prev — предыдущее значение
				className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer focus:outline-none'
				aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
			>
				{/* Условный рендер: разная иконка в зависимости от состояния */}
				{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
			</button>
		</div>
	)
}
