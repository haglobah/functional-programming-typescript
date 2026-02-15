import { AudioPlayer } from './components/AudioPlayer'
import { ImperativeAudioPlayer } from './components/ImperativeAudioPlayer'
import { SignUpForm } from './components/SignUpForm'
import { createModal } from './components/Modal'
import { authClient } from './auth-client'

const App = () => {
  const { openModal, Modal } = createModal()
  const session = authClient.useSession()

  const signOut = async () => {
    const resp = await authClient.signOut()
    console.log(resp)
  }

  return (
    <>
      <button
        class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
        onClick={openModal}
      >
        Sign Up
      </button>
      <button
        class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
        onClick={signOut}
      >
        Sign Out
      </button>
      <pre>{JSON.stringify(session().data?.user, null, 2)}</pre>
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
