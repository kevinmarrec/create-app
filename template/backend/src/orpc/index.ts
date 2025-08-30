import { cors } from '@backend/config/server'
import { logger } from '@backend/logger'
import { onError, ORPCError } from '@orpc/server'
import { RPCHandler } from '@orpc/server/fetch'
import { CORSPlugin, RequestHeadersPlugin, ResponseHeadersPlugin } from '@orpc/server/plugins'
import { APIError } from 'better-auth/api'

import { router } from './router'

export const rpcHandler = new RPCHandler(router, {
  plugins: [
    new CORSPlugin(cors),
    new RequestHeadersPlugin(),
    new ResponseHeadersPlugin(),
  ],
  clientInterceptors: [
    onError((error) => {
      if (error instanceof APIError) {
        throw new ORPCError(error.body?.code ?? 'INTERNAL_SERVER_ERROR', {
          status: error.statusCode,
          message: error.body?.message,
        })
      }

      logger.error(error)
    }),
  ],
})
