import { lazy, Suspense, useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Experience from './components/Experience'
import Projects from './components/Projects'
import Skills from './components/Skills'
import Education from './components/Education'
import Resume from './components/Resume'
import Contact from './components/Contact'
import Footer from './components/Footer'
import ScrollProgress, { IntroLoader } from './components/ScrollProgress'
import CommandPalette from './components/Distinctives'
import CustomCursor from './components/CustomCursor'
import SmoothScroll from './components/SmoothScroll'
import WorldScroll from './components/WorldScroll'
import ScrollExtras from './components/ScrollExtras'
import UxChrome from './components/UxChrome'
import EasterEgg from './components/EasterEgg'
import { TechMarquee } from './components/WowExtras'
import {
  ImpactShowcase,
  HighlightGrid,
  TerminalShowcase,
  QuickDock,
} from './components/ShowcaseExtras'
import { springStamp, easeOut } from './lib/motion'

const GuideRobot = lazy(() => import('./components/GuideRobot'))

function TourGuide() {
  const reduce = useReducedMotion()
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    try {
      setEnabled(localStorage.getItem('portfolio-guide') === '1')
    } catch {
      setEnabled(false)
    }
  }, [])

  if (reduce) return null

  if (!enabled) {
    return (
      <motion.button
        type="button"
        aria-label="Enable tour guide"
        data-cursor="go"
        onClick={() => {
          try {
            localStorage.setItem('portfolio-guide', '1')
          } catch {
            /* ignore */
          }
          setEnabled(true)
        }}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.96 }}
        transition={{ duration: 0.35, ease: easeOut }}
        className="fixed bottom-5 left-5 z-50 inline-flex items-center gap-2 rounded-full border-2 border-[var(--ink)] bg-[var(--bg-elevated)] px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--ink)] shadow-lg md:bottom-8 md:left-8"
      >
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--signal)] opacity-60" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--signal)]" />
        </span>
        Meet your guide
      </motion.button>
    )
  }

  return (
    <Suspense fallback={null}>
      <GuideRobot
        onDismiss={() => {
          try {
            localStorage.setItem('portfolio-guide', '0')
          } catch {
            /* ignore */
          }
          setEnabled(false)
        }}
      />
    </Suspense>
  )
}

function App() {
  const [booting, setBooting] = useState(true)

  return (
    <div className="relative min-h-screen bg-[var(--bg)] text-[var(--text)] selection:bg-[var(--ink)] selection:text-[var(--bg)]">
      <div className="aurora" aria-hidden="true">
        <span className="aurora__blob" />
        <span className="aurora__blob" />
        <span className="aurora__blob" />
      </div>
      <SmoothScroll />
      <WorldScroll />
      <AnimatePresence mode="wait">
        {booting && <IntroLoader key="intro" onDone={() => setBooting(false)} />}
      </AnimatePresence>
      <ScrollProgress />
      <CustomCursor />
      <CommandPalette />
      {!booting && <UxChrome />}
      {!booting && <ScrollExtras />}
      {!booting && <QuickDock />}
      {!booting && <EasterEgg />}
      {!booting && <TourGuide />}

      <Navbar />

      <motion.div
        className="relative z-10"
        initial={{ opacity: 0, y: 40 }}
        animate={booting ? { opacity: 0, y: 40 } : { opacity: 1, y: 0 }}
        transition={springStamp}
      >
        <Hero />
      </motion.div>

      {/* Keep Projects out of any CSS transform (sticky pin). Always mount so #work exists. */}
      <Projects />

      {/* z-20 so Skills / Resume / Contact paint above a leftover Projects pin */}
      <div className="relative z-20 bg-[var(--bg)]">
        <TechMarquee />
        <ImpactShowcase />
        <HighlightGrid />
        <About />
        <Experience />
        <TerminalShowcase />
        <Skills />
        <Education />
        <Resume />
        <Contact />
        <Footer />
      </div>
    </div>
  )
}

export default App
