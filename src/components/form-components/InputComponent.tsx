// components/form-components/InputComponent.tsx
import React from 'react'
import { InputBase } from './InputBase'
import type { IInputComponentProps } from '@/shared/types/form.types'

const InputComponent = React.forwardRef<HTMLInputElement, IInputComponentProps>(
	(props, ref) => <InputBase ref={ref} {...props} />
)

InputComponent.displayName = 'InputComponent'
export { InputComponent }
