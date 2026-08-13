import { useEffect, useState } from 'react'
import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useReducedMotion,
  useScroll,
  useMotionValueEvent,
} from 'framer-motion'
import {
  FaArrowUp,
  FaBriefcase,
  FaChartLine,
  FaCode,
  FaEnvelope,
  FaFileLines,
  FaHouse,
  FaKeyboard,
  FaLayerGroup,
  FaTerminal,
  FaUser,
} from 'react-icons/fa6'
import { smoothScrollToId } from './SmoothScroll'
import { springStamp } from '../lib/motion'

const SECTIONS = [
  { id: 'home', label: 'Home', icon: FaHouse },
  { id: 'work', label: 'Projects', icon: FaLayerGroup },
  { id: 'impact', label: 'Impact', icon: FaChartLine },
  { id: 'about', label: 'About', icon: FaUser },
  { id: 'experience', label: 'Work', icon: FaBriefcase },
  { id: 'terminal', label: 'CLI', icon: FaTerminal },
  { id: 'skills', label: 'Stack', icon: FaCode },
  { id: 'resume', label: 'Resume', icon: FaFileLines },
  { id: 'contact', label: 'Contact', icon: FaEnvelope },
]

export function SectionDots() {
  const reduce = useReducedMotion()
  const [active, setActive] = useState('home')

  useEffect(() => {
    const ids = SECTIONS.map((s) => s.id)
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible?.target?.id) setActive(visible.target.id)
      },
      { rootMargin: '-40% 0px -45% 0px', threshold: [0.15, 0.4, 0.7] }
    )
    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) obs.observe(el)
    })
    return () => obs.disconnect()
  }, [])

  return (
    <nav
      aria-label="Sections"
      className="fixed left-3 top-1/2 z-40 hidden -translate-y-1/2 lg:flex"
    >
      <LayoutGroup id="section-rail">
        <div className="relative flex flex-col items-center gap-1.5 rounded-full border border-[var(--line)] bg-[var(--bg-elevated)]/90 p-1.5 shadow-lg backdrop-blur-md">
          <span
            aria-hidden
            className="pointer-events-none absolute inset-y-4 left-1/2 w-px -translate-x-1/2 bg-[var(--line)]"
          />
          {SECTIONS.map((s) => {
            const on = active === s.id
            const Icon = s.icon
            return (
              <button
                key={s.id}
                type="button"
                title={s.label}
                data-cursor="go"
                aria-label={s.label}
                aria-current={on ? 'true' : undefined}
                onClick={() => smoothScrollToId(s.id)}
                className="group relative flex h-9 w-9 items-center justify-center"
              >
                {on && (
                  <motion.span
                    layoutId={reduce ? undefined : 'section-active'}
                    className="absolute inset-0 rounded-full bg-[var(--ink)] shadow-sm"
                    transition={springStamp}
                  />
                )}
                <Icon
                  size={13}
                  className={`relative z-[1] transition-colors duration-200 ${
                    on
                      ? 'text-[var(--bg)]'
                      : 'text-[var(--text-faint)] group-hover:text-[var(--ink)]'
                  }`}
                />
                <span className="pointer-events-none absolute left-12 z-10 whitespace-nowrap rounded-full bg-[var(--ink)] px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--bg)] opacity-0 shadow-md transition duration-200 group-hover:translate-x-0.5 group-hover:opacity-100">
                  {s.label}
                </span>
              </button>
            )
          })}
        </div>
      </LayoutGroup>
    </nav>
  )
}

export function BackToTop() {
  const { scrollY } = useScroll()
  const [show, setShow] = useState(false)

  useMotionValueEvent(scrollY, 'change', (v) => setShow(v > 520))

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          type="button"
          data-cursor="go"
          aria-label="Back to top"
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.85 }}
          transition={springStamp}
          whileHover={{ scale: 1.08, y: -2 }}
          whileTap={{ scale: 0.94 }}
          onClick={() => {
            const lenis = window.__lenis
            if (lenis) lenis.scrollTo(0, { duration: 1.2 })
            else window.scrollTo({ top: 0, behavior: 'smooth' })
          }}
          className="fixed bottom-5 right-5 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--signal)] text-[#04231c] shadow-[0_12px_28px_rgba(0,184,148,0.35)] md:bottom-8 md:right-8"
        >
          <FaArrowUp size={16} />
        </motion.button>
      )}
    </AnimatePresence>
  )
}

export function ShortcutHint() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    try {
      if (sessionStorage.getItem('ux-hint-seen')) return
    } catch {
      /* ignore */
    }
    const t = setTimeout(() => setShow(true), 2800)
    const hide = setTimeout(() => {
      setShow(false)
      try {
        sessionStorage.setItem('ux-hint-seen', '1')
      } catch {
        /* ignore */
      }
    }, 7500)
    return () => {
      clearTimeout(t)
      clearTimeout(hide)
    }
  }, [])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 24, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: 16, x: '-50%' }}
          transition={springStamp}
          className="fixed bottom-6 left-1/2 z-50 flex items-center gap-3 rounded-full border border-[var(--line)] bg-[var(--bg-elevated)] px-4 py-2.5 shadow-xl"
        >
          <FaKeyboard className="text-[var(--ink)]" />
          <p className="text-xs font-medium text-[var(--text-muted)]">
            <kbd className="rounded bg-[var(--bg-well)] px-1.5 py-0.5 font-mono text-[10px] text-[var(--ink)]">
              Ctrl
            </kbd>
            {' + '}
            <kbd className="rounded bg-[var(--bg-well)] px-1.5 py-0.5 font-mono text-[10px] text-[var(--ink)]">
              K
            </kbd>
            {' jump · ↑↓ hop sections · scroll Projects'}
          </p>
          <button
            type="button"
            className="ml-1 text-xs font-semibold text-[var(--ink)] underline"
            onClick={() => {
              setShow(false)
              try {
                sessionStorage.setItem('ux-hint-seen', '1')
              } catch {
                /* ignore */
              }
            }}
          >
            Got it
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function ToastHost() {
  const [toast, setToast] = useState(null)

  useEffect(() => {
    const onToast = (e) => {
      setToast(e.detail?.message || 'Done')
      window.clearTimeout(onToast._t)
      onToast._t = window.setTimeout(() => setToast(null), 2200)
    }
    window.addEventListener('portfolio-toast', onToast)
    return () => window.removeEventListener('portfolio-toast', onToast)
  }, [])

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12 }}
          transition={springStamp}
          className="fixed bottom-24 left-1/2 z-[90] -translate-x-1/2 rounded-full bg-[var(--ink)] px-5 py-2.5 text-sm font-semibold text-[var(--bg)] shadow-xl"
        >
          {toast}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function toast(message) {
  window.dispatchEvent(new CustomEvent('portfolio-toast', { detail: { message } }))
}

export default function UxChrome() {
  return (
    <>
      <SectionDots />
      <BackToTop />
      <ShortcutHint />
      <ToastHost />
    </>
  )
}
