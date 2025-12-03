import { betterAuth } from 'better-auth'
import { type DB, drizzleAdapter } from 'better-auth/adapters/drizzle'
import type { BaseLogger } from 'pino'

import { env } from '../env'

export function createBetterAuth({ db, logger }: { db: DB, logger: BaseLogger }) {
  return betterAuth({
    basePath: '/auth',
    secret: env.auth.secret,
    trustedOrigins: env.cors.allowedOrigins,
    database: drizzleAdapter(db, {
      provider: 'pg',
      usePlural: true,
    }),
    logger: {
      level: 'info',
      log: (level, message) => {
        logger[level](message)
      },
    },
    emailAndPassword: {
      enabled: true,
    },
  })
}

export type Auth = ReturnType<typeof createBetterAuth>
