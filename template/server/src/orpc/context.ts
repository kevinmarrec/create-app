import type { RequestHeadersPluginContext, ResponseHeadersPluginContext } from '@orpc/server/plugins'

import type { Auth } from '~/server/auth'
import type { Database } from '~/server/database'
import type { Logger } from '~/server/utils/logger'

export interface Context extends RequestHeadersPluginContext, ResponseHeadersPluginContext {
  auth: Auth
  db: Database
  logger: Logger
}
