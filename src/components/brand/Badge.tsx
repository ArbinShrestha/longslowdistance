import { LSD_BADGE_PATH, LSD_BADGE_TRANSFORM } from './lsd-badge'
import { LSD_LETTERS_BBOX, LSD_LETTERS_PATH } from './lsd-letters'

const [bx0, by0, bx1, by1] = LSD_LETTERS_BBOX

/** The LSD letterforms alone, in currentColor. Used in the header and as the favicon source. */
export function Letters({ className, title = 'LSD' }: { className?: string; title?: string }) {
  return (
    <svg viewBox={`${bx0} ${by0} ${bx1 - bx0} ${by1 - by0}`} className={className} role="img" aria-label={title}>
      <path d={LSD_LETTERS_PATH} fill="currentColor" fillRule="evenodd" />
    </svg>
  )
}

/**
 * The complete badge artwork (letters and the "LONG SLOW DISTANCE" ring), traced from the original.
 * `variant="disc"` is the sticker: dark marks on a paper disc.
 * `variant="print"` is the t-shirt print: marks in currentColor, no disc.
 */
export function Badge({ className, variant = 'print' }: { className?: string; variant?: 'disc' | 'print' }) {
  return (
    <svg viewBox="0 0 1000 1000" className={className} role="img" aria-label="Long Slow Distance">
      {variant === 'disc' && <circle cx="500" cy="500" r="500" fill="var(--paper)" />}
      <g transform={LSD_BADGE_TRANSFORM}>
        <path d={LSD_BADGE_PATH} fill={variant === 'disc' ? 'var(--paper-ink)' : 'currentColor'} fillRule="evenodd" />
      </g>
    </svg>
  )
}
