// api.types.ts — типы для работы с API (заготовка).
// Подключим и заполним когда будем интегрировать backend.
//
// Зачем выносить в отдельный файл?
// Чтобы типы ответов сервера не смешивались с типами UI-компонентов.

// Универсальный тип успешного ответа от сервера.
// T — generic-параметр: указывает какие данные придут в поле data.
// Примеры использования: IApiResponse<IUser>, IApiResponse<IAuthTokens>
// Мета пагинации — приходит в списочных ответах (напр. GET /decks)
export interface IPaginationMeta {
	total: number // всего совпадений (для «Seite X von Y»)
	page: number // текущая страница
	limit: number // размер страницы
	totalPages: number // всего страниц
}

export interface IApiResponse<T> {
	data: T
	message: string
	success: boolean
	meta?: IPaginationMeta // есть только у списочных эндпоинтов
}

// Тип ошибки от сервера (4xx, 5xx)
export interface IApiError {
	message: string  // Человекочитаемое сообщение
	statusCode: number // HTTP код: 400, 401, 403, 404, 500 и т.д.
	// Ошибки по конкретным полям формы (например, { email: ['уже занят'] })
	errors?: Record<string, string[]>
}
