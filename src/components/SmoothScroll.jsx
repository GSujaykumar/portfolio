import { useEffect } from 'react'
import Lenis from 'lenis'

export const LENIS_READY = 'portfolio:lenis-ready'
export const LENIS_SCROLL = 'portfolio:lenis-scroll'

function nativeProgress() {
  const max = document.documentElement.scrollHeight - window.innerHeight
  if (max <= 0) return 0
  return Math.min(1, Math.max(0, window.scrollY / max))
}

export function refreshLenis() {
  const lenis = window.__lenis
  if (!lenis) return
  lenis.resize()
  lenis.start()
  const progress = typeof lenis.progress === 'number' ? lenis.progress : nativeProgress()
  document.documentElement.style.setProperty('--scroll-p', progress.toFixed(4))
}

export function lockPageScroll() {
  window.__lenis?.stop()
}

export function unlockPageScroll() {
  requestAnimationFrame(() => {
    refreshLenis()
    window.dispatchEvent(new Event('scroll'))
  })
}

/**
 * Lenis wheel lerp + duration hops for section jumps.
 * autoRaf keeps one rAF loop; we only write a CSS var, no CustomEvents per frame.
 */
export default function SmoothScroll() {
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (reduce.matches) return undefined

    const root = document.documentElement
    let scrollIdle = 0

    const lenis = new Lenis({
      lerp: 0.078,
      smoothWheel: true,
      wheelMultiplier: 0.88,
      touchMultiplier: 1.05,
      syncTouch: false,
      autoRaf: true,
      autoResize: true,
      anchors: false,
      overscroll: false,
      allowNestedScroll: true,
    })

    lenis.on('scroll', ({ progress }) => {
      const p = Number.isFinite(progress) ? Math.min(1, Math.max(0, progress)) : nativeProgress()
      root.style.setProperty('--scroll-p', p.toFixed(4))
      root.setAttribute('data-scrolling', '')
      window.clearTimeout(scrollIdle)
      scrollIdle = window.setTimeout(() => root.removeAttribute('data-scrolling'), 120)
    })

    window.__lenis = lenis
    document.documentElement.classList.add('lenis', 'lenis-smooth')
    document.documentElement.style.setProperty('--scroll-p', '0')
    window.dispatchEvent(new Event(LENIS_READY))

    const onReduce = () => {
      if (reduce.matches) lenis.stop()
      else lenis.start()
    }
    reduce.addEventListener('change', onReduce)

    return () => {
      reduce.removeEventListener('change', onReduce)
      window.clearTimeout(scrollIdle)
      root.removeAttribute('data-scrolling')
      lenis.destroy()
      delete window.__lenis
      document.documentElement.classList.remove('lenis', 'lenis-smooth', 'lenis-stopped')
    }
  }, [])

  return null
}

const hopEase = (t) => 1 - (1 - t) ** 3

export function smoothScrollTo(targetY, { immediate = false } = {}) {
  const lenis = window.__lenis
  if (lenis && !immediate) {
    lenis.scrollTo(targetY, { offset: 0, duration: 1.05, easing: hopEase })
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
  const lenis = window.__lenis
  if (lenis) {
    lenis.scrollTo(el, { offset, duration: 1.05, easing: hopEase })
    return
  }
  const y = window.scrollY + el.getBoundingClientRect().top + offset
  smoothScrollTo(y)
}

export function jumpToSection(id, { offset = -10, delay = 0 } = {}) {
  const go = () => smoothScrollToId(id, offset)
  if (delay > 0) window.setTimeout(go, delay)
  else go()
}
