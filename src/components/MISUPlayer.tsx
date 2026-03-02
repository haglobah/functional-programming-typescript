import { createEffect, createSignal, createMemo, onMount, For, Show } from 'solid-js'

export type Track = { id: string; url: string; title: string }
export type Time = number

export type Initial = { type: 'Initial' }
export type Loading = { type: 'Loading'; track: Track }
export type Playing = { type: 'Playing'; track: Track; currentTime: Time }
export type Paused = { type: 'Paused'; track: Track; currentTime: Time }

export type State = Initial | Loading | Playing | Paused

export const MISUAudioPlayer = () => {
  const [state, setState] = createSignal<State>({ type: 'Initial' })

  createEffect(() => console.log(JSON.stringify(state())))

  const audio: HTMLAudioElement = new Audio()

  const playTrack = (track: Track) => {
    setState({ type: 'Loading', track })

    audio.src = track.url
    audio.play().catch((err) => {
      console.error('Playback failed', err)
      setState({ type: 'Paused', track, currentTime: 0 })
    })
  }

  const togglePlay = () =>
    setState((prev: State) => {
      if (prev.type === 'Paused') {
        audio.play()
        return { ...prev, type: 'Playing' }
      } else if (prev.type === 'Playing') {
        audio.pause()
        return { ...prev, type: 'Paused' }
      } else {
        return prev
      }
    })

  onMount(() => {
    audio.oncanplay = () =>
      setState((prev: State) => {
        if (prev.type === 'Loading') {
          return { type: 'Playing' as const, track: prev.track, currentTime: 0 }
        } else {
          return prev
        }
      })

    audio.ontimeupdate = () =>
      setState((prev: State) => {
        if (prev.type === 'Playing') {
          return { ...prev, currentTime: audio.currentTime }
        } else {
          return prev
        }
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
    if (state().type === 'Loading' || state().type === 'Paused' || state().type === 'Playing') {
      return state() as Loading | Playing | Paused
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
