import Link from 'next/link'

export default function NotFound() {
  return (
    <section className="container-x flex min-h-[70dvh] flex-col justify-center py-32">
      <h1 className="display-lg">Wrong turn.</h1>
      <p className="mt-6 max-w-md text-ink-muted">This page is not on the course. Head back to the start line.</p>
      <Link href="/" className="mt-10 inline-flex w-max rounded-full bg-paper px-6 py-3 font-semibold text-paper-ink">
        Back home
      </Link>
    </section>
  )
}
