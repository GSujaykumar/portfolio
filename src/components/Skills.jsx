import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import {
  motion,
  AnimatePresence,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from 'framer-motion'
import {
  FaJava,
  FaGithub,
  FaServer,
  FaShieldHalved,
  FaBolt,
  FaArrowsRotate,
  FaBoxOpen,
  FaDiagramProject,
  FaLayerGroup,
  FaGaugeHigh,
  FaCubes,
  FaRoute,
  FaFileExcel,
  FaEnvelope,
  FaComments,
  FaTerminal,
  FaDatabase,
  FaCode,
  FaCloud,
} from 'react-icons/fa6'
import {
  SiSpringboot,
  SiHibernate,
  SiApachekafka,
  SiMysql,
  SiRedis,
  SiDocker,
  SiJenkins,
  SiGithubactions,
  SiJunit5,
  SiPrometheus,
  SiGrafana,
  SiOracle,
  SiApachemaven,
} from 'react-icons/si'
import { SectionTitle, Marquee } from './motion/Reveal'
import { easeOut, springStamp, viewportOnce } from '../lib/motion'

const KEY_TERMS = [
  'Java 17',
  'OOP',
  'Collections',
  'Multithreading',
  'Streams API',
  'Spring Boot',
  'Spring MVC',
  'Spring Security',
  'JWT',
  'REST APIs',
  'Microservices',
  'Hibernate',
  'Spring Data JPA',
  'MySQL',
  'Oracle DB',
  'SQL Optimization',
  'SOLID',
  'Design Patterns',
  'Maven',
  'Docker',
  'Jenkins',
  'CI/CD',
  'JUnit',
  'Mockito',
  'Kafka',
  'Redis',
  'Prometheus',
  'Grafana',
  'Zipkin',
  'Oracle Fusion',
  'Agile',
  'SDLC',
]

const groups = [
  {
    id: 'core',
    title: 'Core Backend',
    accent: '#00b894',
    blurb: 'Production Java services — secure, layered, API-first.',
    items: [
      { name: 'Java 17', icon: FaJava, tag: 'Language', color: '#ED8B00' },
      { name: 'Spring Boot 3.x', icon: SiSpringboot, tag: 'Framework', color: '#6DB33F' },
      { name: 'Spring Security · JWT', icon: FaShieldHalved, tag: 'Auth', color: '#6DB33F' },
      { name: 'JPA · Hibernate', icon: SiHibernate, tag: 'ORM', color: '#BCAE79' },
      { name: 'REST API design', icon: FaServer, tag: 'API', color: '#0284C7' },
      { name: 'OOP · SOLID', icon: FaCode, tag: 'Design', color: '#6366F1' },
    ],
  },
  {
    id: 'distributed',
    title: 'Distributed Systems',
    accent: '#ff5a36',
    blurb: 'Events, resilience, and service boundaries that hold under load.',
    items: [
      { name: 'Microservices', icon: FaDiagramProject, tag: 'Architecture', color: '#14B8A6' },
      { name: 'Apache Kafka', icon: SiApachekafka, tag: 'Messaging', color: '#52525B' },
      { name: 'Transactional outbox', icon: FaBoxOpen, tag: 'Reliability', color: '#CA8A04' },
      { name: 'Idempotency & retries', icon: FaArrowsRotate, tag: 'Safety', color: '#0891B2' },
      { name: 'Resilience4j', icon: FaBolt, tag: 'Resilience', color: '#D97706' },
      { name: 'Event-driven design', icon: FaCloud, tag: 'Pattern', color: '#0284C7' },
    ],
  },
  {
    id: 'data',
    title: 'Data Layer',
    accent: '#00b894',
    blurb: 'MySQL + Oracle DB with query discipline and clean schemas.',
    items: [
      { name: 'MySQL', icon: SiMysql, tag: 'SQL', color: '#4479A1' },
      { name: 'Oracle DB', icon: FaDatabase, tag: 'SQL', color: '#E11D48' },
      { name: 'Redis', icon: SiRedis, tag: 'Cache', color: '#DC2626' },
      { name: 'Flyway migrations', icon: FaLayerGroup, tag: 'Schema', color: '#BE123C' },
      { name: 'Query optimization', icon: FaGaugeHigh, tag: 'Perf', color: '#0D9488' },
    ],
  },
  {
    id: 'devops',
    title: 'DevOps & Delivery',
    accent: '#ff5a36',
    blurb: 'Containers, pipelines, and git workflows that ship safely.',
    items: [
      { name: 'Docker', icon: SiDocker, tag: 'Containers', color: '#2496ED' },
      { name: 'Jenkins', icon: SiJenkins, tag: 'CI/CD', color: '#D24939' },
      { name: 'GitHub Actions', icon: SiGithubactions, tag: 'CI/CD', color: '#2088FF' },
      { name: 'Git · GitHub', icon: FaGithub, tag: 'VCS', color: '#3F3F46' },
      { name: 'Maven', icon: SiApachemaven, tag: 'Build', color: '#C71A36' },
    ],
  },
  {
    id: 'observe',
    title: 'Testing & Observability',
    accent: '#00b894',
    blurb: 'Prove it works. Watch it live. Trace the slow path.',
    items: [
      { name: 'JUnit 5 · Mockito', icon: SiJunit5, tag: 'Unit', color: '#25A162' },
      { name: 'Testcontainers', icon: FaCubes, tag: 'Integration', color: '#0E7490' },
      { name: 'Prometheus', icon: SiPrometheus, tag: 'Metrics', color: '#E6522C' },
      { name: 'Grafana', icon: SiGrafana, tag: 'Dashboards', color: '#F46800' },
      { name: 'Zipkin tracing', icon: FaRoute, tag: 'Tracing', color: '#7C3AED' },
    ],
  },
  {
    id: 'fusion',
    title: 'Oracle Fusion & Ops',
    accent: '#ff5a36',
    blurb: 'Finance-ops automation operators can re-run every day.',
    items: [
      { name: 'Fusion REST APIs', icon: SiOracle, tag: 'Enterprise', color: '#E11D48' },
      { name: 'Excel → SQL', icon: FaFileExcel, tag: 'Automation', color: '#15803D' },
      { name: 'PowerShell', icon: FaTerminal, tag: 'Ops', color: '#2563EB' },
      { name: 'Teams Adaptive Cards', icon: FaComments, tag: 'Alerts', color: '#4F46E5' },
      { name: 'API runners · mail', icon: FaEnvelope, tag: 'Bridges', color: '#DC2626' },
    ],
  },
]

const cardVariants = {
  hidden: { opacity: 0, y: 18, scale: 0.96 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.28, ease: easeOut },
  },
  exit: {
    opacity: 0,
    scale: 0.97,
    transition: { duration: 0.16, ease: easeOut },
  },
}

function groupForTerm(term) {
  const t = term.toLowerCase()
  return (
    groups.find((g) =>
      g.items.some((item) => item.name.toLowerCase().includes(t) || t.includes(item.tag.toLowerCase()))
    ) || groups.find((g) => g.title.toLowerCase().includes(t) || t.includes(g.title.toLowerCase().split(' ')[0]))
  )
}

function planetPoint(index, count, radius = 42) {
  const angle = (Math.PI * 2 * index) / count - Math.PI / 2
  return {
    left: `${50 + Math.cos(angle) * radius}%`,
    top: `${50 + Math.sin(angle) * radius}%`,
  }
}

function SkillCard({ item, index, focused, onFocus, reduce }) {
  const ref = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 280, damping: 18 })
  const sy = useSpring(y, { stiffness: 280, damping: 18 })
  const Icon = item.icon

  const onMove = (e) => {
    if (reduce || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    x.set((e.clientX - r.left - r.width / 2) * 0.28)
    y.set((e.clientY - r.top - r.height / 2) * 0.28)
  }

  return (
    <motion.button
      type="button"
      ref={ref}
      variants={cardVariants}
      data-cursor="go"
      style={{ '--skill-color': item.color }}
      onPointerMove={onMove}
      onPointerEnter={() => onFocus(item.name)}
      onPointerLeave={() => {
        x.set(0)
        y.set(0)
      }}
      onClick={() => onFocus(item.name)}
      whileTap={{ scale: 0.96 }}
      className={`skill-chip group relative overflow-hidden rounded-[1.2rem] border px-3.5 py-3.5 text-left shadow-sm ${
        focused ? 'skill-chip--live' : ''
      }`}
    >
      <span
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(120% 80% at 0% 0%, color-mix(in srgb, ${item.color} 32%, transparent), transparent 62%)`,
        }}
      />
      {focused && <span className="skill-live-rail" style={{ background: item.color }} />}
      <motion.span style={{ x: sx, y: sy }} className="relative flex items-center gap-3">
        <motion.span
          animate={
            focused && !reduce
              ? { rotate: [0, -12, 10, 0], scale: [1, 1.14, 1] }
              : { rotate: 0, scale: 1 }
          }
          transition={focused ? { duration: 0.65, ease: 'easeInOut' } : { duration: 0.2 }}
          className="skill-icon flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border text-[1.45rem]"
        >
          <Icon aria-hidden />
        </motion.span>
        <span className="min-w-0">
          <span className="mb-0.5 block font-mono text-[9px] uppercase tracking-[0.18em] text-[var(--text-faint)]">
            {String(index + 1).padStart(2, '0')} · {item.tag}
          </span>
          <span className="block truncate text-[13.5px] font-semibold tracking-[-0.02em] text-[var(--ink)]">
            {item.name}
          </span>
        </span>
      </motion.span>
    </motion.button>
  )
}

function TechOrbit({ group, focus, onFocus, reduce }) {
  const items = group.items
  const count = items.length
  const active = items.find((i) => i.name === focus) || items[0]
  const ActiveIcon = active.icon

  return (
    <div className="skill-theater" style={{ '--orbit-accent': group.accent }}>
      <div className="skill-radar" aria-hidden />
      <div className="skill-radar skill-radar--b" aria-hidden />
      <div className="skill-sweep" aria-hidden />

      <AnimatePresence>
        <motion.div
          key={group.id}
          className="skill-ring-wrap"
          initial={{ opacity: 0, scale: 0.86 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.28, ease: easeOut }}
        >
          <div className={`skill-ring ${reduce ? 'skill-ring--still' : ''}`}>
            {items.map((item, i) => {
              const Icon = item.icon
              const selected = item.name === active.name
              return (
                <button
                  key={item.name}
                  type="button"
                  data-cursor="go"
                  className={`skill-planet ${selected ? 'skill-planet--on' : ''} ${reduce ? 'skill-planet--still' : ''}`}
                  style={{ ...planetPoint(i, count), '--skill-color': item.color }}
                  aria-label={item.name}
                  aria-pressed={selected}
                  onPointerEnter={() => onFocus(item.name)}
                  onFocus={() => onFocus(item.name)}
                  onClick={() => onFocus(item.name)}
                >
                  <span className="skill-planet-face">
                    <Icon aria-hidden />
                  </span>
                  <span className="skill-planet-name">{item.name.split('·')[0].trim()}</span>
                </button>
              )
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="skill-core">
        <AnimatePresence>
          <motion.div
            key={`${group.id}-${active.name}`}
            initial={{ opacity: 0, scale: 0.82 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.22, ease: easeOut }}
            className="skill-core-inner"
            style={{ '--skill-color': active.color }}
          >
            <motion.span
              className="skill-core-icon"
              animate={reduce ? undefined : { y: [0, -7, 0], rotate: [0, -5, 5, 0] }}
              transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
            >
              <ActiveIcon aria-hidden />
            </motion.span>
            <span className="skill-core-label">{active.name}</span>
            <span className="skill-core-tag">{active.tag}</span>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

function SpotlightPanel({ children, className = '', style, ...rest }) {
  const ref = useRef(null)
  const mx = useMotionValue(50)
  const my = useMotionValue(50)
  const background = useMotionTemplate`radial-gradient(460px circle at ${mx}% ${my}%, color-mix(in srgb, var(--lane-accent, var(--signal)) 18%, transparent), transparent 58%)`

  return (
    <motion.div
      ref={ref}
      {...rest}
      style={style}
      onPointerMove={(e) => {
        rest.onPointerMove?.(e)
        const r = ref.current?.getBoundingClientRect()
        if (!r) return
        mx.set(((e.clientX - r.left) / r.width) * 100)
        my.set(((e.clientY - r.top) / r.height) * 100)
      }}
      className={`soft-panel card-shine relative overflow-hidden ${className}`}
    >
      <motion.div aria-hidden style={{ background }} className="pointer-events-none absolute inset-0" />
      <div className="relative z-[1]">{children}</div>
    </motion.div>
  )
}

const Skills = () => {
  const reduce = useReducedMotion()
  const [active, setActive] = useState(groups[0].id)
  const current = useMemo(() => groups.find((g) => g.id === active) || groups[0], [active])
  const [focus, setFocus] = useState(current.items[0].name)
  const [paused, setPaused] = useState(false)
  const [swap, setSwap] = useState(0)

  useLayoutEffect(() => {
    setFocus(current.items[0].name)
  }, [current])

  useEffect(() => {
    if (paused || reduce) return undefined
    const id = window.setInterval(() => {
      setFocus((prev) => {
        const idx = current.items.findIndex((i) => i.name === prev)
        const next = current.items[(Math.max(idx, 0) + 1) % current.items.length]
        return next.name
      })
    }, 2800)
    return () => window.clearInterval(id)
  }, [current, paused, reduce])

  const pickGroup = (id) => {
    if (id === active) return
    const next = groups.find((g) => g.id === id)
    setActive(id)
    if (next) setFocus(next.items[0].name)
    setPaused(false)
    setSwap((n) => n + 1)
  }

  return (
    <section
      id="skills"
      className="relative overflow-hidden py-24 md:py-32"
      style={{ '--lane-accent': current.accent }}
    >
      <div className="pointer-events-none absolute inset-x-0 top-10 -rotate-2 opacity-30">
        <Marquee items={KEY_TERMS.slice(0, 16)} />
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-16 rotate-2 opacity-20">
        <Marquee reverse items={KEY_TERMS.slice(16)} />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-6 md:px-10">
        <div className="mb-12">
          <SectionTitle
            label="Skills"
            title={
              <>
                Stack that
                <br />
                ships backends.
              </>
            }
            subtitle="Pick a lane — the constellation, core icon, and cards all swap to that stack. Hover a planet to pin a tool."
          />
        </div>

        <div className="grid items-stretch gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <SpotlightPanel className="p-6 md:p-8">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--text-faint)]">
                  Live constellation
                </p>
                <h3 className="mt-2 font-display text-2xl text-[var(--ink)] md:text-3xl">
                  Pick a lane. Icons lock on.
                </h3>
              </div>
              <span className="skill-live-dot" aria-hidden />
            </div>

            <div className="mt-5 flex flex-wrap gap-2" role="tablist" aria-label="Skill lanes">
              {groups.map((g, i) => {
                const on = active === g.id
                return (
                  <motion.button
                    key={g.id}
                    type="button"
                    role="tab"
                    aria-selected={on}
                    data-cursor="go"
                    onClick={() => pickGroup(g.id)}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.96 }}
                    className={`skill-lane relative overflow-hidden rounded-full border px-3.5 py-2 font-mono text-[10px] uppercase tracking-[0.14em] ${
                      on ? 'skill-lane--on border-transparent text-[var(--bg)]' : 'border-[var(--line)] bg-[var(--bg)] text-[var(--text-faint)]'
                    }`}
                  >
                    {on && (
                      <motion.span
                        layoutId="skill-lane-pill"
                        className="absolute inset-0 rounded-full"
                        style={{ background: 'var(--ink)' }}
                        transition={springStamp}
                      />
                    )}
                    <span className="relative z-[1]">
                      {String(i + 1).padStart(2, '0')} {g.title}
                    </span>
                  </motion.button>
                )
              })}
            </div>

            <div
              className="mt-5"
              onPointerEnter={() => setPaused(true)}
              onPointerLeave={() => setPaused(false)}
            >
              <TechOrbit key={current.id} group={current} focus={focus} onFocus={setFocus} reduce={reduce} />
            </div>
          </SpotlightPanel>

          <SpotlightPanel
            className="p-6 md:p-8"
            onPointerEnter={() => setPaused(true)}
            onPointerLeave={() => setPaused(false)}
          >
            <AnimatePresence>
              <motion.span
                key={swap}
                aria-hidden
                className="skill-wipe pointer-events-none absolute inset-0 z-[2]"
                style={{ background: current.accent }}
                initial={{ scaleX: 0, opacity: 0.35 }}
                animate={{ scaleX: 1, opacity: 0 }}
                transition={{ duration: 0.55, ease: easeOut }}
              />
            </AnimatePresence>

            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--signal)]">
                  Active stack · {String(current.items.length).padStart(2, '0')} tools
                </p>
                <motion.h3
                  key={current.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.22, ease: easeOut }}
                  className="mt-2 font-display text-3xl text-[var(--ink)]"
                >
                  {current.title}
                </motion.h3>
                <motion.p
                  key={`${current.id}-blurb`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.22, ease: easeOut }}
                  className="mt-2 max-w-md text-sm leading-relaxed text-[var(--text-muted)]"
                >
                  {current.blurb}
                </motion.p>
              </div>
              <motion.span
                key={current.id}
                initial={{ scale: 0.4, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="mt-1 h-3 w-3 shrink-0 rounded-full"
                style={{
                  background: current.accent,
                  boxShadow: `0 0 0 6px color-mix(in srgb, ${current.accent} 22%, transparent)`,
                }}
              />
            </div>

            <motion.div
              key={current.id}
              className="mt-6 grid gap-3 sm:grid-cols-2"
              initial="hidden"
              animate="show"
              variants={{
                hidden: {},
                show: { transition: { staggerChildren: 0.04, delayChildren: 0.02 } },
              }}
            >
              {current.items.map((item, i) => (
                <SkillCard
                  key={`${current.id}-${item.name}`}
                  item={item}
                  index={i}
                  focused={focus === item.name}
                  onFocus={setFocus}
                  reduce={reduce}
                />
              ))}
            </motion.div>
          </SpotlightPanel>
        </div>

        <motion.div
          initial={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          className="mt-8 overflow-hidden rounded-[1.4rem] border border-[var(--line)] bg-[var(--bg-elevated)] p-5 md:p-6"
        >
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--text-faint)]">
                Keyword wall
              </p>
              <h3 className="mt-1 font-display text-xl text-[var(--ink)] md:text-2xl">
                Terms that match backend Java roles
              </h3>
            </div>
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--signal)]">
              {KEY_TERMS.length} signals
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {KEY_TERMS.map((term) => {
              const g = groupForTerm(term)
              return (
                <motion.button
                  key={term}
                  type="button"
                  data-cursor="go"
                  whileHover={{ y: -4, scale: 1.06 }}
                  onClick={() => g && pickGroup(g.id)}
                  className="keyword-pill inline-flex rounded-md border border-[var(--line)] bg-[var(--bg)] px-2.5 py-1.5 font-mono text-[11px] text-[var(--text-muted)]"
                >
                  {term}
                </motion.button>
              )
            })}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Skills
