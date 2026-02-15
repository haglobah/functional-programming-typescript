import { createSignal, Match, Switch } from 'solid-js'
import { SignInForm } from './SignInForm'
import { SignUpForm } from './SignUpForm'

type Tab = 'signin' | 'signup'

export const AuthTabs = () => {
  const [activeTab, setActiveTab] = createSignal<Tab>('signin')

  const tabClass = (tab: Tab) =>
    `flex-1 py-2.5 text-sm font-medium transition-colors ${
      activeTab() === tab
        ? 'text-white border-b-2 border-purple-500'
        : 'text-slate-400 hover:text-slate-300 border-b-2 border-transparent'
    }`

  return (
    <div class="w-80 p-6">
      <div class="flex border-b border-slate-700 mb-6">
        <button type="button" class={tabClass('signin')} onClick={() => setActiveTab('signin')}>
          Sign In
        </button>
        <button type="button" class={tabClass('signup')} onClick={() => setActiveTab('signup')}>
          Sign Up
        </button>
      </div>

      <Switch>
        <Match when={activeTab() === 'signin'}>
          <SignInForm />
        </Match>
        <Match when={activeTab() === 'signup'}>
          <SignUpForm />
        </Match>
      </Switch>
    </div>
  )
}
