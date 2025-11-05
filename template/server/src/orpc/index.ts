import { os } from '@orpc/server'

import { authMiddleware } from '~/server/orpc/middlewares'

import type { Context } from './context'

export { createRpcHandler } from './handler'

export type { Context }

export const pub = os
  .$context<Context>()
  .errors({
    UNAUTHORIZED: { status: 401 },
  })

/** @beta */
export const authed = pub
  .use(authMiddleware)
