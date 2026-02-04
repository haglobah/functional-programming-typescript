import { createStore } from 'solid-js/store'

export const createUpdater = <S extends object, A, C>(
  update: (state: S, action: A) => [S, C],
  initialState: S,
  execute: (cmd: C) => void,
): [S, (action: A) => void] => {
  const [store, setStore] = createStore<S>(initialState)
  const dispatch = (action: A): void => {
    setStore((state) => {
      const [newState, cmd] = update(state, action)
      execute(cmd)
      return newState
    })
  }
  return [store, dispatch]
}

export type Tagged<K extends string, T extends object = Record<string, never>> = {
  readonly kind: K
} & { readonly [P in keyof T]: T[P] }

export const tag =
  <K extends string>(kind: K) =>
  <T extends object = Record<string, never>>(data?: T): Tagged<K, T> =>
    ({ kind, ...data }) as Tagged<K, T>
