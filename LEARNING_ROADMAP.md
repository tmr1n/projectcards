# План изучения проекта — шаг за шагом
> Для тех кто хочет понять как это всё работает, а не просто скопировать.
> Следуй по порядку. Не прыгай вперёд — каждый шаг стоит на предыдущем.

---

## Сколько времени нужно

| Раздел | Время (2-3ч/день) |
|---|---|
| Фундамент (JS/TS/React) | 3-4 дня |
| Frontend архитектура | 3 дня |
| Backend архитектура | 3 дня |
| Связка фронт ↔ бэк | 2 дня |
| **Итого** | **~2 недели** |

Это реалистичная оценка. Не торопись — лучше понять медленно, чем пробежать быстро и не понять ничего.

---

## ФАЗА 1 — Фундамент (дни 1-4)

Без этого дальше не пойдёшь. Если что-то знаешь — просто проверь.

### День 1: JavaScript/TypeScript основы

**Понять эти конструкции (они в коде везде):**

```javascript
// 1. Деструктуризация объекта
const { body, token, ...restOptions } = options
//     ^^^^  ^^^^^  ^^^^^^^^^^^

// ----------Но как мы потом их используем?
//     Достаём поля из объекта в отдельные переменные
//     ...restOptions = "всё остальное что не назвали"

// 2. Spread оператор
const headers = {
    ...existingHeaders,   // Разворачивает объект — все его поля попадают сюда
    Authorization: 'Bearer ...'
}

const headers = {
   ...existingHeaders,
   Authorization: 'Bearer..'
}

// 3. Optional chaining ?.
const message = apiError?.message   // Если apiError = null → message = undefined
//                      ^^          Без этого: apiError.message → TypeError!

const message = apiError?.message // условие, если вдруг ApiError = null, то message будет равен undefined

// 4. Nullish coalescing ??
const url = process.env.API_URL ?? 'http://localhost:3001'



const url = process.env.Api_URL ?? 'localhost..' // Если слева null/undefined, то возьмёт правое
//                               ^^
//                               Если слева null/undefined → берём правое








// 5. Conditional spread
const obj = {
    ...(token && { Authorization: `Bearer ${token}` })
    //  ^^^^^^^   ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    //  Если token есть → разворачиваем { Authorization: ... }
    //  Если token нет  → false && {...} = false → spread {} = ничего
}

// 6. async/await
async function login() {
    const result = await apiFetch('/login', {...})
    //             ^^^^^
    //             "Подожди пока промис выполнится, потом продолжи"
    //             Без await: result = Promise { pending } (не данные!)
}

// 7. try/catch
try {
    const data = await fetch(url)  // Может выбросить ошибку
} catch (err) {
    // Если выбросило — попадаем сюда
    if (err instanceof ApiError) { ... }
    //                 ^^^^^^^^^
    //                 instanceof проверяет тип ошибки
}
```

**Регулярные выражения (RegExp) — минимум:**
```javascript
// /паттерн/ — литеральный синтаксис RegExp
const re = /^[A-Za-z]/
//          ^          = начало строки
//           [A-Za-z]  = один из символов A-Z или a-z

re.test("Hello")  // → true (начинается с буквы)
re.test("123")    // → false (начинается с цифры)

// Флаги
/пробел/g    // g = global: заменить ВСЕ вхождения (replace)
/текст/i     // i = ignore case: без учёта регистра

// Метасимволы
\s  = пробел/таб/перенос строки
\d  = цифра (0-9)
*   = 0 или больше предыдущего символа
+   = 1 или больше
?   = 0 или 1
$   = конец строки
```

**Практика:** Открой консоль DevTools и поиграй с регулярками.

---

### День 2: TypeScript

**Что нужно знать:**

```typescript
// 1. Интерфейсы
interface IUser {
    id: string        // обязательное поле
    email: string
    avatarUrl: string | null   // string ИЛИ null
}

// 2. Generics (шаблонные типы)
// T — это "дырка" которую заполняем при вызове
interface IApiResponse<T> {
    success: boolean
    data: T    // тип данных зависит от того что передали как T
}

interface IApiResponse<T>{
   success: boolean,
   data: T // тип данных зависит от того, что передали в T
}

// Используем:
apiFetch<IUser>('/profile')    // data будет типа IUser
apiFetch<IDeck[]>('/decks')    // data будет массивом IDeck

// 3. Union types (объединение типов)
type ILoginResponse =
    | { access_token: string; email_is_verified: boolean }   // обычный логин
    | { two_factor_token: string }                            // 2FA включена

// Проверяем какой вариант пришёл:
if ('access_token' in response) {
    // TypeScript теперь знает что response.access_token существует
}

// 4. as const — запрещает изменение
const VALIDATION = {
    minLength: 3,
    pattern: /^[A-Za-z]/,
} as const    // Все поля становятся readonly

// 5. Partial<T> — все поля становятся необязательными
// Partial<{ a: string; b: number }> = { a?: string; b?: number }

// 6. Record<K, V> — объект с ключами типа K и значениями типа V
// Record<string, string[]> = { [любая строка]: массив строк }
// Пример: { email: ['уже занят'], username: ['слишком короткое'] }
```

---

### День 3: React основы

**Что нужно понять про React:**

```tsx
// 1. Компонент — функция которая возвращает JSX
function LoginForm() {
    // Хуки — специальные функции React (начинаются с use)
    const [email, setEmail] = useState('')
    //     ^^^^^  ^^^^^^^^^   ^^^^^^^^^^
    //     значение   обновить    начальное значение

    // useEffect — запускается после рендера
    useEffect(() => {
        // Тут сайд-эффекты: подписки, таймеры, запросы...
    }, [dependency])
    //  ^^^^^^^^^^^^ Зависимости: если изменятся — эффект перезапустится

    return (
        <form onSubmit={handleSubmit}>
            <input value={email} onChange={e => setEmail(e.target.value)} />
        </form>
    )
}

// 2. Props — данные от родителя к ребёнку
function Button({ text, onClick }: { text: string; onClick: () => void }) {
    return <button onClick={onClick}>{text}</button>
}

// Используем:
<Button text="Войти" onClick={() => console.log('click')} />

// 3. Кастомный хук — выносим логику из компонента
function useAuthStore(selector) {
    // ...
}
// Используем в компоненте:
const user = useAuthStore(state => state.user)
```

**Что такое re-render?**
Компонент перерисовывается когда:
- Изменился state (`useState`)
- Изменились props
- Изменился Zustand store который он читает

---

### День 4: Next.js App Router

**Ключевые концепции:**

```
1. ФАЙЛОВАЯ МАРШРУТИЗАЦИЯ
   src/app/[locale]/login/page.tsx → /ru/login, /en/login

   Специальные файлы:
   page.tsx     = страница (рендерится по URL)
   layout.tsx   = оболочка (не меняется при навигации внутри)
   loading.tsx  = показывается пока page.tsx загружается
   error.tsx    = показывается если page.tsx упал с ошибкой

2. SERVER vs CLIENT компоненты
   По умолчанию: компонент серверный (выполняется на сервере)
   'use client' вверху файла → клиентский (выполняется в браузере)
   
   Серверный: не имеет useState, useEffect, onClick
   Клиентский: полный React с хуками и событиями

3. SERVER ACTIONS
   'use server' вверху файла или функции
   Запускается НА СЕРВЕРЕ, вызывается из клиентского кода
   Может читать куки, env-переменные, ходить к бэкенду напрямую

4. [locale] в пути — динамический сегмент
   [locale] = любое значение: ru, en, de
   В компоненте: const { locale } = useParams()
```

---

## ФАЗА 2 — Frontend (дни 5-7)

Теперь изучаем фронт этого проекта.

### День 5: Типы, схемы, константы

**Маршрут изучения (в таком порядке):**

1. **`src/shared/types/api.types.ts`**
   - Понять: IApiResponse<T> — это шаблон ответа бэкенда
   - Понять: IApiError — когда бэкенд отвечает ошибкой

2. **`src/shared/types/auth.types.ts`**
   - Понять: IUser — что знаем о пользователе
   - Понять: ILoginResponse — union type (два варианта ответа)

3. **`src/constants/validation.ts`**
   - Разобрать регулярки (см. объяснение в ARCHITECTURE.md)
   - Понять: USERNAME_HINTS и PASSWORD_HINTS — для отображения подсказок

4. **`src/schemas/auth.schema.ts`**
   - Понять как Zod строит схему из константных правил
   - Понять: zodResolver — мост между Zod и React Hook Form

**Ключевой вопрос для самопроверки:**
> Почему validation.ts, auth.schema.ts и формы — это три отдельных слоя, а не всё в одном файле?

---

### День 6: HTTP-клиент и Server Actions

**Маршрут изучения:**

1. **`src/config/api.config.ts`** — откуда берётся URL бэкенда

2. **`src/lib/api.ts`** — разбери каждую строку (объяснения в ARCHITECTURE.md)
   - Понять класс ApiError и зачем он нужен
   - Понять заголовки запроса
   - Понять как conditional spread добавляет Authorization

3. **`src/server-actions/auth.actions.ts`**
   - Понять что `'use server'` — это Server Action
   - Разобрать loginAction: try/catch, куки, результат
   - Понять пустой catch в logoutAction — почему это правильно

4. **`src/lib/translateBackendError.ts`**
   - Понять зачем переводить ошибки бэкенда

**Практическое задание:**
Открой DevTools → Network → попробуй залогиниться → найди запрос к `/api/v1/login` → посмотри Headers и Response.

---

### День 7: Zustand Store

**Маршрут изучения:**

1. **`src/store/authStore.ts`** — самый важный файл фронта
   
   Прочитай трижды:
   - Первый раз: понять структуру (state + actions)
   - Второй раз: разобрать action `login` строку за строкой
   - Третий раз: понять persist middleware и partialize

2. **Нарисуй схему** (на бумаге):
   ```
   LoginForm → authStore.login() → loginAction() → apiFetch() → бэкенд
   бэкенд → apiFetch → loginAction → authStore.set() → LoginForm ре-рендерится
   ```

3. **Посмотри в браузере:**
   - DevTools → Application → Local Storage → `langcards-auth`
   - Залогинься → посмотри что сохранилось
   - Разлогинься → посмотри как данные стёрлись

**Ключевой вопрос:**
> Что произойдёт с isLoading если бэкенд не ответил 30 секунд?
> Подсказка: найди в loginAction — всегда ли вызывается `set({ isLoading: false })`?

---

## ФАЗА 3 — Backend (дни 8-10)

### День 8: NestJS концепции

**Четыре кита NestJS:**

```
1. MODULE (@Module)
   Организационная единица. Объединяет контроллеры и сервисы.
   AppModule → AuthModule, DecksModule, CardsModule, UsersModule...

2. CONTROLLER (@Controller, @Get, @Post...)
   Принимает HTTP запросы. Вызывает сервис. Возвращает ответ.
   НЕ должен содержать бизнес-логику — только роутинг.

3. SERVICE (@Injectable)
   Бизнес-логика. Работа с данными. Может вызывать другие сервисы.
   Инжектируется в контроллеры и другие сервисы.

4. DTO (Data Transfer Object)
   Класс с декораторами class-validator.
   Описывает что ожидаем в теле запроса.
   ValidationPipe автоматически проверяет входящие данные.
```

**Dependency Injection:**
```typescript
// Это:
class DecksController {
    constructor(private decksService: DecksService) {}
}

// Равносильно этому (но NestJS делает это за нас):
class DecksController {
    private decksService: DecksService
    constructor() {
        this.decksService = new DecksService(new PrismaService())
    }
}
```

**Изучи файлы в таком порядке:**
1. `src/main.ts` — точка входа, как всё настраивается
2. `src/app.module.ts` — как модули связаны
3. `src/auth/auth.module.ts` — пример модуля со всеми настройками

---

### День 9: Авторизация и JWT

**Что такое JWT (JSON Web Token):**
```
JWT выглядит так: eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VyMTIzIn0.SIGNATURE
                  ^^^^^^^^^^^^^^^^^^^  ^^^^^^^^^^^^^^^^^^^^^^  ^^^^^^^^^
                  Header (алгоритм)    Payload (данные)        Подпись

Payload хранит: { sub: userId, email, iat: (выдан в), exp: (истекает) }
Payload ВИДЕН всем! Не клади туда секреты.
Подпись защищает от подделки (нужен JWT_SECRET).

access_token:  Живёт 15 минут. Отправляем в каждом запросе в заголовке.
refresh_token: Живёт 30 дней. Хранится в БД. Обменивается на новый access_token.
```

**Изучи в таком порядке:**
1. `src/auth/strategies/jwt.strategy.ts` — как проверяется токен
2. `src/auth/auth.service.ts`:
   - Метод `login()` — как создаётся токен
   - Метод `refresh()` — как обновляется
   - Метод `register()` — bcrypt и верификация email
3. `src/auth/auth.controller.ts` — какие маршруты есть

**Нарисуй схему токенов:**
```
Логин → access_token (15 мин) + refresh_token (30 дней, в БД)
               ↓
Запрос к /decks: Authorization: Bearer <access_token>
               ↓
Токен протух → POST /refresh с refresh_token в cookie → новый access_token
```

---

### День 10: База данных и Prisma

**Что такое ORM (Object-Relational Mapping):**
```
Без ORM: await db.query('SELECT * FROM "Deck" WHERE "userId" = $1', [userId])
С Prisma: await prisma.deck.findMany({ where: { userId } })

Prisma генерирует TypeScript типы из schema.prisma.
Ты получаешь автодополнение и проверку типов бесплатно.
```

**Изучи в таком порядке:**
1. `prisma/schema.prisma` — схема всей БД (объяснение в ARCHITECTURE.md)
2. `src/prisma/prisma.service.ts` — как Prisma подключается
3. `src/decks/decks.service.ts` — CRUD операции: findMany, findUnique, create, update, delete
4. `src/users/users.service.ts` — deleteById: каскадное удаление

**Ключевые понятия Prisma:**
```typescript
// findMany — найти много записей
prisma.deck.findMany({ where: { userId }, include: { cards: true } })

// findUnique — найти одну по уникальному полю
prisma.user.findUnique({ where: { email: 'a@b.com' } })

// create — создать запись
prisma.user.create({ data: { email, username, passwordHash } })

// update — обновить
prisma.user.update({ where: { id }, data: { username } })

// delete — удалить
prisma.deck.delete({ where: { id } })

// _count — считаем связанные записи (без загрузки)
include: { _count: { select: { cards: true } } }
// Результат: { _count: { cards: 5 } }
```

---

## ФАЗА 4 — Связка фронт ↔ бэк (дни 11-12)

### День 11: Полный поток логина

Проследи весь путь вручную, открыв оба проекта:

**Шаг 1: Форма** (фронт)
- Найди `src/components/page-components/LoginForm.tsx`
- Найди вызов `useAuthStore` и что вызывается при submit

**Шаг 2: Store** (фронт)
- Открой `src/store/authStore.ts`
- Найди action `login`
- Проследи вызов `loginAction`

**Шаг 3: Server Action** (фронт)
- Открой `src/server-actions/auth.actions.ts`
- Найди `loginAction`
- Проследи вызов `apiFetch`

**Шаг 4: HTTP запрос**
- Открой `src/lib/api.ts`
- Проследи как собираются заголовки
- Найди куда идёт fetch

**Шаг 5: Контроллер** (бэк)
- Открой `src/auth/auth.controller.ts`
- Найди метод для POST /login
- Проследи вызов authService.login

**Шаг 6: Сервис** (бэк)
- Открой `src/auth/auth.service.ts`
- Разбери метод login по строкам

**Шаг 7: БД** (бэк)
- Найди в auth.service.ts вызовы prisma
- Что создаётся в БД после логина?

---

### День 12: Обработка ошибок

Проследи поток ОШИБКИ:

```
Пользователь ввёл неверный пароль
              ↓
AuthService.login() бросает UnauthorizedException
              ↓
NestJS перехватывает исключение
Отправляет: { statusCode: 401, message: 'Invalid credentials' }
              ↓
apiFetch: response.ok = false → throw new ApiError(401, 'Invalid credentials')
              ↓
loginAction: catch (err) → translateApiError(err) → переводит ошибку
              ↓
authStore: set({ error: 'Неверный логин или пароль' })
              ↓
LoginForm: читает store.error → показывает красный баннер
```

**Изучи файл** `src/lib/translateBackendError.ts` — как переводятся ошибки.

---

## Самопроверочные вопросы

После изучения ответь на эти вопросы. Если не можешь — возвращайся к нужному разделу.

### Frontend
1. Зачем нужен Zustand если есть React useState?
2. Что такое Server Action и чем он отличается от обычной функции?
3. Почему логин токен хранится в httpOnly cookie, а не в localStorage?
4. Что делает `partialize` в persist middleware?
5. Что произойдёт если убрать `?` из `apiError?.message`?
6. Зачем отдельный класс ApiError вместо обычного Error?
7. Что делает `.slice(2, 7)` в resolveUniqueUsername?

### Backend
1. Зачем ValidationPipe с `whitelist: true`?
2. Зачем отдельная таблица Session вместо хранения refresh-токена в User?
3. Почему нельзя просто хранить пароль в открытом виде?
4. Что происходит если кто-то пошлёт GET /decks/чужой-id?
5. Зачем `@Injectable()` декоратор?
6. Почему forgotPassword не кидает ошибку если email не найден?
7. Что будет если JWT_SECRET утечёт?

---

## Полезные команды

### Frontend
```bash
# Запустить фронт
bun dev

# Проверить типы
bun tsc --noEmit
```

### Backend
```bash
# Запустить бэк в режиме разработки (с перезагрузкой)
bun run start:dev

# Создать миграцию после изменения schema.prisma
bun prisma migrate dev --name "название"

# Сгенерировать Prisma Client (после изменения схемы)
bun prisma generate

# Посмотреть БД в браузере
bun prisma studio
```

---

## Задачи для практики (в порядке сложности)

Это не теория — это практика. Делай только когда уверен в понимании.

1. **Просто:** Добавь поле `color` к Deck (выбрать цвет колоды)
   - В schema.prisma: добавь `color String? @default("blue")`
   - В create-deck.dto.ts: добавь поле
   - В CreateDeckDto на фронте: добавь поле

2. **Средне:** Добавь сортировку колод (по дате или алфавиту)
   - Фронт: query parameter `sort=title` или `sort=date`
   - Бэк: `orderBy: sort === 'title' ? { title: 'asc' } : { createdAt: 'desc' }`

3. **Сложно:** Добавь счётчик сколько раз карточка была показана
   - В Card: новое поле `viewCount Int @default(0)`
   - Эндпоинт PATCH /cards/:id/view
   - Фронт вызывает его при показе карточки
