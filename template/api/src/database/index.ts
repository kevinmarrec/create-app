import { drizzle } from 'drizzle-orm/bun-sql'

import { logger } from '../utils/logger'
import * as schema from './schema'

export const db = drizzle({
  connection: {
    url: import.meta.env.DATABASE_URL,
  },
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
