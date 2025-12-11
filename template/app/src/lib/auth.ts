import { createAuthClient, type ErrorContext } from 'better-auth/vue'

import { getFetchOptions } from '../utils/fetch'

export type AuthError = ErrorContext['error']

export const authClient = createAuthClient({
  baseURL: `${import.meta.env.VITE_API_URL}/auth`,
  fetchOptions: {
    ...getFetchOptions(),
    onError: ({ error }) => Promise.reject(error),
  },
})
