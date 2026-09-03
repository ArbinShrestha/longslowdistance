import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import { formatDate, formatTime } from '@/lib/format'
import { resolveImage } from '@/lib/media'
import { findEvents } from '@/lib/queries'
import type { Event } from '@/payload-types'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Events',
  description: 'Upcoming and past Long Slow Distance events: backyard ultras, trail runs and long nights out in Nepal.',
}

function EventRow({ event, big }: { event: Event; big?: boolean }) {
  const img = resolveImage(event.heroImage, big ? 'large' : 'card')
  return (
    <li className="reveal">
      <Link href={`/events/${event.slug}`} className={`group grid gap-6 ${big ? 'lg:grid-cols-12 lg:items-end' : 'sm:grid-cols-12 sm:items-center'}`}>
        <div className={`relative overflow-hidden rounded-sm bg-surface-2 ${big ? 'aspect-[16/9] lg:col-span-8' : 'aspect-[4/3] sm:col-span-4'}`}>
          {img && (
            <Image
              src={img.src}
              alt={img.alt}
              fill
              sizes={big ? '(min-width: 1024px) 66vw, 100vw' : '(min-width: 640px) 33vw, 100vw'}
              className="object-cover transition-transform duration-[1200ms] ease-(--ease-soft) group-hover:scale-[1.04]"
            />
          )}
        </div>
        <div className={big ? 'lg:col-span-4' : 'sm:col-span-8'}>
          <p className="text-sm text-ink-subtle">
            {formatDate(event.startAt, { weekday: 'short' })}, {formatTime(event.startAt)}
          </p>
          <h3 className={`mt-2 ${big ? 'display-md' : 'font-display text-2xl font-bold leading-tight'} group-hover:underline group-hover:decoration-accent group-hover:underline-offset-4`}>
            {event.title}
          </h3>
          <p className="mt-2 text-ink-muted">
            {event.venue}, {event.city}
          </p>
          {big && <p className="mt-4 max-w-md text-ink-muted">{event.summary}</p>}
        </div>
      </Link>
    </li>
  )
}

export default async function EventsPage() {
  const [upcoming, past] = await Promise.all([
    findEvents({ where: { status: { in: ['upcoming', 'live'] } }, sort: 'startAt' }),
    findEvents({ where: { status: { equals: 'past' } }, sort: '-startAt' }),
  ])

  return (
    <>
      <section className="container-x pt-32 pb-16 md:pt-44 md:pb-24">
        <h1 className="display-xl">Events</h1>
        <p className="mt-6 max-w-xl text-lg text-ink-muted">Every event we put on is one we would happily run ourselves. Here is what is coming and what has been.</p>
      </section>

      <section className="container-x pb-24 md:pb-36" aria-labelledby="upcoming">
        <h2 id="upcoming" className="label text-accent">
          Upcoming
        </h2>
        {upcoming.docs.length === 0 ? (
          <p className="mt-8 max-w-md text-ink-muted">Nothing on the calendar right now. Follow us on Instagram to hear first.</p>
        ) : (
          <ul className="mt-8 grid gap-16">
            {upcoming.docs.map((e, i) => (
              <EventRow key={e.id} event={e} big={i === 0} />
            ))}
          </ul>
        )}
      </section>

      {past.docs.length > 0 && (
        <section className="container-x border-t border-line py-24 md:py-36" aria-labelledby="past">
          <h2 id="past" className="label text-ink-subtle">
            Past
          </h2>
          <ul className="mt-8 grid gap-12">
            {past.docs.map((e) => (
              <EventRow key={e.id} event={e} />
            ))}
          </ul>
        </section>
      )}
    </>
  )
}
