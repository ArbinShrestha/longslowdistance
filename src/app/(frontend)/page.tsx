import { FeaturedEvent } from '@/components/home/FeaturedEvent'
import { Hero } from '@/components/home/Hero'
import { JournalStrip } from '@/components/home/JournalStrip'
import { Manifesto } from '@/components/home/Manifesto'
import { Services } from '@/components/home/Services'
import { WorkCta } from '@/components/home/WorkCta'
import { routeFromMedia } from '@/lib/gpxFile'
import { resolveImage } from '@/lib/media'
import { findFeaturedEvent, findPublishedPosts, getPayloadClient, getSiteSettings } from '@/lib/queries'

export const revalidate = 300

export default async function HomePage() {
  const [event, posts, settings] = await Promise.all([findFeaturedEvent(), findPublishedPosts({ limit: 3 }), getSiteSettings()])
  const route = event ? await routeFromMedia(event.gpx) : null
  const heroImage = event ? resolveImage(event.heroImage, 'large') : null

  // A photo for the services tile: the first gallery image of the event, else any media.
  let servicesImage = event?.gallery?.[0]?.image ? resolveImage(event.gallery[0].image, 'large') : null
  if (!servicesImage) {
    const payload = await getPayloadClient()
    const any = await payload.find({ collection: 'media', where: { mimeType: { like: 'image/' } }, limit: 1, sort: '-createdAt' })
    servicesImage = resolveImage(any.docs[0], 'large')
  }

  const primary = event
    ? event.registrationOpen
      ? { href: event.externalRegisterUrl || `/events/${event.slug}/register`, label: 'Register for the Backyard Ultra' }
      : { href: `/events/${event.slug}`, label: 'See the next event' }
    : { href: '/events', label: 'See events' }

  return (
    <>
      <Hero image={heroImage} primary={primary} secondary={{ href: '/work-with-us', label: 'Work with us' }} />
      {event && <FeaturedEvent event={event} route={route} />}
      <Manifesto lines={(settings.manifesto ?? []).map((m) => m.line)} />
      <Services image={servicesImage} />
      <JournalStrip posts={posts.docs} />
      <WorkCta />
    </>
  )
}
