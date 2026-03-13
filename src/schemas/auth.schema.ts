import { z } from 'zod'
import {
	PASSWORD_VALIDATION,
	USERNAME_VALIDATION
} from '@/constants/validation'

export const loginSchema = z.object({
	// Login accepts email OR username, server handles format check
	email: z.string().min(1, 'Введите email или имя пользователя'),
	password: z.string().min(1, 'Введите пароль')
})

export const registerSchema = z
	.object({
		email: z.string().email('Недопустимый адрес электронной почты.'),
		username: z
			.string()
			.min(USERNAME_VALIDATION.minLength, USERNAME_VALIDATION.minLengthMessage)
			.regex(
				USERNAME_VALIDATION.startsWithLatin,
				USERNAME_VALIDATION.startsWithLatinMessage
			)
			.regex(
				USERNAME_VALIDATION.onlyValidChars,
				USERNAME_VALIDATION.onlyValidCharsMessage
			),
		password: z
			.string()
			.min(PASSWORD_VALIDATION.minLength, PASSWORD_VALIDATION.minLengthMessage)
			.regex(
				PASSWORD_VALIDATION.hasUppercase,
				PASSWORD_VALIDATION.hasUppercaseMessage
			)
			.regex(
				PASSWORD_VALIDATION.hasSpecial,
				PASSWORD_VALIDATION.hasSpecialMessage
			),
		confirmPassword: z.string(),
		newsletter: z.boolean().optional(),
		terms: z.boolean().refine(val => val === true, {
			message:
				'Примите условия предоставления услуг и политику конфиденциальности LangCards, чтобы продолжить.'
		})
	})
	.refine(d => d.password === d.confirmPassword, {
		message: 'Пароли не совпадают',
		path: ['confirmPassword']
	})

export const forgotPasswordSchema = z.object({
	email: z.string().email('Недопустимый адрес электронной почты.')
})

export type LoginFormData = z.infer<typeof loginSchema>
export type RegisterFormData = z.infer<typeof registerSchema>
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>
