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

import { HomePageSkeleton } from '@/components/ui/skeletons/HomePageSkeleton'

export default function Loading() {
	return <HomePageSkeleton />
}
