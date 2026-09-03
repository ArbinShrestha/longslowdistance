import type { Media } from '@/payload-types'

export type MediaSize = 'thumbnail' | 'card' | 'large' | 'original'

export type ResolvedImage = { src: string; width: number; height: number; alt: string }

export const isMedia = (value: unknown): value is Media =>
  typeof value === 'object' && value !== null && 'url' in (value as Record<string, unknown>)

/** Picks the best URL for a requested size, falling back to the original upload. */
export function resolveImage(media: Media | number | null | undefined, size: MediaSize = 'card'): ResolvedImage | null {
  if (!isMedia(media) || !media.url) return null
  const sized = size !== 'original' ? media.sizes?.[size] : undefined
  if (sized?.url && sized.width && sized.height) {
    return { src: sized.url, width: sized.width, height: sized.height, alt: media.alt }
  }
  return { src: media.url, width: media.width ?? 1600, height: media.height ?? 1067, alt: media.alt }
}
