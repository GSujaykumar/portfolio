/** Signal-world motion — smoother + crazier (springy, bouncy, still readable). */

export const easeOut = [0.16, 1, 0.3, 1]
export const easeSnap = [0.22, 1.4, 0.36, 1]
export const easeWorld = [0.65, 0, 0.35, 1]
export const easeLux = [0.19, 1, 0.22, 1]

export const springStamp = { type: 'spring', stiffness: 260, damping: 18, mass: 0.75 }
export const springSoft = { type: 'spring', stiffness: 90, damping: 18, mass: 0.85 }
export const springHeavy = { type: 'spring', stiffness: 55, damping: 14, mass: 1.1 }
export const springCrazy = { type: 'spring', stiffness: 180, damping: 12, mass: 0.7 }

/** Easy trigger — fire as soon as a section nears the viewport (no stuck-hidden) */
export const viewportOnce = { once: true, amount: 0, margin: '120px 0px 120px 0px' }

export const stamp = {
  hidden: { opacity: 0, y: 64, scale: 0.92, rotate: -2 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    rotate: 0,
    transition: { ...springStamp, duration: 0.9 },
  },
}

export const slideLeft = {
  hidden: { opacity: 0, x: -72, rotate: -3 },
  show: {
    opacity: 1,
    x: 0,
    rotate: 0,
    transition: springSoft,
  },
}

export const slideRight = {
  hidden: { opacity: 0, x: 72, rotate: 3 },
  show: {
    opacity: 1,
    x: 0,
    rotate: 0,
    transition: springSoft,
  },
}

export const flipIn = {
  hidden: { opacity: 0, y: 48, scale: 0.9, rotateX: 18 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    rotateX: 0,
    transition: { duration: 0.9, ease: easeLux },
  },
}

export const wipeX = {
  hidden: { opacity: 0, x: -56, skewX: 4 },
  show: {
    opacity: 1,
    x: 0,
    skewX: 0,
    transition: { duration: 0.8, ease: easeOut },
  },
}

export const fadeUp = {
  hidden: { opacity: 0, y: 56, scale: 0.97 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.95, ease: easeLux },
  },
}

export const stagger = (staggerChildren = 0.1, delayChildren = 0.08) => ({
  hidden: {},
  show: {
    transition: { staggerChildren, delayChildren },
  },
})

export const letterStamp = {
  hidden: { opacity: 0, y: '110%', rotate: 8 },
  show: {
    opacity: 1,
    y: '0%',
    rotate: 0,
    transition: springCrazy,
  },
}
