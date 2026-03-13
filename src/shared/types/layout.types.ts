// layout.types.ts — типы для компонентов-обёрток (layout'ов).
// Здесь живут пропсы AuthPageLayout, FirstSideComponent и AnimatedPage.
// Вынесено из form.types.ts чтобы разделить UI-формы и layout-компоненты.

import type { ReactNode } from 'react'

// Пропсы для AuthPageLayout — двухколоночный layout страниц авторизации:
// левая колонка = декоративная панель, правая = форма с кнопками навигации
export interface IAuthPageLayoutProps {
	sideText: ReactNode    // Большой текст на левой панели (иногда JSX)
	topButtons?: ReactNode // Кнопки вверху правой части (BackButton, CloseButton)
	navigationTabs?: ReactNode // Вкладки "Вход" / "Зарегистрироваться"
	children: ReactNode    // Сама форма (LoginForm, RegistrationForm и т.д.)
}

// Пропсы для FirstSideComponent — левая декоративная панель с фоновым изображением
export interface IFirstSideComponentProps {
	text: string | ReactNode // Большой заголовок на панели
}

// Пропсы для AnimatedPage — обёртка страницы с анимацией появления
// (используется если нужна анимация на отдельных страницах)
export interface IAnimatedPageProps {
	children: ReactNode
}
