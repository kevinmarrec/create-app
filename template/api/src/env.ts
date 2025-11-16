import * as v from 'valibot'

const schema = v.object({
  auth: v.object({
    secret: v.string(),
  }),
  cors: v.object({
    allowedOrigins: v.pipe(
      v.optional(v.string(), ''),
      v.transform(input => input.split(',')),
    ),
  }),
  database: v.object({
    url: v.string(),
  }),
  log: v.object({
    level: v.optional(v.union([
      v.literal('fatal'),
      v.literal('error'),
      v.literal('warn'),
      v.literal('info'),
      v.literal('debug'),
      v.literal('trace'),
      v.literal('silent'),
    ]), 'info'),
  }),
  server: v.object({
    host: v.optional(v.string(), '0.0.0.0'),
    port: v.pipe(
      v.optional(v.string(), '4000'),
      v.decimal(),
      v.transform(input => Number(input)),
    ),
  }),
})

const parsed = v.safeParse(schema, {
  auth: {
    secret: import.meta.env.AUTH_SECRET,
  },
  cors: {
    allowedOrigins: import.meta.env.ALLOWED_ORIGINS,
  },
  database: {
    url: import.meta.env.DATABASE_URL,
  },
  log: {
    level: import.meta.env.LOG_LEVEL,
  },
  server: {
    host: import.meta.env.HOST,
    port: import.meta.env.PORT,
  },
})

if (!parsed.success) {
  throw new Error([
    '🚨 Environment Validation Error!',
    ...parsed.issues.map(issue =>
      issue.path
        ? `[${issue.path.map(p => p.key).join('.')}] ${issue.message}`
        : issue.message,
    ),
  ].join('\n'))
}

export const env = parsed.output
