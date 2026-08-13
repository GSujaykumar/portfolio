import { useEffect } from 'react'
import Lenis from 'lenis'

/**
 * Ultra-smooth Lenis — long glide + elastic feel.
 * Projects pin stays snappier so horizontal scrub doesn't lag.
 */
export default function SmoothScroll() {
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (reduce.matches) return undefined

    const lenis = new Lenis({
      // Longer = silkier, “crazy smooth” float
      duration: 1.75,
      easing: (t) => {
        // Custom ease-out expo with soft landing
        const p = Math.min(1, Math.max(0, t))
        return 1 - Math.pow(1 - p, 3.6)
      },
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.78,
      touchMultiplier: 1.45,
      syncTouch: false,
      autoRaf: false,
    })

    window.__lenis = lenis
    document.documentElement.classList.add('lenis', 'lenis-smooth')

    const projectsPinned = () => {
      const el = document.getElementById('work')
      if (!el) return false
      const r = el.getBoundingClientRect()
      return r.top <= 8 && r.bottom >= window.innerHeight - 8
    }

    let raf = 0
    const frame = (time) => {
      const pinned = projectsPinned()
      lenis.options.duration = pinned ? 0.62 : 1.75
      lenis.options.wheelMultiplier = pinned ? 1.08 : 0.78
      lenis.raf(time)
      raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)

    const onReduce = () => {
      if (reduce.matches) lenis.stop()
      else lenis.start()
    }
    reduce.addEventListener('change', onReduce)

    return () => {
      cancelAnimationFrame(raf)
      reduce.removeEventListener('change', onReduce)
      lenis.destroy()
      delete window.__lenis
      document.documentElement.classList.remove('lenis', 'lenis-smooth')
    }
  }, [])

  return null
}

export function smoothScrollTo(targetY, { immediate = false } = {}) {
  const lenis = window.__lenis
  if (lenis && !immediate) {
    lenis.scrollTo(targetY, {
      duration: 1.65,
      easing: (t) => 1 - Math.pow(1 - t, 3.6),
    })
    return
  }
  window.scrollTo({
    top: targetY,
    behavior: immediate ? 'auto' : 'smooth',
  })
}

export function smoothScrollToId(id, offset = -10) {
  const el = document.getElementById(id)
  if (!el) return
  const y = window.scrollY + el.getBoundingClientRect().top + offset
  smoothScrollTo(y)
}

/** Menu / chip jump that works with Lenis (react-scroll does not). */
export function jumpToSection(id, { offset = -10, delay = 0 } = {}) {
  const go = () => smoothScrollToId(id, offset)
  if (delay > 0) window.setTimeout(go, delay)
  else go()
}
