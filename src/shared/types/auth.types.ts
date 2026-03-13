// auth.types.ts — ДОМЕННЫЕ типы авторизации.
// Здесь описываем только бизнес-сущности (кто такой юзер, что такое сессия),
// а НЕ пропсы React-компонентов (для них есть form.types.ts и layout.types.ts).

// Пользователь системы — основная сущность
export interface IUser {
	id: string
	email: string
	username: string
	createdAt: string // ISO 8601 формат: "2024-01-15T10:30:00Z"
}

// Сессия — хранит данные текущего залогиненного пользователя
export interface ISession {
	user: IUser
	accessToken: string // JWT токен для API запросов (короткоживущий)
	expiresAt: string   // Когда сессия истекает
}

// Токены — выдаются сервером после успешного входа в систему
export interface IAuthTokens {
	accessToken: string  // Короткоживущий (15 мин) — используется в каждом API-запросе
	refreshToken: string // Долгоживущий (30 дней) — используется для обновления accessToken
}
