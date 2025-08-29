import { orpc } from '@frontend/lib/orpc'
import { get } from '@frontend/utils'
import { useQuery } from '@tanstack/vue-query'
import { computed, type MaybeRef } from 'vue'

export function useWelcome(text: MaybeRef<string>) {
  return useQuery(computed(() => orpc.welcome.queryOptions({
    input: get(text),
  })))
}
