import process from 'node:process'

import type { Logger } from './logger'

export function createStopper({ logger }: { logger: Logger }) {
  return {
    bind: (server: Bun.Server<unknown>) => {
      async function gracefulShutdown() {
        logger.info('Received termination signal. Gracefully shutting down...')
        await server.stop()
        logger.info('Server stopped. Exiting process.')
        process.exit(0)
      }

      process.on('SIGINT', gracefulShutdown)
      process.on('SIGTERM', gracefulShutdown)
    },
  }
}
