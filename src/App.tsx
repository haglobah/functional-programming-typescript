import { AudioPlayer } from './components/AudioPlayer'
import { ImperativeAudioPlayer } from './components/ImperativeAudioPlayer'
import { SignUpForm } from './components/SignUpForm'
import { createModal } from './components/Modal'

const App = () => {
  const { openModal, Modal } = createModal()

  return (
    <>
      <button
        class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
        onClick={openModal}
      >
        Sign Up
      </button>
      <Modal>
        <SignUpForm />
      </Modal>
      <div class="grid grid-cols-2">
        <AudioPlayer />
        <ImperativeAudioPlayer />
      </div>
    </>
  )
}

export default App
