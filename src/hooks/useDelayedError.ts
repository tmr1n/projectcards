import { useEffect, useState } from 'react'

/**
 * Хук для отображения ошибок с задержкой.
 *
 * ЗАЧЕМ нужен:
 * Без задержки ошибка "Недопустимый email" мигает при каждом нажатии клавиши.
 * С задержкой — ошибка появляется только когда пользователь "остановился" (500мс).
 *
 * КАК работает:
 * - Ошибка ПОЯВЛЯЕТСЯ через delay мс (чтобы не мешать при быстрой печати)
 * - Ошибка ИСЧЕЗАЕТ мгновенно (как только пользователь исправился или очистил поле)
 * - После отправки формы (forceShow=true) — показываем ошибку сразу и даже для пустых полей
 *
 * @param rawError  - Текст ошибки от Zod/react-hook-form (undefined/null = нет ошибки)
 * @param value     - Текущее значение поля (нужно чтобы знать: поле пустое или нет)
 * @param delay     - Задержка в мс перед показом ошибки. По умолчанию 500мс.
 * @param forceShow - Показывать ошибку немедленно, даже для пустых полей.
 *                    Используйте isSubmitted из formState — после нажатия Submit
 *                    ошибки должны показываться сразу.
 */
export function useDelayedError(
	rawError: string | null | undefined,
	value: string,
	delay = 500,
	forceShow = false
): string | null {
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		const rawErrorText = rawError ?? null

		// РЕЖИМ ПОСЛЕ SUBMIT: показываем ошибку немедленно, игнорируем пустые поля
		if (forceShow) {
			setError(rawErrorText)
			return
		}

		// ОБЫЧНЫЙ РЕЖИМ: не показываем ошибку для пустых полей
		// Логика: пустое поле — пользователь ещё ничего не ввёл, не нужно пугать
		if (value.length === 0) {
			setError(null)
			return
		}

		// Если ошибки нет → сбрасываем МГНОВЕННО (хорошая UX: быстрый позитивный фидбек)
		if (!rawErrorText) {
			setError(null)
			return
		}

		// Если ошибка есть → показываем с задержкой (чтобы не мигало при печати)
		// setTimeout возвращает ID таймера — он нужен для очистки в return
		const timer = setTimeout(() => setError(rawErrorText), delay)

		// Функция очистки: вызывается когда зависимости (rawError, value) изменились
		// до того как истёк таймер. Без этого — старые ошибки могут "проскочить".
		return () => clearTimeout(timer)
	}, [rawError, value, delay, forceShow])

	return error
}
