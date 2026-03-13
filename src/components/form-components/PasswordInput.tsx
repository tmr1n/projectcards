// components/form-components/PasswordInput.tsx
import { Eye, EyeOff } from 'lucide-react'
import React, { useState } from 'react'
import { InputBase } from './InputBase'
import type { IPasswordInputProps } from '@/shared/types/form.types'

const PasswordInput = React.forwardRef<HTMLInputElement, IPasswordInputProps>(
  ({ error, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false)

    return (
      <div className='relative'>
        <InputBase
          ref={ref}
          type={showPassword ? 'text' : 'password'}
          error={error}
          placeholder='••••••••'
          className='pr-12'
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
)

PasswordInput.displayName = 'PasswordInput'
export { PasswordInput }
