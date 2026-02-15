import { inferAdditionalFields } from 'better-auth/client/plugins'
import { createAuthClient } from 'better-auth/solid'

export const authClient = createAuthClient({
  plugins: [
    inferAdditionalFields({ user: { automergeRootId: { type: 'string', required: true } } }),
  ],
})
