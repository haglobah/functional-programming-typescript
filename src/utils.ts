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
