import { createForm, valiForm } from '@modular-forms/solid'
import * as v from 'valibot'
import { createSignal } from 'solid-js'
import { authClient } from '../auth-client'

const passwordLength = 12
const SignUpSchema = v.object({
  name: v.pipe(
    v.string(),
    v.nonEmpty('Please enter a username'),
    v.minLength(4, 'Should be at least 4 characters'),
    v.maxLength(39, 'Username must be 39 characters or less'),
    v.regex(
      /^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?$/,
      'Username can only contain alphanumeric characters and hyphens, and cannot start or end with a hyphen',
    ),
  ),
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
  const [_signUpForm, { Form, Field }] = createForm<SignUpForm>({
    validate: valiForm(SignUpSchema),
  })

  const handleSubmit = async (formdata: SignUpForm) => {
    setIsSubmitting(true)
    try {
      const resp = await authClient.signUp.email(formdata)
      // TODO: Handle sign up logic here
      console.log('resp: ', resp)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div class="p-6 w-80">
      <h1 class="text-xl font-bold text-white mb-4">Create Account</h1>

      <Form onSubmit={handleSubmit} class="space-y-4">
        <Field name="name">
          {(field, props) => (
            <div>
              <label for="name" class="block text-sm font-medium text-slate-300 mb-1">
                Username
              </label>
              <input
                {...props}
                id="name"
                type="text"
                required
                placeholder="octocat"
                class={`w-full px-3 py-2 rounded bg-slate-700 border focus:outline-none focus:ring-1 focus:ring-purple-500 ${
                  field.error
                    ? 'border-red-500 text-red-400'
                    : 'border-slate-600 text-white placeholder-slate-500'
                }`}
              />
              {field.error && <p class="text-sm text-red-400 mt-1">{field.error}</p>}
            </div>
          )}
        </Field>

        <Field name="email">
          {(field, props) => (
            <div>
              <label for="email" class="block text-sm font-medium text-slate-300 mb-1">
                Email
              </label>
              <input
                {...props}
                id="email"
                type="email"
                required
                placeholder="you@example.com"
                class={`w-full px-3 py-2 rounded bg-slate-700 border focus:outline-none focus:ring-1 focus:ring-purple-500 ${
                  field.error
                    ? 'border-red-500 text-red-400'
                    : 'border-slate-600 text-white placeholder-slate-500'
                }`}
              />
              {field.error && <p class="text-sm text-red-400 mt-1">{field.error}</p>}
            </div>
          )}
        </Field>

        <Field name="password">
          {(field, props) => (
            <div>
              <label for="password" class="block text-sm font-medium text-slate-300 mb-1">
                Password
              </label>
              <input
                {...props}
                id="password"
                type="password"
                required
                placeholder="••••••••••••"
                class={`w-full px-3 py-2 rounded bg-slate-700 border focus:outline-none focus:ring-1 focus:ring-purple-500 ${
                  field.error
                    ? 'border-red-500 text-red-400'
                    : 'border-slate-600 text-white placeholder-slate-500'
                }`}
              />
              {field.error && <p class="text-sm text-red-400 mt-1">{field.error}</p>}
              <p class="text-xs text-slate-400 mt-1">Minimum {passwordLength} characters</p>
            </div>
          )}
        </Field>

        <button
          type="submit"
          disabled={isSubmitting()}
          class="w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-medium rounded"
        >
          {isSubmitting() ? 'Creating Account...' : 'Sign Up'}
        </button>
      </Form>

      <p class="text-center text-slate-400 text-sm mt-4">
        Already have an account?{' '}
        <a href="/login" class="text-purple-400 hover:text-purple-300">
          Log in
        </a>
      </p>
    </div>
  )
}
