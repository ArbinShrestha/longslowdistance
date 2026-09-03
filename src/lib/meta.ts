import type { Metadata } from 'next'

import type { Event, Post } from '@/payload-types'

type Doc = Post | Event

type Fallbacks = {
  title: string
  description: string
  path: string
  image?: string
}

export function docMetadata(doc: Doc, { title, description, path, image }: Fallbacks): Metadata {
  const seo = doc.seo
  const ogImage = typeof seo?.ogImage === 'object' && seo?.ogImage?.url ? seo.ogImage.url : image
  return {
    title: seo?.metaTitle || title,
    description: seo?.metaDescription || description,
    alternates: { canonical: path },
    openGraph: {
      title: seo?.metaTitle || title,
      description: seo?.metaDescription || description,
      url: path,
      ...(ogImage ? { images: [{ url: ogImage }] } : {}),
    },
  }
}
