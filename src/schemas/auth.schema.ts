import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Недопустимый адрес электронной почты.'),
  password: z.string().min(1, 'Введите пароль'),
})

export const registerSchema = z
  .object({
    email: z.string().email('Недопустимый адрес электронной почты.'),
    username: z
      .string()
      .min(3, 'Имя пользователя слишком короткое. Оно должно содержать не менее 3 символов')
      .regex(
        /^[A-Za-z]/,
        'Имена пользователей должны начинаться с букв A-Z и не могут содержать символы с диакритическими знаками.'
      )
      .regex(
        /^[A-Za-z][A-Za-z0-9_-]*$/,
        'Имя пользователя может содержать только буквы, цифры, подчеркивания и дефисы'
      ),
    password: z
      .string()
      .min(8, 'Слишком короткий пароль. Минимальная длина – 8 знаков.')
      .regex(/[A-Z]/, 'Пароль должен содержать одну большую букву.')
      .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Пароль должен содержать один специальный символ.'),
    confirmPassword: z.string(),
    newsletter: z.boolean().optional(),
    terms: z.boolean().refine(val => val === true, {
      message:
        'Примите условия предоставления услуг и политику конфиденциальности LangCards, чтобы продолжить.',
    }),
  })
  .refine(d => d.password === d.confirmPassword, {
    message: 'Пароли не совпадают',
    path: ['confirmPassword'],
  })

export type LoginFormData = z.infer<typeof loginSchema>
export type RegisterFormData = z.infer<typeof registerSchema>
