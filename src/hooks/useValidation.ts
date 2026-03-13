import { zodResolver } from '@hookform/resolvers/zod'
import type { UseFormReturn } from 'react-hook-form'
import { useForm } from 'react-hook-form'
// useValidation.ts
import { loginSchema } from '@/schemas/auth.schema'

const form = useForm({ resolver: zodResolver(loginSchema) })

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

//
