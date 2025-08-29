import { welcome } from './welcome'

export type { RouterClient } from '@orpc/server'

export const router = {
  welcome,
}

export type Router = typeof router
