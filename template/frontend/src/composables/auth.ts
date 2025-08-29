import { orpc } from '@frontend/lib/orpc'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'

export function useAuth() {
  const qc = useQueryClient()

  const { data: session } = useQuery(orpc.auth.getSession.queryOptions({
    retry: false,
  }))

  const { mutateAsync: signUp } = useMutation(orpc.auth.signUp.mutationOptions({
    onSuccess: () => qc.invalidateQueries({ queryKey: orpc.auth.getSession.queryKey() }),
  }))

  const { mutateAsync: signIn } = useMutation(orpc.auth.signIn.mutationOptions({
    onSuccess: () => qc.invalidateQueries({ queryKey: orpc.auth.getSession.queryKey() }),
  }))

  const { mutateAsync: signOut } = useMutation(orpc.auth.signOut.mutationOptions({
    onSuccess: () => {
      qc.setQueryData<null>(orpc.auth.getSession.queryKey(), null)
    },
  }))

  return {
    session,
    signUp,
    signIn,
    signOut,
  }
}
