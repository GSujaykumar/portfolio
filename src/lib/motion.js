/** Calm, readable motion — GPU transforms only, no bounce, no blur. */

export const easeOut = [0.16, 1, 0.3, 1]
export const easeSnap = [0.22, 1, 0.36, 1]
export const easeWorld = [0.65, 0, 0.35, 1]
export const easeLux = [0.22, 1, 0.36, 1]

export const springStamp = { type: 'spring', stiffness: 320, damping: 34, mass: 0.62 }
export const springSoft = { type: 'spring', stiffness: 180, damping: 26, mass: 0.72 }
export const springHeavy = { type: 'spring', stiffness: 140, damping: 28, mass: 0.85 }
export const springCrazy = { type: 'spring', stiffness: 260, damping: 32, mass: 0.65 }

/** Trigger as the block enters the reading zone — earlier than before so it never feels late. */
export const viewportOnce = { once: true, amount: 0.12, margin: '0px 0px -12% 0px' }

/** Text / card reveal — slightly earlier so stagger has room to play. */
export const viewportReveal = { once: true, amount: 0.14, margin: '-4% 0px -14% 0px' }

const enter = (duration = 0.62) => ({
  duration,
  ease: easeOut,
})

export const stamp = {
  hidden: { opacity: 0, y: 36 },
  show: {
    opacity: 1,
    y: 0,
    transition: enter(0.68),
  },
}

export const slideLeft = {
  hidden: { opacity: 0, x: -40 },
  show: {
    opacity: 1,
    x: 0,
    transition: enter(0.62),
  },
}

export const slideRight = {
  hidden: { opacity: 0, x: 40 },
  show: {
    opacity: 1,
    x: 0,
    transition: enter(0.62),
  },
}

export const flipIn = {
  hidden: { opacity: 0, y: 32 },
  show: {
    opacity: 1,
    y: 0,
    transition: enter(0.66),
  },
}

export const wipeX = {
  hidden: { opacity: 0, x: -28 },
  show: {
    opacity: 1,
    x: 0,
    transition: enter(0.6),
  },
}

export const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: enter(0.62),
  },
}

export const stagger = (staggerChildren = 0.08, delayChildren = 0.06) => ({
  hidden: {},
  show: {
    transition: { staggerChildren, delayChildren, ease: easeOut },
  },
})

export const letterStamp = {
  hidden: { opacity: 0, y: '85%' },
  show: {
    opacity: 1,
    y: '0%',
    transition: { duration: 0.42, ease: easeOut },
  },
}

export const CLIP_FROM = {
  left: { clipPath: 'inset(0 100% 0 0)', x: -16 },
  right: { clipPath: 'inset(0 0 0 100%)', x: 16 },
  top: { clipPath: 'inset(0 0 100% 0)', y: -16 },
  bottom: { clipPath: 'inset(100% 0 0 0)', y: 16 },
}

export const CLIP_SHOW = {
  clipPath: 'inset(0 0 0 0)',
  x: 0,
  y: 0,
  opacity: 1,
}
