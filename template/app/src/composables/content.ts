import { useQuery } from '@pinia/colada'

import { orpc } from '~/app/lib/orpc'

export function useContent() {
  const publicContent = useQuery({
    key: () => ['public'],
    query: orpc.public,
  }).data

  const privateContent = useQuery({
    key: () => ['private'],
    query: orpc.private,
  }).data

  return {
    publicContent,
    privateContent,
  }
}
