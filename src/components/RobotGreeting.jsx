import { lazy, Suspense, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { FaVolumeHigh, FaVolumeXmark, FaXmark } from 'react-icons/fa6'
import { easeOut, springCrazy, springStamp } from '../lib/motion'
import {
  BLUR_HOLD_MS,
  EXIT_MS,
  UNVEIL_MS,
  getVisitMoment,
  isGreetingSoundOn,
  markGreetingSeen,
  setGreetingSound,
  speakWish,
  stopWishSpeech,
} from '../lib/greeting'
import { DayMeter } from './VisitClock'
import { lockPageScroll, unlockPageScroll } from './SmoothScroll'

const RobotExpressive = lazy(() => import('./RobotExpressive'))

const WISH_LINES = {
  morning: "Hope the day's treating you well — come see what Sujay's been shipping.",
  afternoon: "Perfect time to browse the work. I'll keep this short.",
  evening: "Pull up a seat — I'll walk you through the portfolio.",
}

function useTypedText(text, enabled) {
  const [out, setOut] = useState(enabled ? '' : text)

  useEffect(() => {
    if (!enabled) {
      setOut(text)
      return undefined
    }
    setOut('')
    let i = 0
    const id = window.setInterval(() => {
      i += 1
      setOut(text.slice(0, i))
      if (i >= text.length) window.clearInterval(id)
    }, 22)
    return () => window.clearInterval(id)
  }, [text, enabled])

  return out
}

function GreetingParticles() {
  const reduce = useReducedMotion()
  if (reduce) return null

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: 22 }).map((_, i) => (
        <span
          key={i}
          className={`greeting-particle ${i % 3 === 0 ? 'greeting-particle--hot' : ''}`}
          style={{
            left: `${(i * 37) % 100}%`,
            animationDelay: `${(i % 7) * 0.28}s`,
            animationDuration: `${4.2 + (i % 5) * 0.55}s`,
            width: i % 4 === 0 ? 7 : i % 3 === 0 ? 4 : 3,
            height: i % 4 === 0 ? 7 : i % 3 === 0 ? 4 : 3,
          }}
        />
      ))}
    </div>
  )
}

function TalkingDots() {
  return (
    <span className="ml-2 inline-flex items-end gap-0.5" aria-hidden>
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="h-1.5 w-1.5 rounded-full bg-[var(--signal)]"
          animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.12, ease: 'easeInOut' }}
        />
      ))}
    </span>
  )
}

export default function RobotGreeting({ onDone }) {
  const reduce = useReducedMotion()
  const moment = useRef(getVisitMoment()).current
  const apiRef = useRef(null)
  const doneRef = useRef(false)
  const onDoneRef = useRef(onDone)
  onDoneRef.current = onDone
  const [phase, setPhase] = useState(reduce ? 'unveil' : 'enter')
  const [soundOn, setSoundOn] = useState(false)
  const headline = moment.greeting
  const sub = WISH_LINES[moment.period]
  const typed = useTypedText(headline, !reduce && (phase === 'enter' || phase === 'wish'))

  const finish = useCallback(() => {
    if (doneRef.current) return
    doneRef.current = true
    stopWishSpeech()
    markGreetingSeen()
    unlockPageScroll()
    onDoneRef.current?.()
  }, [])

  const beginUnveil = useCallback(() => {
    setPhase((p) => (p === 'exit' || p === 'done' ? p : 'unveil'))
  }, [])

  const skip = useCallback(() => {
    setPhase((p) => (p === 'done' ? p : 'exit'))
  }, [])

  const playWish = useCallback(
    (api) => {
      if (!api) return
      api.wave?.() || api.playEmote?.('Wave')
      api.setExpression?.('Surprised')
      window.setTimeout(() => api.playEmote?.('Yes'), 800)
      window.setTimeout(() => api.playEmote?.('Wave'), 1700)
      window.setTimeout(() => {
        api.playEmote?.('ThumbsUp')
        api.setExpression?.(null)
      }, 2600)
    },
    []
  )

  const onReady = useCallback(
    (api) => {
      apiRef.current = api
      if (!reduce) playWish(api)
    },
    [playWish, reduce]
  )

  const toggleSound = () => {
    const next = !soundOn
    setSoundOn(next)
    setGreetingSound(next)
    if (next) {
      speakWish(`${headline}. ${sub}`)
      apiRef.current?.playEmote?.('Wave')
    } else {
      stopWishSpeech()
    }
  }

  const onRobotTap = () => {
    playWish(apiRef.current)
    if (soundOn) speakWish(`${headline}. ${sub}`)
  }

  useEffect(() => {
    setSoundOn(isGreetingSoundOn())
  }, [])

  useLayoutEffect(() => {
    document.documentElement.setAttribute('data-greeting', phase)
  }, [phase])

  useEffect(() => {
    lockPageScroll()
    const failsafe = window.setTimeout(finish, 6500)
    return () => {
      window.clearTimeout(failsafe)
      unlockPageScroll()
      document.documentElement.removeAttribute('data-greeting')
      stopWishSpeech()
    }
  }, [finish])

  useEffect(() => {
    if (reduce) {
      const t = window.setTimeout(finish, 900)
      return () => window.clearTimeout(t)
    }

    const timers = []
    if (phase === 'enter') {
      timers.push(window.setTimeout(() => setPhase('wish'), 480))
    }
    if (phase === 'wish') {
      timers.push(window.setTimeout(beginUnveil, BLUR_HOLD_MS))
    }
    if (phase === 'unveil') {
      timers.push(window.setTimeout(() => setPhase('exit'), UNVEIL_MS))
    }
    if (phase === 'exit') {
      timers.push(window.setTimeout(finish, EXIT_MS))
    }
    return () => timers.forEach((id) => window.clearTimeout(id))
  }, [phase, reduce, beginUnveil, finish])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        skip()
        return
      }
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        beginUnveil()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [beginUnveil, skip])

  const leaving = phase === 'unveil' || phase === 'exit'

  return (
    <AnimatePresence>
      {phase !== 'done' && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="robot-greeting-title"
          className={`greeting-overlay fixed inset-0 z-[90] flex flex-col items-center justify-center overflow-hidden ${
            leaving ? 'greeting-overlay--clear pointer-events-none' : 'greeting-overlay--veiled'
          }`}
          initial={{ opacity: 1 }}
          animate={{ opacity: phase === 'exit' ? 0 : 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: EXIT_MS / 1000, ease: easeOut }}
        >
          {!leaving && (
            <motion.div
              aria-hidden
              className="absolute inset-x-0 top-0 z-20 h-[3px] origin-left bg-[var(--signal)]"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: (480 + BLUR_HOLD_MS) / 1000, ease: 'linear' }}
            />
          )}

          <GreetingParticles />

          <div className="relative z-10 flex w-full max-w-5xl flex-col items-center px-4 pt-8 sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.94 }}
              animate={{ opacity: leaving ? 0 : 1, y: leaving ? -12 : 0, scale: 1 }}
              transition={springStamp}
              className="mb-2 rounded-full border border-[var(--line)] bg-[var(--bg-elevated)]/90 px-3 py-1 font-mono text-[9px] font-bold uppercase tracking-[0.22em] text-[var(--text-faint)] backdrop-blur-md"
            >
              Guide · {moment.period}
            </motion.div>

            <div className="greeting-robot relative">
              <motion.div
                className="greeting-robot__stage"
                initial={{ opacity: 0, scale: 0.35, y: 80, rotate: -8 }}
                animate={{
                  opacity: 1,
                  scale: leaving ? 0.72 : phase === 'wish' ? [1, 1.035, 1] : 1,
                  y: leaving ? 40 : 0,
                  rotate: 0,
                  x: leaving ? '18%' : 0,
                }}
                transition={
                  leaving
                    ? { duration: 0.7, ease: easeOut }
                    : phase === 'wish'
                      ? { scale: { duration: 1.8, repeat: Infinity, ease: 'easeInOut' }, ...springCrazy }
                      : springCrazy
                }
              >
                <Suspense
                  fallback={
                    <div className="flex h-full w-full items-center justify-center">
                      <span className="h-12 w-12 animate-spin rounded-full border-2 border-[var(--line)] border-t-[var(--signal)]" />
                    </div>
                  }
                >
                  {!reduce && (
                    <RobotExpressive className="h-full w-full" onReady={onReady} onClick={onRobotTap} />
                  )}
                </Suspense>
              </motion.div>

              <AnimatePresence>
                {!leaving && (
                  <motion.div
                    initial={{ opacity: 0, y: 24, scale: 0.86 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.94 }}
                    transition={springStamp}
                    className="greeting-bubble pointer-events-none absolute left-1/2 top-[6%] z-20 w-[min(420px,88vw)] -translate-x-1/2 sm:top-[4%]"
                  >
                    <div className="rounded-2xl bg-gradient-to-br from-[var(--ink)] via-[var(--ink)]/50 to-[var(--signal)]/30 p-[1.5px] shadow-[0_22px_60px_-16px_rgba(0,0,0,0.45)]">
                      <div className="rounded-[calc(1rem-1.5px)] bg-[var(--bg-elevated)]/96 px-5 py-4 backdrop-blur-xl">
                        <p
                          id="robot-greeting-title"
                          aria-live="polite"
                          className="font-display text-[clamp(1.7rem,5vw,2.6rem)] font-extrabold leading-[0.95] tracking-tight text-[var(--ink)]"
                        >
                          {typed}
                          {typed.length < headline.length && (
                            <motion.span
                              className="ml-0.5 inline-block h-[0.85em] w-[3px] translate-y-[2px] bg-[var(--signal)]"
                              animate={{ opacity: [1, 0, 1] }}
                              transition={{ duration: 0.65, repeat: Infinity }}
                            />
                          )}
                          {typed.length >= headline.length && <TalkingDots />}
                        </p>
                        <p className="mt-2 text-sm font-medium text-[var(--text-muted)]">{sub}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: leaving ? 0 : 1, y: 0 }}
              transition={{ delay: 0.25, ...springStamp }}
              className="mt-2 flex flex-wrap items-center justify-center gap-4"
            >
              <div className="rounded-2xl border border-[var(--line)] bg-[var(--bg-elevated)]/92 px-4 py-3 shadow-sm backdrop-blur-md">
                <p className="font-mono text-[8px] font-bold uppercase tracking-[0.2em] text-[var(--text-faint)]">
                  Your local time
                </p>
                <p className="font-display text-2xl font-bold tabular-nums text-[var(--ink)]">{moment.timeLabel}</p>
              </div>
              <div className="rounded-2xl border border-[var(--line)] bg-[var(--bg-elevated)]/92 px-4 py-3 shadow-sm backdrop-blur-md">
                <DayMeter elapsed={moment.dayElapsed} />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: leaving ? 0 : 1 }}
              className="mt-5 flex flex-wrap items-center justify-center gap-2"
            >
              <button
                type="button"
                data-cursor="go"
                onClick={toggleSound}
                className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--bg-elevated)] px-3.5 py-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--ink)]"
              >
                {soundOn ? <FaVolumeHigh /> : <FaVolumeXmark />}
                {soundOn ? 'Sound on' : 'Sound off'}
              </button>
              <button
                type="button"
                data-cursor="go"
                onClick={skip}
                className="inline-flex items-center gap-2 rounded-full border-2 border-[var(--ink)] bg-[var(--ink)] px-3.5 py-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--bg)]"
              >
                <FaXmark />
                Skip · Esc
              </button>
            </motion.div>

            <p className="mt-3 font-mono text-[8px] uppercase tracking-[0.16em] text-[var(--text-faint)]">
              Click the robot to hear it wish you again
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
