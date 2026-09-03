import Image from 'next/image'
import Link from 'next/link'

import type { ResolvedImage } from '@/lib/media'

export const SERVICES = [
  {
    title: 'Running events',
    body: 'Road, trail, night, backyard. Course design, timing, aid stations, safety and the finish-line food that people remember.',
  },
  {
    title: 'Trail and adventure experiences',
    body: 'Guided long days on the valley rim and beyond, for groups who want the outdoors done properly.',
  },
  {
    title: 'Corporate and team events',
    body: 'Team days that are actually outside. Relay formats, hill challenges, and a crew that handles every detail.',
  },
]

export function Services({ image }: { image: ResolvedImage | null }) {
  const [first, ...rest] = SERVICES
  return (
    <section className="section-y" aria-labelledby="services">
      <div className="container-x">
        <h2 id="services" className="reveal display-lg max-w-4xl">
          We run events the way we run hills. Patient, prepared, all in.
        </h2>
        <div className="mt-16 grid gap-3 md:grid-cols-12 md:grid-rows-2">
          <Link
            href="/work-with-us"
            className="reveal group relative isolate flex min-h-[420px] flex-col justify-end overflow-hidden rounded-sm md:col-span-7 md:row-span-2"
          >
            {image && (
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(min-width: 768px) 58vw, 100vw"
                className="-z-20 object-cover transition-transform duration-[1200ms] ease-(--ease-soft) group-hover:scale-[1.04]"
              />
            )}
            <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,rgba(11,11,12,0.92),rgba(11,11,12,0.1)_60%)]" />
            <div className="p-8 md:p-10">
              <h3 className="display-md">{first.title}</h3>
              <p className="mt-3 max-w-md text-ink-muted">{first.body}</p>
            </div>
          </Link>
          <Link href="/work-with-us" className="reveal flex flex-col justify-between rounded-sm bg-accent p-8 text-accent-ink md:col-span-5 md:p-10">
            <h3 className="display-md">{rest[0].title}</h3>
            <p className="mt-6 max-w-sm text-accent-ink/80">{rest[0].body}</p>
          </Link>
          <Link href="/work-with-us" className="reveal flex flex-col justify-between rounded-sm border border-line bg-surface-2 p-8 md:col-span-5 md:p-10">
            <h3 className="display-md">{rest[1].title}</h3>
            <p className="mt-6 max-w-sm text-ink-muted">{rest[1].body}</p>
          </Link>
        </div>
      </div>
    </section>
  )
}
