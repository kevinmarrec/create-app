import { cors } from '@backend/config/server'
import { logger } from '@backend/logger'
import { onError, ORPCError } from '@orpc/server'
import { RPCHandler } from '@orpc/server/fetch'
import { CORSPlugin, RequestHeadersPlugin, ResponseHeadersPlugin } from '@orpc/server/plugins'

import { router } from './router'

export const rpcHandler = new RPCHandler(router, {
  plugins: [
    new CORSPlugin(cors),
    new RequestHeadersPlugin(),
    new ResponseHeadersPlugin(),
  ],
  interceptors: [
    onError((error) => {
      if (error instanceof ORPCError) {
        return
      }

      logger.error(error)
    }),
  ],
})
