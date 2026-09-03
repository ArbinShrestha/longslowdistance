import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import { formatDate } from '@/lib/format'
import { resolveImage } from '@/lib/media'
import { findPublishedPosts } from '@/lib/queries'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Journal',
  description: 'Notes from the Long Slow Distance crew: events, formats, and long nights out.',
}

export default async function JournalPage() {
  const posts = await findPublishedPosts({ limit: 50 })
  return (
    <>
      <section className="container-x pt-32 pb-16 md:pt-44 md:pb-24">
        <h1 className="display-xl">Journal</h1>
        <p className="mt-6 max-w-xl text-lg text-ink-muted">What we are building, why, and what we learned on the way.</p>
      </section>
      <section className="container-x pb-24 md:pb-36">
        {posts.docs.length === 0 ? (
          <p className="text-ink-muted">Nothing here yet.</p>
        ) : (
          <ul className="grid gap-x-6 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
            {posts.docs.map((post, i) => {
              const img = resolveImage(post.heroImage, 'card')
              return (
                <li key={post.id} className={`reveal ${i === 0 ? 'sm:col-span-2 lg:col-span-2' : ''}`}>
                  <Link href={`/journal/${post.slug}`} className="group block">
                    <div className={`relative overflow-hidden rounded-sm bg-surface-2 ${i === 0 ? 'aspect-[16/9]' : 'aspect-[4/5]'}`}>
                      {img && (
                        <Image
                          src={img.src}
                          alt={img.alt}
                          fill
                          sizes={i === 0 ? '(min-width: 1024px) 66vw, 100vw' : '(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw'}
                          className="object-cover transition-transform duration-[1200ms] ease-(--ease-soft) group-hover:scale-[1.04]"
                        />
                      )}
                    </div>
                    <p className="mt-5 text-sm text-ink-subtle">{formatDate(post.publishedAt)}</p>
                    <h2 className={`mt-2 ${i === 0 ? 'display-md' : 'font-display text-2xl font-bold leading-tight'} group-hover:underline group-hover:decoration-accent group-hover:underline-offset-4`}>
                      {post.title}
                    </h2>
                    <p className="mt-2 max-w-xl text-ink-muted">{post.excerpt}</p>
                  </Link>
                </li>
              )
            })}
          </ul>
        )}
      </section>
    </>
  )
}
