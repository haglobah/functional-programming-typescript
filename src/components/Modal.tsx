import { Portal } from 'solid-js/web'
import { createSignal, Show, type JSX } from 'solid-js'

export const createModal = () => {
  const [open, setOpen] = createSignal(false)

  return {
    openModal() {
      setOpen(true)
    },
    closeModal() {
      setOpen(false)
    },
    Modal(props: { children: JSX.Element }) {
      return (
        <Portal>
          <Show when={open()}>
            <div
              class="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            >
              <div
                class="bg-slate-800 rounded-lg shadow-2xl p-8 max-w-md w-full mx-4 border border-slate-700"
                onClick={(e) => e.stopPropagation()}
              >
                {props.children}
              </div>
            </div>
          </Show>
        </Portal>
      )
    },
  }
}
