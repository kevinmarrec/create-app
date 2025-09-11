import { logger } from '@backend/utils/logger'
import { drizzle } from 'drizzle-orm/bun-sqlite'

import * as schema from './schema'

export const db = drizzle(import.meta.env.DATABASE_URL, {
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

db.run('PRAGMA journal_mode = WAL')
db.run('PRAGMA journal_size_limit = 6144000')
db.run('PRAGMA synchronous = NORMAL')
db.run('PRAGMA foreign_keys = ON')

export type Database = typeof db
