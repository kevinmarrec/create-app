import { betterAuth } from 'better-auth'
import { type DB, drizzleAdapter } from 'better-auth/adapters/drizzle'
import type { BaseLogger } from 'pino'

export function createBetterAuth<T extends { db: DB, logger: BaseLogger }>({ db, logger }: T) {
  return betterAuth({
    database: drizzleAdapter(db, {
      provider: 'sqlite',
      usePlural: true,
    }),
    logger: {
      log: (level, message) => {
        logger[level](message)
      },
    },
    emailAndPassword: {
      enabled: true,
    },
    // Can be removed when upgrading to v1.3.8
    telemetry: {
      enabled: false,
    },
  })
}

export type Auth = ReturnType<typeof createBetterAuth>
export type Session = Auth['$Infer']['Session']
