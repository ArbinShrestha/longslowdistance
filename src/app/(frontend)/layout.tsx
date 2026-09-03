import type { Metadata, Viewport } from 'next'
import { Bricolage_Grotesque, Geist } from 'next/font/google'
import React from 'react'

import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { MotionProvider } from '@/components/motion/MotionProvider'
import { findFeaturedEvent, getSiteSettings } from '@/lib/queries'
import { getSiteUrl, SITE_NAME, SITE_TAGLINE } from '@/lib/site'
import './styles.css'

const geist = Geist({ subsets: ['latin'], display: 'swap', variable: '--font-geist' })
const bricolage = Bricolage_Grotesque({ subsets: ['latin'], display: 'swap', variable: '--font-bricolage' })

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: { default: `${SITE_NAME}: running events and outdoor experiences in Nepal`, template: `%s | ${SITE_NAME}` },
  description: SITE_TAGLINE,
  openGraph: { siteName: SITE_NAME, type: 'website' },
}

export const viewport: Viewport = { themeColor: '#0b0b0c' }

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [settings, featured] = await Promise.all([getSiteSettings(), findFeaturedEvent()])
  const registerHref =
    featured && featured.registrationOpen
      ? featured.externalRegisterUrl || `/events/${featured.slug}/register`
      : featured
        ? `/events/${featured.slug}`
        : null

  return (
    <html lang="en" className={`${geist.variable} ${bricolage.variable}`}>
      <body className="font-sans">
        <MotionProvider />
        <Header registerHref={registerHref} />
        <main id="main">{children}</main>
        <Footer settings={settings} />
      </body>
    </html>
  )
}
