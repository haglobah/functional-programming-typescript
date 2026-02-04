import { createStore } from 'solid-js/store'

export const createReducer = <S extends object, A>(
  reducer: (state: S, action: A) => S,
  initialState: S,
): [S, (action: A) => void] => {
  const [store, setStore] = createStore<S>(initialState)
  const dispatch = (action: A): void => {
    setStore((state) => reducer(state, action))
  }
  return [store, dispatch]
}
