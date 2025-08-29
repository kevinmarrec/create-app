import { integer, sqliteTable } from 'drizzle-orm/sqlite-core'

const timestamps = {
  createdAt: integer({ mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer({ mode: 'timestamp' }).notNull().$defaultFn(() => new Date()).$onUpdate(() => new Date()),
}

export const users = sqliteTable('users', t => ({
  id: t.text().primaryKey(),
  name: t.text().notNull(),
  email: t.text().notNull().unique(),
  emailVerified: t.integer({ mode: 'boolean' }).notNull().default(false),
  image: t.text(),
  ...timestamps,
}))

export const sessions = sqliteTable('sessions', t => ({
  id: t.text().primaryKey(),
  userId: t.text().notNull().references(() => users.id, { onDelete: 'cascade' }),
  token: t.text().notNull().unique(),
  expiresAt: t.integer({ mode: 'timestamp' }).notNull(),
  ipAddress: t.text(),
  userAgent: t.text(),
  ...timestamps,
}))

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
  ...timestamps,
}))

export const verifications = sqliteTable('verifications', t => ({
  id: t.text().primaryKey(),
  identifier: t.text().notNull(),
  value: t.text().notNull(),
  expiresAt: t.integer({ mode: 'timestamp' }).notNull(),
  ...timestamps,
}))
