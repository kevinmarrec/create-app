import * as v from 'valibot'

const schema = v.object({
  cors: v.object({
    credentials: v.optional(v.boolean(), false),
    origin: v.optional(
      v.pipe(
        v.string(),
        v.minLength(1),
        v.transform(value => value.split(',')),
      ),
      'http://localhost:5173',
    ),
  }),
  hostname: v.optional(
    v.pipe(
      v.string(),
      v.minLength(1),
    ),
    '0.0.0.0',
  ),
  port: v.optional(v.pipe(
    v.string(),
    v.transform(value => +value),
    v.number(),
    v.minValue(3000),
    v.maxValue(65535),
  ), '4000'),
})

const config = v.parse(schema, {
  cors: {
    credentials: true,
    origin: import.meta.env.ALLOWED_ORIGINS,
  },
  hostname: import.meta.env.HOST,
  port: import.meta.env.PORT,
})

export const cors = config.cors
export const hostname = config.hostname
export const port = config.port
