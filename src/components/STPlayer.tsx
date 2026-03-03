import { createEffect, createMemo, onMount, For, Show } from 'solid-js'
import { createUpdater } from '../utils'

export type Track = { id: string; url: string; title: string }
export type Time = number

export type Initial = { type: 'Initial' }
export type Loading = { type: 'Loading'; track: Track }
export type Playing = { type: 'Playing'; track: Track; currentTime: Time }
export type Paused = { type: 'Paused'; track: Track; currentTime: Time }

export type State = Initial | Loading | Playing | Paused

export type SelectTrack = { type: 'SelectTrack'; track: Track }
export type AudioReady = { type: 'AudioReady' }
export type Tick = { type: 'Tick'; time: number }
export type TogglePlay = { type: 'TogglePlay' }

export type Msg = SelectTrack | AudioReady | Tick | TogglePlay

export type None = { type: 'None' }
export type Load = { type: 'Load'; url: string }
export type Pause = { type: 'Pause' }
export type Play = { type: 'Play' }

export type Cmd = None | Load | Pause | Play

export const Initial = (): Initial => ({ type: 'Initial' })
export const Loading = (track: Track): Loading => ({ type: 'Loading', track })
export const Playing = (track: Track, currentTime: Time): Playing => ({
  type: 'Playing',
  track,
  currentTime,
})
export const Paused = (track: Track, currentTime: Time): Paused => ({
  type: 'Paused',
  track,
  currentTime,
})

export const SelectTrack = (track: Track): SelectTrack => ({ type: 'SelectTrack', track })
export const AudioReady = (): AudioReady => ({ type: 'AudioReady' })
export const Tick = (time: number): Tick => ({ type: 'Tick', time })
export const TogglePlay = (): TogglePlay => ({ type: 'TogglePlay' })

export const None = (): None => ({ type: 'None' })
export const Load = (url: string): Load => ({ type: 'Load', url })
export const Pause = (): Pause => ({ type: 'Pause' })
export const Play = (): Play => ({ type: 'Play' })

export const update = (s: State, m: Msg): [State, Cmd] => {
  switch (m.type) {
    case 'SelectTrack':
      return [Loading(m.track), Load(m.track.url)]
    case 'AudioReady':
      if (s.type === 'Loading') {
        return [Playing(s.track, 0), Play()]
      } else {
        return [s, None()]
      }
    case 'Tick':
      if (s.type === 'Playing') {
        return [{ ...s, currentTime: m.time }, None()]
      }
      return [s, None()]
    case 'TogglePlay':
      if (s.type === 'Playing') {
        return [{ ...s, type: 'Paused' }, Pause()]
      } else if (s.type === 'Paused') {
        return [{ ...s, type: 'Playing' }, Play()]
      } else {
        return [s, None()]
      }
    default:
      const _exhaustive: never = m
      return _exhaustive
  }
}

export const makeExecute = (player: HTMLAudioElement) => {
  const execute = (cmd: Cmd) => {
    if (cmd.type === 'Play') {
      player.play().catch((err) => {
        console.error('Playback failed', err)
        return TogglePlay()
      })
    } else if (cmd.type === 'Pause') {
      player.pause()
    } else if (cmd.type === 'Load') {
      player.src = cmd.url
    }
  }
  return execute
}

export const STAudioPlayer = () => {
  const audio: HTMLAudioElement = new Audio()
  const [state, dispatch] = createUpdater<State, Msg, Cmd>(update, Initial(), makeExecute(audio))

  createEffect(() => console.log(JSON.stringify(state)))

  const playTrack = (track: Track) => dispatch(SelectTrack(track))
  const togglePlay = () => dispatch(TogglePlay())

  onMount(() => {
    audio.oncanplay = () => dispatch(AudioReady())
    audio.ontimeupdate = () => dispatch(Tick(audio.currentTime))
  })

  const tracks = [
    {
      id: '1',
      title: 'Lo-Fi Beats',
      url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    },
    {
      id: '2',
      title: 'Synthwave',
      url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    },
  ]

  const trackState = createMemo(() => {
    if (state.type === 'Loading' || state.type === 'Paused' || state.type === 'Playing') {
      return state
    } else {
      return undefined
    }
  })

  return (
    <div style={{ padding: '20px' }}>
      <h2>Audio Player: State Transitions with reduce</h2>
      {/* JSON.stringify(state()) */}

      <For each={tracks}>
        {(track) => (
          <button class="p-2 bg-zinc-200 m-2 cursor-pointer" onClick={() => playTrack(track)}>
            Play {track.title}
          </button>
        )}
      </For>

      <div style={{ 'margin-top': '20px', border: '1px solid red', padding: '10px' }}>
        <Show when={trackState()} fallback={<p>No track selected</p>}>
          {(ts) => (
            <>
              <h3>Now: {ts().track.title}</h3>

              <Show when={ts().type !== 'Loading'} fallback={<p>Loading...</p>}>
                <p>Time: {(ts() as Playing | Paused).currentTime.toFixed(2)}s</p>

                <button class="p-2 bg-zinc-200 m-2 cursor-pointer" onClick={togglePlay}>
                  {ts().type === 'Playing' ? 'Pause' : 'Resume'}
                </button>
              </Show>
            </>
          )}
        </Show>
      </div>
    </div>
  )
}
