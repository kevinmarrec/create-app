import type { BetterFetchOption } from 'better-auth/vue'

const FETCH_TIMEOUT_MS = 30_000

export function getFetchOptions(init?: RequestInit): RequestInit {
  return {
    ...init,
    credentials: 'include',
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  }
}

export const betterFetchOptions: BetterFetchOption = {
  ...getFetchOptions(),
  onError: ({ error }) => Promise.reject(error),
}
