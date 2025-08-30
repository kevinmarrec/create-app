import { db } from '@backend/database'
import { logger } from '@backend/logger'
import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'

export const auth = betterAuth({
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

export type Auth = typeof auth
export type Session = typeof auth.$Infer.Session
