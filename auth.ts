import { betterAuth } from 'better-auth'
import { Database } from 'bun:sqlite'
import { Elysia, type Context, status } from 'elysia'

export const auth = betterAuth({
  database: new Database('./auth.sqlite'),
  emailAndPassword: { enabled: true },
  trustedOrigins: ['http://localhost:5173'],
  user: { additionalFields: { automergeRootId: { type: 'string', required: true } } },
})

const betterAuthView = (context: Context) => {
  if (['POST', 'GET'].includes(context.request.method)) {
    return auth.handler(context.request)
  } else {
    return status(405)
  }
}

const apiPath = '/api/auth/*'

const app = new Elysia().all(apiPath, betterAuthView).listen(3001)

console.log(`Auth API is running at ${app.server?.hostname}:${app.server?.port}${apiPath}`)
