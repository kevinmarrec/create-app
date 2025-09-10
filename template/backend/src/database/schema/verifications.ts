import { sqliteTable } from 'drizzle-orm/sqlite-core'

// https://www.better-auth.com/docs/concepts/database#verification
export const verifications = sqliteTable('verifications', t => ({
  id: t.text().primaryKey(),
  identifier: t.text().notNull(),
  value: t.text().notNull(),
  expiresAt: t.integer({ mode: 'timestamp' }).notNull(),
  createdAt: t.integer({ mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  updatedAt: t.integer({ mode: 'timestamp' }).notNull().$defaultFn(() => new Date()).$onUpdate(() => new Date()),
}))
