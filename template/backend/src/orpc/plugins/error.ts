import { onError, ORPCError } from '@orpc/server'
import type { StandardHandlerOptions, StandardHandlerPlugin } from '@orpc/server/standard'
import { APIError } from 'better-auth/api'
import type { BaseLogger } from 'pino'

export class BetterErrorPlugin<T extends { logger: BaseLogger }> implements StandardHandlerPlugin<T> {
  init(options: StandardHandlerOptions<T>) {
    options.clientInterceptors ??= []
    options.clientInterceptors.push(onError((error, { context }) => {
      if (error instanceof APIError) {
        throw new ORPCError(error.body?.code ?? 'INTERNAL_SERVER_ERROR', {
          status: error.statusCode,
          message: error.body?.message,
        })
      }

      if (error instanceof ORPCError) {
        throw error
      }

      context.logger.error(error)
    }))
  }
}
