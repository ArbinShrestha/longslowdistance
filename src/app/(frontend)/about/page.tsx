import type { Metadata } from 'next'
import Image from 'next/image'

import { Badge } from '@/components/brand/Badge'
import { resolveImage } from '@/lib/media'
import { getPayloadClient, getSiteSettings } from '@/lib/queries'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'About',
  description: 'Long Slow Distance is a Kathmandu Valley running crew turned event company. Run long, run slow, run together.',
}

export default async function AboutPage() {
  const [settings, payload] = await Promise.all([getSiteSettings(), getPayloadClient()])
  const media = await payload.find({ collection: 'media', where: { mimeType: { like: 'image/' } }, limit: 2, sort: 'createdAt' })
  const [a, b] = media.docs.map((m) => resolveImage(m, 'large'))

  return (
    <>
      <section className="container-x pt-32 pb-16 md:pt-44 md:pb-24">
        <h1 className="display-xl max-w-5xl">A crew first. A company because the runs kept getting bigger.</h1>
      </section>

      <section className="container-x grid gap-12 pb-24 lg:grid-cols-12 md:pb-36">
        <div className="reveal lg:col-span-7">
          <div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-surface-2">
            {a && <Image src={a.src} alt={a.alt} fill sizes="(min-width: 1024px) 58vw, 100vw" className="object-cover" />}
          </div>
        </div>
        <div className="reveal flex flex-col justify-end lg:col-span-5">
          <p className="text-lg text-ink-muted">
            Long slow distance is an old coaching phrase: run far, run easy, let the body adapt. We borrowed it for Sunday runs that kept getting longer, and it stuck. Somewhere between planning our own routes, aid drops and finish-line food for thirty friends, we noticed we were already running events.
          </p>
          <p className="mt-6 text-lg text-ink-muted">
            So we made it official. Same crew, same standards, one promise: if our name is on an event, it is one we would run ourselves.
          </p>
        </div>
      </section>

      <section className="border-t border-line" aria-labelledby="manifesto">
        <div className="container-x py-24 md:py-36">
          <h2 id="manifesto" className="sr-only">
            Manifesto
          </h2>
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-3">
              <Badge spin className="h-40 w-40" />
            </div>
            <ul className="lg:col-span-9">
              {(settings.manifesto ?? []).map((m, i) => (
                <li key={i} className="reveal display-md border-t border-line py-8 first:border-t-0 first:pt-0">
                  {m.line}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="container-x grid gap-12 border-t border-line py-24 lg:grid-cols-12 md:py-36">
        <div className="reveal lg:col-span-5">
          <h2 className="display-lg">Where we are going</h2>
          <p className="mt-6 text-ink-muted">
            Running events first: backyard ultras, night runs, trail races on the valley rim. Then the wider outdoors. Nepal has the terrain. We want to be the crew that puts on the events it deserves.
          </p>
        </div>
        <div className="reveal lg:col-span-7">
          <div className="relative aspect-[16/9] overflow-hidden rounded-sm bg-surface-2">
            {b && <Image src={b.src} alt={b.alt} fill sizes="(min-width: 1024px) 58vw, 100vw" className="object-cover" />}
          </div>
        </div>
      </section>
    </>
  )
}
