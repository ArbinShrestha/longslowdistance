import type { Metadata } from 'next'

import { InquiryForm } from '@/components/forms/InquiryForm'
import { SERVICES } from '@/components/home/Services'

export const metadata: Metadata = {
  title: 'Work with us',
  description: 'Long Slow Distance plans and runs running events, trail experiences and outdoor team days across Nepal.',
}

const steps = [
  ['Tell us the idea', 'A date, a place, a feeling you want at the finish. Rough is fine.'],
  ['We walk the ground', 'Course, permits, safety, aid, timing, food. We plan it like we would run it.'],
  ['Race day is ours', 'You show up. We run the event. Everyone gets home.'],
]

export default function WorkWithUsPage() {
  return (
    <>
      <section className="container-x pt-32 pb-16 md:pt-44 md:pb-24">
        <h1 className="display-xl max-w-5xl">Events people talk about for years.</h1>
        <p className="mt-8 max-w-xl text-lg text-ink-muted">
          We started by organising runs for ourselves. Now we do it for clubs, brands, schools and companies across Nepal.
        </p>
      </section>

      <section className="container-x pb-24 md:pb-36" aria-labelledby="what">
        <h2 id="what" className="sr-only">
          What we do
        </h2>
        <ul className="grid gap-3 md:grid-cols-3">
          {SERVICES.map((s, i) => (
            <li key={s.title} className={`reveal rounded-sm p-8 md:p-10 ${i === 1 ? 'bg-accent text-accent-ink' : 'border border-line bg-surface-2'}`}>
              <h3 className="display-md">{s.title}</h3>
              <p className={`mt-6 ${i === 1 ? 'text-accent-ink/80' : 'text-ink-muted'}`}>{s.body}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="container-x border-t border-line py-24 md:py-36" aria-labelledby="how">
        <h2 id="how" className="display-lg reveal">
          How it goes
        </h2>
        <ol className="mt-12 grid gap-10 md:grid-cols-3">
          {steps.map(([title, body]) => (
            <li key={title} className="reveal border-t border-line-strong pt-6">
              <h3 className="font-display text-2xl font-bold">{title}</h3>
              <p className="mt-3 text-ink-muted">{body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="container-x grid gap-12 border-t border-line py-24 lg:grid-cols-12 md:py-36" aria-labelledby="contact">
        <div className="lg:col-span-5">
          <h2 id="contact" className="display-lg">
            Start the conversation
          </h2>
          <p className="mt-6 max-w-md text-ink-muted">A few sentences is enough. We reply within two days, usually faster.</p>
        </div>
        <div className="lg:col-span-7">
          <InquiryForm />
        </div>
      </section>
    </>
  )
}
