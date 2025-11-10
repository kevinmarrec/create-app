import { os } from '@orpc/server'
import * as v from 'valibot'

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
    .input(v.any())
    .handler(async () => {
      return 'public'
    }),
  private: authed
    .input(v.any())
    .handler(async () => {
      return 'private'
    }),
}

export type Router = typeof router
