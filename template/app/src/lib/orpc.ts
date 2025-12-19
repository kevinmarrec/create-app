import { createORPCClient } from '@orpc/client'
import { RPCLink } from '@orpc/client/fetch'
import { createORPCVueColadaUtils } from '@orpc/vue-colada'

import type { Router, RouterClient } from '~/api/orpc/router'

import { getFetchOptions } from '../utils/fetch'

const link = new RPCLink({
  url: `${import.meta.env.VITE_API_URL}/rpc`,
  fetch: (request, init) => globalThis.fetch(request, getFetchOptions(init)),
})

export const client = createORPCClient<RouterClient<Router>>(link)

export const orpc = createORPCVueColadaUtils(client)
