'use client'

import { Check, ChevronDown, Globe } from 'lucide-react'
import { useLocale } from 'next-intl'
import { useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { usePathname, useRouter } from '@/i18n/navigation'

// Автонимы — названия языков на них самих (их НЕ переводят).
const LOCALES = [
	{ code: 'de', name: 'Deutsch' },
	{ code: 'en', name: 'English' },
	{ code: 'ru', name: 'Русский' }
] as const

export function LocaleSwitcher({
	dropUp = false,
	className = ''
}: {
	dropUp?: boolean
	className?: string
}) {
	const locale = useLocale()
	const router = useRouter()
	const pathname = usePathname()
	const searchParams = useSearchParams()
	const [open, setOpen] = useState(false)
	const ref = useRef<HTMLDivElement>(null)

	// Закрытие по клику вне компонента
	useEffect(() => {
		if (!open) return
		const onClick = (e: MouseEvent) => {
			if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
		}
		document.addEventListener('mousedown', onClick)
		return () => document.removeEventListener('mousedown', onClick)
	}, [open])

	const change = (code: string) => {
		if (code === locale) {
			setOpen(false)
			return
		}
		// Запоминаем выбор на год — middleware по этой cookie уводит на нужную
		// локаль даже при навигации без префикса (router.push, прямые заходы).
		document.cookie = `NEXT_LOCALE=${code}; path=/; max-age=31536000; samesite=lax`
		// Сохраняем текущий путь и query-параметры (например ?id= на flash-card)
		const query = Object.fromEntries(searchParams.entries())
		router.replace({ pathname, query }, { locale: code })
		setOpen(false)
	}

	return (
		<div ref={ref} className={`relative ${className}`}>
			<button
				type='button'
				onClick={() => setOpen(v => !v)}
				aria-haspopup='listbox'
				aria-expanded={open}
				aria-label='Sprache wählen'
				className='flex items-center gap-1.5 px-3 py-2 rounded-full border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer'
			>
				<Globe size={16} />
				<span className='uppercase'>{locale}</span>
				<ChevronDown
					size={14}
					className={`transition-transform ${open ? 'rotate-180' : ''}`}
				/>
			</button>

			{open && (
				<ul
					role='listbox'
					className={`absolute right-0 z-50 min-w-40 bg-white border border-gray-200 rounded-xl shadow-lg py-1 ${
						dropUp ? 'bottom-full mb-2' : 'top-full mt-2'
					}`}
				>
					{LOCALES.map(l => (
						<li key={l.code}>
							<button
								type='button'
								onClick={() => change(l.code)}
								className='w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer'
							>
								<span className='uppercase font-semibold w-6 text-gray-500'>
									{l.code}
								</span>
								<span className='flex-1 text-left'>{l.name}</span>
								{l.code === locale && (
									<Check size={14} className='text-violet-600' />
								)}
							</button>
						</li>
					))}
				</ul>
			)}
		</div>
	)
}
