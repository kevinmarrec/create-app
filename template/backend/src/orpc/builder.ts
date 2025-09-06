import { os } from '@orpc/server'

import type { Context } from './context'
import { requiredAuthMiddleware } from './middlewares/auth'

export const pub = os
  .$context<Context>()
  .errors({
    UNAUTHORIZED: { status: 401 },
  })

/** @beta */
export const authed = pub
  .use(requiredAuthMiddleware)
