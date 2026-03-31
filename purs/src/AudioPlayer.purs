module AudioPlayer where

import Data.Tuple (Tuple(..))

-- Domain types

type Track = { id :: String, title :: String, url :: String }
type Time = Number

-- State (sum type — illegal states are unrepresentable)

data State
  = Idle
  | Loading { track :: Track }
  | Playing { track :: Track, currentTime :: Time, duration :: Time }
  | Paused { track :: Track, currentTime :: Time, duration :: Time }

-- Messages
-- Each constructor wraps a record whose fields match the TS Msg types,
-- enabling generic ADT <-> {kind, ...} conversion at the JS boundary.

data Msg
  = SelectTrack { track :: Track }
  | AudioReady { duration :: Time }
  | Tick { time :: Time }
  | TogglePlay
  | Seek { time :: Time }

-- Commands (reified effects)

data Cmd
  = None
  | Play
  | Pause
  | LoadAndPlay { url :: String }
  | SeekTo { time :: Time }

-- The pure update function: (State, Msg) -> (State, Cmd)

update :: State -> Msg -> Tuple State Cmd
update state msg = case msg of
  SelectTrack { track } ->
    Tuple (Loading { track }) (LoadAndPlay { url: track.url })

  AudioReady { duration } -> case state of
    Loading { track } ->
      Tuple (Playing { track, currentTime: 0.0, duration }) Play
    _ ->
      Tuple state None

  Tick { time } -> case state of
    Playing r ->
      Tuple (Playing r { currentTime = time }) None
    Paused r ->
      Tuple (Paused r { currentTime = time }) None
    _ ->
      Tuple state None

  TogglePlay -> case state of
    Playing r ->
      Tuple (Paused { track: r.track, currentTime: r.currentTime, duration: r.duration }) Pause
    Paused r ->
      Tuple (Playing { track: r.track, currentTime: r.currentTime, duration: r.duration }) Play
    _ ->
      Tuple state None

  Seek { time } -> case state of
    Playing r ->
      Tuple (Playing r { currentTime = time }) (SeekTo { time })
    Paused r ->
      Tuple (Paused r { currentTime = time }) (SeekTo { time })
    _ ->
      Tuple state None

-- Initial state

initialState :: State
initialState = Idle
