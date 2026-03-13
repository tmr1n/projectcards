import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { loginSchema } from '@/schemas/auth.schema'
import type { LoginFormData } from '@/schemas/auth.schema'

export type { LoginFormData }

export const useValidation = () => {
	return useForm<LoginFormData>({
		mode: 'onChange',
		defaultValues: {
			email: '',
			password: '',
		},
		resolver: zodResolver(loginSchema),
	})
}
