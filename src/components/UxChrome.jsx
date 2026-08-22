import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FaArrowUp, FaKeyboard } from 'react-icons/fa6'
import { springStamp } from '../lib/motion'

export function BackToTop() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    let ticking = false
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        setShow(window.scrollY > 520)
        ticking = false
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

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
            if (lenis) lenis.scrollTo(0, { duration: 1.05, easing: (t) => 1 - (1 - t) ** 3 })
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
      <BackToTop />
      <ShortcutHint />
      <ToastHost />
    </>
  )
}
