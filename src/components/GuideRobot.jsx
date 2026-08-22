import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import RobotExpressive from './RobotExpressive'
import { easeOut, springStamp, springCrazy } from '../lib/motion'
import { smoothScrollToId } from './SmoothScroll'
import { SECTION_IDS, readActiveSection } from '../lib/sections'

const SCRIPT = {
  home: {
    label: 'Welcome',
    emote: 'Wave',
    face: 'Surprised',
    lines: [
      "Hey — I'm Sujay's guide. I'll hop around the page and walk you through his work.",
      'This is a backend Java portfolio: Spring Boot, microservices, Oracle Fusion ops.',
      'Scroll to Projects — I will bounce to a new spot and keep explaining as you go.',
    ],
    actions: [
      { id: 'next', label: 'Start tour', go: 'work' },
      { id: 'cv', label: 'Get CV', href: '/Sujay-Kumar-Resume.pdf', download: true },
    ],
  },
  work: {
    label: 'Projects',
    emote: 'ThumbsUp',
    face: 'Surprised',
    lines: [
      'Five real systems — not mock screenshots. Scroll or tap a chip to switch them.',
      'Fusion Ops Console and the Daily Teams checker are production work from Varsity.',
      'AlgoLens, payments outbox, and this site show range. Next: proof in numbers.',
    ],
    actions: [
      { id: 'next', label: 'See impact', go: 'impact' },
      { id: 'gh', label: 'GitHub', href: 'https://github.com/GSujaykumar' },
    ],
  },
  impact: {
    label: 'Impact',
    emote: 'Yes',
    face: null,
    lines: [
      'These counters are real delivery signals — years, systems, query gains.',
      'Green pulse means usually available in IST. Handy if you want to schedule a call.',
      'Signature cards are next — four proof points in one glance.',
    ],
    actions: [
      { id: 'next', label: 'Signature work', go: 'highlights' },
      { id: 'mail', label: 'Email', href: 'mailto:sujaykumargaddam18@gmail.com?subject=Opportunity%20-%20Sujay%20Kumar' },
    ],
  },
  highlights: {
    label: 'Signature',
    emote: 'ThumbsUp',
    face: null,
    lines: [
      'Four proof points: APIs, Fusion data, resilience, and ops people can run.',
      'Hover a card — the spotlight follows you. That is the story in one glance.',
      'About is next: who he is, what he owns, and how he ships.',
    ],
    actions: [{ id: 'next', label: 'About Sujay', go: 'about' }],
  },
  about: {
    label: 'About',
    emote: 'Yes',
    face: null,
    lines: [
      'Backend Java · Spring Boot · Microservices · Oracle Fusion ownership.',
      'Two years shipping secure REST APIs and finance-ops automation at Varsity.',
      'Experience is next — production history, not a buzzword list.',
    ],
    actions: [
      { id: 'next', label: 'Experience', go: 'experience' },
      { id: 'cv', label: 'CV', href: '/Sujay-Kumar-Resume.pdf', download: true },
    ],
  },
  experience: {
    label: 'Experience',
    emote: 'ThumbsUp',
    face: null,
    lines: [
      'Varsity: microservices, JWT, Docker/Jenkins, tracing, Fusion pipelines.',
      'About 25% query gains, daily Teams health checks, and a console operators run.',
      'Skills is a stack deep-dive. Contact is one hop if you already want to hire.',
    ],
    actions: [
      { id: 'next', label: 'See stack', go: 'skills' },
      { id: 'contact', label: 'Hire', go: 'contact' },
    ],
  },
  terminal: {
    label: 'CLI demo',
    emote: 'Wave',
    face: 'Surprised',
    lines: [
      'This mini terminal replays whoami, stack, shipped work, and hire status.',
      'Fun extra — the real signal is still Projects plus Experience.',
      'Hit Replay on the panel, or keep scrolling into the skill constellation.',
    ],
    actions: [{ id: 'next', label: 'Skills', go: 'skills' }],
  },
  skills: {
    label: 'Skills',
    emote: 'Punch',
    face: 'Angry',
    lines: [
      'Pick a lane — Java, Spring, MySQL, Oracle, Kafka, Redis, Docker all live here.',
      'Hover a planet or pill to pin a tool. I punch when this section lands.',
      'Education and the ATS-ready CV are just below.',
    ],
    actions: [
      { id: 'next', label: 'Resume', go: 'resume' },
      { id: 'cv', label: 'Download CV', href: '/Sujay-Kumar-Resume.pdf', download: true },
    ],
  },
  education: {
    label: 'Education',
    emote: 'Yes',
    face: null,
    lines: [
      'B.Tech CSE · JNTUH · 2021–2024.',
      'Production taught the rest — Fusion ops, CI/CD, and observability.',
      'Resume is next: download the PDF, then say hello.',
    ],
    actions: [{ id: 'next', label: 'Resume', go: 'resume' }],
  },
  resume: {
    label: 'Resume',
    emote: 'Jump',
    face: 'Surprised',
    lines: [
      'Download or open the PDF — built for ATS and humans.',
      'I jump when you land here. Grab the CV, then scroll to Contact.',
      'Email is the fastest hello. LinkedIn and GitHub are one tap too.',
    ],
    actions: [
      { id: 'cv', label: 'Download CV', href: '/Sujay-Kumar-Resume.pdf', download: true },
      { id: 'next', label: 'Contact', go: 'contact' },
    ],
  },
  contact: {
    label: 'Contact',
    emote: 'Wave',
    face: 'Surprised',
    lines: [
      'You made it — open to work · Hyderabad · remote-friendly.',
      'Email first for opportunities. Phone, LinkedIn, and GitHub are one tap.',
      'Click me for a farewell dance. Thanks for touring the work!',
    ],
    actions: [
      { id: 'mail', label: 'Email Sujay', href: 'mailto:sujaykumargaddam18@gmail.com?subject=Opportunity%20-%20Sujay%20Kumar' },
      { id: 'home', label: 'Back to top', go: 'home' },
    ],
  },
}

const LINE_MS = 4800
const WALK_SPEED = 0.38
const RUN_SPEED = 1.15

const rand = (min, max) => min + Math.random() * (max - min)
const clamp = (v, min, max) => Math.max(min, Math.min(max, v))

function robotSize() {
  const vw = window.innerWidth
  const vh = window.innerHeight
  const desktop = vw >= 1024
  return {
    width: desktop ? 168 : 112,
    height: desktop ? 204 : 136,
  }
}

function clampPose(pose) {
  const vw = window.innerWidth
  const vh = window.innerHeight
  const { width, height } = robotSize()
  return {
    ...pose,
    width,
    height,
    left: clamp(pose.left, 10, vw - width - 10),
    top: clamp(pose.top, 76, vh - height - 16),
  }
}

/** Hop to a distant random slot so the robot never parks. */
function randomPose(from) {
  const vw = window.innerWidth
  const vh = window.innerHeight
  const { width, height } = robotSize()
  const leftMin = 12
  const leftMax = vw - width - 12
  const topMin = 80
  const topMax = vh - height - 18

  const slots = [
    [leftMin, topMin],
    [leftMax, topMin],
    [leftMin, topMax],
    [leftMax, topMax],
    [leftMin, vh * 0.36],
    [leftMax, vh * 0.4],
    [vw * 0.12, vh * 0.22],
    [vw * 0.62, vh * 0.18],
    [vw * 0.2, vh * 0.58],
    [vw * 0.55, vh * 0.52],
    [vw * 0.38, topMin],
    [vw * 0.42, topMax],
  ].map(([l, t]) => ({
    left: clamp(l + rand(-28, 28), leftMin, leftMax),
    top: clamp(t + rand(-22, 22), topMin, topMax),
    width,
    height,
  }))

  const minDist = Math.min(vw, vh) * 0.32
  const far = from
    ? slots.filter((s) => Math.hypot(s.left - from.left, s.top - from.top) >= minDist)
    : slots
  const pool = far.length ? far : slots
  return pool[Math.floor(Math.random() * pool.length)]
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
    const id = setInterval(() => {
      i += 1
      setOut(text.slice(0, i))
      if (i >= text.length) clearInterval(id)
    }, 14)
    return () => clearInterval(id)
  }, [text, enabled])

  return out
}

function SparkBurst({ burst }) {
  return (
    <AnimatePresence>
      <motion.span
        key={`ring-${burst}`}
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[var(--signal)]"
        initial={{ opacity: 0.85, scale: 0.15 }}
        animate={{ opacity: 0, scale: 2.6 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.75, ease: easeOut }}
      />
      <motion.span
        key={`ring2-${burst}`}
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[var(--hot)]"
        initial={{ opacity: 0.7, scale: 0.4 }}
        animate={{ opacity: 0, scale: 3.2 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.9, ease: easeOut, delay: 0.05 }}
      />
      {Array.from({ length: 12 }).map((_, i) => {
        const ang = (i / 12) * Math.PI * 2
        const dist = 55 + (i % 3) * 18
        return (
          <motion.span
            key={`spark-${burst}-${i}`}
            aria-hidden
            className={`pointer-events-none absolute left-1/2 top-1/2 rounded-full ${
              i % 3 === 0 ? 'h-2.5 w-2.5 bg-[var(--hot)]' : 'h-2 w-2 bg-[var(--signal)]'
            }`}
            initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
            animate={{
              opacity: 0,
              x: Math.cos(ang) * dist,
              y: Math.sin(ang) * dist,
              scale: 0.15,
            }}
            transition={{ duration: 0.65 + (i % 4) * 0.08, ease: easeOut }}
          />
        )
      })}
    </AnimatePresence>
  )
}

function TourBeacon({ from, toId }) {
  const [pt, setPt] = useState(null)

  useEffect(() => {
    const el = document.getElementById(toId)
    if (!el || !from) {
      setPt(null)
      return undefined
    }
    const update = () => {
      const r = el.getBoundingClientRect()
      const tx = r.left + r.width * 0.5
      const ty = Math.min(r.top + 48, window.innerHeight - 40)
      const fx = from.left + from.width * 0.5
      const fy = from.top + from.height * 0.35
      const dx = tx - fx
      const dy = ty - fy
      const len = Math.hypot(dx, dy)
      if (len < 90) {
        setPt(null)
        return
      }
      setPt({
        x: fx,
        y: fy,
        angle: (Math.atan2(dy, dx) * 180) / Math.PI,
        len: Math.min(len * 0.42, 160),
      })
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [from, toId])

  if (!pt) return null

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed z-[58]"
      style={{
        left: pt.x,
        top: pt.y,
        transform: `rotate(${pt.angle}deg)`,
        transformOrigin: '0 50%',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: [0.35, 0.9, 0.35] }}
      transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
    >
      <motion.div
        className="h-[2px] origin-left rounded-full bg-gradient-to-r from-[var(--signal)] to-transparent"
        style={{ width: pt.len }}
        animate={{ scaleX: [0.85, 1.05, 0.85] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
      />
      <span className="absolute -right-1 -top-1.5 h-3 w-3 rotate-45 border-r-2 border-t-2 border-[var(--signal)]" />
    </motion.div>
  )
}

export default function GuideRobot() {
  const reduce = useReducedMotion()
  const [mode, setMode] = useState('hero')
  const [active, setActive] = useState('home')
  const [pose, setPose] = useState(() => ({ ...randomPose(), ms: 700 }))
  const [line, setLine] = useState(0)
  const [burst, setBurst] = useState(0)
  const [ghosts, setGhosts] = useState([])
  const [mood, setMood] = useState('help') // help | hype | tip
  const [nudge, setNudge] = useState(false)
  const [bounce, setBounce] = useState(0)

  const apiRef = useRef(null)
  const modeRef = useRef('hero')
  const activeRef = useRef('home')
  const poseRef = useRef(pose)
  const clickCombo = useRef(0)
  const lastHelpRef = useRef(Date.now())

  const markHelp = useCallback(() => {
    lastHelpRef.current = Date.now()
    setNudge(false)
  }, [])

  const onReady = useCallback((api) => {
    apiRef.current = api
    if (!reduce) {
      window.setTimeout(() => {
        api.celebrate?.(2800)
        api.playEmote?.('Wave')
      }, 350)
    }
  }, [reduce])

  const spawnGhost = useCallback((from) => {
    if (reduce) return
    const id = `${Date.now()}-${Math.random()}`
    setGhosts((g) => [...g.slice(-4), { id, ...from }])
    window.setTimeout(() => {
      setGhosts((g) => g.filter((x) => x.id !== id))
    }, 480)
  }, [reduce])

  const moveTo = useCallback(
    (next) => {
      const from = poseRef.current
      const dx = next.left - from.left
      const dy = next.top - from.top
      const dist = Math.hypot(dx, dy)
      const run = dist > window.innerWidth * 0.34
      const ms = clamp(dist / (run ? RUN_SPEED : WALK_SPEED), 650, 2600)

      if (dist > 36) {
        spawnGhost(from)
        if (apiRef.current) apiRef.current.travel(ms, Math.sign(dx) || 1, run)
        if (run) apiRef.current?.boost?.()
      }

      const target = { ...next, ms: dist > 28 ? ms : 500 }
      poseRef.current = target
      setPose(target)
    },
    [spawnGhost]
  )

  const goSection = useCallback(
    (id) => {
      if (!id) return
      markHelp()
      setMood('tip')
      setBurst((n) => n + 1)
      setBounce((n) => n + 1)
      smoothScrollToId(id, -12)
      window.setTimeout(() => {
        apiRef.current?.flip?.()
        apiRef.current?.playEmote?.('Yes')
      }, 180)
    },
    [markHelp]
  )

  const playExplain = useCallback((id) => {
    const spot = SCRIPT[id]
    window.setTimeout(() => {
      if (id === 'contact') apiRef.current?.celebrate?.(3800)
      else if (id === 'skills') apiRef.current?.combo?.()
      else if (id === 'resume') {
        apiRef.current?.flip?.()
        window.setTimeout(() => apiRef.current?.playEmote?.('Jump'), 220)
      } else if (id === 'work') {
        apiRef.current?.boost?.()
        apiRef.current?.playEmote?.('ThumbsUp')
      } else if (id === 'impact') {
        apiRef.current?.playEmote?.('Yes')
        apiRef.current?.boost?.()
      } else if (id === 'home') apiRef.current?.wave?.()
      else if (spot?.emote) apiRef.current?.playEmote?.(spot.emote)
      apiRef.current?.setExpression?.(spot?.face ?? null)
      window.setTimeout(() => apiRef.current?.setExpression?.(null), 2200)
    }, 420)
  }, [])

  useEffect(() => {
    if (reduce) return undefined
    let lastY = window.scrollY
    let settle = 0
    let raf = 0

    const sync = () => {
      raf = 0
      const y = window.scrollY
      const nextMode = y > window.innerHeight * 0.5 ? 'guide' : 'hero'
      if (nextMode !== modeRef.current) {
        modeRef.current = nextMode
        setMode(nextMode)
        moveTo(randomPose(poseRef.current))
        if (nextMode === 'guide') {
          setBurst((n) => n + 1)
          apiRef.current?.flip?.()
          setMood('hype')
        } else {
          setMood('help')
          apiRef.current?.playEmote?.('Wave')
        }
      }

      if (apiRef.current) {
        const dv = y - lastY
        apiRef.current.setSpin(clamp(dv * 0.032, -1.1, 1.1))
        if (Math.abs(dv) > 28) apiRef.current.boost?.()
        window.clearTimeout(settle)
        settle = window.setTimeout(() => apiRef.current?.setSpin(0), 120)
      }
      lastY = y
    }

    const onScroll = () => {
      if (raf) return
      raf = window.requestAnimationFrame(sync)
    }

    const onResize = () => moveTo(clampPose(poseRef.current))

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)
    return () => {
      window.clearTimeout(settle)
      if (raf) window.cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
    }
  }, [moveTo, reduce])

  useEffect(() => {
    if (reduce) return undefined
    let timer = 0
    const hop = () => {
      moveTo(randomPose(poseRef.current))
      setBurst((n) => n + 1)
      const roll = Math.random()
      if (roll < 0.22) apiRef.current?.flip?.()
      else if (roll < 0.42) apiRef.current?.playEmote?.('Wave')
      else if (roll < 0.58) apiRef.current?.playEmote?.('ThumbsUp')
      else if (roll < 0.7) apiRef.current?.playEmote?.('Jump')
      else if (roll < 0.82) apiRef.current?.dance?.(2200)
      else apiRef.current?.playEmote?.('Yes')
      timer = window.setTimeout(hop, rand(8000, 12000))
    }
    timer = window.setTimeout(hop, rand(5000, 8000))
    return () => window.clearTimeout(timer)
  }, [moveTo, reduce])

  // If the viewer stalls, nudge with a tip + bounce
  useEffect(() => {
    if (reduce) return undefined
    const id = window.setInterval(() => {
      if (Date.now() - lastHelpRef.current < 14000) return
      setNudge(true)
      setBurst((n) => n + 1)
      setBounce((n) => n + 1)
      setMood('help')
      apiRef.current?.wave?.() || apiRef.current?.playEmote?.('Wave')
      apiRef.current?.setExpression?.('Surprised')
      window.setTimeout(() => apiRef.current?.setExpression?.(null), 1600)
      lastHelpRef.current = Date.now()
    }, 4000)
    return () => window.clearInterval(id)
  }, [reduce])

  useEffect(() => {
    if (reduce) return undefined

    const apply = (id) => {
      if (!id || id === activeRef.current) return
      activeRef.current = id
      setActive(id)
      setLine(0)
      setNudge(false)
      lastHelpRef.current = Date.now()
      setBurst((n) => n + 1)
      setBounce((n) => n + 1)
      setMood(id === 'contact' || id === 'work' ? 'hype' : 'tip')
      moveTo(randomPose(poseRef.current))
      playExplain(id)
    }

    const sync = () => apply(readActiveSection())
    sync()
    window.addEventListener('scroll', sync, { passive: true })
    window.addEventListener('resize', sync)
    return () => {
      window.removeEventListener('scroll', sync)
      window.removeEventListener('resize', sync)
    }
  }, [moveTo, playExplain, reduce])

  useEffect(() => {
    if (reduce || nudge) return undefined
    const lines = SCRIPT[active]?.lines || []
    if (lines.length < 2) return undefined
    const id = setInterval(() => setLine((i) => (i + 1) % lines.length), LINE_MS)
    return () => clearInterval(id)
  }, [active, reduce, nudge])

  useEffect(() => {
    if (reduce) return undefined
    const emotes = SCRIPT[active]?.emote
    if (line === 0) return undefined
    apiRef.current?.playEmote?.(emotes || 'Wave')
    setBurst((n) => n + 1)
    return undefined
  }, [line, active, reduce])

  const script = SCRIPT[active] || SCRIPT.home
  const stepIdx = Math.max(0, SECTION_IDS.indexOf(active))
  const nextId = stepIdx < SECTION_IDS.length - 1 ? SECTION_IDS[stepIdx + 1] : null
  const text = nudge
    ? nextId
      ? `Still exploring? Scroll on to ${SCRIPT[nextId]?.label || 'the next stop'} — or click me for a tip.`
      : 'You are at the finish — Email Sujay or Back to top when ready.'
    : script.lines[line % script.lines.length]
  const typed = useTypedText(text, !reduce)
  const heroMode = mode === 'hero'
  const nearTop = pose.top < 158
  const bubbleSide = pose.left + pose.width / 2 < window.innerWidth / 2 ? 'left-0' : 'right-0'

  const onRobotClick = () => {
    markHelp()
    clickCombo.current = (clickCombo.current + 1) % 5
    setBurst((n) => n + 1)
    setBounce((n) => n + 1)
    setLine((i) => (i + 1) % script.lines.length)
    setMood('hype')
    moveTo(randomPose(poseRef.current))
    if (clickCombo.current === 0) apiRef.current?.combo?.()
    else if (clickCombo.current === 1) apiRef.current?.celebrate?.(4200)
    else if (clickCombo.current === 2) {
      apiRef.current?.flip?.()
      window.setTimeout(() => apiRef.current?.dance?.(3200), 240)
    } else if (clickCombo.current === 3) {
      apiRef.current?.playEmote?.('ThumbsUp')
      apiRef.current?.setExpression?.('Surprised')
      window.setTimeout(() => apiRef.current?.setExpression?.(null), 1400)
    } else {
      apiRef.current?.playEmote?.('Wave')
      if (nextId) goSection(nextId)
    }
  }

  if (reduce) return null

  return (
    <>
      {ghosts.map((g) => (
        <motion.div
          key={g.id}
          aria-hidden
          className="robot-ghost pointer-events-none fixed z-[55] rounded-[2rem]"
          initial={{ opacity: 0.4, scale: 1 }}
          animate={{ opacity: 0, scale: 1.2, y: -22 }}
          transition={{ duration: 0.48, ease: easeOut }}
          style={{ left: g.left, top: g.top, width: g.width, height: g.height }}
        />
      ))}

      {!heroMode && nextId && <TourBeacon from={pose} toId={nextId} />}

      <motion.div
        className="pointer-events-none fixed z-[60]"
        initial={{ opacity: 0, scale: 0.15, rotate: -16, y: -100 }}
        animate={{
          opacity: 1,
          scale: bounce % 2 === 0 ? 1 : [1, 1.08, 1],
          rotate: mood === 'hype' ? [0, -8, 6, 0] : nudge ? [0, -1.5, 1.5, 0] : [0, 2, -2, 0],
          left: pose.left,
          top: pose.top,
          width: pose.width,
          height: pose.height,
          y: [0, -26, 0],
        }}
        transition={{
          left: { duration: pose.ms / 1000, ease: [0.45, 0, 0.55, 1] },
          top: { duration: pose.ms / 1000, ease: [0.45, 0, 0.55, 1] },
          width: { duration: 0.55, ease: easeOut },
          height: { duration: 0.55, ease: easeOut },
          opacity: { duration: 0.4 },
          scale: springCrazy,
          rotate: { duration: pose.ms / 1000, ease: easeOut },
          y: { duration: Math.min(0.65, pose.ms / 1000), ease: [0.22, 1, 0.36, 1] },
        }}
      >
        <SparkBurst burst={burst} />

        <AnimatePresence mode="wait">
          <motion.div
              key={`${active}-${line}-${nudge ? 'nudge' : 'line'}`}
              initial={{ opacity: 0, y: 24, scale: 0.82, rotate: -4 }}
              animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, y: -12, scale: 0.9, rotate: 3 }}
              transition={springStamp}
              className={`pointer-events-auto absolute ${bubbleSide} ${
                nearTop ? 'top-full mt-2' : '-top-36'
              } w-[min(318px,80vw)] rounded-2xl bg-gradient-to-br from-[var(--ink)] via-[var(--ink)]/55 to-[var(--signal)]/30 p-[1.5px] shadow-[0_20px_55px_-12px_rgba(0,0,0,0.5)]`}
            >
              <div className="relative overflow-hidden rounded-[calc(1rem-1.5px)] bg-[var(--bg-elevated)]/96 backdrop-blur-xl">
                <motion.div
                  key={`rail-${active}-${line}-${nudge}`}
                  className="absolute inset-x-0 top-0 h-[2.5px] origin-left bg-[var(--signal)]"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: LINE_MS / 1000, ease: 'linear' }}
                />
                <div className="px-4 pb-3.5 pt-4">
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <motion.span
                        className="h-1.5 w-1.5 rounded-full bg-[var(--signal)]"
                        animate={{ scale: [1, 1.9, 1], opacity: [1, 0.35, 1] }}
                        transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                      />
                      <span className="font-mono text-[9px] font-bold uppercase tracking-[0.22em] text-[var(--text-faint)]">
                        Guide · {script.label}
                      </span>
                    </div>
                    <span className="rounded-full bg-[color-mix(in_srgb,var(--signal)_14%,transparent)] px-2 py-0.5 font-mono text-[8px] font-bold uppercase tracking-wider text-[var(--signal)]">
                      {stepIdx + 1}/{SECTION_IDS.length}
                    </span>
                  </div>

                  <div className="mb-2.5 flex gap-0.5" role="navigation" aria-label="Tour sections">
                    {SECTION_IDS.map((id, i) => (
                      <motion.button
                        key={id}
                        type="button"
                        data-cursor="go"
                        title={SCRIPT[id]?.label}
                        aria-label={`Go to ${SCRIPT[id]?.label}`}
                        aria-current={i === stepIdx ? 'step' : undefined}
                        onClick={() => goSection(id)}
                        className={`h-1.5 flex-1 rounded-full transition-colors ${
                          i <= stepIdx ? 'bg-[var(--signal)]' : 'bg-[var(--line)]'
                        }`}
                        whileHover={{ scaleY: 1.8 }}
                      />
                    ))}
                  </div>

                  <p className="min-h-[2.8em] text-[12px] font-semibold leading-snug text-[var(--ink)] sm:text-[13px]">
                    {typed}
                    {typed.length < text.length && (
                      <motion.span
                        className="ml-0.5 inline-block h-[1em] w-[2px] translate-y-[2px] bg-[var(--signal)]"
                        animate={{ opacity: [1, 0, 1] }}
                        transition={{ duration: 0.65, repeat: Infinity }}
                      />
                    )}
                  </p>

                  {script.lines.length > 1 && (
                    <div className="mt-2.5 flex gap-1">
                      {script.lines.map((l, i) => (
                        <button
                          key={l}
                          type="button"
                          aria-label={`Tip ${i + 1}`}
                          onClick={() => {
                            markHelp()
                            setLine(i)
                            setBurst((n) => n + 1)
                          }}
                          className={`h-1 rounded-full transition-all duration-300 ${
                            !nudge && i === line % script.lines.length
                              ? 'w-5 bg-[var(--signal)]'
                              : 'w-1.5 bg-[var(--line)]'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                  <p className="mt-2 font-mono text-[8px] uppercase tracking-[0.14em] text-[var(--text-faint)]">
                    Click me · tip · dance · jump ahead
                  </p>
                </div>
              </div>
            </motion.div>
        </AnimatePresence>

        <motion.div
          className="h-full w-full"
          animate={
            reduce
              ? undefined
              : {
                  y: [0, -8, 0],
                  rotate: [0, 1.6, -1.6, 0],
                  scale: bounce ? [1, 1.05, 1] : 1,
                }
          }
          transition={{
            y: { duration: 3.2, repeat: Infinity, ease: 'easeInOut' },
            rotate: { duration: 3.2, repeat: Infinity, ease: 'easeInOut' },
            scale: { duration: 0.45, ease: easeOut },
          }}
        >
          <RobotExpressive className="h-full w-full" onReady={onReady} onClick={onRobotClick} />
        </motion.div>
      </motion.div>
    </>
  )
}
