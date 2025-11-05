import { pgTable } from 'drizzle-orm/pg-core'

// https://www.better-auth.com/docs/concepts/database#user
export const users = pgTable('users', t => ({
  id: t.text().primaryKey(),
  name: t.text().notNull(),
  email: t.text().notNull().unique(),
  emailVerified: t.boolean().notNull().default(false),
  image: t.text(),
  createdAt: t.timestamp().notNull().defaultNow(),
  updatedAt: t.timestamp().notNull().defaultNow().$onUpdate(() => new Date()),
}))
