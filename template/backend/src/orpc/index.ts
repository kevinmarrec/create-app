import { cors } from '@backend/config/server'
import { RPCHandler } from '@orpc/server/fetch'
import { CORSPlugin, RequestHeadersPlugin, ResponseHeadersPlugin } from '@orpc/server/plugins'

import { BetterErrorPlugin } from './plugins/error'
import { router } from './router'

export const rpcHandler = new RPCHandler(router, {
  plugins: [
    new CORSPlugin(cors),
    new RequestHeadersPlugin(),
    new ResponseHeadersPlugin(),
    new BetterErrorPlugin(),
  ],
})
