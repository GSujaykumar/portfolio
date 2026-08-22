import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
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
  viewportReveal,
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

  if (reduce) return <div className={className}>{children}</div>

  return (
    <Comp
      className={`gpu-layer ${className}`.trim()}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={viewportReveal}
      transition={{ ...(variants.show?.transition || {}), delay }}
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
      viewport={viewportReveal}
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
        className={`block gpu-layer ${className}`}
        initial={{ y: '112%', opacity: 0 }}
        whileInView={{ y: '0%', opacity: 1 }}
        viewport={viewportReveal}
        transition={{ duration: 0.72, ease: easeOut, delay }}
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
      variants={stagger(0.018, delay)}
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
  const watermark = typeof title === 'string' ? title : label

  return (
    <div className={`relative ${center ? 'text-center' : ''}`}>
      {watermark && (
        <span
          aria-hidden
          className={`pointer-events-none absolute -top-8 select-none font-display text-[clamp(4rem,14vw,8rem)] uppercase leading-none tracking-tighter text-transparent [-webkit-text-stroke:1px_color-mix(in_srgb,var(--signal)_28%,transparent)] ${
            center ? 'left-1/2 -translate-x-1/2' : 'left-0'
          }`}
        >
          {watermark}
        </span>
      )}

      {label && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={viewportOnce}
          transition={{ duration: 0.5, ease: easeOut }}
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
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={viewportOnce}
        transition={{ duration: 0.7, ease: easeOut, delay: 0.18 }}
        className={`mt-6 h-[4px] w-28 origin-left bg-gradient-to-r from-[var(--signal)] via-[var(--hot)] to-transparent ${
          center ? 'mx-auto' : ''
        }`}
      />

      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: 0.58, ease: easeOut, delay: 0.22 }}
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

export { easeOut }
