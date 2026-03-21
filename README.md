<div align="center">

# LangCards

**Flashcard-based language learning app — your personal Quizlet, built from scratch.**

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06b6d4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Bun](https://img.shields.io/badge/Bun-latest-fbf0df?logo=bun)](https://bun.sh)

</div>

---

## What is this

LangCards is a flashcard learning platform. Create decks, study words with spaced repetition, track your progress. Think Quizlet — but you own the code.

## Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 |
| State | Zustand 5 (with persist) |
| Forms | React Hook Form + Zod |
| Animations | Framer Motion |
| Runtime | Bun |

## Getting started

```bash
bun install
bun dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project structure

```
src/
├── app/
│   ├── (auth)/        # login, registration, forgot-password
│   ├── (public)/      # landing page
│   └── (app)/         # protected: decks, study, profile
├── components/        # reusable UI components
├── store/             # Zustand stores
├── schemas/           # Zod validation schemas
├── hooks/             # custom React hooks
└── server-actions/    # Next.js server actions
```

## Roadmap

- [x] Auth pages (login, registration, forgot password)
- [x] Landing page with animations
- [ ] Deck management (create, edit, delete)
- [ ] Flashcard study mode
- [ ] Spaced repetition (FSRS algorithm)
- [ ] Test mode
- [ ] Match game
- [ ] OAuth (Google, Microsoft, Yandex)
- [ ] Progress tracking

## Commit convention

This project follows [Conventional Commits](https://www.conventionalcommits.org):

```
feat(decks): add create deck form
fix(auth): redirect loop on login
chore: update dependencies
```
