import { defineMutation } from '@pinia/colada'
import { set } from '@vueuse/core'
import { computed, ref } from 'vue'

import { authClient, type AuthError } from '../lib/auth'

const authError = ref<AuthError>()

function defineAuthMutation<TVars, TData>(mutation: (vars: TVars) => Promise<TData>) {
  return defineMutation({
    mutation,
    onMutate: () => {
      set(authError, undefined)
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
