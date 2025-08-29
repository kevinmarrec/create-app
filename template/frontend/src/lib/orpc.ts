import type { Router, RouterClient } from '@backend/router'
import { createORPCClient } from '@orpc/client'
import { RPCLink } from '@orpc/client/fetch'
import { createTanstackQueryUtils } from '@orpc/tanstack-query'

const link = new RPCLink({
  url: import.meta.env.VITE_API_URL,
})

const client: RouterClient<Router> = createORPCClient(link)

export const orpc = createTanstackQueryUtils(client)
