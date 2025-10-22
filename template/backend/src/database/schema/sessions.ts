import { pgTable } from 'drizzle-orm/pg-core'

import { users } from './users'

// https://www.better-auth.com/docs/concepts/database#session
export const sessions = pgTable('sessions', t => ({
  id: t.text().primaryKey(),
  userId: t.text().notNull().references(() => users.id, { onDelete: 'cascade' }),
  token: t.text().notNull().unique(),
  expiresAt: t.timestamp().notNull(),
  ipAddress: t.text(),
  userAgent: t.text(),
  createdAt: t.timestamp().notNull().defaultNow(),
  updatedAt: t.timestamp().notNull().defaultNow().$onUpdate(() => new Date()),
}))
