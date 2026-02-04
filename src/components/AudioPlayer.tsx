import { onMount, For, type Component } from 'solid-js'
import {
  initialPlayerState,
  State,
  Msg,
  Cmd,
  Track,
  type State as StateT,
  type Msg as MsgT,
  type Cmd as CmdT,
} from '../types/PlayerModel'
import { createUpdater } from '../utils'

const update = (state: StateT, msg: MsgT): [StateT, CmdT] => {
  switch (msg.kind) {
    case 'SelectTrack':
      return [State.Loading(msg.track), Cmd.LoadAndPlay(msg.track.url)]

    case 'AudioReady':
      return state.kind === 'Loading'
        ? [State.Playing(state.track, 0, msg.duration), Cmd.Play()]
        : [state, Cmd.None()]

    case 'Tick':
      return state.kind === 'Playing'
        ? [State.Playing(state.track, msg.time, state.duration), Cmd.None()]
        : state.kind === 'Paused'
          ? [State.Paused(state.track, msg.time, state.duration), Cmd.None()]
          : [state, Cmd.None()]

    case 'TogglePlay':
      return state.kind === 'Playing'
        ? [State.Paused(state.track, state.currentTime, state.duration), Cmd.Pause()]
        : state.kind === 'Paused'
          ? [State.Playing(state.track, state.currentTime, state.duration), Cmd.Play()]
          : [state, Cmd.None()]

    case 'Seek':
      return state.kind === 'Playing'
        ? [State.Playing(state.track, msg.time, state.duration), Cmd.SeekTo(msg.time)]
        : state.kind === 'Paused'
          ? [State.Paused(state.track, msg.time, state.duration), Cmd.SeekTo(msg.time)]
          : [state, Cmd.None()]

    default:
      const _exhaustive: never = msg
      return _exhaustive
  }
}

const makeExecute =
  (player: HTMLMediaElement) =>
  (cmd: CmdT): void => {
    switch (cmd.kind) {
      case 'LoadAndPlay':
        player.src = cmd.url
        player.play()
        break
      case 'Play':
        player.play()
        break
      case 'Pause':
        player.pause()
        break
      case 'SeekTo':
        player.currentTime = cmd.time
        break
      case 'None':
        break
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
    player.oncanplay = () => dispatch(Msg.AudioReady(player.duration))
    player.ontimeupdate = () => dispatch(Msg.Tick(player.currentTime))
    player.onended = () => dispatch(Msg.TogglePlay())
  })

  const tracks = [
    Track('1', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', 'Lo-Fi Beats'),
    Track('2', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', 'Synthwave'),
  ]

  const isCurrentTrack = (track: ReturnType<typeof Track>): boolean =>
    state.kind !== 'Idle' && state.track.id === track.id

  const handleSeek = (e: Event) => {
    const target = e.target as HTMLInputElement
    dispatch(Msg.Seek(parseFloat(target.value)))
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
            <p class="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
              Playlist
            </p>
            <For each={tracks}>
              {(track) => (
                <button
                  onClick={() => dispatch(Msg.SelectTrack(track))}
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
                        <span
                          class="w-1 bg-white rounded-full animate-pulse"
                          style="height: 100%; animation-delay: 0ms"
                        />
                        <span
                          class="w-1 bg-white rounded-full animate-pulse"
                          style="height: 60%; animation-delay: 150ms"
                        />
                        <span
                          class="w-1 bg-white rounded-full animate-pulse"
                          style="height: 80%; animation-delay: 300ms"
                        />
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
                    <circle
                      class="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      stroke-width="4"
                    />
                    <path
                      class="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
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
                  <div class="relative group">
                    <input
                      type="range"
                      min={0}
                      max={state.duration}
                      step={0.1}
                      value={state.currentTime}
                      onInput={handleSeek}
                      class="w-full h-2 bg-slate-600 rounded-full appearance-none cursor-pointer
                        [&::-webkit-slider-thumb]:appearance-none
                        [&::-webkit-slider-thumb]:w-4
                        [&::-webkit-slider-thumb]:h-4
                        [&::-webkit-slider-thumb]:rounded-full
                        [&::-webkit-slider-thumb]:bg-gradient-to-br
                        [&::-webkit-slider-thumb]:from-purple-500
                        [&::-webkit-slider-thumb]:to-pink-500
                        [&::-webkit-slider-thumb]:shadow-lg
                        [&::-webkit-slider-thumb]:shadow-purple-500/50
                        [&::-webkit-slider-thumb]:transition-transform
                        [&::-webkit-slider-thumb]:duration-150
                        [&::-webkit-slider-thumb]:hover:scale-125
                        [&::-moz-range-thumb]:w-4
                        [&::-moz-range-thumb]:h-4
                        [&::-moz-range-thumb]:rounded-full
                        [&::-moz-range-thumb]:bg-gradient-to-br
                        [&::-moz-range-thumb]:from-purple-500
                        [&::-moz-range-thumb]:to-pink-500
                        [&::-moz-range-thumb]:border-0
                        [&::-moz-range-thumb]:shadow-lg
                        [&::-moz-range-thumb]:shadow-purple-500/50
                        [&::-moz-range-thumb]:transition-transform
                        [&::-moz-range-thumb]:duration-150
                        [&::-moz-range-thumb]:hover:scale-125
                        [&::-webkit-slider-runnable-track]:rounded-full
                        [&::-moz-range-track]:rounded-full"
                      style={{
                        background: `linear-gradient(to right, rgb(168 85 247) 0%, rgb(236 72 153) ${(state.currentTime / state.duration) * 100}%, rgb(71 85 105) ${(state.currentTime / state.duration) * 100}%, rgb(71 85 105) 100%)`,
                      }}
                    />
                  </div>
                  <div class="flex justify-between mt-3">
                    <span class="text-xs font-medium text-slate-400">
                      {formatTime(state.currentTime)}
                    </span>
                    <span class="text-xs font-medium text-slate-400">
                      {formatTime(state.duration)}
                    </span>
                  </div>
                </div>

                <div class="flex justify-center">
                  <button
                    onClick={() => dispatch(Msg.TogglePlay())}
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
