'use client'

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useEffect, useRef } from 'react'

import type { Route } from '@/lib/gpx'

gsap.registerPlugin(ScrollTrigger)

/** Draws the course as the section scrolls into view. Static under reduced motion. */
export function RouteDraw({ route, className, label }: { route: Route; className?: string; label: string }) {
  const ref = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const svg = ref.current
    if (!svg || document.documentElement.classList.contains('reduce-motion')) return
    const path = svg.querySelector<SVGPathElement>('[data-course]')
    const marker = svg.querySelector<SVGCircleElement>('[data-start]')
    if (!path) return
    const len = path.getTotalLength()
    const ctx = gsap.context(() => {
      gsap.set(path, { strokeDasharray: len, strokeDashoffset: len })
      gsap.set(marker, { scale: 0, transformOrigin: 'center' })
      const tl = gsap.timeline({
        scrollTrigger: { trigger: svg, start: 'top 80%', end: 'bottom 40%', scrub: 0.6 },
      })
      tl.to(path, { strokeDashoffset: 0, ease: 'none' }).to(marker, { scale: 1, ease: 'back.out(2)' }, '>-0.1')
    }, svg)
    return () => ctx.revert()
  }, [route.d])

  return (
    <svg
      ref={ref}
      viewBox={`0 0 ${route.width} ${route.height}`}
      className={className}
      role="img"
      aria-label={label}
      fill="none"
    >
      <path d={route.d} stroke="var(--ink)" strokeOpacity="0.12" strokeWidth="10" strokeLinejoin="round" strokeLinecap="round" />
      <path data-course d={route.d} stroke="var(--accent)" strokeWidth="10" strokeLinejoin="round" strokeLinecap="round" />
      <circle data-start cx={route.start.x} cy={route.start.y} r="18" fill="var(--paper)" stroke="var(--surface)" strokeWidth="6" />
    </svg>
  )
}
