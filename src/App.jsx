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
import SmoothScroll, { refreshLenis } from './components/SmoothScroll'
import ScrollExtras from './components/ScrollExtras'
import UxChrome from './components/UxChrome'
import EasterEgg from './components/EasterEgg'
import RobotGreeting from './components/RobotGreeting'
import {
  ImpactShowcase,
  HighlightGrid,
  TerminalShowcase,
  QuickDock,
} from './components/ShowcaseExtras'
import { easeOut } from './lib/motion'
import { GREET_REPLAY_EVENT, hasSeenGreeting } from './lib/greeting'

const GuideRobot = lazy(() => import('./components/GuideRobot'))
const SceneWorld = lazy(() => import('./components/SceneWorld'))

function TourGuide() {
  const reduce = useReducedMotion()
  if (reduce) return null

  return (
    <Suspense fallback={null}>
      <GuideRobot />
    </Suspense>
  )
}

function App() {
  const [booting, setBooting] = useState(true)
  const [greeting, setGreeting] = useState(() => !hasSeenGreeting())
  const playGreet = !booting && greeting
  const live = !booting && !greeting

  useEffect(() => {
    const boot = window.setTimeout(() => setBooting(false), 2200)
    const greet = window.setTimeout(() => setGreeting(false), 9000)
    return () => {
      window.clearTimeout(boot)
      window.clearTimeout(greet)
    }
  }, [])

  useEffect(() => {
    const replay = () => {
      window.scrollTo(0, 0)
      setGreeting(true)
    }
    window.addEventListener(GREET_REPLAY_EVENT, replay)
    return () => window.removeEventListener(GREET_REPLAY_EVENT, replay)
  }, [])

  return (
    <div className="relative min-h-screen bg-[var(--bg)] text-[var(--text)] selection:bg-[var(--ink)] selection:text-[var(--bg)]">
      <div className="aurora" aria-hidden="true">
        <span className="aurora__blob" />
        <span className="aurora__blob" />
        <span className="aurora__blob" />
      </div>
      <Suspense fallback={null}>
        <SceneWorld />
      </Suspense>
      <SmoothScroll />
      <AnimatePresence mode="wait">
        {booting && (
          <IntroLoader
            key="intro"
            onDone={() => {
              setBooting(false)
              requestAnimationFrame(() => refreshLenis())
            }}
          />
        )}
      </AnimatePresence>
      <ScrollProgress />
      <CustomCursor />
      <CommandPalette />
      {playGreet && (
        <RobotGreeting
          onDone={() => {
            setGreeting(false)
            requestAnimationFrame(() => refreshLenis())
          }}
        />
      )}
      {live && <UxChrome />}
      {live && <ScrollExtras />}
      {live && <QuickDock />}
      {live && <EasterEgg />}
      {live && <TourGuide />}

      <Navbar />

      <motion.div
        className="relative z-10"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: easeOut }}
      >
        <div className="world-stage">
          <Hero />
        </div>
      </motion.div>

      {/* Keep Projects out of any CSS transform (sticky pin). Always mount so #work exists. */}
      <Projects />

      {/* z-20 so Skills / Resume / Contact paint above a leftover Projects pin */}
      <div className="relative z-20 bg-[color-mix(in_srgb,var(--bg)_78%,transparent)]">
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
