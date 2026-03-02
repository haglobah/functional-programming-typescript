import { createEffect, createMemo, onMount, For, Show } from 'solid-js'
import { createReducer } from '../utils'

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

export type Action = SelectTrack | AudioReady | Tick | TogglePlay

export const reduce = (s: State, a: Action): State => {
  switch (a.type) {
    case 'SelectTrack':
      return { type: 'Loading', track: a.track }
    case 'AudioReady':
      if (s.type === 'Loading') {
        return { type: 'Playing', track: s.track, currentTime: 0 }
      } else {
        return s
      }
    case 'Tick':
      if (s.type === 'Playing') {
        return { ...s, currentTime: a.time }
      }
      return s
    case 'TogglePlay':
      if (s.type === 'Playing') {
        return { ...s, type: 'Paused' }
      } else if (s.type === 'Paused') {
        return { ...s, type: 'Playing' }
      } else {
        return s
      }
    default:
      const _exhaustive: never = a
      return _exhaustive
  }
}

export const MISUAudioPlayer = () => {
  const [state, dispatch] = createReducer<State, Action>(reduce, { type: 'Initial' })
  const audio: HTMLAudioElement = new Audio()

  createEffect(() => console.log(JSON.stringify(state)))

  const playTrack = (track: Track) => dispatch({ type: 'SelectTrack', track })
  const togglePlay = () => dispatch({ type: 'TogglePlay' })

  onMount(() => {
    audio.oncanplay = () => dispatch({ type: 'AudioReady' })
    audio.ontimeupdate = () => dispatch({ type: 'Tick', time: audio.currentTime })
  })

  createEffect(() => {
    if (state.type === 'Playing') {
      audio.play().catch((err) => {
        console.error('Playback failed', err)
        dispatch({ type: 'TogglePlay' })
      })
    } else if (state.type === 'Paused') {
      audio.pause()
    } else if (state.type === 'Loading') {
      audio.src = state.track.url
    }
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
      <h2>Audio Player: Illegal States Are Unrepresentable</h2>
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
