import { type Track } from './Track'
export { type Track }

type Idle = { kind: 'Idle' }
type Loading = { kind: 'Loading'; track: Track }
type Playing = { kind: 'Playing'; track: Track; currentTime: number }
type Paused = { kind: 'Paused'; track: Track; currentTime: number }

export type State = Idle | Loading | Playing | Paused

export const initialPlayerState = (): State => ({ kind: 'Idle' })

type SelectTrack = { kind: 'SelectTrack'; track: Track }
type AudioReady = { kind: 'AudioReady' }
type Tick = { kind: 'Tick'; time: number }
type TogglePlay = { kind: 'TogglePlay' }

export type Msg = SelectTrack | AudioReady | Tick | TogglePlay

type None = { kind: 'None' }
type Play = { kind: 'Play' }
type Pause = { kind: 'Pause' }
type LoadAndPlay = { kind: 'LoadAndPlay'; url: string }

export type Cmd = None | Play | Pause | LoadAndPlay
