import { createSignal } from 'solid-js'
import { AudioPlayer } from './components/AudioPlayer'

function App() {
  const [_count, _setCount] = createSignal(0)

  return (
    <div class="">
      <AudioPlayer />
    </div>
  )
}

export default App
