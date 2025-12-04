import { createORPCClient } from '@orpc/client'
import { RPCLink } from '@orpc/client/fetch'

import type { Router, RouterClient } from '~/api/orpc/router'

const link = new RPCLink({
  url: `${import.meta.env.VITE_API_URL}/rpc`,
  fetch: (request, init) =>
    globalThis.fetch(request, {
      ...init,
      credentials: 'include',
      signal: AbortSignal.timeout(30_000),
    }),
})

export const orpc = createORPCClient<RouterClient<Router>>(link)
