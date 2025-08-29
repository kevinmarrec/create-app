import { casing, url } from '@backend/config/database'
import { logger } from '@backend/logger'
import { drizzle } from 'drizzle-orm/bun-sqlite'

import * as schema from './schema'

export const db = drizzle(url, {
  casing,
  schema,
  logger: {
    logQuery: (query, params) => {
      let msg = `[SQL] ${query}`
      msg += params.length ? ` [${params}]` : ''
      logger.info(msg)
    },
  },
})

db.run('PRAGMA journal_mode = WAL')
db.run('PRAGMA journal_size_limit = 6144000')
db.run('PRAGMA synchronous = NORMAL')
db.run('PRAGMA foreign_keys = ON')

export type Database = typeof db
