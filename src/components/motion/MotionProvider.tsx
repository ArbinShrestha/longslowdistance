'use client'

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

gsap.registerPlugin(ScrollTrigger)

/**
 * One place for page-level motion: reveals `.reveal` elements as they enter the viewport
 * and flags `html.reduce-motion` so every animated leaf can degrade to static.
 */
export function MotionProvider() {
  const pathname = usePathname()

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    document.documentElement.classList.toggle('reduce-motion', reduce)
    if (reduce) {
      document.querySelectorAll<HTMLElement>('.reveal').forEach((el) => el.classList.add('is-visible'))
      return
    }
    // IntersectionObserver is independent of ScrollTrigger's position cache, so pinned sections
    // higher up the page cannot leave later elements stuck invisible.
    const io = new IntersectionObserver(
      (entries) => {
        const batch = entries.filter((e) => e.isIntersecting).map((e) => e.target as HTMLElement)
        if (batch.length === 0) return
        batch.forEach((el) => io.unobserve(el))
        gsap.to(batch, {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: 'expo.out',
          stagger: 0.08,
          onComplete: () => batch.forEach((el) => el.classList.add('is-visible')),
        })
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.05 },
    )
    document.querySelectorAll<HTMLElement>('.reveal:not(.is-visible)').forEach((el) => io.observe(el))
    const t = window.setTimeout(() => ScrollTrigger.refresh(), 600)
    return () => {
      window.clearTimeout(t)
      io.disconnect()
    }
  }, [pathname])

  return null
}
