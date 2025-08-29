import { copyHeaders } from '@backend/utils/headers'
import * as v from 'valibot'

import { authed, base } from './base'

export const getSession = authed.handler(async ({ context }) => {
  return context.user
})

export const signUp = base
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

    copyHeaders(headers, resHeaders)

    return response
  })

export const signIn = base.input(v.object({
  email: v.pipe(v.string(), v.email()),
  password: v.string(),
  rememberMe: v.optional(v.boolean(), true),
}))
  .handler(async ({ input, context: { resHeaders, auth } }) => {
    const { headers, response } = await auth.api.signInEmail({
      body: input,
      returnHeaders: true,
    })

    copyHeaders(headers, resHeaders)

    return response
  })

export const signOut = authed.handler(async ({ context: { auth, reqHeaders, resHeaders } }) => {
  const { headers, response } = await auth.api.signOut({
    headers: reqHeaders ?? new Headers(),
    returnHeaders: true,
  })

  copyHeaders(headers, resHeaders)

  return response
})
