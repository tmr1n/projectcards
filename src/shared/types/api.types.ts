// api.types.ts — типы для работы с API (заготовка).
// Подключим и заполним когда будем интегрировать backend.
//
// Зачем выносить в отдельный файл?
// Чтобы типы ответов сервера не смешивались с типами UI-компонентов.

// Универсальный тип успешного ответа от сервера.
// T — generic-параметр: указывает какие данные придут в поле data.
// Примеры использования: IApiResponse<IUser>, IApiResponse<IAuthTokens>
export interface IApiResponse<T> {
	data: T
	message: string
	success: boolean
}

// Тип ошибки от сервера (4xx, 5xx)
export interface IApiError {
	message: string  // Человекочитаемое сообщение
	statusCode: number // HTTP код: 400, 401, 403, 404, 500 и т.д.
	// Ошибки по конкретным полям формы (например, { email: ['уже занят'] })
	errors?: Record<string, string[]>
}
