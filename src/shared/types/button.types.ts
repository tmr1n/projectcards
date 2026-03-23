import type { Url } from 'next/dist/shared/lib/router/router'
import React from 'react'

// Общие типы (DRY)
export type TButtonVariant = 'primary' | 'secondary' | 'third'
export type TButtonContent = {
	text: string
	icon?: React.ReactNode
}
export type TButtonBase = {
	variant?: TButtonVariant
	className?: string
}

// Специфичные для каждой кнопки
export interface IButtonLinkProps extends TButtonContent, TButtonBase {
	href: Url // Только у Link — обязательный
}

export interface IButtonSubmitProps extends TButtonContent, TButtonBase {
	disabled?: boolean
	// href нет — только у Link
}
export interface IButtonPrimitiveProps
	extends TButtonBase, React.ButtonHTMLAttributes<HTMLButtonElement> {
	children: React.ReactNode
}

export interface IBackButtonProps {
	href?: string
	onClick?: () => void
}

export interface ICloseButtonProps extends IBackButtonProps {
	href: string // Теперь обязательный, т.к. next/link требует
}
