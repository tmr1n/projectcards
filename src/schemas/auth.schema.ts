// src/lib/schemas/auth.schema.ts
import { z } from 'zod'

export interface IAuthData {
	email: string
	password: string
	loginSchema: z.ZodObject<{
		email: z.ZodString
		password: z.ZodString
	}>
}
export const loginSchema = z.object({
	email: z.string().email('Некорректный email'),
	password: z.string().min(8, 'Минимум 8 символов')
})

export const registerSchema = loginSchema
	.extend({
		username: z.string().min(3),
		confirmPassword: z.string()
	})
	.refine(d => d.password === d.confirmPassword, {
		message: 'Пароли не совпадают',
		path: ['confirmPassword']
	})
