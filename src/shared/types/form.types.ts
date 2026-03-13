import { type InputHTMLAttributes, type ReactNode } from 'react'

export type HTMLInputProps = InputHTMLAttributes<HTMLInputElement>

export interface ICheckbox extends InputHTMLAttributes<HTMLInputElement> {
	text: string | ReactNode
}

export interface IInputComponentProps extends HTMLInputProps {
	placeholder?: string
	error?: string | null
}

export interface ILabelProps {
	text: string | ReactNode
	error?: string | null
	className?: string
}

export interface ILineComponentProps {
	text: string
}

export interface IPasswordInputProps extends HTMLInputProps {
	error?: string | null
}

export interface IAuthPageLayoutProps {
	sideText: ReactNode
	topButtons?: ReactNode
	navigationTabs?: ReactNode
	children: ReactNode
}

export interface IFirstSideComponentProps {
	text: string | React.ReactNode
}

export interface INavBarProps {
	text: string
	href: string // теперь обязательно, т.к. next/link требует

	onClick?: () => void
}

export interface IAnimatedPageProps {
	children: ReactNode
}
