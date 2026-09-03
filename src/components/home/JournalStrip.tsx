import Image from 'next/image'
import Link from 'next/link'

import { formatDate } from '@/lib/format'
import { resolveImage } from '@/lib/media'
import type { Post } from '@/payload-types'

export function JournalStrip({ posts }: { posts: Post[] }) {
  if (posts.length === 0) return null
  return (
    <section className="section-y border-t border-line" aria-labelledby="journal">
      <div className="container-x flex items-end justify-between gap-6">
        <h2 id="journal" className="reveal display-lg">
          Journal
        </h2>
        <Link href="/journal" className="reveal mb-2 shrink-0 font-medium text-ink-muted underline decoration-accent underline-offset-4 hover:text-ink">
          All entries
        </Link>
      </div>
      <div className="mt-12 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <ul className="container-x flex snap-x snap-mandatory gap-5">
          {posts.map((post) => {
            const img = resolveImage(post.heroImage, 'card')
            return (
              <li key={post.id} className="reveal w-[82vw] shrink-0 snap-start sm:w-[420px]">
                <Link href={`/journal/${post.slug}`} className="group block">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-surface-2">
                    {img && (
                      <Image
                        src={img.src}
                        alt={img.alt}
                        fill
                        sizes="(min-width: 640px) 420px, 82vw"
                        className="object-cover transition-transform duration-[1200ms] ease-(--ease-soft) group-hover:scale-[1.04]"
                      />
                    )}
                  </div>
                  <p className="mt-5 text-sm text-ink-subtle">{formatDate(post.publishedAt)}</p>
                  <h3 className="mt-2 font-display text-2xl leading-tight font-bold group-hover:underline group-hover:decoration-accent group-hover:underline-offset-4">
                    {post.title}
                  </h3>
                  <p className="mt-2 text-ink-muted">{post.excerpt}</p>
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
