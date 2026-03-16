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

// ─────────────────────────────────────────────────────────────
// apiFetch — главная функция
// ─────────────────────────────────────────────────────────────
//
// T — generic (шаблон): тип данных которые вернёт бэкенд в поле data.
// Пример вызовов:
//   apiFetch<AuthResponse>('/login', { method: 'POST', body: {...} })
//   apiFetch<IUser>('/profile', { token: accessToken })
//
// Возвращает всегда IApiResponse<T>:
//   { data: T, message: string, success: boolean }

export async function apiFetch<T>(
	// endpoint — путь БЕЗ базового URL: '/login', '/registration', '/profile'
	endpoint: string,
	options: ApiFetchOptions = {}
): Promise<IApiResponse<T>> {
	// Деструктурируем наши кастомные поля от стандартных опций fetch
	const { body, token, ...restOptions } = options

	// Собираем заголовки запроса
	const headers: Record<string, string> = {
		'Content-Type': 'application/json',
		Accept: 'application/json',

		// Добавляем Authorization только если токен передан.
		// Оператор && с spread: если token falsy — ничего не добавляем.
		...(token && { Authorization: `Bearer ${token}` }),

		// Если caller передал свои headers — они перезапишут наши
		// (полезно для переопределения Content-Type, например для FormData)
		...(restOptions.headers as Record<string, string>),
	}

	// Делаем запрос к бэкенду
	// fetch в Next.js умеет кешировать — { cache: 'no-store' } отключает кеш
	// Для мутаций (POST/PUT/DELETE) кеш и так не применяется
	const response = await fetch(`${API_BASE_URL}${endpoint}`, {
		...restOptions,
		headers,
		// Если body есть — сериализуем в JSON-строку
		// Если нет (GET-запрос) — не добавляем body совсем
		body: body !== undefined ? JSON.stringify(body) : undefined,
	})

	// Парсим JSON. .catch(() => null) — если тело пустое (204 No Content),
	// не падаем с ошибкой парсинга.
	const responseData = await response.json().catch(() => null)

	// response.ok = true если статус 200-299
	// response.ok = false если 400, 401, 422, 500 и т.д.
	if (!response.ok) {
		// Пробуем получить детали ошибки из тела ответа
		const apiError = responseData as IApiError | null

		// Бросаем наш кастомный ApiError
		// В authStore поймаем его и красиво покажем пользователю
		throw new ApiError(
			response.status,
			// Если бэкенд прислал message — берём его, иначе дефолт
			apiError?.message ?? `Ошибка сервера (${response.status})`,
			// Ошибки полей формы: { email: ['уже занят'] }
			apiError?.errors
		)
	}

	return responseData as IApiResponse<T>
}
