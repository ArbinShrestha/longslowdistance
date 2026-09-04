'use client'

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useEffect, useRef } from 'react'

gsap.registerPlugin(ScrollTrigger)

/**
 * Pinned manifesto: the lines sit in the viewport while scrolling lights them up word by word.
 * Motivation: the reader is made to spend time with the words, like a long run makes you spend time.
 */
export function Manifesto({ lines }: { lines: string[] }) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || document.documentElement.classList.contains('reduce-motion')) return
    const ctx = gsap.context(() => {
      const words = gsap.utils.toArray<HTMLElement>('[data-word]')
      gsap.set(words, { opacity: 0.18 })
      gsap.to(words, {
        opacity: 1,
        stagger: 0.6,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top top',
          end: `+=${Math.max(1200, words.length * 40)}`,
          pin: true,
          scrub: 0.4,
          anticipatePin: 1,
        },
      })
    }, el)
    return () => ctx.revert()
  }, [lines])

  return (
    <section ref={ref} className="flex min-h-[100dvh] items-center" aria-label="Manifesto">
      <div className="container-x">
        <div className="max-w-6xl">
          {lines.map((line, i) => (
            <p key={i} className="display-manifesto mb-4 text-ink last:mb-0 md:mb-6">
              {line.split(' ').map((w, j) => (
                <span key={j} data-word className="inline-block will-change-[opacity]">
                  {w}
                  {j < line.split(' ').length - 1 ? ' ' : ''}
                </span>
              ))}
            </p>
          ))}
        </div>
      </div>
    </section>
  )
}
