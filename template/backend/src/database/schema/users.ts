import { sqliteTable } from 'drizzle-orm/sqlite-core'

// https://www.better-auth.com/docs/concepts/database#user
export const users = sqliteTable('users', t => ({
  id: t.text().primaryKey(),
  name: t.text().notNull(),
  email: t.text().notNull().unique(),
  emailVerified: t.integer({ mode: 'boolean' }).notNull().default(false),
  image: t.text(),
  createdAt: t.integer({ mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  updatedAt: t.integer({ mode: 'timestamp' }).notNull().$defaultFn(() => new Date()).$onUpdate(() => new Date()),
}))
