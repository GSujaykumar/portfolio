import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion'
import { springStamp, easeOut } from '../lib/motion'

const ScrollProgress = () => {
  return (
    <div
      role="progressbar"
      aria-label="Page scroll progress"
      className="scroll-progress-bar pointer-events-none fixed left-0 top-0 z-[10000] h-[3px] w-full origin-left"
    />
  )
}

export const IntroLoader = ({ onDone }) => {
  const reduce = useReducedMotion()
  const [count, setCount] = useState(0)
  const [phase, setPhase] = useState('count') // count | slam | done
  const doneRef = useRef(false)
  const onDoneRef = useRef(onDone)
  onDoneRef.current = onDone

  const finish = () => {
    if (doneRef.current) return
    doneRef.current = true
    setPhase('slam')
    setTimeout(() => onDoneRef.current?.(), reduce ? 80 : 400)
  }

  useEffect(() => {
    const failsafe = setTimeout(finish, 1800)
    if (reduce) {
      const t = setTimeout(finish, 120)
      return () => {
        clearTimeout(t)
        clearTimeout(failsafe)
      }
    }

    let n = 0
    const id = setInterval(() => {
      n += Math.floor(Math.random() * 14) + 8
      if (n >= 100) {
        n = 100
        clearInterval(id)
        setCount(100)
        setTimeout(finish, 80)
        return
      }
      setCount(n)
    }, 28)

    const onKey = (e) => {
      if (e.key === 'Enter' || e.key === 'Escape' || e.key === ' ') {
        e.preventDefault()
        clearInterval(id)
        setCount(100)
        finish()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      clearInterval(id)
      clearTimeout(failsafe)
      window.removeEventListener('keydown', onKey)
    }
  }, [reduce])

  return (
    <AnimatePresence>
      {phase !== 'done' && (
        <motion.div
          className="fixed inset-0 z-[10001] flex flex-col items-center justify-center overflow-hidden bg-[var(--ink)] text-[var(--bg)]"
          initial={{ opacity: 1 }}
          animate={
            phase === 'slam'
              ? { y: '-110%', transition: { duration: 0.55, ease: easeOut } }
              : { opacity: 1 }
          }
          onAnimationComplete={() => {
            if (phase === 'slam') setPhase('done')
          }}
        >
          <motion.div
            aria-hidden
            className="absolute inset-x-0 top-0 h-1 origin-left bg-[var(--bg)]"
            animate={{ scaleX: count / 100 }}
            transition={{ duration: 0.08 }}
          />

          <motion.p
            key={count}
            initial={{ scale: 1.4, opacity: 0.5 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={springStamp}
            className="font-display text-7xl tabular-nums tracking-tight md:text-[9rem]"
          >
            {String(count).padStart(3, '0')}
          </motion.p>

          <motion.p
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.12, ...springStamp }}
            className="mt-4 font-display text-2xl uppercase tracking-tight text-[var(--bg)]/80 md:text-3xl"
          >
            {'{ SUJAY }'}
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="mt-3 text-[10px] font-bold uppercase tracking-[0.4em] text-[var(--bg)]/45"
          >
            Portfolio
          </motion.p>

          <button
            type="button"
            onClick={finish}
            className="absolute bottom-8 rounded-full border border-white/30 px-5 py-2 text-xs font-semibold uppercase tracking-wider text-white/80 transition hover:bg-white/10 hover:text-white"
          >
            Skip · Enter
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default ScrollProgress
