import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import { FaArrowUpRightFromSquare, FaGithub } from 'react-icons/fa6'
import { PROJECT_UI } from './ProjectUIs'
import { SplitWords } from './motion/ScrollFX'
import { refreshLenis } from './SmoothScroll'

const FUSION_GH = 'https://github.com/GSujaykumar/-Oracel-Fusion-WorkSpace'
const PORTFOLIO_GH = 'https://github.com/GSujaykumar/portfolio'

const projects = [
  {
    id: 'fusion-ops',
    index: '01',
    title: 'Oracle Fusion Ops Console',
    short: 'Fusion Console',
    category: 'Fusion · Platform',
    status: 'Production',
    outcome: 'Live generate console — 1.8k proven queries, 30k–1M capacity table, mail + Daily Checker',
    github: FUSION_GH,
    summary:
      'Live Fusion Console: Excel → SQL generate with real throughput limits (1.8k proven, 100k+ OOM). Mail drop, API runner, Daily Checker — operators run this every day.',
    keywords: ['Oracle Fusion', 'Excel → SQL', 'Live generate', 'Mail drop', 'API Runner'],
  },
  {
    id: 'daily',
    index: '02',
    title: 'Daily Collection Checker',
    short: 'Teams Card',
    category: 'Ops · Teams',
    status: 'Production',
    outcome: 'One Adaptive Card / day — STATUS OK or CRITICAL into Microsoft Teams',
    github: FUSION_GH,
    summary:
      'Scheduled MySQL tally that posts the production Adaptive Card JSON (tables, SCAITS / VARNA summaries) — this preview is that file, not a mock.',
    tech: 'Spring Boot · MySQL JDBC · PowerShell · Teams Adaptive Cards 1.5',
    keywords: ['Adaptive Card', 'MySQL', 'Scheduler', 'Finance ops'],
  },
  {
    id: 'outbox',
    index: '03',
    title: 'Payments Event Platform',
    short: 'Outbox · Kafka',
    category: 'Distributed Systems',
    status: 'Case study',
    outcome: 'POST /api/v1/payments + GET /api/v1/outbox/stats · idempotency + DLQ',
    github: 'https://github.com/GSujaykumar',
    summary:
      'Real Spring Boot service in this folder: transactional outbox, Idempotency-Key, Kafka publish, PENDING / PUBLISHED / FAILED relay.',
    tech: 'Java 17 · Spring Boot · Kafka · Outbox · Idempotency · Testcontainers',
    keywords: ['Outbox', 'Idempotency-Key', 'Kafka', 'DLQ', 'SKIP LOCKED'],
  },
  {
    id: 'algolens',
    index: '04',
    title: 'AlgoLens DSA Studio',
    short: 'AlgoLens',
    category: 'Product · Visualizer',
    status: 'Shipped',
    outcome: 'Two-pointer / DP canvas · Monaco · Play / Step / Export',
    github: 'https://github.com/GSujaykumar',
    summary:
      'Interactive algorithm visualizer from this workspace — array pointers, 1D/2D DP tables, playback, and language switcher.',
    tech: 'Next.js 14 · TypeScript · Tailwind · Framer Motion · Monaco · Zustand',
    keywords: ['Two pointers', 'DP tables', 'Playback', 'Monaco'],
  },
  {
    id: 'portfolio',
    index: '05',
    title: 'This portfolio',
    short: 'Portfolio',
    category: 'Frontend',
    status: 'Production',
    outcome: 'Signal-world motion, live project UIs, custom cursor, command-free scroll',
    github: PORTFOLIO_GH,
    summary:
      'The site you are on — React + Vite, real product UIs (Fusion Console, Teams card, AlgoLens) instead of stock screenshots.',
    tech: 'React · Vite · Tailwind · Framer Motion · Three.js',
    keywords: ['React', 'Motion', 'Real UIs', 'GitHub Pages'],
  },
]

function scrollPageBy(dy) {
  const lenis = window.__lenis
  if (lenis) {
    lenis.scrollTo(window.scrollY + dy, { immediate: true })
    return
  }
  window.scrollBy(0, dy)
}

function scrollPageTo(y, smooth) {
  const lenis = window.__lenis
  if (lenis) {
    if (!smooth) {
      lenis.scrollTo(y, { immediate: true })
      return
    }
    lenis.scrollTo(y, { duration: 0.9, easing: (t) => 1 - (1 - t) ** 3 })
    return
  }
  window.scrollTo({ top: y, behavior: smooth ? 'smooth' : 'auto' })
}

export default function Projects() {
  const reduce = useReducedMotion()
  const pinRef = useRef(null)
  const stickyRef = useRef(null)
  const trackRef = useRef(null)
  const indexRef = useRef(0)
  const [index, setIndex] = useState(0)
  const count = projects.length

  useEffect(() => {
    const pin = pinRef.current
    const track = trackRef.current
    if (!pin || !track) return undefined

    let raf = 0
    const apply = () => {
      raf = 0
      const total = pin.offsetHeight - window.innerHeight
      const scrolled = Math.min(total, Math.max(0, -pin.getBoundingClientRect().top))
      const p = total > 0 ? scrolled / total : 0
      const x = p * (count - 1)
      track.style.transform = `translate3d(${-x * 100}vw, 0, 0)`
      const next = Math.round(x)
      if (next !== indexRef.current) {
        indexRef.current = next
        setIndex(next)
      }
      const pinning = p > 0.001 && p < 0.999
      document.documentElement.toggleAttribute('data-projects-pin', pinning)
    }

    const onScroll = () => {
      if (raf) return
      raf = window.requestAnimationFrame(apply)
    }

    apply()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    const id = window.setTimeout(() => refreshLenis(), 80)
    return () => {
      window.clearTimeout(id)
      if (raf) window.cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      document.documentElement.removeAttribute('data-projects-pin')
    }
  }, [count])

  useEffect(() => {
    const sticky = stickyRef.current
    const pin = pinRef.current
    if (!sticky || !pin || reduce) return undefined

    const onWheel = (e) => {
      const r = pin.getBoundingClientRect()
      const pinned = r.top <= 1 && r.bottom >= window.innerHeight - 1
      if (!pinned) return
      if (e.ctrlKey) return
      const dy = e.deltaY !== 0 ? e.deltaY : e.deltaX
      if (!dy) return
      e.preventDefault()
      scrollPageBy(dy)
    }

    sticky.addEventListener('wheel', onWheel, { passive: false })
    return () => sticky.removeEventListener('wheel', onWheel)
  }, [reduce])

  const jumpTo = (i) => {
    const pin = pinRef.current
    if (!pin) return
    const total = pin.offsetHeight - window.innerHeight
    const start = window.scrollY + pin.getBoundingClientRect().top
    const t = count <= 1 ? 0 : i / (count - 1)
    scrollPageTo(start + t * total, true)
  }

  return (
    <section
      id="work"
      ref={pinRef}
      className="projects-pin relative z-10"
      style={{ height: `${Math.max(count, 1) * 100}vh` }}
    >
      <div
        ref={stickyRef}
        className="projects-sticky flex h-[100svh] flex-col overflow-hidden bg-[color-mix(in_srgb,var(--bg)_82%,transparent)]"
      >
        <div className="flex shrink-0 items-end justify-between gap-4 px-6 pb-3 pt-20 md:px-10 md:pt-24">
          <div className="min-w-0">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--signal)]">Projects</p>
            <h2 className="mt-1 font-display text-3xl text-[var(--ink)] md:text-5xl">Selected work</h2>
            <p className="mt-1 hidden max-w-xl text-sm text-[var(--text-muted)] sm:block">
              Scroll or wheel — vertical movement still drives this lane sideways.
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--text-faint)]">
              {String(index + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
            </p>
            <div className="flex flex-wrap justify-end gap-1.5">
              {projects.map((p, i) => (
                <button
                  key={p.id}
                  type="button"
                  data-cursor="go"
                  aria-label={`Show ${p.short}`}
                  aria-current={i === index}
                  onClick={() => jumpTo(i)}
                  className={`rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em] transition ${
                    i === index
                      ? 'bg-[var(--ink)] text-[var(--bg)]'
                      : 'border border-[var(--line)] text-[var(--text-faint)] hover:border-[var(--ink)] hover:text-[var(--ink)]'
                  }`}
                >
                  {p.index} {p.short}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="relative min-h-0 flex-1 overflow-hidden">
          <div
            ref={trackRef}
            className="project-track flex h-full"
            style={{ width: `${count * 100}vw` }}
          >
            {projects.map((p, i) => {
              const UI = PROJECT_UI[p.id]
              const on = Math.abs(index - i) <= 1
              return (
                <article
                  key={p.id}
                  className={`project-slide grid h-full w-screen shrink-0 items-center gap-5 px-6 pb-8 md:px-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-10 ${
                    i === index ? 'project-slide--active' : ''
                  }`}
                >
                  <div className="min-w-0">
                    <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--signal)]">
                      {p.index} — {p.category}
                    </p>
                    <h3 className="mt-2 font-display text-3xl text-[var(--ink)] md:text-5xl">{p.title}</h3>
                    <SplitWords
                      as="p"
                      delay={0.04}
                      gap={0.018}
                      className="mt-3 max-w-xl text-[var(--text-muted)]"
                      text={p.summary}
                    />
                    {p.outcome && (
                      <p className="mt-3 border-l-2 border-[var(--signal)] pl-3 font-mono text-xs text-[var(--ink)]">
                        {p.outcome}
                      </p>
                    )}
                    <div className="mt-4 flex flex-wrap gap-2">
                      {p.keywords.map((k) => (
                        <span
                          key={k}
                          className="rounded-md border border-[var(--line)] bg-[var(--bg-elevated)] px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--text-faint)]"
                        >
                          {k}
                        </span>
                      ))}
                    </div>
                    <div className="mt-4 flex flex-wrap items-center gap-3">
                      <span
                        className={`rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] ${
                          p.status === 'Production' || p.status === 'Shipped'
                            ? 'bg-[color-mix(in_srgb,var(--signal)_16%,transparent)] text-[var(--signal)]'
                            : 'bg-[var(--bg-soft)] text-[var(--text-faint)]'
                        }`}
                      >
                        {p.status}
                      </span>
                      {p.github && (
                        <a
                          href={p.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--ink)] underline-offset-4 hover:underline"
                        >
                          <FaGithub /> GitHub
                          <FaArrowUpRightFromSquare className="text-xs" />
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="project-ui-stage min-w-0">
                    {on && UI ? (
                      <UI />
                    ) : (
                      <div className="min-h-[280px] rounded-[1.15rem] bg-[var(--bg-soft)] md:min-h-[380px]" />
                    )}
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
