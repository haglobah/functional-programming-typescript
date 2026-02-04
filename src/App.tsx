import { createSignal } from 'solid-js'
import { AudioPlayer } from './components/AudioPlayer'
import { ImperativeAudioPlayer } from './components/ImperativeAudioPlayer'

function App() {
  const [_count, _setCount] = createSignal(0)

  return (
    <div class="grid grid-cols-2">
      <AudioPlayer />
      <ImperativeAudioPlayer />
    </div>
  )
}

export default App
