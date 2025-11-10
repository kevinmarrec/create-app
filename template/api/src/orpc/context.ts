import type { RequestHeadersPluginContext, ResponseHeadersPluginContext } from '@orpc/server/plugins'

import type { Auth } from '../auth'
import type { Database } from '../database'
import type { Logger } from '../utils/logger'

export interface Context extends RequestHeadersPluginContext, ResponseHeadersPluginContext {
  auth: Auth
  db: Database
  logger: Logger
}
