import createMiddleware from 'next-intl/middleware'
import { type NextRequest, NextResponse } from 'next/server'
import { routing } from './i18n/routing'

const intlMiddleware = createMiddleware(routing)

export function middleware(request: NextRequest) {
	const token = request.cookies.get('token')?.value

	// Убираем префикс локали, чтобы проверить реальный путь
	const localePrefix = /^\/(ru|en|de)/
	const strippedPath = request.nextUrl.pathname.replace(localePrefix, '') || '/'

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
		// Пропускаем внутренние пути Next.js и статические файлы
		'/((?!_next|_vercel|.*\\..*).*)'
	]
}
