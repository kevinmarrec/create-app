import { PGlite } from '@electric-sql/pglite'
import { logger } from '@server/utils/logger'
import { drizzle } from 'drizzle-orm/pglite'

import * as schema from './schema'

export const db = drizzle({
  client: new PGlite(import.meta.env.DATABASE_URL),
  casing: 'snake_case',
  schema,
  logger: {
    logQuery: (query, params) => {
      let msg = `[SQL] ${query}`
      msg += params.length ? ` [${params}]` : ''
      logger.debug(msg)
    },
  },
})

export type Database = typeof db
