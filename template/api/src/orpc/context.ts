import type { RequestHeadersPluginContext, ResponseHeadersPluginContext } from '@orpc/server/plugins'

import type { Auth } from '~/api/auth'
import type { Database } from '~/api/database'
import type { Logger } from '~/api/utils/logger'

export interface Context extends RequestHeadersPluginContext, ResponseHeadersPluginContext {
  auth: Auth
  db: Database
  logger: Logger
}
