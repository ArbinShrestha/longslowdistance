'use client'

import { ArrowUpRight, List, X } from '@phosphor-icons/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

import { Letters } from './brand/Badge'

gsap.registerPlugin(ScrollTrigger)

const navItems = [
  { href: '/events', label: 'Events' },
  { href: '/journal', label: 'Journal' },
  { href: '/work-with-us', label: 'Work with us' },
  { href: '/about', label: 'About' },
]

export function Header({ registerHref }: { registerHref: string | null }) {
  const [open, setOpen] = useState(false)
  const [hidden, setHidden] = useState(false)
  const pathname = usePathname()
  const ref = useRef<HTMLElement>(null)

  useEffect(() => setOpen(false), [pathname])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  // Hide on scroll down, show on scroll up. ScrollTrigger batches the work, no raw scroll listener.
  useEffect(() => {
    const st = ScrollTrigger.create({
      start: 120,
      onUpdate: (self) => setHidden(self.direction === 1 && !open),
    })
    return () => st.kill()
  }, [open])

  return (
    <header
      ref={ref}
      className={`fixed inset-x-0 top-0 z-40 transition-transform duration-500 ease-(--ease-soft) ${hidden ? '-translate-y-full' : 'translate-y-0'}`}
    >
      <div className="container-x flex h-16 items-center justify-between md:h-[72px]">
        <Link href="/" aria-label="Long Slow Distance home" className="flex items-center gap-3 text-ink">
          <Letters className="h-6 w-auto md:h-7" />
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Main">
          {navItems.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors duration-300 hover:text-ink ${active ? 'text-ink' : 'text-ink-muted'}`}
              >
                {item.label}
              </Link>
            )
          })}
          {registerHref && (
            <Link
              href={registerHref}
              className="group inline-flex items-center gap-2 rounded-full bg-paper py-2 pr-2 pl-4 text-sm font-semibold text-paper-ink transition-transform duration-500 ease-(--ease-soft) hover:scale-[1.02] active:scale-[0.98]"
            >
              Register
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-paper-ink/10 transition-transform duration-500 ease-(--ease-soft) group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                <ArrowUpRight size={14} weight="bold" />
              </span>
            </Link>
          )}
        </nav>

        <button
          type="button"
          className="flex h-11 w-11 items-center justify-center rounded-full text-ink md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={24} weight="light" /> : <List size={24} weight="light" />}
        </button>
      </div>

      <div
        id="mobile-menu"
        hidden={!open}
        className="fixed inset-0 top-16 z-30 flex flex-col bg-surface/95 px-5 pt-6 pb-10 backdrop-blur-xl md:hidden"
      >
        <nav className="flex flex-col" aria-label="Mobile">
          {navItems.map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              style={{ transitionDelay: `${80 + i * 60}ms` }}
              className={`display-md border-b border-line py-5 text-ink transition-all duration-700 ease-(--ease-out-expo) ${open ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        {registerHref && (
          <Link
            href={registerHref}
            className="mt-auto inline-flex items-center justify-center gap-2 rounded-full bg-accent py-4 text-lg font-semibold text-accent-ink"
          >
            Register for the Backyard Ultra
          </Link>
        )}
      </div>
    </header>
  )
}
