import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { springStamp } from '../lib/motion'
import { smoothScrollToId } from './SmoothScroll'

const SECTIONS = [
  { id: 'home', label: 'Home', hint: 'Landing' },
  { id: 'work', label: 'Projects', hint: 'Showcase' },
  { id: 'impact', label: 'Impact', hint: 'Numbers' },
  { id: 'highlights', label: 'Signature', hint: 'What I ship' },
  { id: 'about', label: 'About', hint: 'Profile' },
  { id: 'experience', label: 'Experience', hint: 'Work history' },
  { id: 'terminal', label: 'Terminal', hint: 'CLI demo' },
  { id: 'skills', label: 'Skills', hint: 'Stack' },
  { id: 'education', label: 'Education', hint: 'JNTUH' },
  { id: 'resume', label: 'Resume', hint: 'Download CV' },
  { id: 'contact', label: 'Contact', hint: 'Hire me' },
]

const ACTIONS = [
  {
    id: 'cv',
    label: 'Download CV',
    hint: 'PDF',
    run: () => {
      const a = document.createElement('a')
      a.href = '/Sujay-Kumar-Resume.pdf'
      a.download = 'Sujay-Kumar-Resume.pdf'
      a.click()
    },
  },
  {
    id: 'mail',
    label: 'Email Sujay',
    hint: 'Compose',
    run: () => {
      window.location.href = 'mailto:sujaykumargaddam18@gmail.com?subject=Opportunity'
    },
  },
]

export const CommandPalette = () => {
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    const onKey = (e) => {
      const meta = e.metaKey || e.ctrlKey
      if (meta && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen((v) => !v)
        setQ('')
        setIdx(0)
      }
      if (e.key === 'Escape') setOpen(false)
    }
    const onOpen = () => {
      setOpen(true)
      setQ('')
      setIdx(0)
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener('open-command-palette', onOpen)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('open-command-palette', onOpen)
    }
  }, [])

  const results = useMemo(() => {
    const term = q.trim().toLowerCase()
    const sections = SECTIONS.map((s) => ({ ...s, kind: 'section' }))
    const actions = ACTIONS.map((a) => ({ ...a, kind: 'action' }))
    const all = [...sections, ...actions]
    if (!term) return all
    return all.filter(
      (s) =>
        s.label.toLowerCase().includes(term) ||
        (s.hint && s.hint.toLowerCase().includes(term))
    )
  }, [q])

  useEffect(() => {
    setIdx(0)
  }, [q])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setIdx((i) => Math.min(i + 1, results.length - 1))
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        setIdx((i) => Math.max(i - 1, 0))
      }
      if (e.key === 'Enter' && results[idx]) {
        e.preventDefault()
        run(results[idx])
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, results, idx])

  const run = (item) => {
    setOpen(false)
    if (item.kind === 'action') {
      item.run?.()
      return
    }
    smoothScrollToId(item.id)
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[10020] flex items-start justify-center bg-[var(--ink)]/45 px-4 pt-[12vh] backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12 }}
            transition={springStamp}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg overflow-hidden rounded-2xl border-2 border-[var(--ink)]/10 bg-[var(--bg-elevated)] shadow-2xl"
          >
            <div className="flex items-center gap-3 border-b border-[var(--line)] px-4 py-3">
              <span className="rounded bg-[var(--ink)] px-2 py-0.5 font-mono text-[10px] font-bold text-[var(--bg)]">
                ⌘K
              </span>
              <input
                autoFocus
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Jump to section or action…"
                className="w-full bg-transparent text-sm text-[var(--ink)] outline-none placeholder:text-[var(--text-faint)]"
              />
              <kbd className="hidden rounded border border-[var(--line)] px-1.5 py-0.5 font-mono text-[10px] text-[var(--text-faint)] sm:inline">
                ESC
              </kbd>
            </div>
            <ul className="max-h-80 overflow-auto p-2">
              {results.length === 0 && (
                <li className="px-3 py-6 text-center text-sm text-[var(--text-faint)]">No matches</li>
              )}
              {results.map((s, i) => (
                <li key={`${s.kind}-${s.id}`}>
                  <button
                    type="button"
                    data-cursor="go"
                    onMouseEnter={() => setIdx(i)}
                    onClick={() => run(s)}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left transition ${
                      i === idx ? 'bg-[var(--ink)] text-[var(--bg)]' : 'hover:bg-[var(--bg)]'
                    }`}
                  >
                    <span className="font-medium">{s.label}</span>
                    <span
                      className={`font-mono text-[10px] uppercase tracking-wider ${
                        i === idx ? 'text-[var(--bg)]/70' : 'text-[var(--text-faint)]'
                      }`}
                    >
                      {s.hint}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
            <p className="border-t border-[var(--line)] px-4 py-2 font-mono text-[10px] uppercase tracking-wider text-[var(--text-faint)]">
              ↑↓ navigate · Enter open · Esc close
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default CommandPalette
