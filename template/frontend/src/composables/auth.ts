import { orpc } from '@frontend/lib/orpc'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'

export function useAuth() {
  const qc = useQueryClient()

  const { data: user } = useQuery(orpc.auth.getCurrentUser.queryOptions({
    retry: false,
  }))

  const signUp = useMutation(orpc.auth.signUp.mutationOptions({
    onSuccess: () => qc.invalidateQueries({ queryKey: orpc.auth.getCurrentUser.queryKey() }),
  }))

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
  }
}
