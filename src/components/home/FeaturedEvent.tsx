import { ArrowUpRight } from '@phosphor-icons/react/dist/ssr'
import Link from 'next/link'

import { Countdown } from '@/components/event/Countdown'
import { RouteDraw } from '@/components/event/RouteDraw'
import { formatDate, formatNPR, formatTime } from '@/lib/format'
import type { Route } from '@/lib/gpx'
import type { Event } from '@/payload-types'

export function FeaturedEvent({ event, route }: { event: Event; route: Route | null }) {
  const registerHref = event.externalRegisterUrl || `/events/${event.slug}/register`
  const facts: [string, string][] = [
    ['When', `${formatDate(event.startAt, { weekday: 'long' })}, ${formatTime(event.startAt)}`],
    ['Where', `${event.venue}, ${event.city}`],
    ['Loop', event.loopKm ? `${event.loopKm} km, every hour` : event.distanceLabel || 'Announced soon'],
    ['Entry', event.fee ? formatNPR(event.fee) : 'Announced soon'],
  ]

  return (
    <section className="section-y border-t border-line" aria-labelledby="next-event">
      <div className="container-x grid gap-16 lg:grid-cols-12 lg:gap-12">
        <div className="reveal lg:col-span-6">
          <p className="label text-accent">Next event</p>
          <h2 id="next-event" className="display-lg mt-4">
            {event.title}
          </h2>
          <p className="mt-6 max-w-xl text-lg text-ink-muted">{event.summary}</p>

          <dl className="mt-10 grid grid-cols-2 gap-x-8 gap-y-6">
            {facts.map(([k, v]) => (
              <div key={k}>
                <dt className="text-sm text-ink-subtle">{k}</dt>
                <dd className="mt-1 font-medium text-ink">{v}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-12">
            <Countdown startAt={event.startAt} status={event.status} />
          </div>

          <div className="mt-10 flex flex-wrap gap-4">
            {event.registrationOpen && (
              <Link
                href={registerHref}
                className="group inline-flex items-center gap-3 rounded-full bg-paper py-3 pr-3 pl-6 font-semibold text-paper-ink transition-transform duration-500 ease-(--ease-soft) hover:scale-[1.02] active:scale-[0.98]"
              >
                Register
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-paper-ink/10 transition-transform duration-500 ease-(--ease-soft) group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                  <ArrowUpRight size={16} weight="bold" />
                </span>
              </Link>
            )}
            <Link href={`/events/${event.slug}`} className="inline-flex items-center rounded-full border border-line-strong px-6 py-3 font-semibold text-ink transition-colors duration-500 hover:border-ink">
              Event details
            </Link>
          </div>
        </div>

        <div className="reveal lg:col-span-6">
          {route ? (
            <figure className="rounded-sm border border-line bg-surface-2 p-6 md:p-10">
              <RouteDraw route={route} label={`Course map, ${route.distanceKm} km loop`} className="h-auto w-full" />
              <figcaption className="mt-6 flex items-baseline justify-between text-sm text-ink-subtle">
                <span>The loop, drawn from the GPX.</span>
                <span className="font-display text-2xl font-bold text-ink">{event.loopKm ?? route.distanceKm} km</span>
              </figcaption>
            </figure>
          ) : (
            <div className="flex aspect-square items-center justify-center rounded-sm border border-line bg-surface-2 text-ink-subtle">Course map coming soon</div>
          )}
        </div>
      </div>
    </section>
  )
}
