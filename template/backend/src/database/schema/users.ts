import { sqliteTable } from 'drizzle-orm/sqlite-core'

export const users = sqliteTable('users', t => ({
  id: t.integer().primaryKey({ autoIncrement: true }),
  name: t.text().notNull(),
  createdAt: t.integer({ mode: 'timestamp_ms' }).notNull().$defaultFn(() => new Date()),
  updatedAt: t.integer({ mode: 'timestamp_ms' }).notNull().$defaultFn(() => new Date()).$onUpdate(() => new Date()),
}))
