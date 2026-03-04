import { type ReactNode } from 'react'

export interface ICheckbox {
	text: string | ReactNode
}

export interface IInputComponentProps {
	placeholder?: string
}

export interface ILabelProps {
	text: string | ReactNode
}

export interface ILineComponentProps {
	text: string
}

export interface IPasswordInputProps {}

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
