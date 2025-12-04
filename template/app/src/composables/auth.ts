import { useMutation } from '@tanstack/vue-query'
import { createAuthClient, type ErrorContext } from 'better-auth/vue'
import { computed } from 'vue'

const authClient = createAuthClient({
  baseURL: `${import.meta.env.VITE_API_URL}/auth`,
  fetchOptions: {
    credentials: 'include',
  },
})

const session = authClient.useSession()

function createAuthMutation<T extends (...args: any[]) => unknown>(fn: T) {
  return useMutation({
    mutationFn: async (input: Parameters<T>[0]) => {
      return fn(input, {
        onError: ({ error }: ErrorContext) => Promise.reject(error),
      })
    },
  })
}

export function useAuth() {
  const signIn = createAuthMutation(authClient.signIn.email)
  const signUp = createAuthMutation(authClient.signUp.email)
  const signOut = createAuthMutation(authClient.signOut)

  const user = computed(() => session.value.data?.user)

  return {
    signIn,
    signUp,
    signOut,
    user,
  }
}
