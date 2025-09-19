import type { Session } from '@backend/auth'
import type { Context } from '@backend/core/context'
import { copyHeaders } from '@backend/utils/headers'
import { ORPCError, os } from '@orpc/server'

export const authMiddleware = os
  .$context<Context>()
  .middleware(async ({ context, next }) => {
    const response = await context.auth.api.getSession({
      headers: context.reqHeaders ?? new Headers(),
      asResponse: true,
    })

    const session = await response.json() as Session | null

    copyHeaders(response.headers, context.resHeaders)

    return next({
      context: {
        user: session ? session.user : null,
      },
    })
  })

export const requiredAuthMiddleware = authMiddleware
  .concat(async ({ context, next }) => {
    if (!context.user) {
      throw new ORPCError('UNAUTHORIZED')
    }

    return next({
      context: {
        user: context.user,
      },
    })
  },
  )
