import { defineConfig } from 'drizzle-kit'

import { env } from '../../env'

export default defineConfig({
  casing: 'snake_case',
  dialect: 'postgresql',
  dbCredentials: { url: env.database.url },
  schema: 'src/database/schema',
  out: 'src/database/migrations',
})
