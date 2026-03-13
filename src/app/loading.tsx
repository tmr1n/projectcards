// loading.tsx — специальный файл Next.js App Router для состояния загрузки.
//
// ВАЖНО: это НЕ связано с отправкой форм!
// Этот файл показывается пока Next.js загружает JS-код страницы или данные.
//
// Когда срабатывает:
//   - Переход на новую страницу (пока Next.js подгружает компоненты)
//   - async Server Components (пока сервер загружает данные из БД/API)
//
// Как работает технически:
//   Next.js автоматически оборачивает страницы в <Suspense fallback={<Loading />}>.
//   Пока содержимое страницы не готово — показывается Loading.
//   Когда готово — Loading заменяется настоящей страницей.
//
// В продакшне здесь обычно размещают skeleton-экраны (заглушки в форме контента).
// Сейчас — простой спиннер.

export default function Loading() {
	return (
		<div className='flex items-center justify-center min-h-screen'>
			{/* Спиннер — такой же как в FormLoader для консистентности */}
			<div className='w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin' />
		</div>
	)
}
