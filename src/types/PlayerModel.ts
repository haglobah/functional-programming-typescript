import { Record } from 'immutable'

type IdleT = { kind: 'Idle' }
type Idle = Record<IdleT>
const Idle = Record<IdleT>({ kind: 'Idle' })

type TrackT = { id: string; url: string; title: string }
type Track = Record<TrackT>
const Track = Record<TrackT>({ id: '', url: '', title: '' })

type Time = number

// type Idle = { kind: 'Idle' }
type LoadingT = { kind: 'Loading'; track: Track }
type Loading = Record<LoadingT>
const Loading = Record<LoadingT>({ kind: 'Loading', track: Track() })
type Playing = { kind: 'Playing'; track: Track; currentTime: Time; duration: Time }
type Paused = { kind: 'Paused'; track: Track; currentTime: Time; duration: Time }

export type State = Idle | Loading | Playing | Paused

export const initialPlayerState = (): State => Idle({ kind: 'Idle' })

type SelectTrack = { kind: 'SelectTrack'; track: Track }
type AudioReady = { kind: 'AudioReady'; duration: Time }
type Tick = { kind: 'Tick'; time: number }
type TogglePlay = { kind: 'TogglePlay' }
type Seek = { kind: 'Seek'; time: Time }

export type Msg = SelectTrack | AudioReady | Tick | TogglePlay | Seek

type None = { kind: 'None' }
type Play = { kind: 'Play' }
type Pause = { kind: 'Pause' }
type LoadAndPlay = { kind: 'LoadAndPlay'; url: string }
type SeekTo = { kind: 'SeekTo'; time: Time }

export type Cmd = None | Play | Pause | LoadAndPlay | SeekTo
