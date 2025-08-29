import { users } from '@backend/database/schema'
import { pub } from '@backend/lib/orpc'
import * as v from 'valibot'

export const welcome = pub
  .input(v.string())
  .output(v.string())
  .handler(async ({ input, context: { db } }) => {
    const count = await db.$count(users)
    return `Hello ${input} (${count})`
  })
