import { defineConfig } from 'drizzle-kit'

import { casing, url } from './database'

export default defineConfig({
  casing,
  dialect: 'sqlite',
  dbCredentials: { url },
  schema: './src/database/schema',
  out: './src/database/migrations',
})
