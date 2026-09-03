import { ArrowUpRight } from '@phosphor-icons/react/dist/ssr'
import Link from 'next/link'

export function WorkCta() {
  return (
    <section className="section-y border-t border-line">
      <div className="container-x reveal">
        <h2 className="display-xl max-w-5xl">Have an event in mind?</h2>
        <p className="mt-8 max-w-xl text-lg text-ink-muted">
          Tell us what you want people to feel at the finish. We will handle everything between the idea and the last runner home.
        </p>
        <Link
          href="/work-with-us"
          className="group mt-10 inline-flex items-center gap-3 rounded-full bg-accent py-4 pr-4 pl-7 text-lg font-semibold text-accent-ink transition-transform duration-500 ease-(--ease-soft) hover:scale-[1.02] active:scale-[0.98]"
        >
          Work with us
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-ink/10 transition-transform duration-500 ease-(--ease-soft) group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
            <ArrowUpRight size={18} weight="bold" />
          </span>
        </Link>
      </div>
    </section>
  )
}
