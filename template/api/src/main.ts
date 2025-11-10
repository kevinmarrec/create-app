import process from 'node:process'

import { createBetterAuth } from './auth'
import { db } from './database'
import { createRpc } from './orpc'
import { router } from './orpc/router'
import { cors } from './utils/cors'
import { logger } from './utils/logger'

const auth = createBetterAuth({ db, logger })
const rpc = createRpc({ auth, db, logger }, router)

const server = Bun.serve({
  hostname: import.meta.env.HOST ?? '0.0.0.0',
  port: import.meta.env.PORT ?? 4000,
  routes: {
    '/auth/*': cors(auth.handler),
    '/rpc/*': cors(rpc.handler),
  },
  error(error) {
    logger.error(error)
    return new Response('Internal Server Error', { status: 500 })
  },
})

logger.info(`Listening on ${server.url}`)

// Graceful Shutdown

async function gracefulShutdown() {
  logger.info('Gracefully shutting down...')
  await server.stop()
  process.exit(0)
}

process.on('SIGINT', gracefulShutdown)
process.on('SIGTERM', gracefulShutdown)
