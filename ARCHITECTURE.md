# Архитектура: Store + Server Actions + API

> Как работает авторизация от нажатия кнопки до сохранения пользователя.
> Написано для джунов — без воды.

---

## Карта файлов

```
src/
├── config/
│   └── api.config.ts          ← 🔧 один URL бэкенда для всего проекта
├── shared/types/
│   └── api.types.ts           ← 📐 TypeScript-контракты (формы ответов)
├── lib/
│   └── api.ts                 ← 🌐 HTTP-клиент (делает fetch, бросает ошибки)
├── server-actions/
│   └── auth.actions.ts        ← ⚙️  Server Actions (выполняются на сервере)
└── store/
    └── authStore.ts           ← 🧠 Глобальный стейт (Zustand)
```

---

## Полная схема потока данных

```
  БРАУЗЕР (клиент)                    NEXT.JS СЕРВЕР              БЭКЕНД
  ─────────────────                   ──────────────              ──────────────────

  LoginForm
  [Пользователь нажал "Войти"]
         │
         ▼
  ┌──────────────────┐
  │   authStore.ts   │  ← useAuthStore(s => s.login)
  │                  │
  │  login(email,    │  1. set({ isLoading: true })
  │  password)       │     → кнопка показывает лоадер
  │                  │
  │  await           │
  │  loginAction()   │──────────────────────────────────►  auth.actions.ts
  └──────────────────┘                                     [Server Action]
         │                                                        │
         │                                                        │  apiFetch('/login',
         │                                                        │  { method: 'POST',
         │                                                        │    body: {email, pwd} })
         │                                                        │
         │                                                        ▼
         │                                                   ┌─────────────┐
         │                                                   │   lib/api.ts │
         │                                                   │             │
         │                                                   │ 1. Добавить │
         │                                                   │  заголовки  │
         │                                                   │  Content-   │
         │                                                   │  Type: json │
         │                                                   │             │
         │                                                   │ 2. fetch()  │──────────►  POST /api/v1/login
         │                                                   │             │            { email, password }
         │                                                   │ 3. Проверить│◄──────────  { data: { user,
         │                                                   │  response.ok│             tokens },
         │                                                   │             │             success: true }
         │                                                   │ 4. ok=false │
         │                                                   │  → throw    │
         │                                                   │  ApiError   │
         │                                                   └─────────────┘
         │                                                        │
         │◄───────────────────────────────────────────────────────┘
         │   Либо: IApiResponse<AuthResponse>
         │   Либо: throw ApiError
         │
         ▼
  ┌──────────────────┐
  │   authStore.ts   │
  │                  │
  │  try {           │
  │    set({         │  ✅ УСПЕХ:
  │      user,       │  → user, accessToken сохранены
  │      accessToken,│  → isAuthenticated = true
  │      isAuth:true │  → localStorage обновлён (persist)
  │    })            │  → лоадер исчезает
  │  } catch(err) {  │
  │    ApiError?     │  ❌ ОШИБКА 422 (неверный пароль):
  │    → fieldErrors │  → serverFieldErrors = { email: "..." }
  │    → error msg   │  → красный текст под полем формы
  │  }               │
  └──────────────────┘
         │
         ▼
  LoginForm перерисовывается
  (Zustand автоматически уведомил
   все подписанные компоненты)
```

---

## Каждый файл по отдельности

### 1. `api.config.ts` — откуда брать бэкенд

```
┌─────────────────────────────────┐
│         api.config.ts           │
│                                 │
│  .env.local:                    │
│    API_URL=http://localhost:8000 │
│             /api/v1             │
│                 │               │
│                 ▼               │
│  export const API_BASE_URL      │
│    = process.env.API_URL        │
│    ?? 'http://localhost:8000...'│
└─────────────────────────────────┘

Используется только в: lib/api.ts
```

**Зачем:** Один URL на весь проект. Меняешь `.env.local` — меняется везде.

**Важно:** Без `NEXT_PUBLIC_` префикса → переменная **только на сервере**. В браузер не утекает.

---

### 2. `api.types.ts` — контракты с бэкендом

```
┌─────────────────────────────────────────────────┐
│                  api.types.ts                   │
│                                                 │
│  IApiResponse<T>          IApiError             │
│  ┌─────────────────┐      ┌──────────────────┐  │
│  │ data:    T      │      │ message: string  │  │
│  │ message: string │      │ statusCode: num  │  │
│  │ success: boolean│      │ errors?: {       │  │
│  └─────────────────┘      │   email: ['...'] │  │
│                           │ }                │  │
│  Пример:                  └──────────────────┘  │
│  IApiResponse<IUser>                            │
│  {                                              │
│    data: { id: "1", email: "a@b.com", ... }     │
│    message: "Успешный вход"                     │
│    success: true                                │
│  }                                              │
└─────────────────────────────────────────────────┘

T = Generic. Ты говоришь "что придёт в data":
  IApiResponse<IUser>       → data это объект пользователя
  IApiResponse<AuthResponse>→ data это { user, tokens }
  IApiResponse<IDeck[]>     → data это массив колод
```

---

### 3. `lib/api.ts` — HTTP-клиент

```
┌─────────────────────────────────────────────────────┐
│                     lib/api.ts                      │
│                                                     │
│  apiFetch('/login', { method, body, token? })       │
│                                                     │
│  ┌──────────────────────────────────────────────┐   │
│  │ 1. Собрать headers                           │   │
│  │    Content-Type: application/json            │   │
│  │    Authorization: Bearer <token>  ← если есть│   │
│  │                                              │   │
│  │ 2. fetch(API_BASE_URL + endpoint, options)   │   │
│  │    ↓                                         │   │
│  │ 3. Если response.ok = false (4xx/5xx)        │   │
│  │    → throw new ApiError(status, msg, fields) │   │
│  │                                              │   │
│  │ 4. Если ok → return responseData            │   │
│  └──────────────────────────────────────────────┘   │
│                                                     │
│  class ApiError extends Error {                     │
│    statusCode: number   ← 401, 422, 500...          │
│    message: string      ← "Неверный пароль"         │
│    fieldErrors?: {...}  ← { email: ['занят'] }      │
│  }                                                  │
└─────────────────────────────────────────────────────┘

Зачем ApiError, а не обычный Error?
  Обычный Error: "что-то сломалось"
  ApiError:      statusCode=422, fieldErrors={email:['занят']}
  → authStore знает: показать ошибку именно под полем email
```

---

### 4. `auth.actions.ts` — Server Actions

```
┌──────────────────────────────────────────────────────────┐
│               auth.actions.ts                            │
│  'use server'  ← всё в этом файле выполняется на сервере │
│                                                          │
│  loginAction({ email, password })                        │
│    → apiFetch('/login', { method: 'POST', body })        │
│                                                          │
│  registerAction({ email, username, password })           │
│    → apiFetch('/registration', { method: 'POST', body }) │
│                                                          │
│  logoutAction(token)                                     │
│    → apiFetch('/logout', { method: 'POST', token })      │
│    → ошибки глотаем (logout всегда успешен для UI)       │
│                                                          │
│  refreshTokenAction()                                    │
│    → apiFetch('/refresh', { credentials: 'include' })    │
│    → credentials: 'include' = передать httpOnly cookies  │
└──────────────────────────────────────────────────────────┘

Зачем Server Actions, а не fetch прямо из компонента?

  ❌ Без Server Actions (fetch в браузере):
     Browser ──── POST /api/login ────► Backend
     Проблемы:
       - Нужен CORS на бэкенде
       - Запросы видны в DevTools → Network
       - URL бэкенда светится в браузере

  ✅ С Server Actions:
     Browser ──► Next.js Server ──── POST /api/login ────► Backend
     Плюсы:
       - CORS не нужен (сервер → сервер)
       - Запрос к бэкенду не виден в браузере
       - URL бэкенда только в .env на сервере
```

---

### 5. `authStore.ts` — глобальный стейт (Zustand)

```
┌────────────────────────────────────────────────────────────┐
│                      authStore.ts                          │
│                                                            │
│  STATE (данные):              ACTIONS (функции):           │
│  ┌──────────────────────┐     ┌────────────────────────┐   │
│  │ user: IUser | null   │     │ login(email, password) │   │
│  │ accessToken: string  │     │ registration(...)      │   │
│  │ isAuthenticated: bool│     │ logout()               │   │
│  │ isLoading: boolean   │     │ clearError()           │   │
│  │ error: string | null │     └────────────────────────┘   │
│  │ serverFieldErrors    │                                  │
│  └──────────────────────┘                                  │
│                                                            │
│  persist middleware:                                       │
│  ┌────────────────────────────────────────────────────┐    │
│  │ localStorage['langcards-auth'] = {                 │    │
│  │   user, accessToken, isAuthenticated               │    │
│  │ }                                                  │    │
│  │                                                    │    │
│  │ Сохраняем: user, accessToken, isAuthenticated      │    │
│  │ НЕ сохраняем: isLoading, error (они временные)     │    │
│  └────────────────────────────────────────────────────┘    │
└────────────────────────────────────────────────────────────┘

Как использовать в любом компоненте:
  const user   = useAuthStore(s => s.user)
  const login  = useAuthStore(s => s.login)
  const logout = useAuthStore(s => s.logout)
```

---

## Полный путь: что происходит при логине

```
Шаг 1. Пользователь вводит email + пароль и жмёт Submit
       LoginForm → onSubmit → authStore.login(email, password)

Шаг 2. authStore включает лоадер
       set({ isLoading: true }) → кнопка "Submit" показывает спиннер

Шаг 3. authStore вызывает Server Action
       await loginAction({ email, password })
       → Next.js незаметно для браузера отправляет на свой сервер

Шаг 4. Server Action вызывает apiFetch
       apiFetch('/login', { method: 'POST', body: { email, password } })

Шаг 5. apiFetch делает реальный HTTP запрос к бэкенду
       POST http://localhost:8000/api/v1/login
       Headers: { Content-Type: application/json }
       Body: { "email": "user@test.com", "password": "qwerty123" }

Шаг 6. Бэкенд отвечает
       200 OK:
         { data: { user: {...}, tokens: { accessToken: "eyJ..." } },
           message: "Успешный вход", success: true }

       или 422 Unprocessable Entity:
         { message: "Неверный пароль",
           statusCode: 422,
           errors: { password: ["Неверный пароль"] } }

Шаг 7a. Если 200 — apiFetch возвращает данные
        auth.actions → authStore
        set({ user, accessToken, isAuthenticated: true, isLoading: false })
        persist сохраняет в localStorage
        → LoginForm получает isAuthenticated=true → редирект на /dashboard

Шаг 7b. Если 4xx — apiFetch бросает ApiError
        auth.actions не ловит → прокидывает в authStore
        authStore ловит:
          if err.fieldErrors → set({ serverFieldErrors: { password: "Неверный пароль" } })
          else               → set({ error: "Общая ошибка сервера" })
        → форма показывает ошибку под нужным полем
```

---

## Путь ошибок

```
                    Что произошло              Где показывается
                    ─────────────────────────  ────────────────────────────
 Бэкенд вернул      statusCode: 422            Под конкретным полем формы
 ошибку поля:       fieldErrors: {             (через serverFieldErrors
                      email: ['уже занят']     в LabelComponent)
                    }

 Бэкенд вернул      statusCode: 401            Общий баннер ошибки
 общую ошибку:      message: "Неверный пароль" (через error в компоненте)

 Нет сети /         throw Error (не ApiError)  Общий баннер ошибки
 Next.js упал:                                 "Проверьте соединение"

 apiError глотается logoutAction               Нигде — logout всегда
 намеренно:                                    успешен для пользователя
```

---

## Токены: accessToken и refreshToken

```
  accessToken                         refreshToken
  ─────────────────────────────────   ──────────────────────────────────
  Живёт: ~15 минут                    Живёт: ~30 дней
  Хранится: localStorage (Zustand)    Хранится: httpOnly cookie
  Передаётся: Authorization: Bearer   Передаётся: автоматически браузером
  Виден JS: да                        Виден JS: НЕТ (защита от XSS)

  Когда accessToken истечёт (401):
  authStore → refreshTokenAction() → бэкенд видит cookie → выдаёт новый accessToken
  → authStore сохраняет новый токен → повторяет упавший запрос

  TODO: логика авто-обновления токена ещё не реализована в authStore
```

---

## Резюме: зачем каждый файл

| Файл | Роль | Аналогия |
|------|------|----------|
| `api.config.ts` | Один URL бэкенда | `.env` файл для URL |
| `api.types.ts` | Контракты ответов сервера | Схема базы данных |
| `lib/api.ts` | Делает HTTP запросы | Axios, но свой |
| `auth.actions.ts` | Мост: клиент → сервер → бэкенд | Контроллер в MVC |
| `authStore.ts` | Глобальный стейт приложения | Redux store, но проще |
