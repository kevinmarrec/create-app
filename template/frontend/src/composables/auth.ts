import { orpc } from '@frontend/lib/orpc'
import { useMutation, useQuery } from '@tanstack/vue-query'
import { createAuthClient } from 'better-auth/vue'
import { computed } from 'vue'

export const authClient = createAuthClient({
  baseURL: `http://localhost:4000/auth`,
  fetchOptions: {
    credentials: 'include',
  },
})

const session = authClient.useSession()

function createAuthMutation<T extends (...args: any[]) => any>(fn: T) {
  return useMutation({
    mutationFn: async (input: Parameters<T>[0]) => {
      return fn(input, {
        onError: ({ error }: any) => {
          throw error
        },
      })
    },
  })
}

export function useAuth() {
  const signIn = createAuthMutation(authClient.signIn.email)
  const signUp = createAuthMutation(authClient.signUp.email)
  const signOut = createAuthMutation(authClient.signOut)

  const foo = useQuery(orpc.foo.foo.queryOptions()).data
  const user = computed(() => session.value.data?.user)

  return {
    signIn,
    signUp,
    signOut,
    foo,
    user,
  }
}
