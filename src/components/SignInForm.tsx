import { createForm, valiForm } from '@modular-forms/solid'
import * as v from 'valibot'
import { createSignal } from 'solid-js'
import { authClient } from '../auth-client'

const SignInSchema = v.object({
  email: v.pipe(
    v.string(),
    v.nonEmpty('Please enter your email.'),
    v.email('Please insert a correct email address.'),
  ),
  password: v.pipe(v.string(), v.nonEmpty('Please enter your password.')),
})

type SignInForm = v.InferInput<typeof SignInSchema>

export const SignInForm = () => {
  const [isSubmitting, setIsSubmitting] = createSignal(false)
  const [error, setError] = createSignal<string | null>(null)
  const [_signInForm, { Form, Field }] = createForm<SignInForm>({
    validate: valiForm(SignInSchema),
  })

  const handleSubmit = async (formdata: SignInForm) => {
    setIsSubmitting(true)
    setError(null)
    try {
      const resp = await authClient.signIn.email({
        email: formdata.email,
        password: formdata.password,
      })
      if (resp.error) {
        setError(resp.error.message ?? 'Sign in failed')
      }
    } catch (e) {
      setError('An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div class="space-y-4">
      {error() && (
        <div class="p-3 rounded bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error()}
        </div>
      )}

      <Form onSubmit={handleSubmit} class="space-y-4">
        <Field name="email">
          {(field, props) => (
            <div>
              <label for="signin-email" class="block text-sm font-medium text-slate-300 mb-1">
                Email
              </label>
              <input
                {...props}
                id="signin-email"
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
              <label for="signin-password" class="block text-sm font-medium text-slate-300 mb-1">
                Password
              </label>
              <input
                {...props}
                id="signin-password"
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
            </div>
          )}
        </Field>

        <button
          type="submit"
          disabled={isSubmitting()}
          class="w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-medium rounded"
        >
          {isSubmitting() ? 'Signing In...' : 'Sign In'}
        </button>
      </Form>
    </div>
  )
}
