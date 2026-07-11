import { createNavigation } from 'next-intl/navigation'
import { routing } from './routing'

// Локале-осведомлённые обёртки над навигацией Next.js.
// usePathname() отдаёт путь БЕЗ префикса локали, а useRouter().replace(path, { locale })
// корректно меняет язык, сохраняя текущую страницу.
export const { Link, redirect, usePathname, useRouter, getPathname } =
	createNavigation(routing)
