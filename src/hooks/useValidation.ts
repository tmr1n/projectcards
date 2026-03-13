// УСТАРЕЛО (deprecated): этот хук больше не используется.
//
// ПОЧЕМУ убрали:
// Хук useValidation просто оборачивал useForm — лишняя абстракция без пользы.
// Теперь каждая форма вызывает useForm напрямую (как в RegistrationForm и ForgotPasswordForm).
// Единый подход = проще читать код.
//
// БЫЛО: const form = useValidation()
// СТАЛО: const form = useForm({ resolver: zodResolver(loginSchema), ... })
//
// Файл оставлен чтобы не сломать возможные импорты.
// Можно удалить когда убедитесь что нигде не используется.

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { loginSchema } from '@/schemas/auth.schema'
import type { LoginFormData } from '@/schemas/auth.schema'

export type { LoginFormData }

/** @deprecated Используй useForm напрямую с zodResolver(loginSchema) */
export const useValidation = () => {
	return useForm<LoginFormData>({
		mode: 'onChange',
		defaultValues: { email: '', password: '' },
		resolver: zodResolver(loginSchema),
	})
}
