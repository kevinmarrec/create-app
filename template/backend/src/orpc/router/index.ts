import * as foo from './foo'

export type { RouterClient } from '@orpc/server'

export const router = {
  foo,
}

export type Router = typeof router
