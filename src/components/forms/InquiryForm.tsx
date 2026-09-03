'use client'

import { useActionState } from 'react'

import { inquireAction, type InquiryState } from '@/app/actions/inquire'
import { INQUIRY_KINDS } from '@/collections/Inquiries'

import { Field, Select, SubmitButton, Textarea, TextInput } from './Field'

export function InquiryForm() {
  const [state, action, pending] = useActionState<InquiryState, FormData>(inquireAction, { ok: false })
  const e = state.errors ?? {}

  if (state.ok) {
    return (
      <div className="rounded-sm border border-line bg-surface-2 p-8 md:p-12" role="status">
        <h2 className="display-md text-accent">Got it.</h2>
        <p className="mt-4 text-ink-muted">We read every message ourselves and reply within two days. Talk soon.</p>
      </div>
    )
  }

  return (
    <form action={action} className="grid gap-6" noValidate>
      <div className="hidden" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Your name" name="name" error={e.name}>
          <TextInput name="name" autoComplete="name" required error={e.name} />
        </Field>
        <Field label="Organisation" name="organisation" hint="Optional." error={e.organisation}>
          <TextInput name="organisation" autoComplete="organization" error={e.organisation} />
        </Field>
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Email" name="email" error={e.email}>
          <TextInput name="email" type="email" autoComplete="email" required error={e.email} />
        </Field>
        <Field label="Phone" name="phone" hint="Optional." error={e.phone}>
          <TextInput name="phone" type="tel" autoComplete="tel" error={e.phone} />
        </Field>
      </div>
      <Field label="What do you have in mind?" name="kind" error={e.kind}>
        <Select name="kind" defaultValue="" required error={e.kind}>
          <option value="" disabled>
            Choose one
          </option>
          {INQUIRY_KINDS.map((k) => (
            <option key={k.value} value={k.value}>
              {k.label}
            </option>
          ))}
        </Select>
      </Field>
      <Field label="Tell us about it" name="message" hint="Dates, numbers, location, budget if you have one." error={e.message}>
        <Textarea name="message" required error={e.message} />
      </Field>
      {state.message && (
        <p className="rounded-sm border border-bad/40 bg-bad/10 px-4 py-3 text-bad" role="alert">
          {state.message}
        </p>
      )}
      <div>
        <SubmitButton pending={pending}>Send</SubmitButton>
      </div>
    </form>
  )
}
