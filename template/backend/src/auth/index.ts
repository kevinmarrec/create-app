import { betterAuth } from 'better-auth'
import { type DB, drizzleAdapter } from 'better-auth/adapters/drizzle'
import type { BaseLogger } from 'pino'

export function createBetterAuth({ db, logger }: { db: DB, logger: BaseLogger }) {
  return betterAuth({
    trustedOrigins: ['http://localhost:5173'],
    basePath: '/auth',
    database: drizzleAdapter(db, {
      provider: 'pg',
      usePlural: true,
    }),
    logger: {
      log: (level, message) => {
        if (level === 'error') return
        logger[level](message)
      },
    },
    emailAndPassword: {
      enabled: true,
    },
  })
}

export type Auth = ReturnType<typeof createBetterAuth>
