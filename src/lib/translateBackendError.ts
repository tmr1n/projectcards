import { getTranslations } from 'next-intl/server'
import type { ApiError } from './api'

const FIELD_ERROR_MAP: Record<string, string> = {
	'Email is already taken': 'emailTaken',
	'Username is already taken': 'usernameTaken',
	'Passwords do not match': 'passwordsMismatch',
}

export async function translateApiError(err: ApiError): Promise<{
	message: string
	fieldErrors?: Record<string, string[]>
}> {
	const t = await getTranslations('auth.serverErrors')

	// Статус-код надёжнее строки сообщения — NestJS может менять формат
	let message: string
	if (err.message === 'Invalid or expired reset token') {
		message = t('invalidResetToken')
	} else if (err.message === 'Invalid or expired verification token') {
		message = t('invalidVerificationToken')
	} else {
		switch (err.statusCode) {
			case 401:
				message = t('invalidCredentials')
				break
			case 404:
				message = t('userNotFound')
				break
			default:
				message = t('serverError')
		}
	}

	const fieldErrors = err.fieldErrors
		? Object.fromEntries(
				Object.entries(err.fieldErrors).map(([field, messages]) => [
					field,
					messages.map(msg => {
						const key = FIELD_ERROR_MAP[msg]
						return key ? t(key) : msg
					})
				])
			)
		: undefined

	return { message, fieldErrors }
}
