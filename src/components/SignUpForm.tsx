import { createForm, valiForm } from '@modular-forms/solid'
import * as v from 'valibot'
import { createSignal } from 'solid-js'

const passwordLength = 12
const SignUpSchema = v.object({
  email: v.pipe(
    v.string(),
    v.nonEmpty('Please enter your email.'),
    v.email('Please insert a correct email address.'),
  ),
  password: v.pipe(
    v.string(),
    v.nonEmpty('Please enter your password.'),
    v.minLength(passwordLength, `Your password must have ${passwordLength} characters or more.`),
  ),
})

type SignUpForm = v.InferInput<typeof SignUpSchema>

export const SignUpForm = () => {
  const [isSubmitting, setIsSubmitting] = createSignal(false)
  const [signUpForm, { Form, Field }] = createForm<SignUpForm>({ validate: valiForm(SignUpSchema) })

  const handleSubmit = async (data: SignUpForm) => {
    setIsSubmitting(true)
    try {
      // TODO: Handle sign up logic here
      console.log('Sign up data:', data)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div class="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div class="w-full max-w-md">
        <div class="bg-slate-800/50 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-8 shadow-2xl">
          <h1 class="text-3xl font-bold text-white mb-2">Create Account</h1>
          <p class="text-slate-400 mb-8">Join us to get started</p>

          <Form onSubmit={handleSubmit} class="space-y-6">
            <Field name="email">
              {(field, props) => (
                <div class="space-y-2">
                  <label for="email" class="block text-sm font-medium text-slate-200">
                    Email Address
                  </label>
                  <input
                    {...props}
                    id="email"
                    type="email"
                    required
                    placeholder="you@example.com"
                    class={`w-full px-4 py-3 rounded-lg bg-slate-700/50 border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      field.error
                        ? 'border-red-500/50 text-red-400'
                        : 'border-slate-600/50 text-white placeholder-slate-500'
                    }`}
                  />
                  {field.error && (
                    <p class="text-sm text-red-400 flex items-center gap-2">
                      <span class="text-lg">⚠</span>
                      {field.error}
                    </p>
                  )}
                </div>
              )}
            </Field>

            <Field name="password">
              {(field, props) => (
                <div class="space-y-2">
                  <label for="password" class="block text-sm font-medium text-slate-200">
                    Password
                  </label>
                  <input
                    {...props}
                    id="password"
                    type="password"
                    required
                    placeholder="••••••••••••"
                    class={`w-full px-4 py-3 rounded-lg bg-slate-700/50 border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      field.error
                        ? 'border-red-500/50 text-red-400'
                        : 'border-slate-600/50 text-white placeholder-slate-500'
                    }`}
                  />
                  {field.error && (
                    <p class="text-sm text-red-400 flex items-center gap-2">
                      <span class="text-lg">⚠</span>
                      {field.error}
                    </p>
                  )}
                  <p class="text-xs text-slate-400">Minimum {passwordLength} characters</p>
                </div>
              )}
            </Field>

            <button
              type="submit"
              disabled={isSubmitting()}
              class="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-slate-600 disabled:to-slate-600 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100 shadow-lg"
            >
              {isSubmitting() ? 'Creating Account...' : 'Sign Up'}
            </button>
          </Form>

          <p class="text-center text-slate-400 text-sm mt-6">
            Already have an account?{' '}
            <a
              href="/login"
              class="text-purple-400 hover:text-purple-300 font-medium transition-colors"
            >
              Log in
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
