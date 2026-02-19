import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

// Функция cn объединяет классы, используя clsx для условного объединения и twMerge для оптимизации классов Tailwind CSS. Это позволяет легко управлять классами в компонентах React, обеспечивая чистый и оптимизированный код.
