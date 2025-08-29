import { auth, type Auth } from '@backend/auth'
import { type Database, db } from '@backend/database'
import { logger, type Logger } from '@backend/logger'
import type { RequestHeadersPluginContext, ResponseHeadersPluginContext } from '@orpc/server/plugins'

export interface Context extends RequestHeadersPluginContext, ResponseHeadersPluginContext {
  auth: Auth
  db: Database
  logger: Logger
}

export function createContext(): Context {
  return {
    auth,
    db,
    logger,
  }
}
