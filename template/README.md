# Project Template

A full-stack application template with a Vue.js frontend, Bun-based API backend, PostgreSQL database, and Docker Compose setup for local development.

## Overview

This template provides a modern full-stack application structure with:

- **Frontend (app)**: Vue 3 application with Vite, UnoCSS, TypeScript, and TanStack Query
- **Backend (api)**: Bun-based API server with oRPC, Better Auth, and Drizzle ORM
- **Database**: PostgreSQL with Drizzle migrations
- **Infrastructure**: Docker Compose with Traefik reverse proxy
- **Development Tools**: Metabase (business intelligence), Drizzle Studio (database management), Umami (analytics), and Mailpit (email testing)

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
│   │   ├── env.ts           # Environment variable loading and validation (Valibot)
│   │   └── main.ts          # API entry point
│   └── package.json
├── app/                   # Frontend Vue application
│   ├── src/
│   │   ├── components/      # Vue components
│   │   ├── composables/     # Vue composables (auth, etc.)
│   │   ├── lib/             # Library utilities (oRPC client)
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
docker compose up -d
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
docker compose down
```

To stop and remove volumes (⚠️ this will delete database data):

```bash
docker compose down -v
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

After modifying the database schema in `api/src/database/schema/`, generate migrations:

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

- `bun run dev` - Alias for `docker compose`
- `bun run check` - Run all checks (ESLint, Stylelint, unused dependencies, TypeScript)
- `bun run lint` - Run linting (ESLint and Stylelint)
- `bun run lint:inspect` - Open ESLint config inspector
- `bun run update` - Update dependencies

### API Scripts (`cd api`)

- `bun run dev` - Start development server with hot reload
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

Reverse proxy and load balancer that handles:

- HTTPS termination
- SSL certificate management (requires certificates in `.docker/traefik/certs/`)
- Routing to services based on hostnames
- Dashboard accessible at https://traefik.dev.localhost

### PostgreSQL

Database service with:

- Default database: `app`
- Default user: `user`
- Default password: `password`
- Port: `5432`
- Persistent volume: `postgres_data`

### Metabase

Business intelligence tool for data visualization and analytics with:

- Persistent volume: `metabase_data`
- Accessible via Traefik at https://metabase.dev.localhost (runs on port `3000` internally)

### API

Backend API service running Bun with:

- Hot reload enabled
- Automatic database migrations on startup
- Health check endpoint: `/health`
- Auth endpoints: `/auth/*`
- RPC endpoints: `/rpc/*`
- Accessible via Traefik at https://api.dev.localhost (runs on port `4000` internally)

### App

Frontend Vue application with:

- Vite dev server
- Hot module replacement
- Accessible via Traefik at https://app.dev.localhost (runs on port `5173` internally)

### Studio (Drizzle Studio)

Database management and visualization tool with:

- Visual database browser and query editor
- Database schema exploration
- Master password: `foobar` (configured via `MASTERPASS` environment variable)
- Persistent volume: `studio_data`
- Accessible via Traefik at https://studio.dev.localhost (runs on port `4983` internally)

### Analytics (Umami)

Privacy-focused web analytics platform with:

- Website analytics and visitor tracking
- PostgreSQL database: `analytics`
- Persistent data storage
- Accessible via Traefik at https://analytics.dev.localhost (runs on port `3000` internally)

### Mailpit

Email testing tool for development with:

- SMTP server for capturing outgoing emails
- Web interface for viewing and testing emails
- REST API (available at `/api/v1/`) for accessing, searching, deleting, and sending messages
- Useful for testing email functionality without sending real emails
- Accessible via Traefik at https://mail.dev.localhost (runs on port `8025` internally)

## Environment Variables

For detailed environment variable setup, see [Set Up Environment Variables](#2-set-up-environment-variables) in the Getting Started section.

**Quick reference:**

- **API** (`.env.development`): `ALLOWED_ORIGINS` (required), `AUTH_SECRET` (required), `DATABASE_URL` (required), `LOG_LEVEL`, `HOST`, `PORT`
- **App** (`.env`): `VITE_API_URL` (required), `VITE_ANALYTICS_URL` (required), `VITE_ANALYTICS_WEBSITE_ID` (required)

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
docker compose logs -f <service-name>
```

For example:

- `docker compose logs -f api` - View API logs
- `docker compose logs -f app` - View app logs
- `docker compose logs -f traefik` - View Traefik logs

## Tech Stack

- **Runtime**: Bun
- **Language**: TypeScript
- **Frontend**: Vue 3, Vite, UnoCSS, TanStack Query
- **Backend**: Bun, oRPC, Better Auth, Drizzle ORM
- **Database**: PostgreSQL
- **Infrastructure**: Docker Compose, Traefik
