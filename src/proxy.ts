import { NextRequest, NextResponse } from 'next/server'

export function proxy(request: NextRequest) {
	const token = request.cookies.get('token')?.value
	const isAuthPage = request.nextUrl.pathname.startsWith('/login')

	// Если есть токен и пользователь идёт на /login — редирект на главную
	if (token && isAuthPage) {
		return NextResponse.redirect(new URL('/dashboard', request.url))
	}

	// Если нет токена — редирект на /login
	if (!token) {
		return NextResponse.redirect(new URL('/login', request.url))
	}

	return NextResponse.next() // пропускаем
}

// Какие роуты защищать
export const config = {
	matcher: [
		'/dashboard/:path*',
		'/profile/:path*'
		// НЕ включаем /login, /register, /api, /_next
	]
}
