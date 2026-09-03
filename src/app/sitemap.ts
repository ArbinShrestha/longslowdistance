import type { MetadataRoute } from 'next'

import { findEvents, findPublishedPosts } from '@/lib/queries'
import { absoluteUrl } from '@/lib/site'

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [events, posts] = await Promise.all([
    findEvents({ limit: 500, depth: 0 }),
    findPublishedPosts({ limit: 1000, depth: 0 }),
  ])

  const statics: MetadataRoute.Sitemap = ['/', '/events', '/journal', '/work-with-us', '/about'].map((path) => ({
    url: absoluteUrl(path),
    changeFrequency: 'weekly',
    priority: path === '/' ? 1 : 0.8,
  }))

  const entries = (prefix: string, docs: { slug?: string | null; updatedAt: string }[]): MetadataRoute.Sitemap =>
    docs
      .filter((doc) => doc.slug)
      .map((doc) => ({
        url: absoluteUrl(`${prefix}/${doc.slug}`),
        lastModified: doc.updatedAt,
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }))

  return [...statics, ...entries('/events', events.docs), ...entries('/journal', posts.docs)]
}
