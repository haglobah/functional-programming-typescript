import { createStore, reconcile } from 'solid-js/store'

export const createUpdater = <S extends object, M, C>(
  update: (state: S, msg: M) => [S, C],
  initialState: S,
  execute: (cmd: C) => void,
): [S, (msg: M) => void] => {
  const [store, setStore] = createStore<S>(initialState)
  const dispatch = (msg: M): void => {
    setStore((state) => {
      const [newState, cmd] = update(state, msg)
      execute(cmd)
      return newState
    })
  }
  return [store, dispatch]
}

export const createReducer = <S extends object, A>(
  reduce: (state: S, action: A) => S,
  initialState: S,
): [S, (action: A) => void] => {
  const [store, setStore] = createStore<S>(initialState)
  const dispatch = (action: A): void => {
    setStore(reconcile(reduce(store, action)))
  }
  return [store, dispatch]
}
