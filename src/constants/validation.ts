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
