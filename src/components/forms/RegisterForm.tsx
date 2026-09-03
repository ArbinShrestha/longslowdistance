'use client'

import Link from 'next/link'
import { useActionState } from 'react'

import { registerAction, type RegisterState } from '@/app/actions/register'
import { TSHIRT_SIZES } from '@/collections/Registrations'

import { Field, Select, SubmitButton, TextInput } from './Field'

export function RegisterForm({ eventId, eventSlug, paymentNote }: { eventId: number; eventSlug: string; paymentNote: React.ReactNode }) {
  const [state, action, pending] = useActionState<RegisterState, FormData>(registerAction, { ok: false })
  const e = state.errors ?? {}

  if (state.ok) {
    return (
      <div className="rounded-sm border border-line bg-surface-2 p-8 md:p-12" role="status">
        <h2 className="display-md text-accent">You are in.</h2>
        <p className="mt-4 text-ink-muted">Check your inbox for a confirmation. Here is what happens next.</p>
        <div className="prose-lsd mt-8">{paymentNote}</div>
        <Link href={`/events/${eventSlug}`} className="mt-10 inline-flex rounded-full border border-line-strong px-6 py-3 font-semibold text-ink hover:border-ink">
          Back to the event
        </Link>
      </div>
    )
  }

  return (
    <form action={action} className="grid gap-6" noValidate>
      <input type="hidden" name="eventId" value={eventId} />
      <div className="hidden" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <Field label="Full name" name="name" error={e.name}>
        <TextInput name="name" autoComplete="name" required error={e.name} />
      </Field>
      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Email" name="email" error={e.email}>
          <TextInput name="email" type="email" autoComplete="email" required error={e.email} />
        </Field>
        <Field label="Phone" name="phone" error={e.phone}>
          <TextInput name="phone" type="tel" autoComplete="tel" required error={e.phone} />
        </Field>
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Emergency contact name" name="emergencyName" error={e.emergencyName}>
          <TextInput name="emergencyName" required error={e.emergencyName} />
        </Field>
        <Field label="Emergency contact phone" name="emergencyPhone" error={e.emergencyPhone}>
          <TextInput name="emergencyPhone" type="tel" required error={e.emergencyPhone} />
        </Field>
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Club or team" name="club" hint="Optional." error={e.club}>
          <TextInput name="club" error={e.club} />
        </Field>
        <Field label="T-shirt size" name="tshirtSize" error={e.tshirtSize}>
          <Select name="tshirtSize" defaultValue="" required error={e.tshirtSize}>
            <option value="" disabled>
              Pick a size
            </option>
            {TSHIRT_SIZES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </Select>
        </Field>
      </div>

      <div className="flex flex-col gap-2">
        <label className="flex items-start gap-3 text-ink-muted">
          <input type="checkbox" name="waiverAccepted" className="mt-1 h-5 w-5 shrink-0 accent-[var(--accent)]" required />
          <span>I agree to the event waiver and take part at my own risk. I am fit to run through the night and will follow marshal instructions.</span>
        </label>
        {e.waiverAccepted && (
          <p className="text-sm text-bad" role="alert">
            {e.waiverAccepted}
          </p>
        )}
      </div>

      {state.message && (
        <p className="rounded-sm border border-bad/40 bg-bad/10 px-4 py-3 text-bad" role="alert">
          {state.message}
        </p>
      )}

      <div>
        <SubmitButton pending={pending}>Register</SubmitButton>
      </div>
    </form>
  )
}
