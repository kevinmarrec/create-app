import { os } from '@orpc/server'

import type { Context } from '../context'
import { authMiddleware } from '../middlewares/auth'

export type { RouterClient } from '@orpc/server'

const pub = os
  .$context<Context>()
  .errors({
    UNAUTHORIZED: { status: 401 },
  })

const authed = pub
  .use(authMiddleware)

export const router = {
  public: pub
    .handler(async () => 'public'),
  private: authed
    .handler(async () => 'private'),
}

export type Router = typeof router
