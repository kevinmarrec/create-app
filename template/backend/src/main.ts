import process from 'node:process'

import { createBetterAuth } from '@backend/auth'
import { db } from '@backend/database'
import { createRpcHandler } from '@backend/orpc'
import { router } from '@backend/orpc/router'
import { logger } from '@backend/utils/logger'

const auth = createBetterAuth({ db, logger })
const rpcHandler = createRpcHandler(router)

function cors(handler: (req: Request) => Promise<Response>) {
  return async (req: Request) => {
    const response = req.method === 'OPTIONS'
      ? new Response(undefined, { status: 204 })
      : await handler(req)

    if (req.method === 'OPTIONS') {
      response.headers.append('Access-Control-Allow-Headers', 'Content-Type')
      response.headers.append('Access-Control-Allow-Methods', 'GET, HEAD, PUT, POST, DELETE, PATCH')
    }

    response.headers.append('Access-Control-Allow-Credentials', 'true')
    response.headers.append('Access-Control-Allow-Origin', req.headers.get('origin') ?? '')

    return response
  }
}

const routes = {
  '/auth/*': cors(async (req) => {
    return await auth.handler(req)
  }),
  '/rpc/*': cors(async (req) => {
    const { matched, response } = await rpcHandler.handle(req, {
      prefix: '/rpc',
      context: {
        auth,
        db,
        logger,
      },
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
