import { readFile } from 'fs/promises'
import path from 'path'

import type { Media } from '@/payload-types'

import { gpxToRoute, type Route } from './gpx'

/** Loads a GPX upload (local disk or Blob URL) and projects it. Null when missing or unparsable. */
export async function routeFromMedia(media: Media | number | null | undefined): Promise<Route | null> {
  if (!media || typeof media !== 'object' || !media.filename) return null
  try {
    let text: string
    if (media.url?.startsWith('http')) {
      const res = await fetch(media.url, { next: { revalidate: 3600 } })
      if (!res.ok) return null
      text = await res.text()
    } else {
      text = await readFile(path.join(process.cwd(), 'media', media.filename), 'utf8')
    }
    return gpxToRoute(text)
  } catch {
    return null
  }
}
