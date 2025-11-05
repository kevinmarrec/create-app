import { createORPCClient } from '@orpc/client'
import { RPCLink } from '@orpc/client/fetch'
import { createTanstackQueryUtils } from '@orpc/tanstack-query'
import type { Router, RouterClient } from '@server/orpc/router'

const link = new RPCLink({
  url: `${import.meta.env.VITE_API_URL}/rpc`,
  fetch: (request, init) =>
    globalThis.fetch(request, {
      ...init,
      credentials: 'include',
    }),
})

const client: RouterClient<Router> = createORPCClient(link)

export const orpc = createTanstackQueryUtils(client)
