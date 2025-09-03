import * as auth from './auth'

export type { RouterClient } from '@orpc/server'

export const router = {
  auth,
}

export type Router = typeof router
