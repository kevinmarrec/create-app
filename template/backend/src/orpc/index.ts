import type { Auth } from '@backend/auth'
import type { Database } from '@backend/database'
import { requiredAuthMiddleware } from '@backend/orpc/middlewares'
import type { Logger } from '@backend/utils/logger'
import { onError, ORPCError, os, type Router } from '@orpc/server'
import { RPCHandler } from '@orpc/server/fetch'
import {
  CORSPlugin,
  RequestHeadersPlugin,
  type RequestHeadersPluginContext,
  ResponseHeadersPlugin,
  type ResponseHeadersPluginContext,
} from '@orpc/server/plugins'
import { APIError } from 'better-auth/api'

/* Context */

export interface Context extends RequestHeadersPluginContext, ResponseHeadersPluginContext {
  auth: Auth
  db: Database
  logger: Logger
}

/* RPC Handler */

export function createRpcHandler<T extends Context>(router: Router<any, T>) {
  return new RPCHandler<T>(router, {
    plugins: [
      // new CORSPlugin({
      //   credentials: true,
      //   // maxAge: 7200, // 2 hours https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Access-Control-Max-Age
      // }),
      new RequestHeadersPlugin(),
      new ResponseHeadersPlugin(),
    ],
    rootInterceptors: [
      async (interceptorOptions) => {
        return interceptorOptions.next()
      },
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

/* Builder */

export const pub = os
  .$context<Context>()
  .errors({
    UNAUTHORIZED: { status: 401 },
  })

/** @beta */
export const authed = pub
  .use(requiredAuthMiddleware)
