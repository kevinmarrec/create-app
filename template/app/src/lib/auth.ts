import { createAuthClient, type ErrorContext } from 'better-auth/vue'

export type AuthError = ErrorContext['error']

export const authClient = createAuthClient({
  baseURL: `${import.meta.env.VITE_API_URL}/auth`,
  fetchOptions: {
    credentials: 'include',
    onError: ({ error }) => Promise.reject(error),
  },
})
