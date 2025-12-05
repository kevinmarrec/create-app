import { defineMutation } from '@pinia/colada'
import { set } from '@vueuse/core'
import { createAuthClient, type ErrorContext } from 'better-auth/vue'
import { computed, ref } from 'vue'

const authClient = createAuthClient({
  baseURL: `${import.meta.env.VITE_API_URL}/auth`,
  fetchOptions: {
    credentials: 'include',
    onError: ({ error }) => Promise.reject(error),
  },
})

const authError = ref<ErrorContext['error'] | null>(null)

function defineAuthMutation<TVars, TData>(mutation: (vars: TVars) => Promise<TData>) {
  return defineMutation({
    mutation,
    onMutate: () => {
      set(authError, null)
    },
    onSettled: (_, error) => {
      set(authError, error)
    },
  })
}

const useSignIn = defineAuthMutation(authClient.signIn.email)
const useSignUp = defineAuthMutation(authClient.signUp.email)
const useSignOut = defineAuthMutation(authClient.signOut)

export function useAuth() {
  const session = authClient.useSession()

  return {
    error: authError,
    user: computed(() => session.value.data?.user),
    signIn: useSignIn(),
    signUp: useSignUp(),
    signOut: useSignOut(),
  }
}
