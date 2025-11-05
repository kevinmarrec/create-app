import { pub } from '@backend/orpc'

export const foo = pub
  .handler(async () => {
    return 'foo'
  })
