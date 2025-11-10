import type { Router } from '@orpc/server'
import { RPCHandler } from '@orpc/server/fetch'
import { RequestHeadersPlugin, ResponseHeadersPlugin } from '@orpc/server/plugins'

import type { Context } from './context'
import { ErrorPlugin } from './plugins/error'

export function createRpcHandler<T extends Context>(router: Router<any, T>) {
  return new RPCHandler<T>(router, {
    plugins: [
      new ErrorPlugin(),
      new RequestHeadersPlugin(),
      new ResponseHeadersPlugin(),
    ],
  })
}
