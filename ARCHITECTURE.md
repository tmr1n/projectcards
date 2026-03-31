# Архитектура проекта

## Общая схема слоёв

```
Браузер (клиент)
├── Компоненты (LoginForm, RegistrationForm, Header...)
├── Zustand (authStore)          ← глобальное UI-состояние
└── TanStack Query               ← кеш данных с сервера

Next.js сервер
└── Server Actions (auth.actions.ts)   ← выполняются только здесь

Внешний бэкенд
└── https://app.155.212.216.106.nip.io/api/v1
```

---

## Файлы и связи

### `src/config/api.config.ts`
**Что:** Хранит `API_BASE_URL` — базовый URL бэкенда.
**Зачем:** Одно место для смены URL. Меняешь здесь — меняется везде.

```
api.config.ts
    └─► lib/api.ts   (импортирует API_BASE_URL)
```

---

### `src/lib/api.ts`
**Что:** `apiFetch<T>(endpoint, options)` — базовый HTTP-клиент. Добавляет заголовки, парсит JSON, кидает `ApiError` при 4xx/5xx.
**Зачем:** Единая точка всех HTTP-запросов. Не дублируем headers/JSON.stringify в каждом action.

```
lib/api.ts
    ├─► config/api.config.ts    (берёт BASE_URL)
    ├─► shared/types/api.types  (тип IApiResponse<T> для возврата)
    └── экспортирует: apiFetch, ApiError
```

---

### `src/shared/types/api-schema.ts`  ⚠️ автогенерация
**Что:** TypeScript-типы всех эндпоинтов бэкенда. Генерируется командой `bun run api:types`.
**Зачем:** Типы точно соответствуют реальному API. Не нужно писать вручную и угадывать поля.

```
api-schema.ts
    ├─► server-actions/auth.actions.ts  (LoginPayload, RegisterPayload...)
    └─► store/authStore.ts              (RegisterPayload)
```

> Не редактировать вручную. При изменении API → `bun run api:types`.

---

### `src/shared/types/api.types.ts`
**Что:** `IApiResponse<T>` — универсальная обёртка ответа `{ data, message, success }`. `IApiError` — тип ошибки.
**Зачем:** Все ответы бэкенда имеют одинаковую структуру — описываем один раз.

```
api.types.ts
    └─► lib/api.ts   (используется внутри apiFetch)
```

---

### `src/server-actions/auth.actions.ts`  ⚠️ только сервер
**Что:** Функции `loginAction`, `registerAction`, `logoutAction`, `refreshTokenAction`, `updatePasswordAction`. Делают HTTP-запросы к бэкенду.
**Зачем:** Запросы к бэкенду идут через Next.js-сервер, а не напрямую из браузера. Токен не светится в DevTools, не нужен CORS.

```
auth.actions.ts
    ├─► lib/api.ts              (вызывает apiFetch)
    └─► shared/types/api-schema (типы payload и response)
```

Вызывается из:
```
store/authStore.ts  →  auth.actions.ts  →  apiFetch  →  Backend
```

---

### `src/store/authStore.ts`
**Что:** Zustand-стор. Хранит `accessToken`, `isAuthenticated`, `pendingEmail`, `twoFactorToken`, ошибки. Методы: `login`, `registration`, `logout`, `clearError`.
**Зачем:** Глобальное состояние авторизации. Любой компонент читает его напрямую без prop drilling.

```
authStore.ts
    ├─► server-actions/auth.actions.ts  (вызывает loginAction и др.)
    └─► shared/types/api-schema         (тип RegisterPayload)
```

Persist в `localStorage` → пользователь остаётся залогинен после перезагрузки.

Читается из:
```
LoginForm, RegistrationForm, ChangePasswordForm, Header, email-confirmation/page
```

---

### `src/schemas/auth.schema.ts`
**Что:** Zod-схемы валидации форм (`loginSchema`, `registrationSchema`, `changePasswordSchema`).
**Зачем:** Валидация на клиенте до отправки на сервер. Типы формы выводятся из схемы автоматически.

```
auth.schema.ts
    └─► компоненты форм  (LoginForm, RegistrationForm, ChangePasswordForm)
```

---

### `src/middleware.ts`
**Что:** Next.js Middleware. Проверяет cookie `token` перед каждым запросом к защищённым роутам.
**Зачем:** Защита роутов `/dashboard`, `/profile` — без токена редирект на `/login`.

> ⚠️ Сейчас смотрит на cookie `token`, но `authStore` хранит токен в `localStorage`. Это рассинхрон — нужно будет чинить.

---

### `src/lib/queryClient.ts`
**Что:** Экземпляр `QueryClient` с настройками кеша (staleTime: 5 мин, gcTime: 10 мин).
**Зачем:** TanStack Query нужен один клиент на всё приложение. Здесь задаём дефолтное поведение всех запросов.

```
queryClient.ts
    └─► providers/QueryProvider  (передаётся в <QueryClientProvider>)
```

---

## Полный поток: логин пользователя

```
1. LoginForm.onSubmit(email, password)
        │
        ▼
2. authStore.login(email, password)
   set({ isLoading: true })
        │
        ▼
3. loginAction({ email, password })        ← Server Action (сервер)
        │
        ▼
4. apiFetch('/login', { method: 'POST', body })
   + заголовки Content-Type, Accept
        │
        ▼
5. Backend API → ответ:
   { data: { access_token, email_is_verified } }
   ИЛИ
   { data: { two_factor_token, ... } }
        │
        ▼
6. authStore получает результат:
   - обычный логин → set({ accessToken, isAuthenticated: email_is_verified })
   - 2FA           → set({ twoFactorToken })
   - ошибка 422    → set({ serverFieldErrors })   → показываются в форме
   - ошибка 401    → set({ error })               → красный баннер
        │
        ▼
7. LoginForm читает useAuthStore.getState()
   isAuthenticated → /dashboard
   !isAuthenticated → /email-confirmation
```

---

## Полный поток: регистрация

```
1. RegistrationForm.onSubmit(data)
        │
        ▼
2. authStore.registration({ name, email, password, ... })
        │
        ▼
3. registerAction(payload)              ← Server Action
        │
        ▼
4. apiFetch('/registration', { body })
        │
        ▼
5. Backend → { data: { job_id } }       ← юзера нет, только фоновая задача
        │
        ▼
6. authStore: set({ pendingEmail: email })
   isAuthenticated остаётся false
        │
        ▼
7. RegistrationForm → router.push('/email-confirmation')
```

---

## Что где хранится

| Данные | Где | Почему |
|---|---|---|
| `accessToken` | Zustand → localStorage | Нужен в каждом запросе, должен пережить перезагрузку |
| `isAuthenticated` | Zustand → localStorage | Быстрая проверка без запроса к серверу |
| `pendingEmail` | Zustand → localStorage | Нужен на странице подтверждения email |
| Данные с сервера (колоды, карточки) | TanStack Query cache | Серверное состояние — кешируется, инвалидируется |
| Ошибки форм | Zustand (НЕ localStorage) | Временные, не нужны после перезагрузки |
| Защита роутов | middleware.ts cookie | Работает до рендера страницы |
