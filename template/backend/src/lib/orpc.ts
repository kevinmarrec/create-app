import type { Database } from '@backend/database'
import type { Logger } from '@backend/logger'
import { os } from '@orpc/server'

interface Context {
  db: Database
  logger: Logger
}

export const pub = os.$context<Context>()
