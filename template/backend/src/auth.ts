import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'

import { db } from './database'

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'sqlite',
    usePlural: true,
  }),
  emailAndPassword: {
    enabled: true,
  },
  session: {
    // expiresIn: 5,
    updateAge: 10,
  },
  telemetry: {
    enabled: false,
  },
})

export type Auth = typeof auth
