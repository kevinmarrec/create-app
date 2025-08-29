import * as v from 'valibot'

const schema = v.object({
  level: v.optional(v.union([
    v.literal('trace'),
    v.literal('debug'),
    v.literal('info'),
    v.literal('warn'),
    v.literal('error'),
    v.literal('fatal'),
    v.literal('silent'),
  ]), 'info'),
})

const config = v.parse(schema, {
  level: import.meta.env.LOG_LEVEL,
})

export const level = config.level
