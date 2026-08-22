import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion'
import { FaArrowDown, FaArrowUpRightFromSquare } from 'react-icons/fa6'
import { Typewriter } from './motion/Reveal'
import { jumpToSection } from './SmoothScroll'
import Magnetic from './motion/Magnetic'
import { springStamp, easeOut } from '../lib/motion'
import { VisitClock } from './VisitClock'

function StampWord({ word, delay = 0 }) {
  const reduce = useReducedMotion()

  return (
    <span className="block overflow-hidden pb-[0.08em]" aria-label={word}>
      <motion.span
        className="block"
        initial={reduce ? false : { y: '110%', opacity: 0 }}
        animate={{ y: '0%', opacity: 1 }}
        transition={{ duration: 0.72, ease: easeOut, delay }}
      >
        {word}
      </motion.span>
    </span>
  )
}

const Hero = () => {
  const reduce = useReducedMotion()
  const ref = useRef(null)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 80, damping: 18 })
  const sy = useSpring(my, { stiffness: 80, damping: 18 })

  const onMove = (e) => {
    if (reduce || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    mx.set(((e.clientX - r.left) / r.width - 0.5) * 28)
    my.set(((e.clientY - r.top) / r.height - 0.5) * 18)
  }

  return (
    <section
      id="home"
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={() => {
        mx.set(0)
        my.set(0)
      }}
      className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden pb-16 pt-28"
    >
      <div className="relative z-10 mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-8 px-6">
       <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
        <VisitClock className="mb-6" />

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, ease: easeOut }}
          className="mb-6 h-[3px] w-28 origin-center bg-[var(--ink)] lg:origin-left"
        />

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: easeOut, delay: 0.05 }}
          className="mb-5 inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--bg-elevated)] px-3.5 py-1.5"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--signal)]" />
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text-faint)]">
            Open to work · Hyderabad
          </span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: easeOut, delay: 0.08 }}
          className="mb-5 text-xs font-semibold uppercase tracking-[0.28em] text-[var(--text-faint)]"
        >
          Backend Java · Spring Boot · Microservices
        </motion.p>

        <motion.h1
          style={reduce ? undefined : { x: sx, y: sy }}
          className="font-display text-[clamp(3.25rem,11vw,7.5rem)] uppercase leading-[0.85] tracking-tight text-[var(--ink)]"
        >
          <StampWord word="SUJAY" delay={0.12} />
          <br />
          <StampWord word="KUMAR" delay={0.22} />
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.55, ease: easeOut }}
          className="mt-6 flex flex-wrap items-baseline justify-center gap-3 font-display text-2xl font-bold tracking-tight text-[var(--ink)] md:justify-start md:text-4xl"
        >
          <span className="text-[var(--text-faint)]">I build</span>
          <Typewriter
            className="inline-flex items-baseline text-[var(--ink)]"
            words={[
              'Spring Boot APIs',
              'Microservices',
              'REST + JWT systems',
              'Fusion Automation',
              'Observable Backends',
            ]}
          />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.62, duration: 0.6, ease: easeOut }}
          className="mt-7 max-w-lg text-base font-medium text-[var(--text-muted)] md:text-lg"
        >
          Backend Java developer (2 yrs) — Spring Boot microservices, JWT APIs, Docker · Jenkins,
          and Oracle Fusion finance-ops platforms that operators actually run.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.72, duration: 0.55, ease: easeOut }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4 lg:justify-start"
        >
          <Magnetic>
            <motion.button
              type="button"
              data-cursor="go"
              onClick={() => jumpToSection('work', { offset: -20 })}
              whileHover={{ scale: 1.08, rotate: -2, y: -3 }}
              whileTap={{ scale: 0.94 }}
              transition={springStamp}
              className="btn-shine inline-flex items-center gap-2 rounded-full bg-[var(--ink)] px-8 py-4 text-sm font-bold text-[var(--bg)] shadow-lg"
            >
              Explore projects <FaArrowUpRightFromSquare className="text-xs" />
            </motion.button>
          </Magnetic>
          <Magnetic>
            <motion.button
              type="button"
              data-cursor="mail"
              onClick={() => jumpToSection('contact', { offset: -10 })}
              whileHover={{ scale: 1.08, rotate: 2, y: -3 }}
              whileTap={{ scale: 0.94 }}
              transition={springStamp}
              className="inline-flex rounded-full border-2 border-[var(--ink)] bg-[var(--bg-elevated)] px-8 py-4 text-sm font-bold text-[var(--ink)] shadow-sm"
            >
              Hire me
            </motion.button>
          </Magnetic>
          <Magnetic strength={0.22}>
            <motion.a
              href="/Sujay-Kumar-Resume.pdf"
              download="Sujay-Kumar-Resume.pdf"
              data-cursor="go"
              whileHover={{ scale: 1.06, y: -2 }}
              whileTap={{ scale: 0.94 }}
              transition={springStamp}
              className="inline-flex rounded-full border border-[var(--line)] px-6 py-4 text-sm font-semibold text-[var(--text-muted)]"
            >
              Download CV
            </motion.a>
          </Magnetic>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.35 }}
          className="mt-8 flex flex-wrap justify-center gap-2"
        >
          {[
            { to: 'work', label: 'Projects' },
            { to: 'skills', label: 'Skills' },
            { to: 'resume', label: 'Resume' },
            { to: 'experience', label: 'Experience' },
            { to: 'contact', label: 'Contact' },
          ].map((chip, i) => (
            <motion.button
              key={chip.to}
              type="button"
              data-cursor="go"
              onClick={() => jumpToSection(chip.to, { offset: -10 })}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.78 + i * 0.05, duration: 0.45, ease: easeOut }}
              whileHover={{ scale: 1.1, y: -4 }}
              className="inline-flex cursor-pointer rounded-full border border-[var(--line)] bg-[var(--bg-elevated)] px-4 py-2 text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)] shadow-sm"
            >
              {chip.label}
            </motion.button>
          ))}
        </motion.div>

        <div className="mt-10 flex flex-wrap justify-center gap-6 text-xs font-bold uppercase tracking-wider text-[var(--text-faint)] lg:justify-start">
          {[
            { href: 'https://github.com/GSujaykumar', label: 'GitHub' },
            {
              href: 'https://www.linkedin.com/in/sujaykumar-gaddam-a660693a0/',
              label: 'LinkedIn',
            },
            { href: 'mailto:sujaykumargaddam18@gmail.com', label: 'Email' },
          ].map((item, i) => (
            <motion.a
              key={item.label}
              href={item.href}
              target={item.href.startsWith('http') ? '_blank' : undefined}
              rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              data-cursor="go"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.88 + i * 0.05, duration: 0.45, ease: easeOut }}
              whileHover={{ y: -8, scale: 1.12, color: 'var(--ink)', rotate: i % 2 ? 4 : -4 }}
            >
              {item.label}
            </motion.a>
          ))}
        </div>
       </div>
      </div>

      <motion.div
        className="absolute bottom-6 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.7 }}
      >
        <motion.button
          type="button"
          aria-label="Scroll to projects"
          data-cursor="go"
          onClick={() => jumpToSection('work', { offset: -20 })}
          animate={reduce ? undefined : { y: [0, 14, 0] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
          whileHover={{ scale: 1.15 }}
          className="inline-flex h-12 w-12 items-center justify-center rounded-full border-2 border-[var(--ink)] bg-[var(--bg-elevated)] text-[var(--ink)] shadow-md"
        >
          <FaArrowDown />
        </motion.button>
      </motion.div>
    </section>
  )
}

export default Hero
