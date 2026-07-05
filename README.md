<div align="center">

# LangCards

**Lernkarten-App zum Sprachenlernen — dein eigenes Quizlet, von Grund auf selbst gebaut.**

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06b6d4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Bun](https://img.shields.io/badge/Bun-latest-fbf0df?logo=bun)](https://bun.sh)

**[Live-Demo](https://projectcards-production-202e.up.railway.app)** — Anmeldung per Google oder mit einem Klick als Demo-Gast, ohne Registrierung.

</div>

---

> Nicht-kommerzielles Lernprojekt.

## Worum geht es

LangCards ist eine Lernplattform mit Karteikarten: Stapel (Module) anlegen, Vokabeln lernen, Karten umdrehen — wie Quizlet, nur mit eigenem Code. Dies ist das Frontend; das [Backend (NestJS)](https://github.com/tmr1n/cards-api) liegt in einem separaten Repository.

## Features

- **Authentifizierung**: Google OAuth 2.0, klassisches Login (E-Mail/Benutzername + Passwort) und **Demo-Gastzugang** — ein temporäres Konto, das beim Logout automatisch vollständig gelöscht wird
- **Lernkarten**: Module (Stapel) und Karten erstellen, durchblättern, umdrehen — mit Vorlesefunktion (Web Speech API, läuft komplett im Browser)
- **Profil**: Avatar aus Vorlagen wählen oder eigenes Bild hochladen (via UploadThing)
- **Dreisprachig**: Deutsch, Englisch, Russisch (next-intl)
- **Datenschutz-bewusst**: nur technisch notwendige Cookies, kein Tracking, selbst gehostete Schriften, Impressum & Datenschutzerklärung

> Hinweis: Die Registrierung per E-Mail ist im Live-Deployment deaktiviert (die Hosting-Plattform blockiert ausgehendes SMTP). Lokal funktioniert der komplette E-Mail-Flow über Mailpit.

## Tech-Stack

| Bereich | Technologie |
|---|---|
| Framework | Next.js 16 (App Router, Server Actions) |
| Sprache | TypeScript 5 |
| Styling | Tailwind CSS 4 |
| State | Zustand 5 (mit persist) |
| Daten | TanStack Query |
| Formulare | React Hook Form + Zod |
| Sprachen | next-intl (de, en, ru) |
| Animationen | Framer Motion |
| Runtime | Bun |
| Hosting | Railway (EU, Amsterdam) |

## Architektur

```
[Browser]
   │ HTTPS
   ▼
[Next.js Frontend] ── Server Actions ──► [NestJS Backend /api/v1] ── Prisma ──► [PostgreSQL]
   │                                          │
   │ ◄── Google OAuth Redirect ──────────────┘
```

Der Browser spricht (fast) nie direkt mit dem Backend: alle Datenzugriffe laufen serverseitig über **Next.js Server Actions**, die die REST-API mit einem Bearer-JWT aufrufen. Einzige Ausnahme ist der Google-OAuth-Redirect.

<!-- TODO: Excalidraw-Architekturdiagramm einfügen (docs/architecture.png) -->

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
│   ├── (auth)/        # Login, Registrierung, Module, Lernkarten
│   ├── (public)/      # Landingpage, Impressum, Datenschutz, Nutzungsbedingungen
│   └── dashboard/ profile/   # geschützte Bereiche
├── components/        # UI-Komponenten
├── store/             # Zustand-Stores (Auth)
├── server-actions/    # Next.js Server Actions (API-Aufrufe)
├── i18n/              # next-intl Konfiguration
└── messages/          # Übersetzungen (de, en, ru)
```

## Hinweis

Nicht-kommerzielles Lernprojekt, inspiriert von Quizlet. Nutzungsbedingungen in der App unter `/terms`.
