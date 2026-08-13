import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import {
  fadeUp,
  flipIn,
  letterStamp,
  slideLeft,
  slideRight,
  stamp,
  stagger,
  wipeX,
  viewportOnce,
  springStamp,
  easeOut,
} from '../../lib/motion'

const VARIANT_MAP = {
  stamp,
  fade: fadeUp,
  left: slideLeft,
  right: slideRight,
  flip: flipIn,
  wipe: wipeX,
}

export function Reveal({ children, className = '', delay = 0, variant = 'fade', as = 'div' }) {
  const reduce = useReducedMotion()
  const Comp = motion[as] || motion.div
  const variants = VARIANT_MAP[variant] || fadeUp
  const [forceShow, setForceShow] = useState(false)

  useEffect(() => {
    const t = window.setTimeout(() => setForceShow(true), 1600)
    return () => window.clearTimeout(t)
  }, [])

  if (reduce) return <div className={className}>{children}</div>

  return (
    <Comp
      className={className}
      variants={variants}
      initial="hidden"
      animate={forceShow ? 'show' : undefined}
      whileInView="show"
      viewport={viewportOnce}
      // delay only — do not override variant transition (that broke reveals)
      custom={delay}
      transition={{ delay }}
      style={variant === 'flip' ? { transformStyle: 'preserve-3d', perspective: 900 } : undefined}
    >
      {children}
    </Comp>
  )
}

export function Stagger({ children, className = '', gap = 0.07, delay = 0.04 }) {
  const reduce = useReducedMotion()
  if (reduce) return <div className={className}>{children}</div>

  return (
    <motion.div
      className={className}
      variants={stagger(gap, delay)}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({ children, className = '', as = 'div', variant = 'fade' }) {
  const Comp = motion[as] || motion.div
  return (
    <Comp className={className} variants={VARIANT_MAP[variant] || fadeUp}>
      {children}
    </Comp>
  )
}

/**
 * Masked line reveal — the text slides up from behind a clipped edge instead of
 * just fading. Used for headings.
 */
export function MaskReveal({ children, className = '', delay = 0 }) {
  const reduce = useReducedMotion()
  if (reduce) return <span className={`block ${className}`}>{children}</span>

  return (
    <span className="block overflow-hidden pb-[0.12em]">
      <motion.span
        className={`block ${className}`}
        initial={{ y: '120%', rotate: 6, skewY: 4, opacity: 0 }}
        whileInView={{ y: '0%', rotate: 0, skewY: 0, opacity: 1 }}
        viewport={viewportOnce}
        transition={{ duration: 0.95, ease: easeOut, delay }}
      >
        {children}
      </motion.span>
    </span>
  )
}

/** Stamp each letter with bounce */
export function SplitChars({ text, className = '', delay = 0, once = false }) {
  const reduce = useReducedMotion()
  const chars = text.split('')

  if (reduce) return <span className={className}>{text}</span>

  const trigger = once
    ? { animate: 'show' }
    : { whileInView: 'show', viewport: viewportOnce }

  return (
    <motion.span
      className={`inline-flex flex-wrap justify-center ${className}`}
      aria-label={text}
      variants={stagger(0.04, delay)}
      initial="hidden"
      {...trigger}
    >
      {chars.map((char, i) => (
        <motion.span
          key={`${char}-${i}`}
          variants={letterStamp}
          className="inline-block"
          style={{ whiteSpace: char === ' ' ? 'pre' : undefined }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </motion.span>
  )
}

/** Scramble → settle typewriter look */
export function ScrambleText({ text, className = '', trigger = true }) {
  const reduce = useReducedMotion()
  const [out, setOut] = useState(reduce ? text : '')
  const glyphs = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789<>/\\|'

  useEffect(() => {
    if (reduce || !trigger) {
      setOut(text)
      return
    }
    let frame = 0
    const total = text.length * 3
    const id = setInterval(() => {
      frame += 1
      const progress = Math.min(1, frame / total)
      const revealed = Math.floor(progress * text.length)
      let next = ''
      for (let i = 0; i < text.length; i += 1) {
        if (text[i] === ' ') {
          next += ' '
        } else if (i < revealed) {
          next += text[i]
        } else {
          next += glyphs[Math.floor(Math.random() * glyphs.length)]
        }
      }
      setOut(next)
      if (progress >= 1) clearInterval(id)
    }, 28)
    return () => clearInterval(id)
  }, [text, trigger, reduce])

  return (
    <span className={`font-mono ${className}`} aria-label={text}>
      {out}
    </span>
  )
}

/** Rotating typewriter — types a word, pauses, deletes, cycles to the next */
export function Typewriter({
  words = [],
  className = '',
  typeSpeed = 70,
  deleteSpeed = 38,
  holdTime = 1400,
  gapTime = 320,
}) {
  const reduce = useReducedMotion()
  const [index, setIndex] = useState(0)
  const [text, setText] = useState('')
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (reduce || words.length === 0) return undefined

    const current = words[index % words.length]

    if (!deleting && text === current) {
      const t = setTimeout(() => setDeleting(true), holdTime)
      return () => clearTimeout(t)
    }

    if (deleting && text === '') {
      const t = setTimeout(() => {
        setDeleting(false)
        setIndex((i) => (i + 1) % words.length)
      }, gapTime)
      return () => clearTimeout(t)
    }

    const next = deleting
      ? current.slice(0, text.length - 1)
      : current.slice(0, text.length + 1)

    const t = setTimeout(() => setText(next), deleting ? deleteSpeed : typeSpeed)
    return () => clearTimeout(t)
  }, [text, deleting, index, words, reduce, typeSpeed, deleteSpeed, holdTime, gapTime])

  if (reduce) {
    return <span className={className}>{words[0]}</span>
  }

  return (
    <span className={className} aria-live="polite">
      {text}
      <motion.span
        aria-hidden
        className="ml-1 inline-block w-[0.08em] self-stretch bg-current align-baseline"
        style={{ height: '1em' }}
        animate={{ opacity: [1, 1, 0, 0] }}
        transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
      />
    </span>
  )
}

export function SectionTitle({ label, title, subtitle, center = false }) {
  const reduce = useReducedMotion()
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const drift = useTransform(scrollYProgress, [0, 1], [32, -48])
  const rotate = useTransform(scrollYProgress, [0, 1], [-1.5, 2.5])
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.96, 1.04, 0.98])
  const watermark = typeof title === 'string' ? title : label

  return (
    <div ref={ref} className={`relative ${center ? 'text-center' : ''}`}>
      {watermark && (
        <motion.span
          aria-hidden
          style={reduce ? undefined : { y: drift, rotate, scale }}
          className={`pointer-events-none absolute -top-8 select-none font-display text-[clamp(4rem,14vw,8rem)] uppercase leading-none tracking-tighter text-transparent [-webkit-text-stroke:1px_color-mix(in_srgb,var(--signal)_35%,transparent)] ${
            center ? 'left-1/2 -translate-x-1/2' : 'left-0'
          }`}
        >
          {watermark}
        </motion.span>
      )}

      {label && (
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={viewportOnce}
          transition={{ duration: 0.55, ease: easeOut }}
          className={`relative mb-6 inline-flex items-center gap-3 ${center ? 'mx-auto' : ''}`}
        >
          <span className="h-px w-8 bg-[var(--signal)]" />
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.28em] text-[var(--signal)]">
            {label}
          </span>
          <motion.span
            className="h-2 w-2 rotate-45 bg-[var(--hot)]"
            animate={{ scale: [1, 1.35, 1] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>
      )}

      <MaskReveal delay={0.05}>
        <h2 className="relative font-display text-4xl uppercase leading-[0.92] tracking-tight text-[var(--ink)] md:text-5xl lg:text-7xl">
          {title}
        </h2>
      </MaskReveal>

      <motion.div
        initial={{ scaleX: 0, rotate: -4 }}
        whileInView={{ scaleX: 1, rotate: 0 }}
        viewport={viewportOnce}
        transition={{ duration: 0.75, ease: easeOut, delay: 0.25 }}
        className={`mt-6 h-[4px] w-28 origin-left bg-gradient-to-r from-[var(--signal)] via-[var(--hot)] to-transparent ${
          center ? 'mx-auto' : ''
        }`}
      />

      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 28, filter: 'blur(8px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={viewportOnce}
          transition={{ duration: 0.65, ease: easeOut, delay: 0.28 }}
          className={`relative mt-5 max-w-xl text-base text-[var(--text-muted)] md:text-lg ${
            center ? 'mx-auto' : ''
          }`}
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  )
}

/** Infinite scrolling text band */
export function Marquee({ items, reverse = false, className = '' }) {
  const row = [...items, ...items]
  return (
    <div className={`marquee ${reverse ? 'marquee--reverse' : ''} ${className}`} aria-hidden>
      <div className="marquee__track">
        {row.map((item, i) => (
          <span key={`${item}-${i}`} className="marquee__item">
            {item}
            <span className="mx-4 opacity-30">◆</span>
          </span>
        ))}
      </div>
    </div>
  )
}

export { springStamp, easeOut }
