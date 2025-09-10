import { sqliteTable } from 'drizzle-orm/sqlite-core'

import { users } from './users'

// https://www.better-auth.com/docs/concepts/database#session
export const sessions = sqliteTable('sessions', t => ({
  id: t.text().primaryKey(),
  userId: t.text().notNull().references(() => users.id, { onDelete: 'cascade' }),
  token: t.text().notNull().unique(),
  expiresAt: t.integer({ mode: 'timestamp' }).notNull(),
  ipAddress: t.text(),
  userAgent: t.text(),
  createdAt: t.integer({ mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  updatedAt: t.integer({ mode: 'timestamp' }).notNull().$defaultFn(() => new Date()).$onUpdate(() => new Date()),
}))
