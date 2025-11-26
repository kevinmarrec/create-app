# Project Template

A full-stack application template with Vue.js frontend, Bun-based API backend, and PostgreSQL database.

## Tech Stack

- **Runtime**: [Bun](https://bun.sh/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Frontend**: [Vue 3](https://vuejs.org/) | [Vite](https://vitejs.dev/) | [UnoCSS](https://unocss.dev/) | [TanStack Query](https://tanstack.com/query/latest)
- **Backend**: [Bun](https://bun.sh/) | [oRPC](https://orpc.dev/) | [Better Auth](https://www.better-auth.com/) | [Drizzle ORM](https://orm.drizzle.team/)
- **Validation**: [Valibot](https://valibot.dev/)
- **Database**: [PostgreSQL](https://www.postgresql.org/) (with [Drizzle](https://orm.drizzle.team/) migrations)
- **Infrastructure**: [Docker Compose](https://docs.docker.com/compose/) | [Traefik](https://traefik.io/)
- **Code Quality Tools**: [ESLint](https://eslint.org/) | [Stylelint](https://stylelint.io/) | [Knip](https://knip.dev/)
- **Development Services**: [Metabase](https://www.metabase.com/) | [Drizzle Studio](https://gateway.drizzle.team/) | [Umami](https://umami.is/) | [Mailpit](https://mailpit.axllent.org/)

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
│   │   ├── App.vue          # Main Vue component
│   │   └── main.ts          # App entry point
│   └── package.json
├── compose.yaml              # Docker Compose configuration
└── package.json              # Root workspace configuration
```

## Getting Started

### 1. Install Dependencies

```bash
bun install
```

### 2. Set Up Environment Variables

> **Note**: If `.env.development` (API) or `.env` (App) files already exist in the template, you may skip this step. Otherwise, create them as described below.

#### API Environment Variables

Create a `.env.development` file in the `api/` directory with the following variables:

```bash
# api/.env.development
ALLOWED_ORIGINS=https://app.dev.localhost
AUTH_SECRET=your-secret-key-here
DATABASE_URL=postgresql://user:password@postgres:5432/app
LOG_LEVEL=info
HOST=0.0.0.0
PORT=4000
```

**Required variables:**

- `ALLOWED_ORIGINS` - Comma-separated list of allowed CORS origins (must start with `https://`)
- `AUTH_SECRET` - Secret key for authentication encryption
- `DATABASE_URL` - PostgreSQL connection string

**Optional variables:**

- `LOG_LEVEL` - Logging level: `fatal`, `error`, `warn`, `info`, `debug`, `trace`, or `silent` (default: `info`)
- `HOST` - Server host (default: `0.0.0.0`)
- `PORT` - Server port (default: `4000`)

#### App Environment Variables

Create a `.env` file in the `app/` directory with the following variables:

```bash
# app/.env
VITE_API_URL=https://api.dev.localhost
VITE_ANALYTICS_URL=https://analytics.dev.localhost
VITE_ANALYTICS_WEBSITE_ID=your-website-id-here
```

**Required variables:**

- `VITE_API_URL` - API base URL for the frontend
- `VITE_ANALYTICS_URL` - Analytics service URL (e.g., Umami instance)
- `VITE_ANALYTICS_WEBSITE_ID` - Website ID for analytics tracking

### 3. Set Up Local TLS Certificates

To access the HTTPS URLs (`https://*.dev.localhost`), you need to set up trusted local TLS certificates using [mkcert](https://github.com/FiloSottile/mkcert).

Check their [installation guide](https://github.com/FiloSottile/mkcert#installation) for detailed instructions on installing mkcert.

Then, run the following command to generate the certificates:

```bash
.docker/traefik/bin/install_cert
```

This will generate the certificates in `.docker/traefik/certs/` and install the mkcert root CA into your system trust store.

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

### 4. Start Docker Services and Access the Application

Start all services:

```bash
bun run dev up -d
```

Once the services are running, you can access:

- Frontend: https://app.dev.localhost
- API: https://api.dev.localhost
- Traefik Dashboard: https://traefik.dev.localhost
- Metabase: https://metabase.dev.localhost
- Drizzle Studio: https://studio.dev.localhost
- Umami Analytics: https://analytics.dev.localhost
- Mailpit: https://mail.dev.localhost

### 5. Stopping Services

To stop all Docker services:

```bash
bun run dev down
```

To stop and remove volumes (⚠️ this will delete database data):

```bash
bun run dev down -v
```

## Development

### Running Services Locally (without Docker)

You can also run the services locally without Docker. Note that you'll still need PostgreSQL running (either locally or via Docker).

#### API Server

```bash
cd api
bun run dev
```

The API will run on `http://localhost:4000` (or the port specified in `PORT`).

#### Frontend App

```bash
cd app
bun run dev
```

The app will run on `http://localhost:5173` (Vite default port).

### Database Management

#### Generate Migrations

After modifying the database schema in `api/src/database/schema/`:

```bash
cd api
bun run db:generate
```

#### Run Migrations

Migrations run automatically when starting the API in dev mode. To run manually:

```bash
cd api
bun run db:migrate
```

## Available Scripts

### Root Level Scripts

- `bun run dev` - Shortcut for `docker compose` (use `bun run dev up -d` to start services)
- `bun run check` - Run all checks (ESLint, Stylelint, unused dependencies, TypeScript)
- `bun run lint` - Run linting (ESLint and Stylelint)
- `bun run lint:inspect` - Open ESLint config inspector
- `bun run update` - Update dependencies

### API Scripts (`cd api`)

- `bun run dev` - Start development server with hot reload (automatically runs migrations and uses pino-pretty for logging)
- `bun run build` - Build production binary
- `bun run db:generate` - Generate database migrations
- `bun run db:migrate` - Run database migrations

### App Scripts (`cd app`)

- `bun run dev` - Start development server with HMR (Hot Module Replacement)
- `bun run build` - Build for production (static site)
- `bun run build:analyze` - Build with bundle analyzer
- `bun run preview` - Preview production build

## Docker Compose Services

### Traefik

Reverse proxy and load balancer that handles HTTPS termination, SSL certificate management, and routing to services based on hostnames.

- Dashboard: https://traefik.dev.localhost
- Certificates: `.docker/traefik/certs/`

### PostgreSQL

Database service:

- Connection: `postgresql://user:password@postgres:5432/app`
- Port: `5432` (exposed to host)
- Persistent volume: `postgres_data`

### Metabase

Business intelligence tool for data visualization and analytics:

- Accessible at https://metabase.dev.localhost
- Persistent volume: `metabase_data`

### API

Backend API service running Bun with hot reload enabled and automatic database migrations on startup:

- Accessible at https://api.dev.localhost
- Endpoints:
  - `/health` - Health check
  - `/auth/*` - Authentication (Better Auth)
  - `/rpc/*` - RPC endpoints (oRPC)

### App

Frontend Vue application with Vite dev server and HMR (Hot Module Replacement):

- Accessible at https://app.dev.localhost

### Studio (Drizzle Studio)

Database management and visualization tool:

- Accessible at https://studio.dev.localhost
- Master password: `foobar`
- Persistent volume: `studio_data`

### Analytics (Umami)

Privacy-focused web analytics platform:

- Accessible at https://analytics.dev.localhost
- Uses PostgreSQL database: `analytics`
- Persistent data storage

### Mailpit

Email and SMTP testing tool with API for developers:

- Accessible at https://mail.dev.localhost
- Web interface for viewing and testing captured emails
- REST API at `/api/v1/` for accessing, searching, deleting, and sending messages

## Environment Variables

See [Set Up Environment Variables](#2-set-up-environment-variables) for detailed setup instructions.

**Quick reference:**

- **API** (`api/.env.development`): `ALLOWED_ORIGINS`, `AUTH_SECRET`, `DATABASE_URL` (required); `LOG_LEVEL`, `HOST`, `PORT` (optional)
- **App** (`app/.env`): `VITE_API_URL`, `VITE_ANALYTICS_URL`, `VITE_ANALYTICS_WEBSITE_ID` (required)

## Building for Production

### Build API

```bash
cd api
bun run build
```

This creates a compiled binary at `api/dist/api`.

### Build App

```bash
cd app
bun run build
```

This creates a static site in `app/dist/`.

## Troubleshooting

### Port Already in Use

If ports 80, 443, or 5432 are already in use, modify the port mappings in `compose.yaml`.

### SSL Certificate Warnings

If you see SSL certificate warnings when accessing `https://*.dev.localhost` URLs, ensure you have completed the [Local TLS Setup](#3-set-up-local-tls-certificates) to generate trusted certificates using mkcert.

**Note**: Without proper certificates, Traefik may fail to start or services may not be accessible via HTTPS.

### Service Logs

To view logs for a specific service:

```bash
bun run dev logs -f <service-name>
```

For example:

- `bun run dev logs -f api` - View API logs
- `bun run dev logs -f app` - View app logs
- `bun run dev logs -f traefik` - View Traefik logs
