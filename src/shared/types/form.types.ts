// form.types.ts — пропсы для UI-компонентов форм.
// Только поля ввода, лейблы, разделители.
// Layout-типы (AuthPageLayout, FirstSideComponent, AnimatedPage) → layout.types.ts

import { type InputHTMLAttributes, type ReactNode } from 'react'

// Базовый тип — псевдоним для всех стандартных HTML-атрибутов <input>.
// type (не interface) — потому что это просто псевдоним, не расширяемая сущность.
export type THTMLInputProps = InputHTMLAttributes<HTMLInputElement>

// Пропсы для Checkbox — расширяем нативный input[type=checkbox].
// text — что отображается рядом с галочкой (может быть JSX: текст со ссылками)
export interface ICheckbox extends InputHTMLAttributes<HTMLInputElement> {
	text: string | ReactNode
}

// Пропсы для InputComponent — обёртка над нативным <input>
export interface IInputComponentProps extends THTMLInputProps {
	placeholder?: string
	error?: string | null // null/undefined = нет ошибки, строка = текст ошибки
}

// Пропсы для LabelComponent — подпись к полю ввода.
// Если передан error — лейбл краснеет и показывает текст ошибки вместо text.
export interface ILabelProps {
	text: string | ReactNode // Обычный текст или JSX (например ссылка "Забыли пароль?")
	error?: string | null
	className?: string
}

// Пропсы для LineComponent — горизонтальный разделитель "или адрес эл. почты"
export interface ILineComponentProps {
	text: string
}

// Пропсы для PasswordInput — инпут с кнопкой показать/скрыть пароль
export interface IPasswordInputProps extends THTMLInputProps {
	error?: string | null
}

// Пропсы для NavBar — вкладки навигации "Вход" / "Зарегистрироваться"
export interface INavBarProps {
	text: string
	href: string       // Обязательный — Next.js Link требует href
	onClick?: () => void
}
