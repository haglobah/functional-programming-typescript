import { inferAdditionalFields } from 'better-auth/client/plugins'
import { createAuthClient } from 'better-auth/solid'
import { auth } from '../auth'

export const authClient = createAuthClient({ plugins: [inferAdditionalFields<typeof auth>()] })
