import { pub } from '@backend/orpc'
import { authMiddleware } from '@backend/orpc/middlewares'
import * as v from 'valibot'

export const getCurrentUser = pub
  .use(authMiddleware)
  .handler(async ({ context }) => context.user)

export const signUp = pub
  .input(v.object({
    name: v.string(),
    email: v.pipe(v.string(), v.email()),
    password: v.string(),
    rememberMe: v.optional(v.boolean(), true),
  }))
  .handler(async ({ input, context: { resHeaders, auth } }) => {
    const { headers, response } = await auth.api.signUpEmail({
      body: input,
      returnHeaders: true,
    })

    headers.forEach((v, k) => resHeaders?.append(k, v))

    return response.user
  })

export const signIn = pub
  .input(v.object({
    email: v.pipe(v.string(), v.email()),
    password: v.string(),
    rememberMe: v.optional(v.boolean(), true),
  }))
  .handler(async ({ input, context: { resHeaders, auth } }) => {
    const { headers, response } = await auth.api.signInEmail({
      body: input,
      returnHeaders: true,
    })

    headers.forEach((v, k) => resHeaders?.append(k, v))

    return response.user
  })

export const signOut = pub
  .handler(async ({ context: { auth, reqHeaders, resHeaders } }) => {
    const { headers, response } = await auth.api.signOut({
      headers: reqHeaders ?? new Headers(),
      returnHeaders: true,
    })

    headers.forEach((v, k) => resHeaders?.append(k, v))

    return response
  })
