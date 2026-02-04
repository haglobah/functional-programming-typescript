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

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
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

  const isCurrentTrack = (track: Track): boolean => {
    if (state.kind === 'Idle') return false
    return state.track.id === track.id
  }

  return (
    <div class="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-6">
      <div class="w-full max-w-md bg-slate-800/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-700/50 overflow-hidden">
        <div class="p-8">
          <div class="flex items-center gap-3 mb-8">
            <div class="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
              </svg>
            </div>
            <h2 class="text-xl font-bold text-white">Audio Player</h2>
          </div>

          <div class="space-y-3 mb-8">
            <p class="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Playlist</p>
            <For each={tracks}>
              {(track) => (
                <button
                  onClick={() => dispatch({ kind: 'SelectTrack', track })}
                  class={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-200 ${
                    isCurrentTrack(track)
                      ? 'bg-gradient-to-r from-purple-600/30 to-pink-600/30 border border-purple-500/50'
                      : 'bg-slate-700/30 hover:bg-slate-700/50 border border-transparent'
                  }`}
                >
                  <div
                    class={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      isCurrentTrack(track)
                        ? 'bg-gradient-to-br from-purple-500 to-pink-500'
                        : 'bg-slate-600'
                    }`}
                  >
                    {isCurrentTrack(track) && state.kind === 'Playing' ? (
                      <div class="flex items-end gap-0.5 h-4">
                        <span class="w-1 bg-white rounded-full animate-pulse" style="height: 100%; animation-delay: 0ms" />
                        <span class="w-1 bg-white rounded-full animate-pulse" style="height: 60%; animation-delay: 150ms" />
                        <span class="w-1 bg-white rounded-full animate-pulse" style="height: 80%; animation-delay: 300ms" />
                      </div>
                    ) : (
                      <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    )}
                  </div>
                  <div class="flex-1 text-left">
                    <p class="font-semibold text-white">{track.title}</p>
                    <p class="text-sm text-slate-400">Track {track.id}</p>
                  </div>
                  {isCurrentTrack(track) && (
                    <div class="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  )}
                </button>
              )}
            </For>
          </div>

          <div class="bg-slate-700/30 rounded-2xl p-6">
            {state.kind === 'Idle' && (
              <div class="text-center py-4">
                <div class="w-16 h-16 mx-auto mb-4 bg-slate-600/50 rounded-full flex items-center justify-center">
                  <svg class="w-8 h-8 text-slate-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                  </svg>
                </div>
                <p class="text-slate-400">Select a track to begin</p>
              </div>
            )}

            {state.kind === 'Loading' && (
              <div class="text-center py-4">
                <div class="w-16 h-16 mx-auto mb-4 bg-purple-600/30 rounded-full flex items-center justify-center">
                  <svg class="w-8 h-8 text-purple-400 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                </div>
                <p class="text-purple-300 font-medium">Loading {state.track.title}...</p>
              </div>
            )}

            {(state.kind === 'Playing' || state.kind === 'Paused') && (
              <div>
                <div class="text-center mb-6">
                  <p class="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    Now {state.kind === 'Playing' ? 'Playing' : 'Paused'}
                  </p>
                  <h3 class="text-xl font-bold text-white">{state.track.title}</h3>
                </div>

                <div class="mb-6">
                  <div class="h-1.5 bg-slate-600 rounded-full overflow-hidden">
                    <div
                      class="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min((state.currentTime / 300) * 100, 100)}%` }}
                    />
                  </div>
                  <div class="flex justify-between mt-2">
                    <span class="text-xs text-slate-400">{formatTime(state.currentTime)}</span>
                    <span class="text-xs text-slate-400">5:00</span>
                  </div>
                </div>

                <div class="flex justify-center">
                  <button
                    onClick={() => dispatch({ kind: 'TogglePlay' })}
                    class="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-105 transition-all duration-200"
                  >
                    {state.kind === 'Playing' ? (
                      <svg class="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                      </svg>
                    ) : (
                      <svg class="w-7 h-7 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
