import { copyHeaders } from '@backend/utils/headers'
import { os } from '@orpc/server'

import type { Context } from '../context'

async function getSession(context: Context) {
  const response = await context.auth.api.getSession({
    headers: context.reqHeaders ?? new Headers(),
    asResponse: true,
  })

  const session = await response.json() as typeof context.auth.$Infer.Session | null

  copyHeaders(response.headers, context.resHeaders)

  return session
}

export const requiredAuthMiddleware = os
  .$context<Context>()
  .errors({
    UNAUTHORIZED: { status: 401 },
  })
  .middleware(async ({ context, errors, next }) => {
    const session = await getSession(context)

    if (!session) {
      throw errors.UNAUTHORIZED()
    }

    return next({
      context: {
        user: session.user,
      },
    })
  })
