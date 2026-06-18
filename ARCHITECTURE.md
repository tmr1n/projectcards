# Архитектура проекта ProjectCards / LangCards

> Полное разжёвывание для джунов. Здесь объяснено всё — от зависимостей до каждой строки кода.

---

## Содержание

1. [Что за проект и зачем он нужен](#1-что-за-проект)
2. [Общая схема — как всё связано](#2-общая-схема)
3. [FRONTEND — подробно](#3-frontend)
4. [BACKEND — подробно](#4-backend)
5. [База данных — схема и объяснение](#5-база-данных)
6. [Потоки данных — что происходит когда](#6-потоки-данных)
7. [Переменные окружения](#7-переменные-окружения)

---

## 1. Что за проект

**ProjectCards / LangCards** — веб-приложение для создания карточек для запоминания (как Anki или Quizlet).

**Что умеет:**

- Регистрация / вход / Google OAuth (войти через Google)
- Подтверждение email после регистрации
- Сброс пароля через письмо
- Создание колод (decks) с карточками (cards)
- Профиль с аватаром
- Многоязычность (русский, английский, немецкий)

---

## 2. Общая схема

```
┌─────────────────────────────────────────────────────────────────┐
│                        БРАУЗЕР (Chrome)                         │
│   Пользователь открывает localhost:3000                          │
└──────────────────────┬───────────────────────────────────────────┘
                       │ HTTP запросы
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                    FRONTEND (Next.js)                            │
│                    localhost:3000                                 │
│                                                                  │
│  React-компоненты ──► Zustand authStore ──► Server Actions      │
│       (UI)              (состояние)         (запросы к API)     │
└─────────────────────────────────────────────────────────────────┘
                       │
                       │ fetch() запросы
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND (NestJS)                              │
│                    localhost:3001/api/v1                          │
│                                                                  │
│  Controller ──► Service ──► Prisma ──► База данных              │
│  (маршруты)    (логика)    (ORM)      (PostgreSQL)              │
└─────────────────────────────────────────────────────────────────┘
```

**Самое важное понять:**

- Браузер видит только `localhost:3000` (фронт)
- Фронт сам **никогда** не ходит в БД напрямую
- Цепочка всегда: Компонент → Store → Server Action → fetch → NestJS → Prisma → БД

---

## 3. FRONTEND

### 3.1 Стек и зависимости

| Библиотека            | Зачем нужна                                                     | Пример использования                              |
| --------------------- | --------------------------------------------------------------- | ------------------------------------------------- |
| **Next.js 16**        | Фреймворк поверх React. Даёт маршрутизацию, Server Actions, SSR | `app/[locale]/dashboard/page.tsx` — это маршрут   |
| **React 19**          | Создание UI через компоненты и хуки                             | `useState`, `useEffect`, JSX                      |
| **TypeScript**        | Добавляет типы к JS. Ловит ошибки до запуска                    | `const user: IUser = ...` — тип не даст ошибиться |
| **Tailwind CSS 4**    | Стили через классы в JSX, без CSS-файлов                        | `className="flex gap-4 text-red-500"`             |
| **Zustand 5**         | Глобальное состояние (кто залогинен, токен)                     | `useAuthStore(s => s.user)`                       |
| **TanStack Query 5**  | Кеш данных с сервера (колоды, карточки)                         | `useQuery(['decks'], fetchDecks)`                 |
| **Zod 4**             | Схемы валидации форм                                            | `z.string().email().min(1)`                       |
| **React Hook Form 7** | Управление формами + связь с Zod                                | `useForm({ resolver: zodResolver(schema) })`      |
| **next-intl 4**       | Переключение языков ru/en/de                                    | `useTranslations('auth')`                         |
| **UploadThing 7**     | Загрузка аватаров в облако                                      | `<UploadButton endpoint="imageUploader" />`       |
| **Motion 12**         | Анимации                                                        | `<motion.div animate={{ opacity: 1 }}>`           |
| **dnd-kit**           | Drag-and-drop карточек                                          | Перетаскивание колод                              |
| **next-themes**       | Тёмная/светлая тема                                             | `useTheme()`                                      |
| **lucide-react**      | SVG иконки как React-компоненты                                 | `<Eye />`, `<Loader2 />`                          |

---

### 3.2 Структура папок Frontend

```
src/
├── app/                      ← МАРШРУТЫ (Next.js App Router)
│   ├── [locale]/             ← Динамический сегмент URL: /ru/, /en/, /de/
│   │   ├── layout.tsx        ← Общая оболочка всех страниц (провайдеры)
│   │   ├── (auth)/           ← Группа маршрутов авт-ии (в URL НЕ видна)
│   │   │   ├── login/        ← /ru/login
│   │   │   ├── registration/ ← /ru/registration
│   │   │   ├── forgot-password/
│   │   │   ├── password-change/
│   │   │   ├── username-change/
│   │   │   ├── email-confirmation/
│   │   │   └── auth/callback/ ← После Google OAuth
│   │   ├── (public)/         ← Публичные маршруты
│   │   │   └── page.tsx      ← Главная страница /ru/
│   │   └── dashboard/        ← /ru/dashboard (защищённая)
│   └── api/uploadthing/      ← API-маршрут для загрузки файлов
│
├── components/
│   ├── ui/                   ← Примитивы: кнопки, скелетоны, баннеры
│   ├── buttons/              ← ButtonPrimitive, ButtonSubmit, BackButton...
│   ├── form-components/      ← InputComponent, PasswordInput, Checkbox...
│   ├── page-components/      ← LoginForm, RegistrationForm, NavBar...
│   ├── dashboard-components/ ← DecksList, DeckCard, FlashCard...
│   ├── profile/              ← ProfileAvatar, AvatarPicker...
│   ├── landing/              ← HeroSection, HowItWorks, Footer...
│   └── header/               ← SidebarMenu
│
├── config/
│   └── api.config.ts         ← URL бэкенда (из .env)
│
├── constants/
│   ├── validation.ts         ← Правила для username и password
│   ├── input.ts              ← CSS-классы для инпутов
│   └── button.ts             ← CSS-классы для кнопок
│
├── hooks/
│   ├── useInputStyles.ts     ← Стиль инпута зависит от состояния (ошибка/фокус)
│   └── useDelayedError.ts    ← Показ ошибки с задержкой
│
├── i18n/
│   ├── routing.ts            ← Список языков: ['ru', 'en', 'de'], default: 'ru'
│   └── request.ts            ← Загрузка файлов переводов
│
├── lib/
│   ├── api.ts                ← HTTP-клиент (обёртка над fetch)
│   ├── queryClient.ts        ← Настройка TanStack Query
│   └── translateBackendError.ts ← Перевод ошибок бэкенда на русский
│
├── providers/
│   ├── QueryProvider.tsx     ← <QueryClientProvider> для всего app
│   └── ThemeProvider.tsx     ← <ThemeProvider> для тём
│
├── schemas/
│   └── auth.schema.ts        ← Zod-схемы для всех форм
│
├── server-actions/
│   └── auth.actions.ts       ← Все API-вызовы авторизации (Server Actions)
│
├── shared/types/
│   ├── api.types.ts          ← IApiResponse<T>, IApiError
│   ├── auth.types.ts         ← IUser, ISession, IAuthTokens, payload-типы
│   └── form.types.ts         ← Типы пропсов форм
│
└── store/
    └── authStore.ts          ← Zustand store (глобальное состояние)
```

---

### 3.3 Ключевые файлы с разбором строк

---

#### `src/config/api.config.ts`

```typescript
// process.env.API_URL — берёт значение из .env.local файла
// В .env.local: API_URL=http://localhost:3001/api/v1
// ?? — "если слева null или undefined, взять то что справа"
export const API_BASE_URL =
	process.env.API_URL ?? 'http://localhost:3001/api/v1'
//                          ^^^^^^^^^^^^^^^^^        ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
//                          из .env.local            запасное значение если .env нет
```

**Зачем?** Один файл — один URL. Меняешь здесь — меняется везде. Не надо искать по всему коду.

---

#### `src/shared/types/api.types.ts`

```typescript
// IApiResponse<T> — ФОРМАТ КАЖДОГО ОТВЕТА от нашего бэкенда
// Каждый ответ выглядит так:
//   { success: true, message: "OK", data: { id: "123", email: "a@b.com" } }
//
// T — generic (шаблон типа). При вызове указываем что будет в data:
//   apiFetch<IUser>('/profile')   → data будет типа IUser
//   apiFetch<IDeck[]>('/decks')   → data будет массивом IDeck
export interface IApiResponse<T> {
	success: boolean
	message: string
	data: T
}

// IApiError — формат ответа при ошибке
export interface IApiError {
	success: false
	message: string
	statusCode: number // 400=плохой запрос, 401=не авт-н, 422=ошибки полей, 500=сервер упал
	errors?: Record<string, string[]>
	//       ^^^^^^^^^^^^^^^^^^^^^^^^
	//       Объект где ключ = название поля, значение = массив ошибок:
	//       { email: ['Email уже занят'], username: ['Слишком короткое'] }
}
```

---

#### `src/lib/api.ts`

```typescript
// ApiError — наш кастомный класс ошибки
// Зачем не обычный Error?
//   Обычный Error: "что-то пошло не так"
//   ApiError:      statusCode=422 → "ошибки в полях формы, покажи их"
//                  statusCode=401 → "токен протух, редирект на /login"
//                  statusCode=500 → "сервер упал, покажи красный баннер"
export class ApiError extends Error {
	constructor(
		public statusCode: number, // HTTP-код
		message: string, // Текст ошибки для юзера
		public fieldErrors?: Record<string, string[]> // Ошибки полей (или нет)
	) {
		super(message) // Вызов конструктора родителя — class Error
		this.name = 'ApiError' // Имя для читаемого стектрейса в консоли
	}
}

// ApiFetchOptions — наши опции поверх стандартных опций fetch
// Extends Omit<RequestInit, 'body'> — берём все стандартные опции fetch,
// но body переопределяем (стандартный fetch требует строку, мы хотим объект)
interface ApiFetchOptions extends Omit<RequestInit, 'body'> {
	body?: unknown // Принимаем объект — сами сделаем JSON.stringify
	token?: string // JWT-токен. Если передан — добавим Authorization заголовок
}

export async function apiFetch<T>(
	endpoint: string, // Путь без базового URL: '/login', '/decks'
	options: ApiFetchOptions = {}
): Promise<IApiResponse<T>> {
	// Деструктуризация — разбираем объект на отдельные переменные
	// body и token — наши кастомные поля
	// ...restOptions — всё остальное (method, cache, credentials...)
	const { body, token, ...restOptions } = options

	const headers: Record<string, string> = {
		'Content-Type': 'application/json', // Говорим серверу: тело запроса — JSON
		Accept: 'application/json', // Говорим серверу: хочу JSON в ответе

		// Умный conditional spread:
		//   token = "abc" → разворачивает { Authorization: "Bearer abc" }
		//   token = undefined → разворачивает {} (ничего не добавляет)
		...(token && { Authorization: `Bearer ${token}` }),

		// Если вызывающий код передал свои headers — они перезапишут наши
		...(restOptions.headers as Record<string, string>)
	}

	// Делаем HTTP запрос через встроенный fetch
	const response = await fetch(`${API_BASE_URL}${endpoint}`, {
		...restOptions,
		headers,
		// Если body есть — превращаем объект в JSON-строку:
		//   { email: "a@b.com" }  →  '{"email":"a@b.com"}'
		// Если нет (GET-запрос) — не добавляем body
		body: body !== undefined ? JSON.stringify(body) : undefined
	})

	// .json() парсит тело ответа из строки в объект
	// .catch(() => null) — если тело пустое (204 No Content), не падаем с ошибкой
	const responseData = await response.json().catch(() => null)

	// response.ok = true при статусах 200-299
	// response.ok = false при 400, 401, 422, 500 и т.д.
	if (!response.ok) {
		const apiError = responseData as IApiError | null
		// Бросаем ApiError — поймаем его в auth.actions.ts
		throw new ApiError(
			response.status,
			apiError?.message ?? `Ошибка сервера (${response.status})`,
			// apiError?.errors — ?. это "optional chaining":
			//   если apiError = null → не упадём, вернём undefined
			apiError?.errors
		)
	}

	return responseData as IApiResponse<T>
}
```

---

#### `src/server-actions/auth.actions.ts`

```typescript
'use server'

// ↑ Эта строка ОБЯЗАТЕЛЬНА. Говорит Next.js:
//   "эти функции запускаются на сервере, не в браузере"
//
// ЗАЧЕМ Server Actions?
//   Прямо из браузера ходить на бэкенд → CORS проблемы, токены видны в DevTools
//   Через Server Action:  браузер → Next.js сервер → NestJS бэкенд
//   Токен хранится в httpOnly cookie → JavaScript браузера не может его прочитать
import { cookies } from 'next/headers' // next/headers работает только на сервере

export async function loginAction(payload: ILoginPayload) {
	try {
		const res = await apiFetch<ILoginResponse>('/login', {
			method: 'POST',
			body: payload // { email: "...", password: "..." }
		})

		// Если пришёл access_token (не 2FA) — сохраняем в httpOnly cookie
		if ('access_token' in res.data) {
			const cookieStore = await cookies()
			cookieStore.set('token', res.data.access_token, {
				httpOnly: true, // JS браузера НЕ видит эту куку (безопасно!)
				sameSite: 'lax', // Защита от CSRF атак
				maxAge: 60 * 15 // 15 минут × 60 секунд = 900 сек
				//       ^^^^^^^^^^^^
				//       60 * 15 = 900 — явно, чтобы понятно было что это 15 минут
			})
		}

		return { success: true, data: res.data }
	} catch (err) {
		if (err instanceof ApiError) {
			// translateApiError — переводит английские ошибки бэкенда на русский
			const translated = await translateApiError(err)
			// Spread оператор разворачивает объект:
			//   { success: false, ...{ message: "...", fieldErrors: {...} } }
			// превращается в:
			//   { success: false, message: "...", fieldErrors: {...} }
			return { success: false, ...translated }
		}
		return { success: false, message: 'Ошибка соединения' }
	}
}

// logoutAction — с намеренно пустым catch
export async function logoutAction(token: string) {
	try {
		await apiFetch('/logout', { method: 'POST', token })
	} catch {
		// Пустой catch — намеренно!
		// Если бэкенд недоступен — всё равно разлогиниваем локально.
		// Logout с точки зрения UI всегда успешен.
	}
	const cookieStore = await cookies()
	cookieStore.delete('token') // Удаляем куку из браузера
}

// getProfileAction — получить данные пользователя
export async function getProfileAction(token: string): Promise<IUser | null> {
	try {
		const res = await apiFetch<IUser>('/profile', { token })
		return res.data
	} catch {
		// Если токен протух или сервер недоступен — возвращаем null
		// Store проверит null и не будет обновлять user
		return null
	}
}
```

---

#### `src/store/authStore.ts`

```typescript
// ЗАЧЕМ STORE?
// LoginForm, Header, Dashboard — три разных компонента, все хотят знать:
// "пользователь залогинен?"
//
// БЕЗ Store: App → Layout → Header → Avatar  (prop drilling — пробрасывать везде)
// СО Zustand: любой компонент пишет useAuthStore() и сразу получает данные

// flattenFieldErrors — вспомогательная функция
// Бэкенд: { email: ['уже занят', 'проверь формат'] }  (массивы)
// Store:  { email: 'уже занят' }                       (одна строка)
// Берём только ПЕРВУЮ ошибку — остальные обычно дублируют смысл
function flattenFieldErrors(
	errors: Record<string, string[]>
): Record<string, string> {
	// Object.entries({ email: ['err1', 'err2'] })
	//   → [['email', ['err1', 'err2']]]  (массив пар [ключ, значение])
	//
	// .map(([field, messages]) => [field, messages[0]])
	//   → [['email', 'err1']]   берём только первый элемент массива
	//   [field, messages] — деструктуризация: field='email', messages=['err1','err2']
	//   messages[0] — первый элемент массива (индекс 0)
	//
	// Object.fromEntries([['email', 'err1']])
	//   → { email: 'err1' }   превращаем обратно в объект
	return Object.fromEntries(
		Object.entries(errors).map(([field, messages]) => [field, messages[0]])
	)
}

// create<T>()() — функция Zustand. Двойные скобки из-за middleware.
// Без persist было бы: create<T>((set) => ({...}))
// С persist:           create<T>()(persist((set) => ({...}), config))
export const useAuthStore = create<AuthState & AuthActions>()(
	persist(
		(set, get) => ({
			// ── НАЧАЛЬНОЕ СОСТОЯНИЕ ──────────────────────────
			user: null, // Данные юзера (после fetchProfile)
			accessToken: null, // JWT токен
			isAuthenticated: false, // true = залогинен
			isLoading: false, // true = идёт запрос (показываем лоадер)
			error: null, // Текст общей ошибки (красный баннер)
			serverFieldErrors: null, // Ошибки по полям { email: '...' }
			pendingEmail: null, // Email для страницы подтверждения
			twoFactorToken: null, // Токен для 2FA (если включена)

			// ── ACTION: login ─────────────────────────────────
			login: async (email, password) => {
				// set() — обновляет поля store (как setState в React)
				// Передаём только те поля которые меняем
				set({ isLoading: true, error: null, serverFieldErrors: null })

				const result = await loginAction({ email, password })

				if (!result.success) {
					set({
						serverFieldErrors: result.fieldErrors
							? flattenFieldErrors(
									result.fieldErrors as Record<string, string[]>
								)
							: null,
						// Если есть ошибки полей — не показываем общую ошибку
						// Если нет ошибок полей — показываем общую ошибку
						error: result.fieldErrors ? null : result.message,
						isLoading: false
					})
					return // ← Выход из функции, логин не удался
				}

				const response = result.data
				// 'two_factor_token' in response — проверяет есть ли такой ключ в объекте
				if ('two_factor_token' in response) {
					// 2FA включена — сохраняем временный токен
					set({ twoFactorToken: response.two_factor_token, isLoading: false })
				} else {
					// Обычный логин — сохраняем токен и статус
					set({
						accessToken: response.access_token,
						// isAuthenticated = true ТОЛЬКО если email подтверждён
						isAuthenticated: response.email_is_verified,
						pendingEmail: email,
						isLoading: false
					})
					// void = "не ждём промис, запускаем фоново"
					// get() читает текущий state — нужен чтобы вызвать другой action
					void get().fetchProfile()
				}
			},

			// fetchProfile — загружает данные пользователя с бэкенда
			fetchProfile: async () => {
				const { accessToken } = get() // get() читает текущий state
				if (!accessToken) return // Если нет токена — выходим
				const user = await getProfileAction(accessToken)
				if (user) set({ user }) // Обновляем только если пришли данные
			},

			// logout — синхронный (не async)
			// UI не ждёт бэкенд — сразу сбрасываем локально
			logout: () => {
				const { accessToken } = get()
				// void = запускаем фоново, не ждём
				if (accessToken) void logoutAction(accessToken)
				set({
					user: null,
					accessToken: null,
					isAuthenticated: false,
					error: null,
					serverFieldErrors: null
				})
			},

			clearError: () => set({ error: null, serverFieldErrors: null })
		}),
		{
			name: 'langcards-auth', // Ключ в localStorage (DevTools → Application)
			// partialize — "сохраняй только эти поля"
			// isLoading, error — временные данные, не нужны после перезагрузки
			partialize: state => ({
				user: state.user,
				accessToken: state.accessToken,
				isAuthenticated: state.isAuthenticated,
				pendingEmail: state.pendingEmail
			})
		}
	)
)
```

---

#### `src/constants/validation.ts`

```typescript
export const USERNAME_VALIDATION = {
	minLength: 3,

	// Регулярные выражения (RegExp)
	// /паттерн/ — буквально так выглядит RegExp в JavaScript
	//
	// /^[A-Za-z]/
	//   ^ = "якорь" — начало строки
	//   [A-Za-z] = "любая буква от A до Z или от a до z"
	//   → Первый символ должен быть буквой
	startsWithLatin: /^[A-Za-z]/,

	// /^[A-Za-z][A-Za-z0-9_-]*$/
	//   ^ = начало строки
	//   [A-Za-z] = первый символ — буква
	//   [A-Za-z0-9_-]* = ноль или больше символов: буквы, цифры, _ или -
	//   * = "ноль или больше" (в отличие от + = "один или больше")
	//   $ = "якорь" — конец строки
	onlyValidChars: /^[A-Za-z][A-Za-z0-9_-]*$/
} as const
// as const — делает объект readonly (нельзя изменить)
// Без него TypeScript думает что значения могут поменяться

// PASSWORD_HINTS — массив подсказок для формы
// Каждый элемент массива — объект с тремя полями
export const PASSWORD_HINTS = [
	{
		key: 'hasUppercase' as const,
		// test — функция-проверка
		// принимает строку v, возвращает true (условие выполнено) или false
		// .test(v) — метод RegExp: возвращает true если строка соответствует паттерну
		// /[A-Z]/ — хотя бы одна заглавная буква
		test: (v: string) => PASSWORD_VALIDATION.hasUppercase.test(v),
		message: 'Пароль должен содержать одну большую букву.'
	},
	{
		key: 'hasSpecial' as const,
		// /[!@#$%^&*(),.?":{}|<>]/ — один из этих спецсимволов
		// Квадратные скобки в RegExp = "любой из перечисленных символов"
		test: (v: string) => PASSWORD_VALIDATION.hasSpecial.test(v),
		message: 'Пароль должен содержать один специальный символ.'
	}
]
```

---

## 4. BACKEND

### 4.1 Стек Backend

| Библиотека          | Зачем нужна                                                        |
| ------------------- | ------------------------------------------------------------------ |
| **NestJS 11**       | Фреймворк. Структурирует код через модули/контроллеры/сервисы      |
| **TypeScript 5.7**  | Типизация. Prisma автогенерирует типы из схемы БД                  |
| **Prisma 6**        | ORM — работа с БД без написания SQL. `prisma.user.findUnique(...)` |
| **PostgreSQL**      | Реляционная база данных (таблицы со связями)                       |
| **Passport.js**     | Библиотека стратегий аутентификации                                |
| **@nestjs/jwt**     | Создание и проверка JWT токенов                                    |
| **bcrypt 6**        | Хеширование паролей (нельзя хранить в открытом виде!)              |
| **Resend 6**        | Отправка email (верификация, сброс пароля)                         |
| **cookie-parser**   | Парсит HTTP cookies: `req.cookies.token`                           |
| **class-validator** | Декораторы для валидации DTO: `@IsEmail()`, `@MinLength(8)`        |

---

### 4.2 Структура папок Backend

```
src/
├── main.ts              ← Точка входа. Настраивает и запускает сервер
├── app.module.ts        ← Корневой модуль. Объединяет все модули
│
├── auth/                ← Авторизация (login, register, OAuth, profile)
│   ├── auth.controller.ts    ← Маршруты: POST /login, GET /profile...
│   ├── auth.service.ts       ← Логика: хеши, токены, верификации...
│   ├── auth.module.ts        ← Конфигурация: JWT, стратегии, зависимости
│   ├── strategies/
│   │   ├── jwt.strategy.ts       ← Проверяет Bearer токен в заголовке
│   │   └── google.strategy.ts    ← Google OAuth через Passport
│   └── dto/
│       ├── login.dto.ts          ← { email, password }
│       ├── register.dto.ts       ← { email, username, password, ... }
│       └── ...
│
├── users/
│   ├── users.service.ts     ← findByEmail, findById, create, delete
│   └── user.module.ts
│
├── decks/
│   ├── decks.controller.ts  ← GET/POST/PATCH/DELETE /decks
│   ├── decks.service.ts     ← findAll, findOne, create, update, remove
│   ├── decks.module.ts
│   └── dto/
│
├── cards/
│   ├── cards.controller.ts  ← POST/PATCH/DELETE /cards
│   ├── cards.service.ts
│   └── dto/
│
├── mail/
│   ├── mail.service.ts      ← sendEmailVerification, sendPasswordReset
│   └── mail.module.ts
│
└── prisma/
    ├── prisma.service.ts    ← PrismaClient (соединение с БД)
    └── prisma.module.ts
```

---

### 4.3 Ключевые файлы Backend

---

#### `src/main.ts`

```typescript
async function bootstrap() {
	// NestFactory.create(AppModule) — создаёт всё приложение
	// AppModule — корень дерева модулей
	const app = await NestFactory.create(AppModule)

	// Все эндпоинты получают префикс /api/v1
	// POST /login → POST /api/v1/login
	app.setGlobalPrefix('api/v1')

	// ValidationPipe — перехватывает входящие запросы
	// и проверяет DTO через class-validator декораторы
	// whitelist: true — удаляет поля которых нет в DTO
	//   { email, password, hacker_field } → { email, password }
	app.useGlobalPipes(new ValidationPipe({ whitelist: true }))

	// cookie-parser — middleware, парсит cookies
	// Без него req.cookies = undefined
	app.use(cookieParser())

	// CORS — безопасность браузера
	// Браузер по умолчанию блокирует запросы с localhost:3000 на localhost:3001
	// Здесь мы явно разрешаем это
	app.enableCors({
		origin: 'http://localhost:3000', // Только наш фронтенд
		credentials: true // Разрешаем куки в CORS запросах
	})

	await app.listen(3001)
}
bootstrap() // Вызываем async функцию — запускаем сервер
```

---

#### `src/auth/auth.service.ts`

```typescript
// @Injectable() — декоратор NestJS
// Говорит NestJS: "этот класс можно инжектировать в другие классы"
@Injectable()
export class AuthService {
	// constructor с private — Dependency Injection
	// NestJS сам создаёт экземпляры и передаёт их сюда
	// Нам не нужно писать new PrismaService() — NestJS делает это за нас
	constructor(
		private prisma: PrismaService,
		private users: UsersService,
		private jwt: JwtService,
		private mail: MailService
	) {}

	// ── РЕГИСТРАЦИЯ ──────────────────────────────────────────────
	async register(dto: RegisterDto) {
		if (dto.password !== dto.password_confirmation) {
			// BadRequestException → HTTP 400
			// NestJS автоматически превращает исключения в HTTP-ответы
			throw new BadRequestException({
				message: 'Validation error',
				errors: { password_confirmation: ['Passwords do not match'] }
			})
		}

		const existing = await this.users.findByEmail(dto.email)
		if (existing) {
			if (!existing.emailVerified) {
				// Уже зарегистрирован, но email не подтверждён
				// Повторно шлём письмо с верификацией
				await this.sendVerificationEmail(existing.id, existing.email)
				return { job_id: crypto.randomUUID() }
			}
			throw new BadRequestException({
				errors: { email: ['Email is already taken'] }
			})
		}

		// bcrypt.hash(password, 10)
		// Первый аргумент: строка которую хешируем
		// Второй аргумент: "salt rounds" = сложность (10 = нормально, 12 = медленно)
		// ВАЖНО: bcrypt необратим. Из хеша нельзя получить пароль.
		// При проверке bcrypt.compare() хеширует введённый пароль и сравнивает хеши
		const passwordHash = await bcrypt.hash(dto.password, 10)

		const user = await this.users.create({
			email: dto.email,
			username: dto.username,
			passwordHash,
			newsletter: dto.mailing_enabled ?? false,
			// ?? — "nullish coalescing": если mailing_enabled = null/undefined → false
			emailVerified: false
		})

		await this.sendVerificationEmail(user.id, user.email)
		return { job_id: crypto.randomUUID() }
	}

	// ── ЛОГИН ────────────────────────────────────────────────────
	async login(dto: LoginDto) {
		// ?? — пробуем найти по email. Если null — пробуем по username
		// (Это позволяет логиниться и по email и по имени пользователя)
		const user =
			(await this.users.findByEmail(dto.email)) ??
			(await this.users.findByUsername(dto.email))

		// Нет юзера ИЛИ нет пароля (OAuth-юзер логинится только через Google)
		if (!user || !user.passwordHash)
			throw new UnauthorizedException('Invalid credentials')

		// bcrypt.compare(введённый пароль, хеш из БД) → true/false
		const match = await bcrypt.compare(dto.password, user.passwordHash)
		if (!match) throw new UnauthorizedException('Invalid credentials')

		// jwt.sign(payload) создаёт JWT токен
		// payload = данные внутри токена (видны всем, но подпись защищает от подделки)
		// sub = "subject" — стандартное поле JWT, обычно userId
		const accessToken = this.jwt.sign({ sub: user.id, email: user.email })

		// Создаём запись сессии в БД с refresh-токеном
		// crypto.randomUUID() = UUID v4, случайная строка типа "a1b2c3d4-..."
		const refreshToken = crypto.randomUUID()
		await this.prisma.session.create({
			data: {
				userId: user.id,
				refreshToken,
				// Date.now() = текущее время в миллисекундах с 1970 года
				// + 30 * 24 * 60 * 60 * 1000 = 30 дней в миллисекундах
				expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
			}
		})

		return { access_token: accessToken, email_is_verified: user.emailVerified }
	}

	// resolveUniqueUsername — используется при Google OAuth регистрации
	private async resolveUniqueUsername(base: string): Promise<string> {
		// .replace(/\s+/g, '_')
		//   /\s+/ = один или более пробелов
		//   g = глобальный флаг: заменяем ВСЕ вхождения (не только первое)
		//   "John Doe" → "John_Doe"
		//
		// .slice(0, 20)
		//   Метод строк: вырезает подстроку
		//   .slice(начало, конец_не_включая)
		//   .slice(0, 20) = символы от 0 до 19 включительно (максимум 20)
		//   "VeryLongGoogleUsername123" → "VeryLongGoogleUserna"
		const sanitized = base.replace(/\s+/g, '_').slice(0, 20)

		const existing = await this.prisma.user.findUnique({
			where: { username: sanitized }
		})
		if (!existing) return sanitized // Имя свободно — берём

		// Имя занято — добавляем случайный суффикс
		// Math.random() → случайное число от 0 до 1: 0.78234
		// .toString(36) → строка в системе счисления 36 (0-9 + a-z): "0.s1k2j"
		// .slice(2, 7) → убираем "0." и берём 5 символов: "s1k2j"
		return `${sanitized}_${Math.random().toString(36).slice(2, 7)}`
	}
}
```

---

#### `src/auth/strategies/jwt.strategy.ts`

```typescript
// JwtStrategy — как Passport проверяет JWT токен
// Срабатывает АВТОМАТИЧЕСКИ на каждый запрос с @UseGuards(AuthGuard('jwt'))
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor() {
		super({
			// jwtFromRequest: откуда брать токен из входящего запроса?
			// fromAuthHeaderAsBearerToken = из заголовка "Authorization: Bearer eyJ..."
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: process.env.JWT_SECRET // Секрет для проверки подписи
		})
	}

	// validate() вызывается ПОСЛЕ успешной проверки подписи токена
	// payload = содержимое токена: { sub: userId, email, iat: (выдан), exp: (истекает) }
	// Возвращаемый объект → попадает в req.user
	validate(payload: { sub: string; email: string }) {
		return { id: payload.sub, email: payload.email }
		//       ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
		//       Это будет доступно в контроллерах как req.user
	}
}
```

---

#### `src/decks/decks.controller.ts`

```typescript
// @UseGuards(AuthGuard('jwt')) на классе = защищает ВСЕ методы
// Каждый запрос к /decks должен иметь валидный JWT
@UseGuards(AuthGuard('jwt'))
@Controller('decks') // Базовый путь: /api/v1/decks
export class DecksController {
	// Dependency Injection — NestJS передаёт DecksService автоматически
	constructor(private decksService: DecksService) {}

	// GET /api/v1/decks
	@Get()
	async findAll(@Req() req: Request) {
		// @Req() — декоратор, вставляет объект запроса
		// req.user заполнил JwtStrategy.validate() (см. выше)
		const user = req.user as { id: string }
		const data = await this.decksService.findAll(user.id)
		return { success: true, message: 'OK', data }
	}

	// GET /api/v1/decks/abc123 — одна колода
	// @Param('id') — вытаскивает :id из URL
	@Get(':id')
	async findOne(@Param('id') id: string, @Req() req: Request) {
		const user = req.user as { id: string }
		const data = await this.decksService.findOne(id, user.id)
		return { success: true, message: 'OK', data }
	}

	// POST /api/v1/decks — создать колоду
	// @Body() — вытаскивает тело запроса (JSON)
	@Post()
	async create(@Body() dto: CreateDeckDto, @Req() req: Request) {
		const user = req.user as { id: string }
		const data = await this.decksService.create(user.id, dto)
		return { success: true, message: 'Deck created', data }
	}

	// PATCH /api/v1/decks/abc123 — обновить
	@Patch(':id')
	async update(
		@Param('id') id: string,
		@Body() dto: UpdateDeckDto,
		@Req() req: Request
	) {
		const user = req.user as { id: string }
		const data = await this.decksService.update(id, user.id, dto)
		return { success: true, message: 'Deck updated', data }
	}

	// DELETE /api/v1/decks/abc123
	@Delete(':id')
	async remove(@Param('id') id: string, @Req() req: Request) {
		const user = req.user as { id: string }
		await this.decksService.remove(id, user.id)
		return { success: true, message: 'Deck deleted', data: null }
	}
}
```

---

#### `src/decks/decks.service.ts`

```typescript
@Injectable()
export class DecksService {
	constructor(private prisma: PrismaService) {}

	findAll(userId: string) {
		return this.prisma.deck.findMany({
			where: { userId }, // SQL: WHERE userId = '...'

			// include загружает связанные данные
			// _count = специальная Prisma-фича: считает связанные записи
			// select: { cards: true } = считаем карточки
			// Результат: { ..., _count: { cards: 5 } }
			// Так мы знаем сколько карточек БЕЗ загрузки самих карточек
			include: { _count: { select: { cards: true } } },

			orderBy: { createdAt: 'desc' } // Новые сверху
		})
	}

	async findOne(id: string, userId: string) {
		const deck = await this.prisma.deck.findUnique({
			where: { id },
			include: { cards: true } // Загружаем все карточки этой колоды
		})

		// Колода не найдена → HTTP 404 Not Found
		if (!deck) throw new NotFoundException('Deck not found')

		// КРИТИЧЕСКИ ВАЖНАЯ ПРОВЕРКА:
		// Юзер А не должен видеть колоды юзера Б!
		// Без этой строки: GET /decks/чужой-id → вернёт чужие данные
		if (deck.userId !== userId) throw new ForbiddenException()
		// ForbiddenException → HTTP 403 Forbidden

		return deck
	}

	async update(id: string, userId: string, dto: UpdateDeckDto) {
		// findOne уже проверяет: существует ли колода и наша ли она
		await this.findOne(id, userId)
		return this.prisma.deck.update({ where: { id }, data: dto })
	}
}
```

---

## 5. База данных

### Схема (prisma/schema.prisma)

```prisma
// User — основная сущность
model User {
  id            String   @id @default(cuid())
  //             ^^^      ^^^^ ^^^^^^^^^^^^^^
  //             тип      первичный ключ
  //                           автозаполнение: cuid() генерирует уникальный ID
  //                           cuid: "clg1a2b3c0000abc..." (короче UUID, URL-безопасен)

  email         String   @unique     // @unique = нельзя два юзера с одним email
  username      String   @unique
  passwordHash  String?              // ? = поле nullable (может быть null)
  //                                 null для Google OAuth юзеров (нет пароля)
  googleId      String?  @unique
  emailVerified Boolean  @default(false)   // false по умолчанию
  newsletter    Boolean  @default(false)
  avatarUrl     String?
  createdAt     DateTime @default(now())   // Заполняется автоматически при создании
  updatedAt     DateTime @updatedAt        // Обновляется автоматически при изменении

  // Связи (Relations) — один юзер имеет много...
  decks                   Deck[]    // один-ко-многим
  sessions                Session[]
  passwordResetTokens     PasswordResetToken[]
  emailVerificationTokens EmailVerificationToken[]
}

// Session — хранит refresh-токены активных сессий
model Session {
  id           String   @id @default(cuid())
  userId       String           // FK (Foreign Key) → ссылка на User.id
  refreshToken String   @unique
  expiresAt    DateTime
  createdAt    DateTime @default(now())

  // @relation — объявляем связь явно
  // fields: [userId] → поле в этой таблице
  // references: [id] → поле в таблице User
  user         User     @relation(fields: [userId], references: [id])
}

// PasswordResetToken — токен для сброса пароля
model PasswordResetToken {
  id        String   @id @default(cuid())
  token     String   @unique
  userId    String
  expiresAt DateTime    // Живёт 1 час, потом удаляется
  createdAt DateTime @default(now())
  user      User     @relation(fields: [userId], references: [id])
}

// EmailVerificationToken — токен для подтверждения email
model EmailVerificationToken {
  id        String   @id @default(cuid())
  token     String   @unique
  userId    String
  expiresAt DateTime    // Живёт 24 часа
  createdAt DateTime @default(now())
  user      User     @relation(fields: [userId], references: [id])
}

// Deck — колода карточек
model Deck {
  id          String   @id @default(cuid())
  title       String
  description String?  // Необязательное поле
  userId      String   // Чья колода
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  user        User     @relation(fields: [userId], references: [id])
  cards       Card[]   // В колоде много карточек
}

// Card — одна карточка
model Card {
  id        String   @id @default(cuid())
  front     String   // Лицевая сторона (вопрос)
  back      String   // Обратная сторона (ответ)
  deckId    String
  createdAt DateTime @default(now())
  deck      Deck     @relation(fields: [deckId], references: [id])
}
```

**Почему отдельные таблицы для токенов?**
Токен сброса пароля живёт 1 час → удаляется. Хранить его в User → нужно было бы обнулять поля.
Отдельная таблица → удаляем запись когда токен использован. Чисто и просто.

---

## 6. Потоки данных

### Регистрация нового пользователя

```
1. Пользователь заполняет форму → submit
2. RegistrationForm → useAuthStore().registration(payload)
3. authStore: set({ isLoading: true })
4. registerAction(payload)                        [Server Action]
5. apiFetch POST /api/v1/registration
6. NestJS: AuthController.register()
7. AuthService.register():
   a. Проверяет: пароли совпадают?
   b. findByEmail → email занят?
   c. bcrypt.hash(password, 10) → хеш пароля
   d. prisma.user.create()
   e. sendVerificationEmail() → createToken → Resend API → письмо
   f. return { job_id: "uuid" }
8. authStore: set({ pendingEmail: email, isLoading: false })
9. UI: редирект на /email-confirmation
```

### Логин

```
1. LoginForm → authStore.login(email, password)
2. loginAction(payload)                           [Server Action]
3. apiFetch POST /api/v1/login
4. AuthService.login():
   a. findByEmail ?? findByUsername
   b. bcrypt.compare(password, hash) → совпадает?
   c. jwt.sign({ sub: userId }) → accessToken
   d. prisma.session.create({ refreshToken }) → сессия в БД
   e. return { access_token, email_is_verified }
5. loginAction: cookieStore.set('token', accessToken, httpOnly)
6. authStore: set({ accessToken, isAuthenticated: true })
7. void get().fetchProfile()                      [фоново]
8. UI: редирект на /dashboard
```

### Получить колоды (защищённый запрос)

```
1. Dashboard монтируется
2. useQuery(['decks']) запускает queryFn
3. apiFetch GET /api/v1/decks, { token: accessToken }
4. fetch добавляет заголовок: Authorization: Bearer eyJhb...
5. NestJS: @UseGuards(AuthGuard('jwt')) срабатывает
6. JwtStrategy проверяет подпись токена
7. Токен валидный → req.user = { id: "...", email: "..." }
8. DecksController.findAll(req)
9. DecksService.findAll(userId)
10. prisma.deck.findMany({ where: { userId }, include: { _count } })
11. Ответ: [{ id, title, _count: { cards: 3 } }, ...]
12. TanStack Query кеширует данные
13. DecksList ре-рендерится с данными
```

---

## 7. Переменные окружения

### Frontend (`.env.local`)

```bash
# URL бэкенда. Используется в Server Actions через apiFetch
API_URL=http://localhost:3001/api/v1

# Токен для UploadThing (загрузка аватаров на облако)
UPLOADTHING_TOKEN=eyJhcGlLZXkiOi...
```

### Backend (`.env`)

```bash
# Строка подключения к PostgreSQL
DATABASE_URL="postgresql://user:pass@host:5432/database"

# Секрет для подписи JWT токенов — НИКОГДА никому не показывать!
# Если утечёт — любой сможет подделать токен любого пользователя
JWT_SECRET="your-super-secret-random-key"

# API ключ Resend для отправки email
RESEND_API_KEY="re_xxxxxxxx"

# Данные Google OAuth (из console.cloud.google.com)
GOOGLE_CLIENT_ID="xxx.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="GOCSPX-xxx"
GOOGLE_CALLBACK_URL="http://localhost:3001/api/v1/google/callback"

# URL фронтенда — вставляется в ссылки в письмах
FRONTEND_URL="http://localhost:3000"

# Опционально: все письма идут на этот адрес в режиме разработки
DEV_EMAIL="dev@example.com"
```
