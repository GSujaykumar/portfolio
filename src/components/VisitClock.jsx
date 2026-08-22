import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FaRotateRight } from 'react-icons/fa6'
import { easeOut } from '../lib/motion'
import { getVisitMoment, requestGreetingReplay } from '../lib/greeting'

export function useClock() {
  const [moment, setMoment] = useState(() => getVisitMoment())

  useEffect(() => {
    const id = window.setInterval(() => setMoment(getVisitMoment()), 1000)
    return () => window.clearInterval(id)
  }, [])

  return moment
}

export function DayMeter({ elapsed, compact = false }) {
  const r = compact ? 16 : 22
  const c = 2 * Math.PI * r
  const dash = (elapsed / 100) * c

  return (
    <div className="flex items-center gap-3">
      <svg
        width={compact ? 42 : 56}
        height={compact ? 42 : 56}
        viewBox="0 0 56 56"
        className="-rotate-90"
        aria-hidden
      >
        <circle cx="28" cy="28" r={r} fill="none" stroke="var(--line)" strokeWidth="4" />
        <motion.circle
          cx="28"
          cy="28"
          r={r}
          fill="none"
          stroke="var(--signal)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${c}`}
          initial={{ strokeDasharray: `0 ${c}` }}
          animate={{ strokeDasharray: `${dash} ${c}` }}
          transition={{ duration: 0.8, ease: easeOut }}
        />
      </svg>
      <div className="min-w-0 text-left">
        <p
          className={`font-display font-bold tabular-nums leading-none text-[var(--ink)] ${
            compact ? 'text-lg' : 'text-2xl'
          }`}
        >
          {elapsed}%
        </p>
        <p className="mt-0.5 font-mono text-[8px] font-bold uppercase tracking-[0.16em] text-[var(--text-faint)]">
          of day elapsed
        </p>
      </div>
    </div>
  )
}

export function VisitClock({ className = '' }) {
  const moment = useClock()

  return (
    <div
      className={`visit-clock inline-flex flex-wrap items-center gap-3 rounded-2xl border border-[var(--line)] bg-[var(--bg-elevated)]/90 px-3.5 py-2.5 shadow-sm backdrop-blur-md ${className}`}
    >
      <div>
        <p className="font-mono text-[8px] font-bold uppercase tracking-[0.2em] text-[var(--text-faint)]">
          Local time
        </p>
        <p className="font-display text-lg font-bold tabular-nums leading-none text-[var(--ink)]">
          {moment.timeLabel}
        </p>
      </div>
      <span className="h-8 w-px bg-[var(--line)]" aria-hidden />
      <DayMeter elapsed={moment.dayElapsed} compact />
      <button
        type="button"
        data-cursor="go"
        onClick={requestGreetingReplay}
        aria-label="Replay robot greeting"
        title="Replay greeting"
        className="ml-0.5 inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--line)] text-[var(--ink)] transition hover:border-[var(--ink)] hover:bg-[var(--ink)] hover:text-[var(--bg)]"
      >
        <FaRotateRight className="text-xs" />
      </button>
    </div>
  )
}
