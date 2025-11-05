import * as v from 'valibot'

import { authed, pub } from '~/server/orpc'

export type { RouterClient } from '@orpc/server'

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
