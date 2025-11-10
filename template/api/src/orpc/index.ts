import type { Router } from '@orpc/server'
import { RPCHandler } from '@orpc/server/fetch'
import { RequestHeadersPlugin, ResponseHeadersPlugin } from '@orpc/server/plugins'

import type { Context } from './context'
import { ErrorPlugin } from './plugins/error'

export function createRpc<T extends Context>(context: T, router: Router<any, T>) {
  const handler = new RPCHandler<T>(router, {
    plugins: [
      new ErrorPlugin(),
      new RequestHeadersPlugin(),
      new ResponseHeadersPlugin(),
    ],
  })

  return {
    handler: async (req: Request) => {
      const { matched, response } = await handler.handle(req, {
        prefix: '/rpc',
        context,
      })

      return matched ? response : new Response('Not found', { status: 404 })
    },
  }
}
