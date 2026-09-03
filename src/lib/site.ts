export const SITE_NAME = 'Long Slow Distance'
export const SITE_SHORT = 'LSD'
export const SITE_TAGLINE = 'Running events and outdoor experiences, made in Nepal.'

export const getSiteUrl = (): string =>
  process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

export const absoluteUrl = (path: string): string => `${getSiteUrl()}${path}`
