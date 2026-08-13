import { useEffect, useRef, useState } from 'react'
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
  useReducedMotion,
} from 'framer-motion'
import { FaArrowUpRightFromSquare, FaGithub } from 'react-icons/fa6'
import { PROJECT_UI } from './ProjectUIs'
import { easeOut } from '../lib/motion'

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
    outcome: 'Live operator console — modules, mail, SQL, API runner, Daily Checker',
    github: FUSION_GH,
    summary:
      'The real Fusion Console from this workspace: drop Excel → SQL / upload, mail history, API presets, and launchers operators run every day.',
    tech: 'React · Vite · Java 17 · Spring Boot · Oracle DB · PowerShell',
    keywords: ['Oracle Fusion', 'Excel → SQL', 'Mail drop', 'API Runner', 'Live console'],
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

function ProjectSlide({ project, scrollProgress, index, total, active }) {
  const UI = PROJECT_UI[project.id]
  const start = index / Math.max(1, total - 1)
  const prev = Math.max(0, start - 0.22)
  const next = Math.min(1, start + 0.22)

  const scale = useTransform(scrollProgress, [prev, start, next], [0.88, 1, 0.88])
  const rotateY = useTransform(scrollProgress, [prev, start, next], [14, 0, -14])
  const opacity = useTransform(scrollProgress, [prev, start, next], [0.35, 1, 0.35])
  const y = useTransform(scrollProgress, [prev, start, next], [36, 0, 36])
  const blur = useTransform(scrollProgress, [prev, start, next], [6, 0, 6])
  const filter = useTransform(blur, (b) => `blur(${b}px)`)

  return (
    <motion.article
      style={{ scale, rotateY, opacity, y, filter, transformPerspective: 1600 }}
      className={`project-slide relative flex w-[min(100vw,1080px)] shrink-0 items-center px-4 md:px-8 ${
        active ? 'project-slide--active' : ''
      }`}
      aria-current={active ? 'true' : undefined}
    >
      <div className="grid w-full items-center gap-5 lg:grid-cols-[0.95fr_1.05fr] lg:gap-8">
        <div className="order-2 lg:order-1">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--signal)]">
            {project.index} — {project.category}
          </p>
          <h3 className="mt-3 font-display text-[clamp(1.9rem,4.6vw,3.3rem)] leading-[0.92] text-[var(--ink)]">
            {project.title}
          </h3>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-[var(--text-muted)] md:text-base">
            {project.summary}
          </p>
          {project.outcome && (
            <p className="mt-3 max-w-xl border-l-2 border-[var(--signal)] pl-3 font-mono text-[11px] leading-relaxed text-[var(--ink)] md:text-xs">
              {project.outcome}
            </p>
          )}
          <p className="mt-4 font-mono text-[11px] leading-relaxed text-[var(--text-faint)]">{project.tech}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {project.keywords.map((k) => (
              <span
                key={k}
                className="rounded-md border border-[var(--line)] bg-[var(--bg-elevated)] px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--text-faint)]"
              >
                {k}
              </span>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span
              className={`rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] ${
                project.status === 'Production' || project.status === 'Shipped'
                  ? 'bg-[color-mix(in_srgb,var(--signal)_16%,transparent)] text-[var(--signal)]'
                  : 'bg-[var(--bg-soft)] text-[var(--text-faint)]'
              }`}
            >
              {project.status}
            </span>
            {project.github ? (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="go"
                className="inline-flex items-center gap-2 rounded-full border border-[var(--ink)] bg-[var(--ink)] px-4 py-2 text-sm font-semibold text-[var(--bg)]"
              >
                <FaGithub />
                GitHub
                <FaArrowUpRightFromSquare className="text-xs" />
              </a>
            ) : (
              <span className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--bg-elevated)] px-4 py-2 text-sm font-semibold text-[var(--text-faint)]">
                Private · architecture notes
              </span>
            )}
          </div>
        </div>

        <motion.div className="project-ui-stage order-1 lg:order-2">
          {UI ? <UI /> : null}
        </motion.div>
      </div>
    </motion.article>
  )
}

function StackedProjects() {
  return (
    <section id="work" className="relative z-10 bg-[var(--bg)] py-24 md:py-32">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 md:px-10">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--signal)]">Projects</p>
          <h2 className="mt-2 font-display text-4xl text-[var(--ink)] md:text-6xl">Selected work</h2>
          <p className="mt-3 max-w-xl text-[var(--text-muted)]">
            Production Fusion Console, Teams Adaptive Card, payments outbox, AlgoLens, and this site.
          </p>
        </div>
        {projects.map((p) => {
          const UI = PROJECT_UI[p.id]
          return (
            <article
              key={p.id}
              className="grid items-center gap-6 rounded-[1.6rem] border border-[var(--line)] bg-[var(--bg-elevated)] p-5 md:p-8 lg:grid-cols-2"
            >
              <div>{UI ? <UI /> : null}</div>
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--signal)]">
                  {p.index} — {p.category}
                </p>
                <h3 className="mt-2 font-display text-3xl text-[var(--ink)]">{p.title}</h3>
                <p className="mt-3 text-[var(--text-muted)]">{p.summary}</p>
                {p.outcome && (
                  <p className="mt-3 border-l-2 border-[var(--signal)] pl-3 font-mono text-xs text-[var(--ink)]">
                    {p.outcome}
                  </p>
                )}
                <p className="mt-4 font-mono text-[11px] leading-relaxed text-[var(--text-faint)]">{p.tech}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {p.keywords.map((k) => (
                    <span
                      key={k}
                      className="rounded-md border border-[var(--line)] bg-[var(--bg)] px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--text-faint)]"
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
                    </a>
                  )}
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}

export default function Projects() {
  const reduce = useReducedMotion()
  const sectionRef = useRef(null)
  const trackRef = useRef(null)
  const [active, setActive] = useState(0)
  const [maxX, setMaxX] = useState(0)
  const [stacked, setStacked] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(max-width: 767px)').matches
  })

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const apply = () => setStacked(mq.matches)
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [])

  // While this tall section is pinned, page Y scroll drives X on the track.
  // Progress 0→1 = first→last project; past end, sticky releases → normal vertical scroll.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  const smooth = useSpring(scrollYProgress, { stiffness: 55, damping: 22, mass: 0.45 })
  const x = useTransform(smooth, [0, 1], [0, -maxX])

  useEffect(() => {
    const measure = () => {
      const track = trackRef.current
      if (!track) return
      setMaxX(Math.max(0, track.scrollWidth - window.innerWidth))
    }
    measure()
    const id = window.setTimeout(measure, 120)
    const id2 = window.setTimeout(measure, 500)
    window.addEventListener('resize', measure)
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(measure) : null
    if (trackRef.current && ro) ro.observe(trackRef.current)
    return () => {
      window.clearTimeout(id)
      window.clearTimeout(id2)
      window.removeEventListener('resize', measure)
      ro?.disconnect()
    }
  }, [])

  useEffect(() => {
    const onScroll = () => {
      const el = sectionRef.current
      if (!el) return
      const r = el.getBoundingClientRect()
      const pinned = r.top <= 8 && r.bottom >= window.innerHeight - 8
      document.documentElement.dataset.projectsPin = pinned ? '1' : '0'
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      delete document.documentElement.dataset.projectsPin
    }
  }, [])

  useMotionValueEvent(smooth, 'change', (v) => {
    const i = Math.min(projects.length - 1, Math.max(0, Math.round(v * (projects.length - 1))))
    setActive(i)
  })

  const jumpTo = (index) => {
    const section = sectionRef.current
    if (!section) return
    const top = window.scrollY + section.getBoundingClientRect().top
    const travel = Math.max(1, section.offsetHeight - window.innerHeight)
    const y = top + (index / Math.max(1, projects.length - 1)) * travel
    const lenis = window.__lenis
    if (lenis && !reduce) lenis.scrollTo(y, { duration: 1.25, easing: (t) => 1 - Math.pow(1 - t, 3.2) })
    else window.scrollTo({ top: y, behavior: reduce ? 'auto' : 'smooth' })
  }

  if (reduce || stacked) {
    return <StackedProjects />
  }

  return (
    <section
      id="work"
      ref={sectionRef}
      className="projects-pin relative z-10 bg-[var(--bg)]"
      style={{ height: `${(projects.length + 0.35) * 100}vh` }}
    >
      {/* Sticky stage: vertical wheel → horizontal until last project, then page unlocks */}
      <div className="projects-sticky sticky top-0 isolate flex h-[100svh] max-h-[100dvh] flex-col overflow-hidden bg-[var(--bg)]">
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div className="absolute -left-20 top-1/4 h-[40vmax] w-[40vmax] rounded-full bg-[color-mix(in_srgb,var(--signal)_14%,transparent)] blur-3xl" />
          <div className="absolute -right-16 bottom-1/4 h-[36vmax] w-[36vmax] rounded-full bg-[color-mix(in_srgb,var(--hot)_12%,transparent)] blur-3xl" />
        </div>

        <div className="relative z-[2] flex shrink-0 items-end justify-between gap-4 px-6 pb-2 pt-8 md:px-10 md:pt-10">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--signal)]">Projects</p>
            <h2 className="mt-2 font-display text-[clamp(2.1rem,5.5vw,4.2rem)] leading-[0.9] text-[var(--ink)]">
              Work that moves with you.
            </h2>
            <p className="mt-3 max-w-md text-sm text-[var(--text-muted)]">
              Soft horizontal glide across real product UIs — then the page continues down.
            </p>
          </div>
          <div className="hidden text-right sm:block">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--text-faint)]">Active</p>
            <p className="mt-1 font-display text-xl text-[var(--ink)]">{projects[active]?.short}</p>
            <p className="font-mono text-sm text-[var(--text-faint)]">
              {String(active + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}
            </p>
          </div>
        </div>

        <div className="relative z-[2] min-h-0 flex-1 overflow-hidden">
          <motion.div ref={trackRef} style={{ x }} className="flex h-full items-center will-change-transform">
            <div className="w-[2vw] shrink-0 md:w-[5vw]" aria-hidden />
            {projects.map((project, i) => (
              <ProjectSlide
                key={project.id}
                project={project}
                scrollProgress={smooth}
                index={i}
                total={projects.length}
                active={active === i}
              />
            ))}
            <div className="w-[6vw] shrink-0" aria-hidden />
          </motion.div>
        </div>

        <div className="relative z-[2] shrink-0 bg-[var(--bg)] px-6 pb-8 pt-2 md:px-10">
          <div className="h-[3px] overflow-hidden rounded-full bg-[var(--bg-soft)]">
            <motion.div className="h-full origin-left rounded-full bg-[var(--ink)]" style={{ scaleX: smooth }} />
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {projects.map((p, i) => (
              <button
                key={p.id}
                type="button"
                data-cursor="go"
                onClick={() => jumpTo(i)}
                className={`rounded-full border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] transition ${
                  active === i
                    ? 'border-[var(--ink)] bg-[var(--ink)] text-[var(--bg)]'
                    : 'border-[var(--line)] bg-[var(--bg-elevated)] text-[var(--text-faint)]'
                }`}
              >
                {p.short}
              </button>
            ))}
          </div>
          <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--text-faint)]">
            {active < projects.length - 1
              ? 'Horizontal mode · scroll to next project'
              : 'Last project · keep scrolling for the rest of the page'}
          </p>
        </div>
      </div>
    </section>
  )
}
