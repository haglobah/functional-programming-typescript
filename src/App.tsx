import { AudioPlayer } from './components/AudioPlayer'
import { ImperativeAudioPlayer } from './components/ImperativeAudioPlayer'
import { AuthTabs } from './components/AuthTabs'
import { createModal } from './components/Modal'
import { authClient } from './auth-client'
import { MISUAudioPlayer } from './components/MISUPlayer'
import { STAudioPlayer } from './components/STPlayer'
import { PatternMatchingAudioPlayer } from './components/PatternMatchingPlayer'
import { EffectsAudioPlayer } from './components/EffectsPlayer'

const App = () => {
  const { openModal, Modal } = createModal()
  const session = authClient.useSession()

  const signOut = async () => {
    const resp = await authClient.signOut()
    console.log(resp)
  }

  return (
    <>
      {/*<button
        class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
        onClick={openModal}
      >
        Sign In / Sign Up
      </button>
      <button
        class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
        onClick={signOut}
      >
        Sign Out
      </button>
      <pre>{JSON.stringify(session().data?.user, null, 2)}</pre>
      <Modal>
        <AuthTabs />
        </Modal> */}
      <div class="grid grid-cols-2">
        <ImperativeAudioPlayer />
        <MISUAudioPlayer />
        <STAudioPlayer />
        <PatternMatchingAudioPlayer />
        <EffectsAudioPlayer />
        {/*<AudioPlayer /> */}
      </div>
    </>
  )
}

export default App
