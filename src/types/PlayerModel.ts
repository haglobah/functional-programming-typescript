import { Maybe } from 'purify-ts/Maybe'
import { type Tagged, tag } from '../utils'

export type Track = Tagged<'Track', { id: string; url: string; title: string }>
export const Track = (id: string, url: string, title: string): Track =>
  tag('Track')({ id, url, title })

type Time = number

type Idle = Tagged<'Idle'>
type Loading = Tagged<'Loading', { track: Track }>
type Playing = Tagged<'Playing', { track: Track; currentTime: Time; duration: Time }>
type Paused = Tagged<'Paused', { track: Track; currentTime: Time; duration: Time }>

export type State = Idle | Loading | Playing | Paused

export const State = {
  Idle: tag('Idle'),
  Loading: (track: Track): Loading => tag('Loading')({ track }),
  Playing: (track: Track, currentTime: Time, duration: Time): Playing =>
    tag('Playing')({ track, currentTime, duration }),
  Paused: (track: Track, currentTime: Time, duration: Time): Paused =>
    tag('Paused')({ track, currentTime, duration }),
} as const

export const initialPlayerState = (): State => State.Idle()

export const getTrack = (state: State): Maybe<Track> =>
  Maybe.fromPredicate(() => state.kind !== 'Idle', state).map(
    (s) => (s as Loading | Playing | Paused).track,
  )

export const getCurrentTime = (state: State): Maybe<Time> =>
  state.kind === 'Playing' || state.kind === 'Paused' ? Maybe.of(state.currentTime) : Maybe.empty()

export const getDuration = (state: State): Maybe<Time> =>
  state.kind === 'Playing' || state.kind === 'Paused' ? Maybe.of(state.duration) : Maybe.empty()

type SelectTrack = Tagged<'SelectTrack', { track: Track }>
type AudioReady = Tagged<'AudioReady', { duration: Time }>
type Tick = Tagged<'Tick', { time: Time }>
type TogglePlay = Tagged<'TogglePlay'>
type Seek = Tagged<'Seek', { time: Time }>

export type Msg = SelectTrack | AudioReady | Tick | TogglePlay | Seek

export const Msg = {
  SelectTrack: (track: Track): SelectTrack => tag('SelectTrack')({ track }),
  AudioReady: (duration: Time): AudioReady => tag('AudioReady')({ duration }),
  Tick: (time: Time): Tick => tag('Tick')({ time }),
  TogglePlay: tag('TogglePlay'),
  Seek: (time: Time): Seek => tag('Seek')({ time }),
} as const

type None = Tagged<'None'>
type Play = Tagged<'Play'>
type Pause = Tagged<'Pause'>
type LoadAndPlay = Tagged<'LoadAndPlay', { url: string }>
type SeekTo = Tagged<'SeekTo', { time: Time }>

export type Cmd = None | Play | Pause | LoadAndPlay | SeekTo

export const Cmd = {
  None: tag('None'),
  Play: tag('Play'),
  Pause: tag('Pause'),
  LoadAndPlay: (url: string): LoadAndPlay => tag('LoadAndPlay')({ url }),
  SeekTo: (time: Time): SeekTo => tag('SeekTo')({ time }),
} as const
