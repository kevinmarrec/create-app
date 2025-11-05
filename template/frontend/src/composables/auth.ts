import { orpc } from '@frontend/lib/orpc'
import { useQuery } from '@tanstack/vue-query'
import { createAuthClient } from 'better-auth/vue'
import { computed } from 'vue'

export const authClient = createAuthClient({
  baseURL: `http://localhost:4000/auth`,
  fetchOptions: {
    credentials: 'include',
  },
})

const session = authClient.useSession()

export function useAuth() {
  const { data: foo } = useQuery(orpc.foo.foo.queryOptions({
    retry: false,
  }))

  return {
    user: computed(() => session.value.data?.user),
    signUp: authClient.signUp.email,
    signIn: authClient.signIn.email,
    signOut: authClient.signOut,
    foo,
  }
}
