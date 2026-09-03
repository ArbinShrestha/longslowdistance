import { LSD_LETTERS_BBOX, LSD_LETTERS_PATH } from './lsd-letters'

const [bx0, by0, bx1, by1] = LSD_LETTERS_BBOX
const lettersW = bx1 - bx0
const lettersH = by1 - by0

/** The traced LSD letterforms alone, filling the box, in currentColor. */
export function Letters({ className, title = 'LSD' }: { className?: string; title?: string }) {
  return (
    <svg viewBox={`${bx0} ${by0} ${lettersW} ${lettersH}`} className={className} role="img" aria-label={title}>
      <path d={LSD_LETTERS_PATH} fill="currentColor" fillRule="evenodd" />
    </svg>
  )
}

/**
 * The round badge: white disc, letters in the middle, ring text "LONG SLOW DISTANCE" three times.
 * `spin` rotates the ring only, the letters stay upright.
 */
export function Badge({ className, spin = false, inverted = false }: { className?: string; spin?: boolean; inverted?: boolean }) {
  const disc = inverted ? 'var(--surface)' : 'var(--paper)'
  const ink = inverted ? 'var(--paper)' : 'var(--paper-ink)'
  const scale = 0.58 // letters width relative to badge diameter
  const w = 1000 * scale
  const h = (lettersH / lettersW) * w
  return (
    <svg viewBox="0 0 1000 1000" className={className} role="img" aria-label="Long Slow Distance">
      <circle cx="500" cy="500" r="500" fill={disc} />
      <g className={spin ? 'spin-slow origin-center' : undefined} style={{ transformOrigin: '500px 500px' }}>
        <defs>
          <path id="lsd-ring" d="M500,500 m-390,0 a390,390 0 1,1 780,0 a390,390 0 1,1 -780,0" />
        </defs>
        <text fill={ink} fontFamily="var(--font-bricolage), Georgia, serif" fontWeight="600" fontSize="78" letterSpacing="6">
          <textPath href="#lsd-ring" startOffset="0">
            LONG SLOW DISTANCE   °   LONG SLOW DISTANCE   °   LONG SLOW DISTANCE   °
          </textPath>
        </text>
      </g>
      <svg x={(1000 - w) / 2} y={(1000 - h) / 2} width={w} height={h} viewBox={`${bx0} ${by0} ${lettersW} ${lettersH}`}>
        <path d={LSD_LETTERS_PATH} fill={ink} fillRule="evenodd" />
      </svg>
    </svg>
  )
}
