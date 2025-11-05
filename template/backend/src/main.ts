import process from 'node:process'

import { createBetterAuth } from '@backend/auth'
import { db } from '@backend/database'
import { createRpcHandler } from '@backend/orpc'
import { router } from '@backend/orpc/router'
import { cors } from '@backend/utils/cors'
import { logger } from '@backend/utils/logger'

const auth = createBetterAuth({ db, logger })
const rpcHandler = createRpcHandler(router)

const routes = {
  '/auth/*': cors(async (req) => {
    return await auth.handler(req)
  }),
  '/rpc/*': cors(async (req) => {
    const { matched, response } = await rpcHandler.handle(req, {
      prefix: '/rpc',
      context: { auth, db, logger },
    })

    if (matched)
      return response

    return new Response('Not found', { status: 404 })
  }),
}

const server = Bun.serve({
  hostname: import.meta.env.HOST ?? '0.0.0.0',
  port: import.meta.env.PORT ?? 4000,
  routes,
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
