import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
	locales: ['ru', 'en', 'de'],
	defaultLocale: 'de',
	// Всегда стартуем с немецкого (не подстраиваемся под язык браузера).
	// Захочет другой — переключит вручную (переключатель языков).
	localeDetection: false
})
