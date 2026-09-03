import { ArrowUpRight } from '@phosphor-icons/react/dist/ssr'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { Countdown } from '@/components/event/Countdown'
import { RouteDraw } from '@/components/event/RouteDraw'
import { RichText } from '@/components/RichText'
import { formatDate, formatNPR, formatTime } from '@/lib/format'
import { routeFromMedia } from '@/lib/gpxFile'
import { resolveImage } from '@/lib/media'
import { docMetadata } from '@/lib/meta'
import { findEventBySlug, findEvents } from '@/lib/queries'

export const revalidate = 300

type Params = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  const events = await findEvents({ limit: 100, depth: 0 })
  return events.docs.filter((e) => e.slug).map((e) => ({ slug: e.slug as string }))
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const event = await findEventBySlug(slug)
  if (!event) return {}
  const img = resolveImage(event.heroImage, 'large')
  return docMetadata(event, { title: event.title, description: event.summary, path: `/events/${slug}`, image: img?.src })
}

export default async function EventPage({ params }: Params) {
  const { slug } = await params
  const event = await findEventBySlug(slug)
  if (!event) notFound()

  const [route, hero] = [await routeFromMedia(event.gpx), resolveImage(event.heroImage, 'large')]
  const registerHref = event.externalRegisterUrl || `/events/${event.slug}/register`
  const closed =
    !event.registrationOpen || (event.registrationCloseAt && new Date(event.registrationCloseAt).getTime() < Date.now())
  const gallery = (event.gallery ?? []).map((g) => resolveImage(g.image, 'card')).filter(Boolean)

  const facts: [string, string][] = [
    ['Start', `${formatDate(event.startAt, { weekday: 'long' })}, ${formatTime(event.startAt)}`],
    ['Venue', `${event.venue}, ${event.city}`],
    ['Course', event.loopKm ? `${event.loopKm} km loop` : event.distanceLabel || 'Announced soon'],
    ['Entry fee', event.fee ? formatNPR(event.fee) : 'Announced soon'],
    ['Beneficiary', event.charity?.name || 'Announced soon'],
    ['Registration', closed ? 'Closed' : event.registrationCloseAt ? `Open until ${formatDate(event.registrationCloseAt)}` : 'Open'],
  ]

  return (
    <article>
      <header className="relative isolate flex min-h-[80dvh] items-end overflow-hidden">
        {hero && <Image src={hero.src} alt="" fill priority sizes="100vw" className="-z-20 object-cover" />}
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,rgba(11,11,12,1)_0%,rgba(11,11,12,0.7)_45%,rgba(11,11,12,0.3)_100%)]" />
        <div className="container-x relative pt-40 pb-12 md:pb-16">
          <p className="text-ink-muted">
            {formatDate(event.startAt, { weekday: 'long' })}, {formatTime(event.startAt)}
          </p>
          <h1 className="display-xl mt-3 max-w-[16ch]">{event.title}</h1>
          <p className="mt-6 max-w-2xl text-lg text-ink-muted md:text-xl">{event.summary}</p>
        </div>
      </header>

      <section className="container-x grid gap-12 py-16 lg:grid-cols-12 md:py-24">
        <div className="lg:col-span-4">
          <dl className="grid grid-cols-2 gap-x-6 gap-y-6 lg:grid-cols-1">
            {facts.map(([k, v]) => (
              <div key={k} className="border-t border-line pt-4">
                <dt className="text-sm text-ink-subtle">{k}</dt>
                <dd className="mt-1 font-medium">{v}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-10">
            <Countdown startAt={event.startAt} status={event.status} />
          </div>
          {!closed && (
            <Link
              href={registerHref}
              className="group mt-10 inline-flex items-center gap-3 rounded-full bg-accent py-3 pr-3 pl-6 font-semibold text-accent-ink transition-transform duration-500 ease-(--ease-soft) hover:scale-[1.02] active:scale-[0.98]"
            >
              Register
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-ink/10 transition-transform duration-500 ease-(--ease-soft) group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                <ArrowUpRight size={16} weight="bold" />
              </span>
            </Link>
          )}
        </div>
        <div className="lg:col-span-8">
          {event.body && <RichText data={event.body} className="prose-lsd" />}
          {event.formatNotes && (
            <div className="mt-12 rounded-sm border border-line bg-surface-2 p-8">
              <h2 className="font-display text-2xl font-bold">How it works</h2>
              <p className="mt-3 text-ink-muted">{event.formatNotes}</p>
              {event.feeIncludes && <p className="mt-3 text-ink-muted">Your entry includes {event.feeIncludes.charAt(0).toLowerCase() + event.feeIncludes.slice(1)}</p>}
            </div>
          )}
        </div>
      </section>

      {route && (
        <section className="container-x py-16 md:py-24" aria-labelledby="course">
          <h2 id="course" className="display-lg">
            The course
          </h2>
          <div className="mt-10 grid gap-8 lg:grid-cols-12 lg:items-center">
            <figure className="rounded-sm border border-line bg-surface-2 p-6 md:p-12 lg:col-span-8">
              <RouteDraw route={route} label={`Course map, ${route.distanceKm} km`} className="h-auto w-full" />
            </figure>
            <div className="lg:col-span-4">
              <p className="font-display text-6xl font-bold">{event.loopKm ?? route.distanceKm} km</p>
              <p className="mt-3 text-ink-muted">Drawn from the GPX. The white dot is the start and the bell.</p>
              {event.lat && event.lng && (
                <a
                  href={`https://www.google.com/maps?q=${event.lat},${event.lng}`}
                  className="mt-6 inline-block text-ink underline decoration-accent underline-offset-4"
                  rel="noopener"
                >
                  Open the venue in Maps
                </a>
              )}
            </div>
          </div>
        </section>
      )}

      {event.charity?.blurb && (
        <section className="container-x py-16 md:py-24">
          <div className="rounded-sm bg-accent p-8 text-accent-ink md:p-14">
            <h2 className="display-md">{event.charity.name ? `For ${event.charity.name}` : 'A charity run'}</h2>
            <p className="mt-4 max-w-2xl text-accent-ink/80">{event.charity.blurb}</p>
            {event.charity.url && (
              <a href={event.charity.url} className="mt-6 inline-block font-semibold underline underline-offset-4" rel="noopener">
                About the beneficiary
              </a>
            )}
          </div>
        </section>
      )}

      {gallery.length > 0 && (
        <section className="container-x py-16 md:py-24" aria-label="Photos">
          <ul className="grid gap-4 sm:grid-cols-2">
            {gallery.map((img, i) => (
              <li key={i} className={`relative overflow-hidden rounded-sm bg-surface-2 ${i % 3 === 0 ? 'aspect-[4/3]' : 'aspect-[3/4] sm:aspect-[4/3]'}`}>
                <Image src={img!.src} alt={img!.alt} fill sizes="(min-width: 640px) 50vw, 100vw" className="object-cover" />
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  )
}
