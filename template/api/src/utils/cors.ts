import { env } from '../env'

export function cors(handler: (req: Request) => Promise<Response>) {
  return async (req: Request) => {
    const origin = req.headers.get('origin')

    if (origin && !env.cors.allowedOrigins.includes(origin)) {
      return new Response('Origin not allowed', { status: 403 })
    }

    const response = req.method === 'OPTIONS'
      ? new Response(undefined, { status: 204 })
      : await handler(req)

    if (req.method === 'OPTIONS') {
      response.headers.append('Access-Control-Allow-Headers', 'Content-Type')
      response.headers.append('Access-Control-Allow-Methods', 'GET, HEAD, PUT, POST, DELETE, PATCH')
      response.headers.append('Access-Control-Max-Age', '7200') // 2 hours https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Access-Control-Max-Age
    }

    response.headers.append('Access-Control-Allow-Credentials', 'true')

    if (origin) {
      response.headers.append('Access-Control-Allow-Origin', origin)
    }

    return response
  }
}
