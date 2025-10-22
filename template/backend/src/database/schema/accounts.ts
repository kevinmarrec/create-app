import { pgTable } from 'drizzle-orm/pg-core'

import { users } from './users'

// https://www.better-auth.com/docs/concepts/database#account
export const accounts = pgTable('accounts', t => ({
  id: t.text().primaryKey(),
  userId: t.text().notNull().references(() => users.id, { onDelete: 'cascade' }),
  accountId: t.text().notNull(),
  providerId: t.text().notNull(),
  accessToken: t.text(),
  refreshToken: t.text(),
  accessTokenExpiresAt: t.timestamp(),
  refreshTokenExpiresAt: t.timestamp(),
  scope: t.text(),
  idToken: t.text(),
  password: t.text(),
  createdAt: t.timestamp().notNull().defaultNow(),
  updatedAt: t.timestamp().notNull().defaultNow().$onUpdate(() => new Date()),
}))
