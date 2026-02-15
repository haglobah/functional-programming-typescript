type User = { id: string; name: string; email: string; image: string; automergeId: string }

export type None = { type: 'None' }
export type NoUser = { type: 'NoUser'; automergeId: string }
export type SignedIn = { type: 'SignedIn'; user: User }

export type AuthState = None | NoUser | SignedIn

export const initialState = (): AuthState => ({ type: 'None' })
