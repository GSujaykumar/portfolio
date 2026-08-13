import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { FaChevronDown, FaChevronUp } from 'react-icons/fa6'
import { easeOut, springSoft } from '../lib/motion'
import { smoothScrollToId } from './SmoothScroll'

const SECTIONS = [
  { id: 'home', label: 'Home' },
  { id: 'work', label: 'Projects' },
  { id: 'impact', label: 'Impact' },
  { id: 'highlights', label: 'Signature' },
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'terminal', label: 'Terminal' },
  { id: 'skills', label: 'Stack' },
  { id: 'education', label: 'Education' },
  { id: 'resume', label: 'Resume' },
  { id: 'contact', label: 'Contact' },
]

/** Floating “you are here” chip + ↑↓ section hop */
export default function ScrollExtras() {
  const reduce = useReducedMotion()
  const [active, setActive] = useState('home')
  const [showCue, setShowCue] = useState(true)

  useEffect(() => {
    const ids = SECTIONS.map((s) => s.id)
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible?.target?.id) setActive(visible.target.id)
      },
      { rootMargin: '-42% 0px -42% 0px', threshold: [0.1, 0.35, 0.6] }
    )
    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) obs.observe(el)
    })
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    const hide = () => setShowCue(window.scrollY < 80)
    hide()
    window.addEventListener('scroll', hide, { passive: true })
    return () => window.removeEventListener('scroll', hide)
  }, [])

  useEffect(() => {
    if (reduce) return undefined
    const onKey = (e) => {
      if (e.target && ['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return
      if (e.metaKey || e.ctrlKey || e.altKey) return
      const i = SECTIONS.findIndex((s) => s.id === active)
      if (e.key === 'ArrowDown' || e.key === 'j') {
        e.preventDefault()
        const next = SECTIONS[Math.min(SECTIONS.length - 1, i + 1)]
        if (next) smoothScrollToId(next.id)
      }
      if (e.key === 'ArrowUp' || e.key === 'k') {
        e.preventDefault()
        const prev = SECTIONS[Math.max(0, i - 1)]
        if (prev) smoothScrollToId(prev.id)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [active, reduce])

  const label = SECTIONS.find((s) => s.id === active)?.label || 'Home'
  const idx = SECTIONS.findIndex((s) => s.id === active)
  const go = (dir) => {
    const next = SECTIONS[Math.min(SECTIONS.length - 1, Math.max(0, idx + dir))]
    if (next) smoothScrollToId(next.id)
  }

  return (
    <>
      {/* Soft depth wash */}
      <div className="scroll-atmosphere" aria-hidden="true" />

      <AnimatePresence>
        {!showCue && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.45, ease: easeOut }}
            className="pointer-events-none fixed bottom-6 left-1/2 z-40 hidden -translate-x-1/2 sm:block"
          >
            <div className="pointer-events-auto flex items-center gap-1 rounded-full border border-[var(--line)] bg-[var(--bg-elevated)]/90 px-2 py-1.5 shadow-lg backdrop-blur-md">
              <button
                type="button"
                aria-label="Previous section"
                data-cursor="go"
                onClick={() => go(-1)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-[var(--text-faint)] transition hover:bg-[var(--bg-soft)] hover:text-[var(--ink)]"
              >
                <FaChevronUp className="text-xs" />
              </button>
              <div className="min-w-[7.5rem] px-2 text-center">
                <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-[var(--text-faint)]">
                  Now viewing
                </p>
                <p className="font-display text-sm text-[var(--ink)]">{label}</p>
              </div>
              <button
                type="button"
                aria-label="Next section"
                data-cursor="go"
                onClick={() => go(1)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-[var(--text-faint)] transition hover:bg-[var(--bg-soft)] hover:text-[var(--ink)]"
              >
                <FaChevronDown className="text-xs" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showCue && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            exit={{ opacity: 0 }}
            transition={springSoft}
            className="pointer-events-none fixed bottom-8 left-1/2 z-30 hidden -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--text-faint)] md:block"
          >
            Scroll to explore
          </motion.p>
        )}
      </AnimatePresence>
    </>
  )
}
