import { useEffect } from 'react'
import { useReducedMotion } from 'framer-motion'

/**
 * Crazy-smooth scroll atmosphere:
 * - velocity stretch (elastic “whoosh”)
 * - aurora + glow pulse
 * - no page skew / hue (those cause dizziness)
 */
export default function WorldScroll() {
  const reduce = useReducedMotion()

  useEffect(() => {
    const root = document.documentElement
    const reset = () => {
      root.style.setProperty('--scroll-p', '0')
      root.style.setProperty('--aurora-shift', '0px')
      root.style.setProperty('--depth-glow', '0.2')
      root.style.setProperty('--scroll-vel', '0')
      root.style.setProperty('--stretch-y', '1')
      root.style.setProperty('--drift-y', '0px')
      root.style.setProperty('--world-skew', '0deg')
      root.style.setProperty('--world-scale', '1')
      root.style.setProperty('--world-hue', '0deg')
      root.style.setProperty('--world-shift', '0px')
    }

    if (reduce) {
      reset()
      return undefined
    }

    let raf = 0
    let lastY = window.scrollY
    let lastT = performance.now()
    let vel = 0

    const projectsPinned = () => {
      const el = document.getElementById('work')
      if (!el) return false
      const r = el.getBoundingClientRect()
      return r.top <= 8 && r.bottom >= window.innerHeight - 8
    }

    const paint = (now = performance.now()) => {
      const y = window.scrollY
      const dt = Math.max(8, now - lastT)
      const raw = ((y - lastY) / dt) * 16
      // Smooth velocity
      vel += (raw - vel) * 0.18
      lastY = y
      lastT = now

      const pinned = projectsPinned()
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
      const p = y / max

      const clampedVel = Math.max(-1.8, Math.min(1.8, vel))
      // Elastic stretch — subtle, feels fast without nausea
      const stretch = pinned ? 1 : 1 + Math.abs(clampedVel) * 0.012
      const drift = pinned ? 0 : clampedVel * -6
      const shift = Math.sin(p * Math.PI * 2.4) * 28 + clampedVel * 10
      const glow = pinned
        ? 0.45
        : 0.2 + Math.sin(p * Math.PI) * 0.28 + Math.min(0.35, Math.abs(clampedVel) * 0.12)

      root.style.setProperty('--scroll-p', p.toFixed(4))
      root.style.setProperty('--aurora-shift', `${shift.toFixed(1)}px`)
      root.style.setProperty('--depth-glow', glow.toFixed(3))
      root.style.setProperty('--scroll-vel', clampedVel.toFixed(3))
      root.style.setProperty('--stretch-y', stretch.toFixed(4))
      root.style.setProperty('--drift-y', `${drift.toFixed(2)}px`)

      raf = requestAnimationFrame(paint)
    }

    raf = requestAnimationFrame(paint)
    return () => {
      cancelAnimationFrame(raf)
      reset()
    }
  }, [reduce])

  return null
}
