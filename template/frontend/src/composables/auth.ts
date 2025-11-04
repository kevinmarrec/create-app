import { orpc } from '@frontend/lib/orpc'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { createAuthClient } from 'better-auth/vue'

export const authClient = createAuthClient({
  baseURL: `http://localhost:4000/auth`,
  fetchOptions: {
    credentials: 'include',
  },
})

export function useAuth() {
  const session = authClient.useSession()

  console.log(session)

  const qc = useQueryClient()

  const { data: user } = useQuery(orpc.auth.getCurrentUser.queryOptions({
    retry: false,
  }))

  const signUp = useMutation(orpc.auth.signUp.mutationOptions({
    onSuccess: () => qc.invalidateQueries({ queryKey: orpc.auth.getCurrentUser.queryKey() }),
  }))

  const signUp2 = useMutation({
    mutationKey: ['signUp'],
    mutationFn: async (data: { email: string, password: string }) => {
      const response = await authClient.signUp.email({
        email: data.email,
        password: data.password,
        name: 'User',
      })
      return response
    },
  })

  const signIn = useMutation(orpc.auth.signIn.mutationOptions({
    onSuccess: () => qc.invalidateQueries({ queryKey: orpc.auth.getCurrentUser.queryKey() }),
  }))

  const signOut = useMutation(orpc.auth.signOut.mutationOptions({
    onSuccess: () => {
      qc.setQueryData<null>(orpc.auth.getCurrentUser.queryKey(), null)
    },
  }))

  return {
    user,
    signUp,
    signIn,
    signOut,
    signUp2,
  }
}
