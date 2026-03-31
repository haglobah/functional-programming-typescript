module AudioFFI
  ( module Web.HTML.HTMLAudioElement
  , module Web.HTML.HTMLMediaElement
  , onCanPlay
  , onTimeUpdate
  , onEnded
  ) where

import Prelude

import Effect (Effect)
import Web.Event.Event (EventType(..))
import Web.Event.EventTarget (addEventListener, eventListener)
import Web.HTML.HTMLAudioElement (HTMLAudioElement, create, toHTMLMediaElement, toEventTarget)
import Web.HTML.HTMLMediaElement (HTMLMediaElement, setSrc, play, pause, setCurrentTime, duration, currentTime)

onCanPlay :: (Number -> Effect Unit) -> HTMLAudioElement -> Effect Unit
onCanPlay cb audio = do
  listener <- eventListener \_ -> do
    dur <- duration (toHTMLMediaElement audio)
    cb dur
  addEventListener (EventType "canplay") listener false (toEventTarget audio)

onTimeUpdate :: (Number -> Effect Unit) -> HTMLAudioElement -> Effect Unit
onTimeUpdate cb audio = do
  listener <- eventListener \_ -> do
    t <- currentTime (toHTMLMediaElement audio)
    cb t
  addEventListener (EventType "timeupdate") listener false (toEventTarget audio)

onEnded :: Effect Unit -> HTMLAudioElement -> Effect Unit
onEnded cb audio = do
  listener <- eventListener \_ -> cb
  addEventListener (EventType "ended") listener false (toEventTarget audio)
