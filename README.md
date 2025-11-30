# @kevinmarrec/create-app

## Description

CLI that scaffolds an opinionated [Bun](https://bun.sh/) & [Vue](https://vuejs.org/) fullstack application.

## Opinions

### Core Stack

- [Bun](https://bun.sh/) as package manager & runtime
- [TypeScript](https://www.typescriptlang.org/) as the language
- [Vue 3](https://vuejs.org/) as frontend framework
- [Vite](https://vitejs.dev/) as build tool
- [Vite SSG](https://github.com/antfu-collective/vite-ssg) for static site generation
- [UnoCSS](https://unocss.dev/) for styling
- [TanStack Query](https://tanstack.com/query/latest) for data fetching
- [Unhead](https://unhead.unjs.io/) for head management
- [Vue I18n](https://github.com/kevinmarrec/vue-i18n) for internationalization
- [oRPC](https://orpc.dev/) for API layer
- [Better Auth](https://www.better-auth.com/) for authentication
- [Pino](https://getpino.io/) for logging
- [Drizzle ORM](https://orm.drizzle.team/) for database management
- [Valibot](https://valibot.dev/) for validation
- [PostgreSQL](https://www.postgresql.org/) as database
- [Docker Compose](https://docs.docker.com/compose/) & [Traefik](https://traefik.io/) for infrastructure

### Development Tools

- [ESLint](https://eslint.org/) & [Stylelint](https://stylelint.io/) for linting
- [Knip](https://knip.dev/) for detecting unused dependencies, exports, and files
- [Metabase](https://www.metabase.com/) for Business Intelligence (BI)
- [Drizzle Studio](https://gateway.drizzle.team/) for database management
- [Umami](https://umami.is/) for web analytics
- [Mailpit](https://mailpit.axllent.org/) for email testing

## Usage

> Requires [Bun](https://bun.sh/) v1.3 _or later_.

```sh
bun create @kevinmarrec/app
# OR
bunx @kevinmarrec/create-app
```

After scaffolding, see the generated `README.md` in your project root for detailed setup instructions, including environment configuration, Docker setup, and development workflows.
