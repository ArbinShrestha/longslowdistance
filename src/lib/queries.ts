import config from '@payload-config'
import { getPayload, type Where } from 'payload'

export const getPayloadClient = () => getPayload({ config })

export const PAGE_SIZE = 12

type FindArgs = { where?: Where; page?: number; limit?: number; sort?: string; depth?: number }

export async function findPublishedPosts({ where, page = 1, limit = PAGE_SIZE, sort = '-publishedAt', depth = 1 }: FindArgs = {}) {
  const payload = await getPayloadClient()
  return payload.find({ collection: 'posts', where, page, limit, sort, depth, overrideAccess: false })
}

export async function findPostBySlug(slug: string) {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'posts',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 2,
    overrideAccess: false,
  })
  return result.docs[0] ?? null
}

export async function findEvents({ where, limit = 50, sort = 'startAt', depth = 1 }: FindArgs = {}) {
  const payload = await getPayloadClient()
  return payload.find({ collection: 'events', where, limit, sort, depth, overrideAccess: false })
}

/** The next upcoming or live event, if any. */
export async function findFeaturedEvent() {
  const result = await findEvents({
    where: { status: { in: ['upcoming', 'live'] } },
    limit: 1,
    sort: 'startAt',
    depth: 2,
  })
  return result.docs[0] ?? null
}

export async function findEventBySlug(slug: string) {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'events',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 2,
    overrideAccess: false,
  })
  return result.docs[0] ?? null
}

export async function getSiteSettings() {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'site-settings', depth: 0 })
}
