import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { RichText } from '@/components/RichText'
import { formatDate } from '@/lib/format'
import { resolveImage } from '@/lib/media'
import { docMetadata } from '@/lib/meta'
import { findPostBySlug, findPublishedPosts } from '@/lib/queries'

export const revalidate = 300

type Params = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  const posts = await findPublishedPosts({ limit: 200, depth: 0 })
  return posts.docs.filter((p) => p.slug).map((p) => ({ slug: p.slug as string }))
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const post = await findPostBySlug(slug)
  if (!post) return {}
  const img = resolveImage(post.heroImage, 'large')
  return docMetadata(post, { title: post.title, description: post.excerpt, path: `/journal/${slug}`, image: img?.src })
}

export default async function PostPage({ params }: Params) {
  const { slug } = await params
  const post = await findPostBySlug(slug)
  if (!post) notFound()
  const img = resolveImage(post.heroImage, 'large')

  return (
    <article className="container-x pt-32 pb-24 md:pt-44 md:pb-36">
      <header className="max-w-4xl">
        <p className="text-ink-subtle">{formatDate(post.publishedAt, { weekday: 'long' })}</p>
        <h1 className="display-lg mt-3">{post.title}</h1>
        <p className="mt-6 text-lg text-ink-muted md:text-xl">{post.excerpt}</p>
      </header>
      {img && (
        <div className="relative mt-12 aspect-[16/9] overflow-hidden rounded-sm bg-surface-2">
          <Image src={img.src} alt={img.alt} fill priority sizes="100vw" className="object-cover" />
        </div>
      )}
      <div className="mt-16">
        <RichText data={post.body} className="prose-lsd" />
      </div>
      <Link href="/journal" className="mt-16 inline-block text-ink underline decoration-accent underline-offset-4">
        All journal entries
      </Link>
    </article>
  )
}
