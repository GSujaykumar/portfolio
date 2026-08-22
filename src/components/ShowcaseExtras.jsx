import { useEffect, useRef, useState } from 'react'
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
} from 'framer-motion'
import {
  FaBolt,
  FaClock,
  FaDatabase,
  FaShieldHalved,
  FaShareNodes,
  FaCheck,
  FaTerminal,
  FaGithub,
  FaLinkedin,
  FaEnvelope,
  FaFilePdf,
} from 'react-icons/fa6'
import { SectionTitle, Reveal, Stagger, StaggerItem } from './motion/Reveal'
import { ClipReveal, ScrollFade } from './motion/ScrollFX'
import { AnimatedCounter } from './WowExtras'
import { toast } from './UxChrome'
import { easeOut, springStamp, springSoft } from '../lib/motion'
import Magnetic from './motion/Magnetic'

const METRICS = [
  { value: 2, suffix: '+', label: 'Years shipping backend' },
  { value: 6, suffix: '', label: 'Production systems owned' },
  { value: 25, suffix: '%', label: 'Query time improved' },
  { value: 1, suffix: '', label: 'Daily Teams health check' },
]

const HIGHLIGHTS = [
  {
    icon: FaBolt,
    title: 'APIs that stay up',
    body: 'JWT-secured Spring Boot services with Docker · Jenkins releases and Zipkin traces when something breaks.',
  },
  {
    icon: FaDatabase,
    title: 'Data that moves money',
    body: 'Oracle Fusion Segment / GL / remarks pipelines — Excel in, SQL & uploads out, operators in control.',
  },
  {
    icon: FaShieldHalved,
    title: 'Resilience by default',
    body: 'Outbox + Kafka, circuit breakers, retries, DLQ thinking — so integrations fail loud, not silent.',
  },
  {
    icon: FaTerminal,
    title: 'Ops you can run',
    body: 'Mail bridges, launchers, live Fusion Console — automation that finance teams actually use.',
  },
]

function SpotlightCard({ children, className = '' }) {
  const ref = useRef(null)
  const mx = useMotionValue(50)
  const my = useMotionValue(50)
  const background = useMotionTemplate`radial-gradient(520px circle at ${mx}% ${my}%, color-mix(in srgb, var(--signal) 18%, transparent), transparent 55%)`

  return (
    <motion.div
      ref={ref}
      onPointerMove={(e) => {
        const r = ref.current?.getBoundingClientRect()
        if (!r) return
        mx.set(((e.clientX - r.left) / r.width) * 100)
        my.set(((e.clientY - r.top) / r.height) * 100)
      }}
      whileHover={{ y: -6 }}
      transition={springStamp}
      className={`spotlight-card group relative overflow-hidden ${className}`}
    >
      <motion.div
        aria-hidden
        style={{ background }}
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />
      <div className="relative z-[1]">{children}</div>
    </motion.div>
  )
}

function LiveClock() {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const time = new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  }).format(now)

  const hour = Number(
    new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Kolkata',
      hour: 'numeric',
      hour12: false,
    }).format(now)
  )
  const open = hour >= 9 && hour < 21

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span
        className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] ${
          open
            ? 'bg-[color-mix(in_srgb,var(--signal)_16%,transparent)] text-[var(--signal)]'
            : 'bg-[var(--bg-soft)] text-[var(--text-faint)]'
        }`}
      >
        <span className={`h-1.5 w-1.5 rounded-full ${open ? 'bg-[var(--signal)]' : 'bg-[var(--text-faint)]'}`} />
        {open ? 'Usually available' : 'Offline hours · IST'}
      </span>
      <span className="inline-flex items-center gap-2 font-mono text-xs text-[var(--text-muted)]">
        <FaClock className="text-[var(--signal)]" />
        {time} IST
      </span>
    </div>
  )
}

const TERM_LINES = [
  { t: 'cmd', v: 'sujay --whoami' },
  { t: 'out', v: 'Backend Java · Spring Boot · Oracle Fusion @ Varsity' },
  { t: 'cmd', v: 'sujay --stack' },
  { t: 'out', v: 'Java 17 · JWT · MySQL · Oracle DB · Docker · Jenkins · Kafka' },
  { t: 'cmd', v: 'sujay --shipped' },
  { t: 'out', v: 'Fusion Console · Teams Adaptive Card · Payments Outbox · AlgoLens' },
  { t: 'cmd', v: 'sujay --hire' },
  { t: 'out', v: 'Open to work · Hyderabad · Remote-friendly ✓' },
]

function DevTerminal() {
  const reduce = useReducedMotion()
  const [step, setStep] = useState(0)
  const [typed, setTyped] = useState('')
  const [running, setRunning] = useState(true)

  useEffect(() => {
    if (!running || reduce) {
      if (reduce) {
        setStep(TERM_LINES.length)
        setTyped(TERM_LINES[TERM_LINES.length - 1]?.v || '')
      }
      return undefined
    }
    if (step >= TERM_LINES.length) return undefined

    const line = TERM_LINES[step]
    if (typed.length < line.v.length) {
      const id = setTimeout(() => setTyped(line.v.slice(0, typed.length + 1)), line.t === 'cmd' ? 28 : 12)
      return () => clearTimeout(id)
    }
    const id = setTimeout(() => {
      setStep((s) => s + 1)
      setTyped('')
    }, line.t === 'cmd' ? 420 : 700)
    return () => clearTimeout(id)
  }, [step, typed, running, reduce])

  const replay = () => {
    setRunning(true)
    setStep(0)
    setTyped('')
  }

  const visible = TERM_LINES.slice(0, step).concat(
    step < TERM_LINES.length ? [{ ...TERM_LINES[step], v: typed }] : []
  )

  return (
    <div className="terminal-panel overflow-hidden rounded-2xl border border-[var(--line)] bg-[#0a1210] shadow-[var(--panel-shadow)]">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5a36]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#f5c542]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#00b894]" />
          <span className="ml-3 font-mono text-[10px] uppercase tracking-[0.18em] text-white/45">
            sujay@portfolio — zsh
          </span>
        </div>
        <button
          type="button"
          data-cursor="go"
          onClick={replay}
          className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--signal)] hover:underline"
        >
          Replay
        </button>
      </div>
      <div className="min-h-[220px] space-y-2 p-5 font-mono text-[12px] leading-relaxed text-[#c8ffe8] md:text-[13px]">
        {visible.map((line, i) => (
          <p key={`${line.t}-${i}`} className={line.t === 'cmd' ? 'text-[var(--signal)]' : 'text-white/75'}>
            {line.t === 'cmd' ? (
              <>
                <span className="text-white/40">➜</span> {line.v}
                {i === visible.length - 1 && step < TERM_LINES.length && (
                  <span className="ml-0.5 inline-block h-[1em] w-[7px] translate-y-[2px] animate-pulse bg-[var(--signal)]" />
                )}
              </>
            ) : (
              line.v
            )}
          </p>
        ))}
        {step >= TERM_LINES.length && (
          <p className="pt-2 text-white/40">
            <span className="text-[var(--signal)]">➜</span> _
          </p>
        )}
      </div>
    </div>
  )
}

export function ImpactShowcase() {
  return (
    <section id="impact" className="py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionTitle label="Impact" title="Numbers that matter." />
          <LiveClock />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {METRICS.map((m, i) => (
            <ClipReveal key={m.label} delay={i * 0.07} from={i % 2 ? 'top' : 'bottom'}>
              <motion.div
                whileHover={{ y: -8, scale: 1.02 }}
                transition={springStamp}
                className="soft-panel p-6"
              >
                <p className="font-display text-4xl text-[var(--ink)] md:text-5xl">
                  <AnimatedCounter value={m.value} suffix={m.suffix} />
                </p>
                <p className="mt-2 text-sm text-[var(--text-muted)]">{m.label}</p>
              </motion.div>
            </ClipReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export function HighlightGrid() {
  return (
    <section id="highlights" className="pb-8 pt-4 md:pb-12">
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <div className="mb-10 max-w-2xl">
          <SectionTitle
            label="Signature"
            title="What I actually ship."
            subtitle="Not buzzwords — production systems operators and services rely on."
          />
        </div>
        <Stagger className="grid gap-4 md:grid-cols-2" gap={0.1}>
          {HIGHLIGHTS.map((h, i) => {
            const Icon = h.icon
            return (
              <StaggerItem key={h.title} variant="fade">
                <ClipReveal delay={i * 0.08} from={i % 2 ? 'right' : 'left'}>
                  <SpotlightCard className="group soft-panel h-full p-6 md:p-7">
                    <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-[color-mix(in_srgb,var(--signal)_14%,transparent)] text-[var(--signal)]">
                      <Icon />
                    </div>
                    <h3 className="font-display text-xl text-[var(--ink)] md:text-2xl">{h.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted)] md:text-base">
                      {h.body}
                    </p>
                  </SpotlightCard>
                </ClipReveal>
              </StaggerItem>
            )
          })}
        </Stagger>
      </div>
    </section>
  )
}

export function TerminalShowcase() {
  return (
    <section id="terminal" className="py-16 md:py-24">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 md:px-10 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <SectionTitle
            label="Live demo"
            title="Meet the CLI."
            subtitle="A tiny interactive terminal — who I am, what I ship, how to reach me."
          />
          <Magnetic className="mt-8 inline-block">
            <a
              href="mailto:sujaykumargaddam18@gmail.com?subject=Opportunity%20-%20Sujay%20Kumar"
              data-cursor="mail"
              className="inline-flex items-center gap-2 rounded-full bg-[var(--ink)] px-6 py-3 text-sm font-bold text-[var(--bg)]"
            >
              Start a conversation
            </a>
          </Magnetic>
        </div>
        <div className="lg:col-span-7">
          <ScrollFade>
            <Reveal variant="fade">
              <DevTerminal />
            </Reveal>
          </ScrollFade>
        </div>
      </div>
    </section>
  )
}

export function SharePortfolio() {
  const [copied, setCopied] = useState(false)

  const share = async () => {
    const url = window.location.href
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Sujay Kumar — Backend Java',
          text: 'Backend Java · Spring Boot · Oracle Fusion portfolio',
          url,
        })
        return
      }
    } catch {
      /* user cancelled */
    }
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      toast('Portfolio link copied')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast('Copy failed')
    }
  }

  return (
    <motion.button
      type="button"
      data-cursor="go"
      onClick={share}
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.96 }}
      transition={springSoft}
      className="pointer-events-auto inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--bg-elevated)] px-3 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--ink)] shadow-sm"
      aria-label="Share portfolio"
    >
      {copied ? <FaCheck className="text-[var(--signal)]" /> : <FaShareNodes />}
      {copied ? 'Copied' : 'Share'}
    </motion.button>
  )
}

export function QuickDock() {
  const reduce = useReducedMotion()
  const [hovered, setHovered] = useState(null)
  const links = [
    {
      id: 'resume',
      href: '/Sujay-Kumar-Resume.pdf',
      label: 'Resume',
      download: 'Sujay-Kumar-Resume.pdf',
      icon: FaFilePdf,
      fill: '#F40F02',
    },
    {
      id: 'github',
      href: 'https://github.com/GSujaykumar',
      label: 'GitHub',
      icon: FaGithub,
      fill: '#24292F',
      rest: 'var(--ink)',
    },
    {
      id: 'linkedin',
      href: 'https://www.linkedin.com/in/sujaykumar-gaddam-a660693a0/',
      label: 'LinkedIn',
      icon: FaLinkedin,
      fill: '#0A66C2',
    },
    {
      id: 'email',
      href: 'mailto:sujaykumargaddam18@gmail.com',
      label: 'Email',
      icon: FaEnvelope,
      fill: '#EA4335',
    },
  ]

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, x: 28 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1.05, duration: 0.5, ease: easeOut }}
      className="social-dock fixed right-3 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-end gap-3 lg:flex"
    >
      {links.map((l, i) => {
        const Icon = l.icon
        const open = hovered === l.id
        return (
          <Magnetic key={l.id} strength={0.28}>
            <div
              className="social-dock__item"
              style={{ animationDelay: `${i * 0.2}s` }}
              onPointerEnter={() => setHovered(l.id)}
              onPointerLeave={() => setHovered(null)}
            >
              <motion.div
                initial={reduce ? false : { opacity: 0, x: 22, scale: 0.8 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ delay: 1.1 + i * 0.09, ...(reduce ? { duration: 0.3 } : springStamp) }}
              >
              <motion.a
                href={l.href}
                download={l.download}
                target={l.href.startsWith('http') ? '_blank' : undefined}
                rel={l.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                data-cursor="go"
                aria-label={l.label}
                className={`social-dock__btn relative flex h-12 rounded-full border ${open ? 'is-open' : ''}`}
                style={{ '--dock-fill': l.fill, originX: 1, originY: 0.5 }}
                data-brand={l.id}
                animate={
                  reduce
                    ? {
                        width: open ? 148 : 48,
                        backgroundColor: open
                          ? l.fill
                          : 'color-mix(in srgb, var(--dock-fill) 18%, var(--bg-elevated))',
                        color: open ? '#ffffff' : l.rest || l.fill,
                        borderColor: open
                          ? l.fill
                          : 'color-mix(in srgb, var(--dock-fill) 58%, var(--line))',
                      }
                    : {
                        width: open ? 156 : 48,
                        scale: open ? 1.18 : 1,
                        backgroundColor: open
                          ? l.fill
                          : 'color-mix(in srgb, var(--dock-fill) 18%, var(--bg-elevated))',
                        color: open ? '#ffffff' : l.rest || l.fill,
                        borderColor: open
                          ? l.fill
                          : 'color-mix(in srgb, var(--dock-fill) 58%, var(--line))',
                        boxShadow: open
                          ? `0 0 0 4px color-mix(in srgb, ${l.fill} 22%, transparent), 0 16px 36px color-mix(in srgb, ${l.fill} 48%, transparent)`
                          : `0 8px 20px color-mix(in srgb, ${l.fill} 18%, transparent)`,
                      }
                }
                transition={reduce ? { duration: 0.2 } : springStamp}
                onFocus={() => setHovered(l.id)}
                onBlur={() => setHovered(null)}
                whileTap={reduce ? undefined : { scale: 0.94 }}
              >
                <span className="social-dock__clip relative z-[1] flex h-12 w-full overflow-hidden rounded-full">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center">
                    <motion.span
                      animate={
                        reduce
                          ? { scale: 1, rotate: 0 }
                          : open
                            ? { rotate: [0, -18, 14, -6, 0], scale: [1, 1.28, 1.12] }
                            : { rotate: 0, scale: 1 }
                      }
                      transition={{ duration: 0.55, ease: 'easeInOut' }}
                      className="grid place-items-center text-[1.15rem]"
                    >
                      <Icon />
                    </motion.span>
                  </span>
                  <span
                    className={`flex items-center whitespace-nowrap pr-4 text-[11px] font-bold uppercase tracking-[0.14em] transition-opacity duration-200 ${
                      open ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    {l.label}
                  </span>
                </span>
                <span aria-hidden className="social-dock__shine" />
              </motion.a>
              </motion.div>
            </div>
          </Magnetic>
        )
      })}
    </motion.div>
  )
}
