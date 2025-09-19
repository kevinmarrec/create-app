import { sqliteTable } from 'drizzle-orm/sqlite-core'

import { users } from './users'

// https://www.better-auth.com/docs/concepts/database#account
export const accounts = sqliteTable('accounts', t => ({
  id: t.text().primaryKey(),
  userId: t.text().notNull().references(() => users.id, { onDelete: 'cascade' }),
  accountId: t.text().notNull(),
  providerId: t.text().notNull(),
  idToken: t.text(),
  accessToken: t.text(),
  accessTokenExpiresAt: t.integer({ mode: 'timestamp' }),
  refreshToken: t.text(),
  refreshTokenExpiresAt: t.integer({ mode: 'timestamp' }),
  scope: t.text(),
  password: t.text(),
  createdAt: t.integer({ mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  updatedAt: t.integer({ mode: 'timestamp' }).notNull().$defaultFn(() => new Date()).$onUpdate(() => new Date()),
}))
