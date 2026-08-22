import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import ThemeToggle from './ThemeToggle'
import { SharePortfolio } from './ShowcaseExtras'
import { jumpToSection } from './SmoothScroll'
import { springStamp, easeOut } from '../lib/motion'

const navLinks = [
  { name: 'Home', to: 'home' },
  { name: 'Projects', to: 'work' },
  { name: 'Skills', to: 'skills' },
  { name: 'About', to: 'about' },
  { name: 'Experience', to: 'experience' },
  { name: 'Resume', to: 'resume' },
  { name: 'Contact', to: 'contact' },
]

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (!isOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e) => {
      if (e.key === 'Escape') setIsOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [isOpen])

  return (
    <>
      <motion.a
        href="#home"
        data-cursor="go"
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={springStamp}
        onClick={(e) => {
          e.preventDefault()
          jumpToSection('home', { offset: 0 })
        }}
        className="pointer-events-auto fixed left-3 top-3 z-[60] inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--bg-elevated)]/90 px-3 py-2 shadow-sm backdrop-blur-md md:left-5 md:top-4"
        aria-label="Sujay Kumar — home"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--ink)] font-display text-[11px] font-bold text-[var(--bg)]">
          SK
        </span>
        <span className="hidden font-display text-sm tracking-tight text-[var(--ink)] sm:inline">
          Sujay Kumar
        </span>
      </motion.a>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={springStamp}
        className="pointer-events-none fixed right-3 top-3 z-[60] flex items-center gap-2 md:right-5 md:top-4"
        aria-label="Main navigation"
      >
        <button
          type="button"
          data-cursor="go"
          aria-label="Open command palette"
          onClick={() => window.dispatchEvent(new Event('open-command-palette'))}
          className="pointer-events-auto hidden rounded-full border border-[var(--line)] bg-[var(--bg-elevated)] px-3 py-2 font-mono text-[10px] font-bold text-[var(--text-faint)] shadow-sm transition hover:border-[var(--ink)] hover:text-[var(--ink)] sm:inline-flex"
        >
          ⌘K
        </button>
        <div className="pointer-events-auto hidden sm:block">
          <SharePortfolio />
        </div>
        <div className="pointer-events-auto hidden sm:block">
          <ThemeToggle compact />
        </div>
        <motion.button
          type="button"
          data-cursor="go"
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isOpen}
          className="bubble-btn pointer-events-auto"
          onClick={() => setIsOpen((v) => !v)}
          whileHover={{ scale: 1.12, rotate: 12 }}
          whileTap={{ scale: 0.9 }}
          transition={springStamp}
        >
          <span className="flex flex-col items-center justify-center gap-[6px]">
            <motion.span
              animate={isOpen ? { y: 4, rotate: 45 } : { y: 0, rotate: 0 }}
              className="block h-[2px] w-[22px] rounded-sm bg-[var(--ink)]"
            />
            <motion.span
              animate={isOpen ? { y: -4, rotate: -45 } : { y: 0, rotate: 0 }}
              className="block h-[2px] w-[22px] rounded-sm bg-[var(--ink)]"
            />
          </span>
        </motion.button>
      </motion.nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div className="fixed inset-0 z-[55] overflow-hidden">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.45, ease: easeOut }}
              className="absolute inset-0 bg-[var(--ink)]"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.5, ease: easeOut, delay: 0.05 }}
              className="absolute inset-0 bg-[var(--bg)]"
            />

            <div className="relative z-10 flex h-full flex-col items-center justify-center gap-1 px-6">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.name}
                  initial={{ x: i % 2 ? 80 : -80, opacity: 0, rotate: i % 2 ? 6 : -6 }}
                  animate={{ x: 0, opacity: 1, rotate: 0 }}
                  exit={{ x: i % 2 ? 40 : -40, opacity: 0 }}
                  transition={{ delay: 0.2 + i * 0.05, ...springStamp }}
                >
                  <button
                    type="button"
                    data-cursor="go"
                    onClick={() => {
                      setIsOpen(false)
                      jumpToSection(link.to, { offset: -20, delay: 90 })
                    }}
                  >
                    <motion.span
                      whileHover={{ scale: 1.12, rotate: i % 2 ? -3 : 3 }}
                      className="block cursor-pointer px-6 py-3 text-center font-display text-4xl uppercase tracking-tight text-[var(--ink)] md:text-6xl"
                    >
                      {link.name}
                    </motion.span>
                  </button>
                </motion.div>
              ))}
              <motion.a
                href="/Sujay-Kumar-Resume.pdf"
                download="Sujay-Kumar-Resume.pdf"
                data-cursor="go"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.55, ...springStamp }}
                whileHover={{ scale: 1.08, rotate: -2 }}
                className="mt-10 rounded-full bg-[var(--ink)] px-7 py-3.5 text-sm font-semibold text-[var(--bg)]"
                onClick={() => setIsOpen(false)}
              >
                Download CV
              </motion.a>
              <div className="mt-4 sm:hidden">
                <ThemeToggle />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default Navbar
