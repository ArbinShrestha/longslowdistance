'use client'

import { useSyncExternalStore } from 'react'

const parts = (ms: number) => {
  const s = Math.max(0, Math.floor(ms / 1000))
  return { d: Math.floor(s / 86400), h: Math.floor((s % 86400) / 3600), m: Math.floor((s % 3600) / 60), s: s % 60 }
}

const subscribeToClock = (cb: () => void) => {
  const id = window.setInterval(cb, 1000)
  return () => window.clearInterval(id)
}

export function Countdown({ startAt, status }: { startAt: string; status: 'upcoming' | 'live' | 'past' }) {
  const target = new Date(startAt).getTime()
  // Server snapshot is null so the first paint shows placeholders instead of a mismatched time.
  const now = useSyncExternalStore(subscribeToClock, () => Math.floor(Date.now() / 1000) * 1000, () => null)

  if (status === 'live') return <p className="display-md text-accent">Live now.</p>
  if (status === 'past') return <p className="display-md text-ink-muted">Finished.</p>

  const p = now === null ? null : parts(target - now)
  const cells: [string, number | null][] = [
    ['days', p?.d ?? null],
    ['hours', p?.h ?? null],
    ['min', p?.m ?? null],
    ['sec', p?.s ?? null],
  ]
  return (
    <div className="grid grid-cols-4 gap-2 sm:gap-4" aria-live="off" aria-label="Countdown to the start">
      {cells.map(([label, value]) => (
        <div key={label} className="rounded-sm border border-line bg-surface-2 px-3 py-4 sm:px-5 sm:py-6">
          <div className="font-display text-3xl font-bold tabular-nums leading-none sm:text-5xl">
            {value === null ? <span className="inline-block h-[1em] w-[1.4em] animate-pulse rounded-sm bg-surface-3" /> : String(value).padStart(2, '0')}
          </div>
          <div className="mt-2 text-xs tracking-wide text-ink-subtle uppercase">{label}</div>
        </div>
      ))}
    </div>
  )
}
