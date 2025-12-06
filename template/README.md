# Project Template

A full-stack application template with Vue.js frontend, Bun-based API backend, and PostgreSQL database.

## Tech Stack

### Core Stack

- [Bun](https://bun.sh/) as package manager & runtime
- [TypeScript](https://www.typescriptlang.org/) as the language
- [Vue 3](https://vuejs.org/) as frontend framework
- [Vite](https://vitejs.dev/) as build tool
- [Vite SSG](https://github.com/antfu-collective/vite-ssg) for static site generation
- [UnoCSS](https://unocss.dev/) for styling
- [Unhead](https://unhead.unjs.io/) for head management
- [Vue I18n](https://github.com/kevinmarrec/vue-i18n) for internationalization
- [oRPC](https://orpc.dev/) for API layer
- [Better Auth](https://www.better-auth.com/) for authentication
- [Pinia Colada](https://pinia-colada.esm.dev/) for data fetching & state management
- [Pino](https://getpino.io/) for logging
- [Drizzle ORM](https://orm.drizzle.team/) as SQL-first TypeScript ORM
- [Valibot](https://valibot.dev/) for validation
- [PostgreSQL](https://www.postgresql.org/) as database
- [Docker Compose](https://docs.docker.com/compose/) & [Traefik](https://traefik.io/) for infrastructure

### Development Tools

- [ESLint](https://eslint.org/) & [Stylelint](https://stylelint.io/) for linting
- [Knip](https://knip.dev/) for detecting unused dependencies, exports, and files
- [Metabase](https://www.metabase.com/) for Business Intelligence (BI)
- [Drizzle Studio](https://gateway.drizzle.team/) for database management (web GUI)
- [Umami](https://umami.is/) for web analytics
- [Mailpit](https://mailpit.axllent.org/) for email testing

## Prerequisites

- [Bun](https://bun.sh/) (v1.3 or later)
- [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/)
- [Node.js LTS](https://nodejs.org/en/download/) (for compatibility)
- [mkcert](https://github.com/FiloSottile/mkcert) (for local TLS certificates)

## Project Structure

```
project/
├── api/                   # Backend API server
│   ├── src/
│   │   ├── auth/            # Authentication setup (Better Auth)
│   │   ├── database/        # Database schema and migrations (Drizzle)
│   │   ├── orpc/            # Router definitions (oRPC)
│   │   ├── utils/           # Utility functions (CORS, logger, etc.)
│   │   ├── env.ts           # Environment variable loading and validation (Valibot)
│   │   └── main.ts          # API entry point
│   └── package.json
├── app/                   # Frontend Vue application
│   ├── public/             # Public static assets
│   ├── src/
│   │   ├── components/      # Vue components
│   │   ├── composables/     # Vue composables (auth, etc.)
│   │   ├── lib/             # Library utilities (oRPC client)
│   │   ├── locales/         # Internationalization files (i18n)
│   │   ├── utils/           # Utility functions (fetch, etc.)
│   │   ├── App.vue          # Main Vue component
│   │   └── main.ts          # App entry point
│   └── package.json
├── compose.yml               # Docker Compose configuration
└── package.json              # Root workspace configuration
```

## Getting Started

### 1. Install Dependencies

```bash
bun install
```

### 2. Set Up Environment Variables

#### API (`api/.env.development`)

```bash
ALLOWED_ORIGINS=https://app.dev.localhost
AUTH_SECRET=your-secret-key-here
DATABASE_URL=postgresql://user:password@postgres:5432/app
LOG_LEVEL=info
HOST=0.0.0.0
PORT=4000
```

**Required:** `ALLOWED_ORIGINS`, `AUTH_SECRET`, `DATABASE_URL`

**Optional:** `LOG_LEVEL` (default: `info`), `HOST` (default: `0.0.0.0`), `PORT` (default: `4000`)

#### App (`app/.env`)

```bash
VITE_API_URL=https://api.dev.localhost
VITE_ANALYTICS_URL=https://analytics.dev.localhost
VITE_ANALYTICS_WEBSITE_ID=your-website-id-here
```

**Required:** `VITE_API_URL`, `VITE_ANALYTICS_URL`, `VITE_ANALYTICS_WEBSITE_ID`

### 3. Set Up Local TLS Certificates

Install [mkcert](https://github.com/FiloSottile/mkcert), then run:

```bash
.docker/traefik/bin/install_cert
```

This generates certificates in `.docker/traefik/certs/` and installs the root CA into your system trust store.

> [!IMPORTANT]
> If your system is running on WSL and you are using Firefox or Zen Browser, **you must import the mkcert root CA into your browser trust store.**
>
> 1. Find the root CA file path:
>    ```bash
>    echo "wslpath -w $(mkcert -CAROOT)/rootCA.pem"
>    # \\wsl.localhost\Ubuntu\home\user\.local\share\mkcert\rootCA.pem
>    ```
> 2. Import the root CA file into your browser trust store:
>    - **Settings** -> **Privacy & Security**.
>    - **Certificates** -> **View Certificates...**
>    - **Authorities** tab -> **Import...**
>    - Select the rootCA.pem file (using the path found above)
>    - Check **"Trust this CA to identify websites"**
>    - Click **OK**

### 4. Start Services

```bash
bun run dev up -d
# or
bun run dev up --wait
```

**Services:**

- Frontend: https://app.dev.localhost
- API: https://api.dev.localhost
- Traefik: https://traefik.dev.localhost
- Metabase: https://metabase.dev.localhost
- Drizzle Studio: https://studio.dev.localhost (password: `foobar`)
- Umami: https://analytics.dev.localhost
- Mailpit: https://mail.dev.localhost

**Stop services:**

```bash
bun run dev down          # Stop services
bun run dev down -v       # Stop and remove volumes (⚠️ deletes data)
```

## Scripts

**Root:**

- `bun run dev` - Docker Compose shortcut
- `bun run check` - Run all checks (lint, typecheck, unused deps)
- `bun run lint` - Run ESLint and Stylelint
- `bun run update` - Update dependencies

**API (`cd api`):**

- `bun run dev` - Dev server (auto-migrations, hot reload)
- `bun run build` - Build production binary
- `bun run db:generate` - Generate migrations
- `bun run db:migrate` - Run migrations

**App (`cd app`):**

- `bun run dev` - Dev server (HMR)
- `bun run build` - Build for production
- `bun run build:analyze` - Build with bundle analyzer
- `bun run preview` - Preview production build

## Database Migrations

After modifying the database schema in `api/src/database/schema/`, generate migrations:

```bash
cd api && bun run db:generate
```

Migrations run automatically when starting the API in dev mode. To run manually:

```bash
cd api && bun run db:migrate
```

## Docker Services

- **Traefik** - Reverse proxy (HTTPS termination, routing)
- **PostgreSQL** - Database (`postgresql://user:password@postgres:5432/app`, port `5432`)
- **API** - Backend (`/health`, `/auth/*`, `/rpc/*`)
- **App** - Frontend (Vue + Vite)
- **Metabase** - BI tool
- **Drizzle Studio** - DB management (password: `foobar`)
- **Umami** - Analytics
- **Mailpit** - Email testing (REST API at `/api/v1/`)

## Production Build

**API:**

```bash
cd api && bun run build
```

Output: `api/dist/api`

**App:**

```bash
cd app && bun run build
```

Output: `app/dist/`

## Troubleshooting

**Port conflicts:** Modify port mappings in `compose.yml` if ports 80, 443, or 5432 are in use.

**SSL warnings:** Complete [TLS setup](#3-set-up-local-tls-certificates). Without certificates, Traefik may fail to start.

**View logs:**

```bash
bun run dev logs -f <service-name>  # e.g., api, app, traefik
```
