'use client'

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <section className="container-x flex min-h-[70dvh] flex-col justify-center py-32">
      <h1 className="display-lg">Something tripped.</h1>
      <p className="mt-6 max-w-md text-ink-muted">The page hit an error on our side. Try again, it usually clears.</p>
      <div className="mt-10 flex gap-4">
        <button type="button" onClick={reset} className="rounded-full bg-paper px-6 py-3 font-semibold text-paper-ink">
          Try again
        </button>
        <a href="/" className="rounded-full border border-line-strong px-6 py-3 font-semibold text-ink">
          Back home
        </a>
      </div>
    </section>
  )
}
