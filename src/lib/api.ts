// ============================================================
// lib/api.ts — базовый HTTP-клиент (замена axios)
// ============================================================
//
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ЧТО ЭТО И ЗАЧЕМ?
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//
// В прошлом проекте был api.js на axios — он делал то же самое:
//   1. Знал BASE_URL
//   2. Добавлял заголовки (Content-Type, Authorization)
//   3. Парсил ответ
//   4. Бросал понятную ошибку при неудаче
//
// Этот файл делает то же самое, но:
//   — без axios (fetch встроен в Next.js/Node.js, ничего ставить не надо)
//   — только для серверной стороны (используй в server-actions, не в компонентах)
//
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ПОТОК ДАННЫХ:
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//
//   auth.actions.ts (Server Action)
//       ↓ вызывает apiFetch('/login', { method: 'POST', body: {...} })
//   api.ts (этот файл)
//       ↓ добавляет заголовки, делает fetch к бэкенду
//   Backend (http://localhost:8000/api/v1/login)
//       ↓ возвращает JSON { data: {...}, message: "...", success: true }
//   api.ts
//       ↓ проверяет response.ok, парсит JSON, или кидает ApiError
//   auth.actions.ts
//       ↓ возвращает данные в authStore
//   authStore → user, accessToken сохранены в state
//
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import { API_BASE_URL } from '@/config/api.config'
import type { IApiError, IApiResponse } from '@/shared/types/api.types'

// ─────────────────────────────────────────────────────────────
// ApiError — кастомный класс ошибки
// ─────────────────────────────────────────────────────────────
//
// Зачем не использовать обычный Error?
// Нам нужно знать не только "что-то пошло не так",
// но и:
//   — statusCode: 401 (не авторизован), 422 (ошибки полей), 500 (сервер упал)
//   — fieldErrors: { email: ['уже занят'], username: ['слишком короткое'] }
//
// В authStore мы проверяем тип ошибки:
//   catch (err) {
//     if (err instanceof ApiError) {
//       err.statusCode   // HTTP-код
//       err.fieldErrors  // ошибки полей для формы
//     }
//   }

export class ApiError extends Error {
	constructor(
		// HTTP статус-код: 400, 401, 403, 404, 422, 500...
		public statusCode: number,
		// Человекочитаемое сообщение из бэкенда: "Неверный пароль"
		message: string,
		// Ошибки по полям формы (если бэкенд их прислал):
		// { email: ['уже занят'], username: ['слишком короткое имя'] }
		public fieldErrors?: Record<string, string[]>
	) {
		// super() — вызываем конструктор родителя (Error), передаём message
		super(message)
		// Устанавливаем имя для читаемого стектрейса в консоли
		this.name = 'ApiError'
	}
}

// ─────────────────────────────────────────────────────────────
// Опции для apiFetch
// ─────────────────────────────────────────────────────────────
//
// Extends RequestInit — наследуем все стандартные опции fetch
// (method, headers, cache, next...) но переопределяем body и добавляем token.

interface ApiFetchOptions extends Omit<RequestInit, 'body'> {
	// body принимает любой объект — мы сами сделаем JSON.stringify
	// (стандартный fetch требует строку или FormData, это неудобно)
	body?: unknown

	// access-токен пользователя.
	// Если передан — добавим заголовок Authorization: Bearer <token>
	// Если не передан — запрос без авторизации (логин, регистрация)
	token?: string
}

export async function apiFetch<T>(
	endpoint: string,
	options: ApiFetchOptions = {}
): Promise<IApiResponse<T>> {
	const { body, token, ...restOptions } = options

	const headers: Record<string, string> = {
		'Content-Type': 'application/json',
		Accept: 'application/json',

		// Если token есть — добавляем заголовок Authorization
		...(token && { Authorization: `Bearer ${token}` }),

		// Если в options были переданы свои заголовки — добавляем их (например, для CORS)
		...(restOptions.headers as Record<string, string>)
	}

	// Делаем запрос к бэкенду (http://localhost:8000/api/v1/endpoint), передавая все опции (метод, тело, заголовки...)
	const response = await fetch(`${API_BASE_URL}${endpoint}`, {
		...restOptions,
		headers,
		/// Если body есть — сериализуем в JSON-строку
		// Если нет (GET-запрос) — не добавляем body совсем, чтобы fetch не ругался
		body: body !== undefined ? JSON.stringify(body) : undefined
	})

	// Пытаемся распарсить JSON-ответ. Если не получилось (например, сервер вернул 500 без тела) — просто null
	//Т.е ответ получаем конкретно тут в этом файле, а не в каждом экшене, который вызывает apiFetch. Responsedata - это уже распарсенные данные из ответа, а не сырая Response от fetch. И если сервер вернул не JSON, то мы не будем пытаться парсить его и просто получим null, чтобы не ломать код дальше.
	const responseData = await response.json().catch(() => null)

	// Если HTTP-статус не 2xx — бросаем ApiError с данными из ответа (message, statusCode, fieldErrors)
	if (!response.ok) {
		const apiError = responseData as IApiError | null

		throw new ApiError(
			response.status,

			apiError?.message ?? `Ошибка сервера (${response.status})`,

			apiError?.errors
		)
	}

	// Если всё ок — возвращаем распарсенные данные (responseData.data) и message, success из ответа
	return responseData as IApiResponse<T>
}
