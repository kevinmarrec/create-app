import { pgTable } from 'drizzle-orm/pg-core'

// https://www.better-auth.com/docs/concepts/database#verification
export const verifications = pgTable('verifications', t => ({
  id: t.text().primaryKey(),
  identifier: t.text().notNull(),
  value: t.text().notNull(),
  expiresAt: t.timestamp().notNull(),
  createdAt: t.timestamp().notNull().defaultNow(),
  updatedAt: t.timestamp().notNull().defaultNow().$onUpdate(() => new Date()),
}))
