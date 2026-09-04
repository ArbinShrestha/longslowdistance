import { InstagramLogo } from '@phosphor-icons/react/dist/ssr'
import Link from 'next/link'

import type { SiteSetting } from '@/payload-types'

import { Badge } from './brand/Badge'

const links = [
  { href: '/events', label: 'Events' },
  { href: '/journal', label: 'Journal' },
  { href: '/work-with-us', label: 'Work with us' },
  { href: '/about', label: 'About' },
]

export function Footer({ settings }: { settings: SiteSetting }) {
  const year = new Date().getFullYear()
  return (
    <footer className="border-t border-line">
      <div className="container-x grid gap-12 py-16 md:grid-cols-12 md:py-24">
        <div className="md:col-span-5">
          <Badge className="h-32 w-32 text-ink md:h-40 md:w-40" />
          <p className="mt-8 max-w-xs text-ink-muted">{settings.tagline}</p>
        </div>
        <nav className="md:col-span-3" aria-label="Footer">
          <ul className="flex flex-col gap-3">
            {links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-ink-muted transition-colors duration-300 hover:text-ink">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="md:col-span-4">
          <ul className="flex flex-col gap-3 text-ink-muted">
            {settings.email && (
              <li>
                <a href={`mailto:${settings.email}`} className="transition-colors duration-300 hover:text-ink">
                  {settings.email}
                </a>
              </li>
            )}
            {settings.whatsapp && (
              <li>
                <a href={`https://wa.me/${settings.whatsapp.replace(/\D/g, '')}`} className="transition-colors duration-300 hover:text-ink">
                  WhatsApp {settings.whatsapp}
                </a>
              </li>
            )}
            {settings.instagram && (
              <li>
                <a
                  href={`https://www.instagram.com/${settings.instagram}/`}
                  className="inline-flex items-center gap-2 transition-colors duration-300 hover:text-ink"
                  rel="noopener"
                >
                  <InstagramLogo size={20} weight="light" /> @{settings.instagram}
                </a>
              </li>
            )}
            {settings.strava && (
              <li>
                <a href={settings.strava} className="transition-colors duration-300 hover:text-ink" rel="noopener">
                  Strava club
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>
      <div className="container-x flex flex-col gap-2 border-t border-line py-6 text-sm text-ink-subtle sm:flex-row sm:justify-between">
        <span>{settings.footerNote || 'Made in Kathmandu Valley.'}</span>
        <span>{year} Long Slow Distance</span>
      </div>
    </footer>
  )
}
