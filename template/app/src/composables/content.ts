import { useQuery } from '@pinia/colada'

import { orpc } from '~/app/lib/orpc'

export function useContent() {
  return {
    publicContent: useQuery(orpc.public.queryOptions()).data,
    privateContent: useQuery(orpc.private.queryOptions()).data,
  }
}
