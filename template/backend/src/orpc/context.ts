import type { Auth } from '@backend/auth'
import type { Database } from '@backend/database'
import type { Logger } from '@backend/logger'
import type { RequestHeadersPluginContext, ResponseHeadersPluginContext } from '@orpc/server/plugins'

export interface Context extends RequestHeadersPluginContext, ResponseHeadersPluginContext {
  auth: Auth
  db: Database
  logger: Logger
}
