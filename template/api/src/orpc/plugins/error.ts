import { onError, ORPCError } from '@orpc/server'
import type { StandardHandlerOptions, StandardHandlerPlugin } from '@orpc/server/standard'

import type { Context } from '~/api/orpc'

export class ErrorPlugin<T extends Context> implements StandardHandlerPlugin<T> {
  init(options: StandardHandlerOptions<T>): void {
    options.clientInterceptors ??= []
    options.clientInterceptors.unshift(onError((error, { context }) => {
      if (error instanceof ORPCError) {
        throw error
      }

      context.logger.error(error)
    }))
  }
}
