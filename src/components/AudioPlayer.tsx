import { onMount, For, type Component } from 'solid-js'
import {
  initialPlayerState,
  type State,
  type Msg,
  type Cmd,
  type Track,
} from '../types/PlayerModel'
import { createUpdater } from '../utils'

const update = (state: State, msg: Msg): [State, Cmd] => {
  switch (msg.kind) {
    case 'SelectTrack':
      return [
        { kind: 'Loading', track: msg.track },
        { kind: 'LoadAndPlay', url: msg.track.url },
      ]
    case 'AudioReady':
      if (state.kind === 'Loading')
        return [{ kind: 'Playing', track: state.track, currentTime: 0 }, { kind: 'Play' }]
      return [state, { kind: 'None' }]
    case 'Tick':
      if (state.kind === 'Playing' || state.kind === 'Paused')
        return [{ ...state, currentTime: msg.time }, { kind: 'None' }]
      return [state, { kind: 'None' }]
    case 'TogglePlay':
      if (state.kind === 'Playing') return [{ ...state, kind: 'Paused' }, { kind: 'Pause' }]
      if (state.kind === 'Paused') return [{ ...state, kind: 'Playing' }, { kind: 'Play' }]
      return [state, { kind: 'None' }]
    default:
      const _exhaustive = msg
      return _exhaustive
  }
}

const makeExecute = (player: HTMLMediaElement) => {
  return (cmd: Cmd) => {
    if (cmd.kind === 'LoadAndPlay') {
      player.src = cmd.url
      player.play()
    } else if (cmd.kind === 'Play') {
      player.play()
    } else if (cmd.kind === 'Pause') {
      player.pause()
    }
  }
}

type Props = {}

export const AudioPlayer: Component<Props> = () => {
  const player = new Audio()

  const [state, dispatch] = createUpdater(update, initialPlayerState(), makeExecute(player))

  onMount(() => {
    player.oncanplay = () => dispatch({ kind: 'AudioReady' })
    player.ontimeupdate = () => dispatch({ kind: 'Tick', time: player.currentTime })
  })

  const tracks: Track[] = [
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
    <div class="p-20">
      <h2>Purely Functional Audio Player</h2>

      <div>
        <For each={tracks}>
          {(track) => (
            <button onClick={() => dispatch({ kind: 'SelectTrack', track })}>
              Play {track.title}
            </button>
          )}
        </For>
      </div>

      <div>
        {state.kind === 'Idle' && <p>Select a track to begin.</p>}
        {state.kind === 'Loading' && <p>Loading {state.track.title}...</p>}

        {(state.kind === 'Playing' || state.kind === 'Paused') && (
          <div>
            <h3>
              Now {state.kind}: {state.track.title}
            </h3>
            <p>Time: {state.currentTime.toFixed(2)}s</p>
            <button onClick={() => dispatch({ kind: 'TogglePlay' })}>
              {state.kind === 'Playing' ? 'Pause' : 'Resume'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
