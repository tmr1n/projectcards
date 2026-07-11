import createMiddleware from 'next-intl/middleware'
import { NextResponse, type NextRequest } from 'next/server'
import { routing } from './i18n/routing'

const intlMiddleware = createMiddleware(routing)

export function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl
	const token = request.cookies.get('token')?.value

	// Есть ли в пути префикс локали (/de, /ru, /en)?
	const hasLocalePrefix = /^\/(ru|en|de)(\/|$)/.test(pathname)

	// Локале-осведомлённый дефолт: путь без префикса, но пользователь ранее
	// выбрал язык (cookie NEXT_LOCALE) — уводим на него. Так локаль держится
	// и при навигации без префикса (router.push), и на прямых заходах.
	// Нет cookie → падаем в дефолт (de) ниже, через intlMiddleware.
	if (!hasLocalePrefix) {
		const saved = request.cookies.get('NEXT_LOCALE')?.value
		if (saved === 'ru' || saved === 'en') {
			const url = request.nextUrl.clone()
			url.pathname = `/${saved}${pathname}`
			return NextResponse.redirect(url)
		}
	}

	// Убираем префикс локали, чтобы проверить реальный путь
	const localePrefix = /^\/(ru|en|de)/
	const strippedPath = pathname.replace(localePrefix, '') || '/'

	const isProtectedRoute =
		strippedPath.startsWith('/dashboard') || strippedPath.startsWith('/profile')
	const isAuthPage = strippedPath.startsWith('/login')

	if (isProtectedRoute && !token) {
		return NextResponse.redirect(new URL('/login', request.url))
	}

	if (token && isAuthPage) {
		return NextResponse.redirect(new URL('/dashboard', request.url))
	}

	return intlMiddleware(request)
}

export const config = {
	matcher: [
		// Пропускаем внутренние пути Next.js, статические файлы и API роуты
		'/((?!_next|_vercel|api|.*\\..*).*)'
	]
}
