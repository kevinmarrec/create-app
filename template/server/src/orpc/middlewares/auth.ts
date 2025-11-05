import { ORPCError, os } from '@orpc/server'
import type { Context } from '@server/orpc'

export const authMiddleware = os
  .$context<Context>()
  .middleware(async ({ context, next }) => {
    const { response: session, headers } = await context.auth.api.getSession({
      headers: context.reqHeaders,
      returnHeaders: true,
    })

    headers.forEach((v, k) => context.resHeaders?.append(k, v))

    if (!session) {
      throw new ORPCError('UNAUTHORIZED')
    }

    return next({
      context: {
        user: session.user,
      },
    })
  })
