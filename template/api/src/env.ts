import * as v from 'valibot'

const schema = v.object({
  auth: v.object({
    secret: v.pipe(
      v.string(),
      v.nonEmpty(),
    ),
  }),
  cors: v.object({
    allowedOrigins: v.pipe(
      v.string(),
      v.nonEmpty(),
      v.transform(input => input.split(',').filter(Boolean)),
      v.array(v.pipe(
        v.string(),
        v.trim(),
        v.startsWith('https://'),
      )),
    ),
  }),
  database: v.object({
    url: v.pipe(
      v.string(),
      v.nonEmpty(),
      v.startsWith('postgresql://'),
    ),
  }),
  log: v.object({
    level: v.optional(v.picklist([
      'fatal',
      'error',
      'warn',
      'info',
      'debug',
      'trace',
      'silent',
    ]), 'info'),
  }),
  server: v.object({
    host: v.optional(v.string(), '0.0.0.0'),
    port: v.pipe(
      v.optional(v.string(), '4000'),
      v.digits(),
      v.toNumber(),
    ),
    url: v.pipe(
      v.string(),
      v.trim(),
      v.startsWith('https://'),
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
    url: import.meta.env.SERVER_URL,
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
