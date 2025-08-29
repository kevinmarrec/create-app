import { defineConfig } from 'drizzle-kit'

import { url } from './database'

export default defineConfig({
  dialect: 'sqlite',
  dbCredentials: { url },
  schema: './src/database/schema',
  out: './src/database/migrations',
})
