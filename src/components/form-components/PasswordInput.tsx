import cn from 'clsx'
import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'

interface IPasswordInputProps {}

export function PasswordInput({}: IPasswordInputProps) {
	const [showPassword, setShowPassword] = useState(false)

	return (
		<div className='relative'>
			<input
				type={showPassword ? 'text' : 'password'}
				className={cn(
					'w-full h-12.5 px-4 py-3.5  pr-12 border-2 border-transparent rounded-lg bg-[#f8f9fa] text-[16px] text-[#2d3748] leading-5.5 transition-all duration-300 ease-in-out',
					'placeholder:text-[#8e9aaf]',
					'focus:border-[#007bff] focus:bg-white focus:shadow-[0_0_0_3px_rgba(0,123,255,0.1)] focus:outline-none'
				)}
				placeholder='••••••••'
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
