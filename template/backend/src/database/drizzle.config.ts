import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  casing: 'snake_case',
  dialect: 'sqlite',
  dbCredentials: { url: import.meta.env.DATABASE_URL },
  schema: 'src/database/schema',
  out: 'src/database/migrations',
})
