import { createAuthClient } from 'better-auth/solid'

export const authClient = createAuthClient({ baseURL: 'http://localhost:3000' })

// const signUpUser = (email: Email, password)

// const { data, error } = await authClient.signUp.email({

// })
