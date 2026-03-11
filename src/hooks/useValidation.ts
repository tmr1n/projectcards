import type { UseFormReturn } from 'react-hook-form'
import { useForm } from 'react-hook-form'

export interface ILoginFormData {
	email: string
	password: string
}

export const useValidation = (): UseFormReturn<ILoginFormData> => {
	return useForm<ILoginFormData>({
		mode: 'onChange',
		defaultValues: {
			email: '',
			password: ''
		}
	})
}
