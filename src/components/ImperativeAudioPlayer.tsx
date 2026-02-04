import { createSignal, onMount, For, Show } from 'solid-js'

export const ImperativeAudioPlayer = () => {
  // --- "Boolean Soup" State ---
  // These are independent. Nothing stops 'loading' and 'playing'
  // from being true at the same time, or both false while audio is actually playing.
  const [isPlaying, setIsPlaying] = createSignal(false)
  const [isLoading, setIsLoading] = createSignal(false)
  const [currentTrack, setCurrentTrack] = createSignal<any>(null)
  const [currentTime, setCurrentTime] = createSignal(0)

  const audio = new Audio()

  // --- Scattered Logic ---
  const playTrack = (track: any) => {
    setCurrentTrack(track)
    setIsLoading(true)
    setIsPlaying(false) // Reset playing state manually

    audio.src = track.url
    // Side effect happens immediately and directly
    audio.play().catch((err) => {
      console.error('Playback failed', err)
      setIsPlaying(false)
    })
  }

  const togglePlay = () => {
    if (audio.paused) {
      audio.play()
      setIsPlaying(true)
    } else {
      audio.pause()
      setIsPlaying(false)
    }
  }

  onMount(() => {
    // Wiring up listeners that directly mutate signals
    audio.oncanplay = () => {
      setIsLoading(false)
      setIsPlaying(true)
    }

    audio.ontimeupdate = () => {
      setCurrentTime(audio.currentTime)
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

  return (
    <div style={{ padding: '20px' }}>
      <h2>Imperative Audio Player</h2>

      <For each={tracks}>
        {(track) => <button onClick={() => playTrack(track)}>Play {track.title}</button>}
      </For>

      <div style={{ 'margin-top': '20px', border: '1px solid red', padding: '10px' }}>
        <Show when={currentTrack()} fallback={<p>No track selected</p>}>
          <h3>Now: {currentTrack().title}</h3>

          <Show when={isLoading()}>
            <p>Loading...</p>
          </Show>

          <p>Time: {currentTime().toFixed(2)}s</p>

          <button onClick={togglePlay}>{isPlaying() ? 'Pause' : 'Resume'}</button>
        </Show>
      </div>
    </div>
  )
}
