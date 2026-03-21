// ============================================================
// providers/QueryProvider.tsx — обёртка для TanStack Query
// ============================================================
//
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ЗАЧЕМ НУЖЕН ПРОВАЙДЕР?
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//
//  QueryClientProvider — это React Context под капотом.
//  Он передаёт queryClient (мозг с кешем) вниз по дереву компонентов.
//  Любой компонент ВНУТРИ него может вызвать useQuery/useMutation
//  и получить доступ к кешу.
//
//  Если компонент вызовет useQuery вне провайдера — получит ошибку:
//  "No QueryClient set, use QueryClientProvider to set one"
//
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ПОЧЕМУ ОТДЕЛЬНЫЙ ФАЙЛ, А НЕ ПРЯМО В layout.tsx?
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//
//  layout.tsx в Next.js App Router — Server Component по умолчанию.
//  Server Components не могут использовать:
//    — useState, useEffect (хуки работают только на клиенте)
//    — любой клиентский контекст (Provider тоже клиентский код)
//
//  Поэтому выносим Provider в отдельный файл с директивой 'use client'.
//  layout.tsx рендерит <QueryProvider> как дочерний компонент —
//  сам остаётся серверным, но его children получают клиентский контекст.
//
//  Так работают все провайдеры в Next.js App Router:
//    RootLayout (Server) → QueryProvider (Client) → children
//
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ИТОГОВАЯ СХЕМА СВЯЗИ
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//
//  src/app/layout.tsx  (Server Component)
//  └── <QueryProvider>  (этот файл, 'use client')
//      └── <ReactQueryDevtools />  (только в dev режиме)
//      └── {children}  (всё приложение)
//          ├── ProfilePage
//          │   └── useQuery(['profile'])  ──→ queryClient cache
//          ├── DecksPage
//          │   └── useQuery(['decks'])    ──→ queryClient cache
//          └── DeckPage
//              └── useQuery(['decks', id]) ─→ queryClient cache
//
//  queryClient (из lib/queryClient.ts) — единый кеш для всего приложения.
//  Все useQuery видят один и тот же кеш.
//
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

'use client'

import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { queryClient } from '@/lib/queryClient'

// ─────────────────────────────────────────────────────────────
// QueryProvider
// ─────────────────────────────────────────────────────────────
//
// Принимает children — всё дерево компонентов приложения.
// Оборачивает их в QueryClientProvider передавая наш queryClient.
//
// ReactQueryDevtools — панель разработчика (только в dev).
// Показывает в браузере:
//   — все активные queryKey в кеше
//   — статус каждого запроса (fresh / stale / fetching / error)
//   — данные в кеше (можно посмотреть что пришло с бэкенда)
//   — кнопки для ручной инвалидации / refetch
//
// Иконка появится в правом нижнем углу браузера (логотип TanStack).
// В production-билде ReactQueryDevtools автоматически исчезает.

export function QueryProvider({ children }: { children: React.ReactNode }) {
	return (
		<QueryClientProvider client={queryClient}>
			{children}
			{/* initialIsOpen={false} — панель по умолчанию свёрнута */}
			<ReactQueryDevtools initialIsOpen={false} />
		</QueryClientProvider>
	)
}
