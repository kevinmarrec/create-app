import { createBetterAuth } from './auth'
import { db } from './database'
import { env } from './env'
import { createRpc } from './orpc'
import { router } from './orpc/router'
import { cors } from './utils/cors'
import { logger } from './utils/logger'
import { bindGracefulShutdown } from './utils/stopper'

const auth = createBetterAuth({ db, logger })
const rpc = createRpc({ auth, db, logger }, router)

const server = Bun.serve({
  hostname: env.server.host,
  port: env.server.port,
  routes: {
    '/health': () => new Response('OK', { status: 200 }),
    '/auth/*': cors(auth.handler),
    '/rpc/*': cors(rpc.handler),
  },
  error(error) {
    logger.error(error)
    return new Response('Internal Server Error', { status: 500 })
  },
})

bindGracefulShutdown(server, logger)

logger.info(`Listening on ${server.url}`)
