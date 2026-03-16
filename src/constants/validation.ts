// ─── ПОТОК ДАННЫХ ───────────────────────────────────────────────────────────
//
//   validation.ts  →  auth.schema.ts  →  RegistrationForm / LoginForm
//
//   Этот файл — единый источник правды для всех правил валидации.
//   Отсюда данные расходятся в двух направлениях:
//
//   1. КОНСТАНТЫ (USERNAME_VALIDATION, PASSWORD_VALIDATION)
//      └─ импортируются в auth.schema.ts
//         └─ там строятся Zod-схемы (registerSchema, loginSchema)
//            └─ Zod через zodResolver подключается к useForm в форме
//               └─ errors.field.message — одна ошибка над полем (Label)
//
//   2. HINTS (USERNAME_HINTS, PASSWORD_HINTS)
//      └─ импортируются прямо в RegistrationForm
//         └─ каждый hint содержит test() — проверяет значение в реальном времени
//            └─ failing hints показываются списком под полем (второй уровень ошибок)
//
//   ЗАЧЕМ два уровня ошибок?
//   Zod даёт одно сообщение на поле — первое нарушение.
//   Hints позволяют показать сразу все нарушенные условия одновременно.
//
// ────────────────────────────────────────────────────────────────────────────

export const USERNAME_VALIDATION = {
	minLength: 3,
	minLengthMessage:
		'Имя пользователя слишком короткое. Оно должно содержать не менее 3 символов',
	startsWithLatin: /^[A-Za-z]/,
	startsWithLatinMessage:
		'Имена пользователей должны начинаться с букв A-Z и не могут содержать символы с диакритическими знаками.',
	onlyValidChars: /^[A-Za-z][A-Za-z0-9_-]*$/,
	onlyValidCharsMessage:
		'Имя пользователя может содержать только буквы, цифры, подчеркивания и дефисы',
} as const

export const PASSWORD_VALIDATION = {
	minLength: 8,
	minLengthMessage: 'Слишком короткий пароль. Минимальная длина – 8 знаков.',
	hasUppercase: /[A-Z]/,
	hasUppercaseMessage: 'Пароль должен содержать одну большую букву.',
	hasSpecial: /[!@#$%^&*(),.?":{}|<>]/,
	hasSpecialMessage: 'Пароль должен содержать один специальный символ.',
} as const

// Used by form components to display per-condition hints below inputs
export const PASSWORD_HINTS = [
	{
		key: 'hasUppercase' as const,
		test: (v: string) => PASSWORD_VALIDATION.hasUppercase.test(v),
		message: PASSWORD_VALIDATION.hasUppercaseMessage,
	},
	{
		key: 'hasSpecial' as const,
		test: (v: string) => PASSWORD_VALIDATION.hasSpecial.test(v),
		message: PASSWORD_VALIDATION.hasSpecialMessage,
	},
]

export const USERNAME_HINTS = [
	{
		key: 'startsWithLatin' as const,
		test: (v: string) => USERNAME_VALIDATION.startsWithLatin.test(v),
		message: USERNAME_VALIDATION.startsWithLatinMessage,
	},
	{
		key: 'onlyValidChars' as const,
		test: (v: string) => USERNAME_VALIDATION.onlyValidChars.test(v),
		message: USERNAME_VALIDATION.onlyValidCharsMessage,
	},
]
