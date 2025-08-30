import { os } from '@orpc/server'

import type { Context } from './context'
import { requiredAuthMiddleware } from './middlewares/auth'

export const base = os
  .$context<Context>()
  .errors({
    UNAUTHORIZED: { status: 401 },
  })

export const authed = base
  .use(requiredAuthMiddleware)
