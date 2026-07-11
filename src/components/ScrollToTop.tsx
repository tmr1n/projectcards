'use client'

import { useEffect } from 'react'

// Сбрасывает скролл в начало при монтировании страницы.
// Нужно на серверных страницах (terms/datenschutz), куда переходят с длинных
// форм — иначе позиция скролла переносится и страница открывается «в конце».
export function ScrollToTop() {
	useEffect(() => {
		window.scrollTo(0, 0)
	}, [])
	return null
}
