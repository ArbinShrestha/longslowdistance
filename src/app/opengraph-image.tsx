import { ImageResponse } from 'next/og'

import { LSD_LETTERS_BBOX, LSD_LETTERS_PATH } from '@/components/brand/lsd-letters'
import { SITE_TAGLINE } from '@/lib/site'

export const runtime = 'nodejs'
export const alt = 'Long Slow Distance'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpenGraphImage() {
  const [x0, y0, x1, y1] = LSD_LETTERS_BBOX
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 72,
          background: '#0b0b0c',
          color: '#f2efe9',
          fontFamily: 'sans-serif',
        }}
      >
        <svg width="360" height={(360 * (y1 - y0)) / (x1 - x0)} viewBox={`${x0} ${y0} ${x1 - x0} ${y1 - y0}`}>
          <path d={LSD_LETTERS_PATH} fill="#f2efe9" fillRule="evenodd" />
        </svg>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 84, fontWeight: 800, letterSpacing: -3, lineHeight: 1 }}>
            Run long. Run slow. <span style={{ color: '#ff5a1f' }}>Run together.</span>
          </div>
          <div style={{ marginTop: 24, fontSize: 30, color: '#b3afa8' }}>{SITE_TAGLINE}</div>
        </div>
      </div>
    ),
    size,
  )
}
