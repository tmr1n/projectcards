// ─── ПОТОК ДАННЫХ ───────────────────────────────────────────────────────────
//
//   Этот файл получает правила из constants/validation.ts и строит Zod-схемы.
//
//   constants/validation.ts          ← правила (regex, длины, сообщения)
//          ↓ импорт
//   auth.schema.ts (этот файл)       ← Zod-схемы собираются из правил
//          ↓ импорт registerSchema / loginSchema
//   RegistrationForm / LoginForm     ← useForm({ resolver: zodResolver(schema) })
//          ↓
//   errors.field.message             ← одна ошибка Zod над полем (через LabelComponent)
//
//   Параллельно: constants/validation.ts → PASSWORD_HINTS / USERNAME_HINTS
//   → тоже идут в RegistrationForm, но уже для списка hints под полем (не через Zod).
//
// ────────────────────────────────────────────────────────────────────────────

import { z } from 'zod'
import {
	PASSWORD_VALIDATION,
	USERNAME_VALIDATION
} from '@/constants/validation'

// Сообщения в схемах — КЛЮЧИ переводов (auth.validation), формы переводят при показе
export const loginSchema = z.object({
	// Login accepts email OR username, server handles format check
	email: z.string().min(1, 'loginIdentifierRequired'),
	password: z.string().min(1, 'passwordRequired')
})

export const registerSchema = z
	.object({
		email: z.string().email('emailInvalid'),
		username: z
			.string()
			.min(USERNAME_VALIDATION.minLength, USERNAME_VALIDATION.minLengthMessage)
			.max(USERNAME_VALIDATION.maxLength, USERNAME_VALIDATION.maxLengthMessage)
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
			message: 'termsRequired'
		})
	})
	.refine(d => d.password === d.confirmPassword, {
		message: 'passwordsMismatch',
		path: ['confirmPassword']
	})

export const forgotPasswordSchema = z.object({
	email: z.string().email('emailInvalid')
})

export const changePasswordSchema = z
	.object({
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
		confirmPassword: z.string()
	})
	.refine(d => d.password === d.confirmPassword, {
		message: 'passwordsMismatch',
		path: ['confirmPassword']
	})

export const changeUsernameSchema = z.object({
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
		)
})
export type ChangeUsernameFormData = z.infer<typeof changeUsernameSchema>

export type LoginFormData = z.infer<typeof loginSchema>
export type RegisterFormData = z.infer<typeof registerSchema>
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>
