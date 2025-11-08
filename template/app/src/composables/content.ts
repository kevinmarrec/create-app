import { useQuery } from '@tanstack/vue-query'

import { orpc } from '~/app/lib/orpc'

export function useContent() {
  const publicContent = useQuery(orpc.public.queryOptions({})).data
  const privateContent = useQuery(orpc.private.queryOptions({})).data

  return {
    publicContent,
    privateContent,
  }
}
