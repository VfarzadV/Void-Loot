![Void Loot logo](public/android-chrome-192x192.png)

# Void Loot

**A bilingual gaming storefront and community demo built with Next.js.**

[![Next.js](https://img.shields.io/badge/Next.js_16-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_4-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

[Source repository](https://github.com/VfarzadV/Void-Loot)

---

## About

Void Loot is a test/demo gaming storefront built with Next.js 16, React 19, and TypeScript. It includes English and Persian interfaces, game discovery, hardware and brand catalogs, user accounts, community features, and a 3D Loot Box experience.

This project is intended for local development and demonstration, not as a production store.

## Features

- Game discovery using the RAWG API, including search, filters, and game details.
- Product and brand storefront backed by SQL Server and Prisma.
- User registration, login, profile, cart, wishlist, and order history.
- Community posts, comments, likes, notifications, and support tickets.
- English and Persian localization with RTL and LTR layouts.
- Interactive 3D Loot Box. Rewards are demo-only, have no cash or redemption value, and are limited to one draw per signed-in user per UTC day.
- Live page with simulated streams, viewer counts, and chat.
- PWA manifest and installable app icons.

### Demo limitations

- Checkout records a pending order; it does not collect payment.
- Loot Box rewards are not redeemable.
- Live streams and chat are simulated.
- Password recovery and email newsletter signup are not connected to an email service.

## Tech stack

- Next.js 16 App Router and React 19
- TypeScript, Tailwind CSS 4, and Lucide
- Prisma with SQL Server
- Zustand and TanStack Query
- next-intl, Zod, React Hook Form
- Three.js, React Three Fiber, Drei, and Framer Motion

## Requirements

- Node.js 20.9 or newer
- npm
- A SQL Server database
- A RAWG API key for RAWG-powered game data

## Run locally

1. Clone the repository and install dependencies:

   ```bash
   git clone https://github.com/VfarzadV/Void-Loot.git
   cd Void-Loot
   npm install
   ```

2. Create a root `.env` file:

   ```env
   DATABASE_URL=your_sql_server_connection_string
   NEXT_PUBLIC_RAWG_API_KEY=your_rawg_api_key
   ```

   Prisma CLI reads `DATABASE_URL` from `.env`. The `NEXT_PUBLIC_` prefix means the RAWG key is available to client-side code; do not put private credentials in that variable. Environment files are ignored by Git.

3. Set up the database:

   For a new, empty database, apply all migrations:

   ```bash
   npx prisma migrate deploy
   ```

   The existing-database baseline (`0_init`) was generated from the project's original SQL Server schema. If using an existing Void Loot database with no Prisma migration history, first confirm its schema matches that baseline. Then mark the baseline as applied once and deploy the Loot Box migration:

   ```bash
   npx prisma migrate resolve --applied 0_init
   npx prisma migrate deploy
   ```

   `migrate resolve` only records migration history; it does not create the baseline tables. Do not mark `0_init` as applied on an empty database.

4. Start the development server:

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## Project structure

```text
src/
├── app/
│   ├── [locale]/     # English and Persian pages
│   └── api/          # Route handlers
├── components/       # Layout, storefront, community, and 3D UI
├── lib/              # Prisma, auth, and shared server helpers
└── store/            # Zustand state stores
messages/             # en/fa translations
prisma/               # SQL Server schema and migrations
public/               # Icons, images, PWA assets, and 3D model
```

## Useful commands

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm start` | Serve a previously built app |
| `npm run lint` | Run ESLint |
| `npm test -- --runInBand` | Run Jest tests |

## Developer

[Farzad Vatandoust](https://github.com/VfarzadV)
