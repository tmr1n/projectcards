import { useEffect, useState } from 'react'

/**
 * Delays showing an error by `delay` ms, but clears it immediately
 * when the value is empty or the error resolves.
 *
 * UX: error appears "after a moment" of typing, disappears instantly on fix/clear.
 */
export function useDelayedError(
	rawError: string | null | undefined,
	value: string,
	delay = 500
): string | null {
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		// Never show error for empty field
		const target = value.length > 0 ? (rawError ?? null) : null

		if (!target) {
			setError(null)
			return
		}

		const timer = setTimeout(() => setError(target), delay)
		return () => clearTimeout(timer)
	}, [rawError, value, delay])

	return error
}
