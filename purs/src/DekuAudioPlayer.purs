module DekuAudioPlayer where

import Prelude

import AudioPlayer as AP
import AudioFFI as FFI
import Data.Int (floor)
import Web.HTML.HTMLMediaElement (HTMLMediaElement)
import Data.Number ((%))
import Data.String (length)
import Data.Tuple (Tuple(..))
import Data.Tuple.Nested ((/\))
import Deku.Attribute ((!:=))
import Deku.Attributes (klass_, style_)
import Deku.Control (switcher, text_)
import Deku.Core (Nut, fixed)
import Deku.DOM as D
import Deku.Do as Deku
import Deku.Hooks (useHot, useRef, useEffect)
import Deku.Listeners (click_, slider_)
import Deku.Toplevel (runInElement')
import Effect (Effect)
import Effect.Ref as Ref
import Web.DOM.Element (Element)

-- Tracks

tracks :: Array AP.Track
tracks =
  [ { id: "1", title: "Lo-Fi Beats", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" }
  , { id: "2", title: "Synthwave", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" }
  ]

-- Helpers

padStart :: Int -> String -> String -> String
padStart targetLen padChar str =
  let
    diff = targetLen - length str
  in
    if diff <= 0 then str
    else go diff padChar <> str
  where
  go 0 _ = ""
  go n c = c <> go (n - 1) c

formatTime :: Number -> String
formatTime seconds =
  let
    mins = floor (seconds / 60.0)
    secs = floor (seconds % 60.0)
  in
    show mins <> ":" <> padStart 2 "0" (show secs)

-- Command execution

executeCmd :: HTMLMediaElement -> AP.Cmd -> Effect Unit
executeCmd media = case _ of
  AP.None -> pure unit
  AP.Play -> FFI.play media
  AP.Pause -> FFI.pause media
  AP.LoadAndPlay { url } -> do
    FFI.setSrc url media
    FFI.play media
  AP.SeekTo { time } -> FFI.setCurrentTime time media

-- The Deku app

dekuApp :: HTMLMediaElement -> Ref.Ref (AP.Msg -> Effect Unit) -> Nut
dekuApp media dispatchRef = Deku.do
  setState /\ stateE <- useHot AP.Idle
  readState <- useRef AP.Idle stateE

  let
    dispatch :: AP.Msg -> Effect Unit
    dispatch msg = do
      currentState <- readState
      let Tuple newState cmd = AP.update currentState msg
      setState newState
      executeCmd media cmd

  -- Write dispatch into the ref so audio callbacks can use it
  _ <- useEffect stateE (\_ -> Ref.write dispatch dispatchRef)

  D.div
    [ klass_ "bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900 flex items-center justify-center p-6" ]
    [ D.div
        [ klass_ "w-full max-w-md bg-slate-800/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-700/50 overflow-hidden" ]
        [ D.div
            [ klass_ "p-8" ]
            [ -- Header
              D.div
                [ klass_ "flex items-center gap-3 mb-8" ]
                [ D.div
                    [ klass_ "w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center" ]
                    [ D.svg
                        [ klass_ "w-5 h-5 text-white", D.Fill !:= "currentColor", D.ViewBox !:= "0 0 24 24" ]
                        [ D.path [ D.D !:= "M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" ] [] ]
                    ]
                , D.div_
                    [ D.h2 [ klass_ "text-xl font-bold text-white" ] [ text_ "Deku Player" ]
                    , D.p [ klass_ "text-xs text-emerald-400 font-mono" ] [ text_ "full UI in PureScript Deku" ]
                    ]
                ]
            , -- Playlist
              D.div
                [ klass_ "space-y-3 mb-8" ]
                [ D.p
                    [ klass_ "text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4" ]
                    [ text_ "Playlist" ]
                , fixed (map (renderTrack dispatch) tracks)
                ]
            , -- Now playing area
              D.div
                [ klass_ "bg-slate-700/30 rounded-2xl p-6" ]
                [ switcher (renderPlayer dispatch) stateE ]
            ]
        ]
    ]

renderTrack :: (AP.Msg -> Effect Unit) -> AP.Track -> Nut
renderTrack dispatch track =
  D.button
    [ click_ (dispatch (AP.SelectTrack { track }))
    , klass_ "w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-200 bg-slate-700/30 hover:bg-slate-700/50 border border-transparent cursor-pointer text-white font-inherit"
    ]
    [ D.div
        [ klass_ "w-12 h-12 rounded-xl flex items-center justify-center bg-slate-600" ]
        [ D.svg
            [ klass_ "w-5 h-5 text-white", D.Fill !:= "currentColor", D.ViewBox !:= "0 0 24 24" ]
            [ D.path [ D.D !:= "M8 5v14l11-7z" ] [] ]
        ]
    , D.div
        [ klass_ "flex-1 text-left" ]
        [ D.p [ klass_ "font-semibold text-white" ] [ text_ track.title ]
        , D.p [ klass_ "text-sm text-slate-400" ] [ text_ ("Track " <> track.id) ]
        ]
    ]

renderPlayer :: (AP.Msg -> Effect Unit) -> AP.State -> Nut
renderPlayer dispatch = case _ of
  AP.Idle ->
    D.div
      [ klass_ "text-center py-4" ]
      [ D.div
          [ klass_ "w-16 h-16 mx-auto mb-4 bg-slate-600/50 rounded-full flex items-center justify-center" ]
          [ D.svg
              [ klass_ "w-8 h-8 text-slate-400", D.Fill !:= "currentColor", D.ViewBox !:= "0 0 24 24" ]
              [ D.path [ D.D !:= "M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" ] [] ]
          ]
      , D.p [ klass_ "text-slate-400" ] [ text_ "Select a track to begin" ]
      ]

  AP.Loading { track } ->
    D.div
      [ klass_ "text-center py-4" ]
      [ D.div
          [ klass_ "w-16 h-16 mx-auto mb-4 bg-emerald-600/30 rounded-full flex items-center justify-center" ]
          [ D.svg
              [ klass_ "w-8 h-8 text-emerald-400 animate-spin", D.Fill !:= "none", D.ViewBox !:= "0 0 24 24" ]
              [ D.circle [ klass_ "opacity-25", D.Cx !:= "12", D.Cy !:= "12", D.R !:= "10", D.Stroke !:= "currentColor", D.StrokeWidth !:= "4" ] []
              , D.path [ klass_ "opacity-75", D.Fill !:= "currentColor", D.D !:= "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" ] []
              ]
          ]
      , D.p [ klass_ "text-emerald-300 font-medium" ] [ text_ ("Loading " <> track.title <> "...") ]
      ]

  AP.Playing r -> renderActive dispatch true r
  AP.Paused r -> renderActive dispatch false r

renderActive :: (AP.Msg -> Effect Unit) -> Boolean -> { track :: AP.Track, currentTime :: Number, duration :: Number } -> Nut
renderActive dispatch isPlaying { track, currentTime, duration } =
  let
    pct = show ((currentTime / duration) * 100.0)
    trackBg = "linear-gradient(to right, rgb(16 185 129) 0%, rgb(20 184 166) " <> pct <> "%, rgb(71 85 105) " <> pct <> "%, rgb(71 85 105) 100%)"
  in
    D.div_
      [ -- Track info
        D.div
          [ klass_ "text-center mb-6" ]
          [ D.p
              [ klass_ "text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1" ]
              [ text_ (if isPlaying then "Now Playing" else "Paused") ]
          , D.h3
              [ klass_ "text-xl font-bold text-white" ]
              [ text_ track.title ]
          ]
      , -- Seek bar
        D.div
          [ klass_ "mb-6" ]
          [ D.input
              [ slider_ (\val -> dispatch (AP.Seek { time: val }))
              , D.Min !:= "0"
              , D.Max !:= show duration
              , D.Step !:= "0.1"
              , D.Value !:= show currentTime
              , klass_ "w-full h-2 bg-slate-600 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-br [&::-webkit-slider-thumb]:from-emerald-500 [&::-webkit-slider-thumb]:to-teal-500 [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-emerald-500/50 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-gradient-to-br [&::-moz-range-thumb]:from-emerald-500 [&::-moz-range-thumb]:to-teal-500 [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:shadow-lg [&::-moz-range-thumb]:shadow-emerald-500/50"
              , style_ ("background:" <> trackBg)
              ]
              []
          , D.div
              [ klass_ "flex justify-between mt-3" ]
              [ D.span [ klass_ "text-xs font-medium text-slate-400" ] [ text_ (formatTime currentTime) ]
              , D.span [ klass_ "text-xs font-medium text-slate-400" ] [ text_ (formatTime duration) ]
              ]
          ]
      , -- Play/pause button
        D.div
          [ klass_ "flex justify-center" ]
          [ D.button
              [ click_ (dispatch (AP.TogglePlay))
              , klass_ "w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-105 transition-all duration-200 border-none cursor-pointer"
              ]
              [ D.svg
                  [ klass_ "w-7 h-7 text-white", D.Fill !:= "currentColor", D.ViewBox !:= "0 0 24 24" ]
                  [ D.path [ D.D !:= if isPlaying then "M6 19h4V5H6v14zm8-14v14h4V5h-4z" else "M8 5v14l11-7z" ] [] ]
              ]
          ]
      ]

-- Mount function for use from TypeScript
mount :: Element -> Effect (Effect Unit)
mount elt = do
  audio <- FFI.create
  let media = FFI.toHTMLMediaElement audio
  dispatchRef <- Ref.new (\_ -> pure unit :: Effect Unit)
  let
    callDispatch msg = do
      d <- Ref.read dispatchRef
      d msg
  FFI.onCanPlay (\dur -> callDispatch (AP.AudioReady { duration: dur })) audio
  FFI.onTimeUpdate (\t -> callDispatch (AP.Tick { time: t })) audio
  FFI.onEnded (callDispatch AP.TogglePlay) audio
  runInElement' elt (dekuApp media dispatchRef)
