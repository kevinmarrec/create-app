import { onError, ORPCError, type Router } from '@orpc/server'
import { RPCHandler } from '@orpc/server/fetch'
import {
  RequestHeadersPlugin,
  ResponseHeadersPlugin,
} from '@orpc/server/plugins'
import { APIError } from 'better-auth/api'

import type { Context } from './context'

export function createRpcHandler<T extends Context>(router: Router<any, T>) {
  return new RPCHandler<T>(router, {
    plugins: [
      new RequestHeadersPlugin(),
      new ResponseHeadersPlugin(),
    ],
    clientInterceptors: [
      onError((error, { context }) => {
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
      }),
    ],
  })
}
