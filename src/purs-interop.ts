/**
 * Generic interop between PureScript ADTs and {kind: ...} tagged unions.
 *
 * Convention: PureScript constructors use records whose fields match the
 * TypeScript types. Constructor name === kind tag. This makes conversion
 * fully generic — no per-type boilerplate needed.
 *
 * PureScript ADT shape:  CtorName.value (nullary) or CtorName.create({...})
 * Compiled JS shape:     { constructor: { name: "CtorName" }, value0?: {...} }
 */

import * as PS from '../purs/output/AudioPlayer/index.js'
import type { State, Msg, Cmd } from './types/PlayerModel'

// ADT instance → {kind, ...fields}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fromADT = (val: any) => {
  const kind = val.constructor.name
  return val.value0 ? { kind, ...val.value0 } : { kind }
}

// {kind, ...fields} → ADT instance
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const toADT = (ctors: Record<string, any>, obj: any) => {
  const { kind, ...rest } = obj
  const ctor = ctors[kind]
  return Object.keys(rest).length > 0 ? ctor.create(rest) : ctor.value
}

const stateCtors = { Idle: PS.Idle, Loading: PS.Loading, Playing: PS.Playing, Paused: PS.Paused }
const msgCtors = {
  SelectTrack: PS.SelectTrack,
  AudioReady: PS.AudioReady,
  Tick: PS.Tick,
  TogglePlay: PS.TogglePlay,
  Seek: PS.Seek,
}

export const update = (state: State, msg: Msg): [State, Cmd] => {
  const result = PS.update(toADT(stateCtors, state))(toADT(msgCtors, msg)) as {
    value0: unknown
    value1: unknown
  }
  return [fromADT(result.value0) as State, fromADT(result.value1) as Cmd]
}

export const initialState: State = { kind: 'Idle' }
