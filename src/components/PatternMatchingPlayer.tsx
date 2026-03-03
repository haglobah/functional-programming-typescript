import { match, P } from 'ts-pattern'
import { createEffect, createMemo, onMount, For, Show } from 'solid-js'
import { createReducer } from '../utils'

export type Track = { id: string; url: string; title: string }
export type Time = number

export type Initial = { state: 'Initial' }
export type Loading = { state: 'Loading'; track: Track }
export type Playing = { state: 'Playing'; track: Track; currentTime: Time }
export type Paused = { state: 'Paused'; track: Track; currentTime: Time }

export type State = Initial | Loading | Playing | Paused

export type SelectTrack = { action: 'SelectTrack'; track: Track }
export type AudioReady = { action: 'AudioReady' }
export type Tick = { action: 'Tick'; time: number }
export type TogglePlay = { action: 'TogglePlay' }

export type Action = SelectTrack | AudioReady | Tick | TogglePlay

export const reduce = (s: State, a: Action): State =>
  match([a, s])
    .returnType<State>()
    .with([{ action: 'SelectTrack' }, P._], ([a]) => ({ state: 'Loading', track: a.track }))
    .with([{ action: 'AudioReady' }, { state: 'Loading' }], ([, s]) => ({
      state: 'Playing',
      track: s.track,
      currentTime: 0,
    }))
    .with([{ action: 'Tick' }, { state: 'Playing' }], ([a, s]) => ({ ...s, currentTime: a.time }))
    .with([{ action: 'TogglePlay' }, { state: 'Playing' }], ([, s]) => ({ ...s, state: 'Paused' }))
    .with([{ action: 'TogglePlay' }, { state: 'Paused' }], ([, s]) => ({ ...s, state: 'Playing' }))
    .otherwise(() => s)

export const PatternMatchingAudioPlayer = () => {
  const [state, dispatch] = createReducer<State, Action>(reduce, { state: 'Initial' })
  const audio: HTMLAudioElement = new Audio()

  createEffect(() => console.log(JSON.stringify(state)))

  const playTrack = (track: Track) => dispatch({ action: 'SelectTrack', track })
  const togglePlay = () => dispatch({ action: 'TogglePlay' })

  onMount(() => {
    audio.oncanplay = () => dispatch({ action: 'AudioReady' })
    audio.ontimeupdate = () => dispatch({ action: 'Tick', time: audio.currentTime })
  })

  createEffect(() => {
    match(state)
      .with({ state: 'Playing' }, () => {
        audio.play().catch((err) => {
          console.error('Playback failed', err)
          dispatch({ action: 'TogglePlay' })
        })
      })
      .with({ state: 'Paused' }, () => {
        audio.pause()
      })
      .with({ state: 'Loading' }, (s) => {
        audio.src = s.track.url
      })
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
    if (state.state === 'Loading' || state.state === 'Paused' || state.state === 'Playing') {
      return state
    } else {
      return undefined
    }
  })

  return (
    <div style={{ padding: '20px' }}>
      <h2>Audio Player: State Transitions with reduce and pattern matching</h2>
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

              <Show when={ts().state !== 'Loading'} fallback={<p>Loading...</p>}>
                <p>Time: {(ts() as Playing | Paused).currentTime.toFixed(2)}s</p>

                <button class="p-2 bg-zinc-200 m-2 cursor-pointer" onClick={togglePlay}>
                  {ts().state === 'Playing' ? 'Pause' : 'Resume'}
                </button>
              </Show>
            </>
          )}
        </Show>
      </div>
    </div>
  )
}
