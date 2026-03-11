// components/form-components/PasswordInput.tsx
import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import { InputBase } from './InputBase'
import type { IPasswordInputProps } from '@/shared/types/form.types'

export function PasswordInput({
	error,
	...props
}: IPasswordInputProps & { error?: string | null }) {
	const [showPassword, setShowPassword] = useState(false)

	return (
		<div className='relative'>
			<InputBase
				type={showPassword ? 'text' : 'password'}
				error={error}
				placeholder='••••••••'
				className='pr-12' // переопределяем padding-right
				{...props}
			/>
			<button
				type='button'
				onClick={() => setShowPassword(!showPassword)}
				className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none transition-colors cursor-pointer'
			>
				{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
			</button>
		</div>
	)
}
