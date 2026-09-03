import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { RegisterForm } from '@/components/forms/RegisterForm'
import { RichText } from '@/components/RichText'
import { isRegistrationClosed } from '@/lib/events'
import { formatDate, formatTime } from '@/lib/format'
import { findEventBySlug } from '@/lib/queries'

type Params = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const event = await findEventBySlug(slug)
  return event ? { title: `Register: ${event.title}`, robots: { index: false } } : {}
}

export default async function RegisterPage({ params }: Params) {
  const { slug } = await params
  const event = await findEventBySlug(slug)
  if (!event || !event.slug) notFound()
  const closed = isRegistrationClosed(event)

  return (
    <section className="container-x grid gap-12 pt-32 pb-24 lg:grid-cols-12 md:pt-44 md:pb-36">
      <div className="lg:col-span-5">
        <p className="text-ink-muted">
          {formatDate(event.startAt, { weekday: 'long' })}, {formatTime(event.startAt)}
        </p>
        <h1 className="display-lg mt-3">{event.title}</h1>
        <p className="mt-6 max-w-md text-ink-muted">
          {closed
            ? 'Registration is closed for this event.'
            : 'Fill this in once. We hold your spot and email you the payment details. No payment gateway, no fuss.'}
        </p>
        <Link href={`/events/${event.slug}`} className="mt-8 inline-block text-ink underline decoration-accent underline-offset-4">
          Event details
        </Link>
      </div>
      <div className="lg:col-span-7">
        {closed ? (
          <div className="rounded-sm border border-line bg-surface-2 p-8 text-ink-muted">Follow us on Instagram to hear about the next one first.</div>
        ) : event.externalRegisterUrl ? (
          <a href={event.externalRegisterUrl} className="inline-flex rounded-full bg-accent px-8 py-4 font-semibold text-accent-ink" rel="noopener">
            Register on the external form
          </a>
        ) : (
          <RegisterForm
            eventId={event.id}
            eventSlug={event.slug}
            paymentNote={event.paymentInstructions ? <RichText data={event.paymentInstructions} className="prose-lsd" /> : <p>We will email you the payment details shortly.</p>}
          />
        )}
      </div>
    </section>
  )
}
