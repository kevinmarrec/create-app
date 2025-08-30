import process from 'node:process'

import { hostname, port } from './config/server'
import { logger } from './logger'
import { rpcHandler } from './orpc'
import { createContext } from './orpc/context'

const server = Bun.serve({
  hostname,
  port,
  async fetch(request) {
    const { matched, response } = await rpcHandler.handle(request, {
      prefix: '/rpc',
      context: createContext(),
    })

    if (matched)
      return response

    return new Response('Not found', { status: 404 })
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
