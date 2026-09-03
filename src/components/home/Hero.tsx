import { ArrowUpRight } from '@phosphor-icons/react/dist/ssr'
import Image from 'next/image'
import Link from 'next/link'

import { Badge } from '@/components/brand/Badge'
import type { ResolvedImage } from '@/lib/media'

type Props = {
  image: ResolvedImage | null
  primary: { href: string; label: string }
  secondary: { href: string; label: string }
}

export function Hero({ image, primary, secondary }: Props) {
  return (
    <section className="relative isolate flex min-h-[100dvh] items-end overflow-hidden">
      {image && (
        <Image
          src={image.src}
          alt=""
          fill
          priority
          sizes="100vw"
          className="-z-20 object-cover object-center"
        />
      )}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,rgba(11,11,12,0.96)_0%,rgba(11,11,12,0.72)_38%,rgba(11,11,12,0.25)_70%,rgba(11,11,12,0.35)_100%)]" />

      <div className="container-x relative grid w-full gap-10 pt-32 pb-14 md:grid-cols-12 md:items-end md:pb-20">
        <div className="md:col-span-9">
          <h1 className="display-xl max-w-[14ch] text-ink">
            Run long. Run slow. <span className="text-accent">Run together.</span>
          </h1>
          <p className="mt-8 max-w-xl text-lg text-ink-muted md:text-xl">
            A Kathmandu Valley running crew building the events we always wanted to run. Starting with a night on a hill.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              href={primary.href}
              className="group inline-flex items-center gap-3 rounded-full bg-accent py-3 pr-3 pl-6 text-base font-semibold text-accent-ink transition-transform duration-500 ease-(--ease-soft) hover:scale-[1.02] active:scale-[0.98]"
            >
              {primary.label}
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-ink/10 transition-transform duration-500 ease-(--ease-soft) group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                <ArrowUpRight size={16} weight="bold" />
              </span>
            </Link>
            <Link
              href={secondary.href}
              className="inline-flex items-center rounded-full border border-line-strong px-6 py-3 text-base font-semibold text-ink backdrop-blur-sm transition-colors duration-500 hover:border-ink"
            >
              {secondary.label}
            </Link>
          </div>
        </div>
        <div className="hidden justify-end md:col-span-3 md:flex">
          <Badge spin className="h-40 w-40 lg:h-48 lg:w-48" />
        </div>
      </div>
    </section>
  )
}
