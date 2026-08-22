import { useEffect } from 'react'
import { useReducedMotion } from 'framer-motion'

/**
 * Atmosphere only — no page stretch / drift (those lag and make scroll feel stuck).
 * --scroll-p is owned by Lenis.
 */
export default function WorldScroll() {
  const reduce = useReducedMotion()

  useEffect(() => {
    const root = document.documentElement
    root.style.setProperty('--aurora-shift', '0px')
    root.style.setProperty('--depth-glow', reduce ? '0.12' : '0.22')
    root.style.setProperty('--scroll-vel', '0')
    root.style.setProperty('--stretch-y', '1')
    root.style.setProperty('--drift-y', '0px')
    root.style.setProperty('--marquee-boost', '0')
    root.style.setProperty('--world-skew', '0deg')
    root.style.setProperty('--world-scale', '1')
    root.style.setProperty('--world-hue', '0deg')
    root.style.setProperty('--world-shift', '0px')
  }, [reduce])

  return null
}
