import { defineMutation } from '@pinia/colada'
import { computed, ref } from 'vue'

import { authClient, type AuthError } from '../lib/auth'

const authError = ref<AuthError>()

function defineAuthMutation<TVars, TData>(mutation: (vars: TVars) => Promise<TData>) {
  return defineMutation({
    mutation,
    onMutate: () => {
      authError.value = undefined
    },
    onSettled: (_, error) => {
      authError.value = error as AuthError
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
