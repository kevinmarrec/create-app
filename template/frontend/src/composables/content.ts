import { orpc } from '@frontend/lib/orpc'
import { useQuery } from '@tanstack/vue-query'

export function useContent() {
  const publicContent = useQuery(orpc.public.queryOptions({})).data
  const privateContent = useQuery(orpc.private.queryOptions({})).data

  return {
    publicContent,
    privateContent,
  }
}
