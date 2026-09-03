import type { Event, Post } from '@/payload-types'

import { isMedia } from './media'
import { absoluteUrl, SITE_NAME } from './site'

const org = { '@type': 'Organization', name: SITE_NAME, url: absoluteUrl('/') }

export function eventJsonLd(event: Event) {
  const image = isMedia(event.heroImage) && event.heroImage.url ? [absoluteUrl(event.heroImage.url)] : undefined
  return {
    '@context': 'https://schema.org',
    '@type': 'SportsEvent',
    name: event.title,
    description: event.summary,
    startDate: event.startAt,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: { '@type': 'Place', name: event.venue, address: event.city },
    image,
    organizer: org,
    url: absoluteUrl(`/events/${event.slug}`),
    ...(event.fee
      ? { offers: { '@type': 'Offer', price: event.fee, priceCurrency: 'NPR', url: absoluteUrl(`/events/${event.slug}/register`) } }
      : {}),
  }
}

export function postJsonLd(post: Post) {
  const image = isMedia(post.heroImage) && post.heroImage.url ? [absoluteUrl(post.heroImage.url)] : undefined
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    image,
    author: org,
    publisher: org,
    mainEntityOfPage: absoluteUrl(`/journal/${post.slug}`),
  }
}
