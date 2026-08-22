import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import {
  CLIP_FROM,
  CLIP_SHOW,
  easeLux,
  easeOut,
  stagger,
  viewportReveal,
  viewportOnce,
} from '../../lib/motion'

const wordVariant = {
  hidden: { y: '115%', opacity: 0 },
  show: {
    y: '0%',
    opacity: 1,
    transition: { duration: 0.5, ease: easeOut },
  },
}

/**
 * Staggered word reveal — each word clips up from below with a slight delay.
 * Pass a plain string. Screen readers get the full sentence via aria-label.
 */
export function SplitWords({
  text,
  className = '',
  delay = 0,
  gap = 0.038,
  as = 'span',
}) {
  const reduce = useReducedMotion()
  const Comp = motion[as] || motion.span
  const words = String(text).split(/(\s+)/)

  if (reduce) {
    const Tag = as === 'span' ? 'span' : as
    return <Tag className={className}>{text}</Tag>
  }

  return (
    <Comp
      className={className}
      aria-label={text}
      variants={stagger(gap, delay)}
      initial="hidden"
      whileInView="show"
      viewport={viewportReveal}
    >
      {words.map((token, i) => {
        if (/^\s+$/.test(token)) {
          return <span key={`s-${i}`}>{token}</span>
        }
        return (
          <span key={`${token}-${i}`} className="split-word">
            <motion.span variants={wordVariant} className="split-word__inner" aria-hidden>
              {token}
            </motion.span>
          </span>
        )
      })}
    </Comp>
  )
}

/** Clip-path wipe — cards, media, and panels enter from a masked edge. */
export function ClipReveal({
  children,
  className = '',
  delay = 0,
  from = 'bottom',
  duration = 0.78,
}) {
  const reduce = useReducedMotion()
  if (reduce) return <div className={className}>{children}</div>

  const hidden = CLIP_FROM[from] || CLIP_FROM.bottom

  return (
    <motion.div
      className={`gpu-layer overflow-hidden ${className}`}
      initial={{ opacity: 0, ...hidden }}
      whileInView={CLIP_SHOW}
      viewport={viewportReveal}
      transition={{ duration, ease: easeOut, delay }}
    >
      {children}
    </motion.div>
  )
}

/** Media-style mask: slightly zoomed + blurred, then opens to full. */
export function MediaReveal({ children, className = '', delay = 0.08 }) {
  const reduce = useReducedMotion()
  if (reduce) return <div className={className}>{children}</div>

  return (
    <motion.div
      className={`gpu-layer overflow-hidden ${className}`}
      initial={{ opacity: 0, scale: 1.04, y: 18 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={viewportOnce}
      transition={{ duration: 0.72, ease: easeLux, delay }}
    >
      {children}
    </motion.div>
  )
}

/** Scroll-tied translate / scale / rotate — GPU transforms only. */
export function ParallaxLayer({
  children,
  className = '',
  speed = 48,
  scaleFrom = 1,
  scaleTo = 1,
  rotateFrom = 0,
  rotateTo = 0,
}) {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const [amp, setAmp] = useState(1)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px), (pointer: coarse)')
    const apply = () => setAmp(mq.matches ? 0.32 : 1)
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [])

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], [speed * amp, -speed * amp])
  const scale = useTransform(scrollYProgress, [0, 1], [scaleFrom, scaleTo])
  const rotate = useTransform(
    scrollYProgress,
    [0, 1],
    [rotateFrom * amp, rotateTo * amp]
  )

  if (reduce) return <div className={className}>{children}</div>

  return (
    <motion.div ref={ref} className={`gpu-layer ${className}`} style={{ y, scale, rotate }}>
      {children}
    </motion.div>
  )
}

/**
 * One-shot fade in — no scroll-linked opacity (that feels like lag).
 */
export function ScrollFade({ children, className = '' }) {
  const reduce = useReducedMotion()
  if (reduce) return <div className={className}>{children}</div>

  return (
    <motion.div
      className={`gpu-layer ${className}`}
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewportOnce}
      transition={{ duration: 0.58, ease: easeOut }}
    >
      {children}
    </motion.div>
  )
}

/** Same as ScrollFade — kept for existing imports. */
export function ScrollBlur({ children, className = '' }) {
  return <ScrollFade className={className}>{children}</ScrollFade>
}

/** Vertical line that draws as the section enters. */
export function DrawLine({ className = '', delay = 0.12 }) {
  const reduce = useReducedMotion()
  if (reduce) {
    return <span aria-hidden className={className} />
  }

  return (
    <motion.span
      aria-hidden
      className={`origin-top ${className}`}
      initial={{ scaleY: 0, opacity: 0 }}
      whileInView={{ scaleY: 1, opacity: 1 }}
      viewport={viewportOnce}
      transition={{ duration: 0.95, ease: easeOut, delay }}
    />
  )
}
