import { os } from '@orpc/server'

import type { Context } from '../context'
import { requiredAuthMiddleware } from '../middlewares/auth'

export const base = os.$context<Context>()
export const authed = base.use(requiredAuthMiddleware)
