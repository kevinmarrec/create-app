import { onError, ORPCError } from '@orpc/server'
import { RPCHandler } from '@orpc/server/fetch'
import { CORSPlugin, RequestHeadersPlugin, ResponseHeadersPlugin } from '@orpc/server/plugins'
import { APIError } from 'better-auth/api'

import { router } from './router'

export const rpcHandler = new RPCHandler(router, {
  plugins: [
    new CORSPlugin({
      credentials: true,
      maxAge: 7200, // 2 hours https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Access-Control-Max-Age
    }),
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
