<div align="center">

# LangCards

**Lernkarten-App zum Sprachenlernen — dein eigenes Quizlet, von Grund auf selbst gebaut.**

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06b6d4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Bun](https://img.shields.io/badge/Bun-latest-fbf0df?logo=bun)](https://bun.sh)

</div>

---

> Nicht-kommerzielles Lernprojekt.

## Worum geht es

LangCards ist eine Lernplattform mit Karteikarten: Stapel anlegen, Vokabeln lernen, Fortschritt verfolgen. Wie Quizlet — nur mit eigenem Code. Dies ist das Frontend; das [Backend (NestJS)](https://github.com/tmr1n/cards-api) liegt in einem separaten Repository.

## Tech-Stack

| Bereich | Technologie |
|---|---|
| Framework | Next.js 16 (App Router) |
| Sprache | TypeScript 5 |
| Styling | Tailwind CSS 4 |
| State | Zustand 5 (mit persist) |
| Daten | TanStack Query |
| Formulare | React Hook Form + Zod |
| Sprachen | next-intl (Deutsch, Englisch, Russisch) |
| Animationen | Framer Motion |
| Runtime | Bun |

## Lokal starten

Voraussetzung: das laufende [Backend](https://github.com/tmr1n/cards-api).

```bash
bun install
bun dev
```

App öffnen: [http://localhost:3000](http://localhost:3000).

## Struktur

```
src/
├── app/[locale]/
│   ├── (auth)/        # Login, Registrierung, Passwort-Reset
│   ├── (public)/      # Landingpage, Nutzungsbedingungen
│   └── dashboard/ profile/ modules/   # geschützte Bereiche
├── components/        # UI-Komponenten
├── store/             # Zustand-Stores
├── server-actions/    # Next.js Server Actions
├── i18n/              # next-intl Konfiguration
└── messages/          # Übersetzungen (de, en, ru)
```

## Hinweis

Nicht-kommerzielles Lernprojekt, inspiriert von Quizlet. Nutzungsbedingungen in der App unter `/terms`.
