import { onMount, onCleanup, type Component } from 'solid-js'
import { mount } from '../../purs/output/DekuAudioPlayer/index.js'

export const DekuPlayer: Component = () => {
  let container!: HTMLDivElement
  let cleanup: (() => void) | undefined

  onMount(() => {
    cleanup = mount(container)()
  })

  onCleanup(() => cleanup?.())

  return <div ref={container} />
}
