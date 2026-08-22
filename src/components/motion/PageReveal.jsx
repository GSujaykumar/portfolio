import { useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { easeLux, springStamp } from '../../lib/motion'

/**
 * Section enter — light travel, no scale (scale fights Lenis / sticky).
 */
export default function PageReveal({ children, className = '', delay = 0, y = 28 }) {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const inView = useInView(ref, { once: true, amount: 0.08, margin: '0px 0px -10% 0px' })

  if (reduce) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      ref={ref}
      className={`gpu-layer ${className}`}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      transition={{ duration: 0.55, ease: easeLux, delay }}
    >
      {children}
    </motion.div>
  )
}

export function StampIn({ children, className = '', delay = 0 }) {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const inView = useInView(ref, { once: true, amount: 0.12, margin: '0px 0px -8% 0px' })

  if (reduce) return <div className={className}>{children}</div>

  return (
    <motion.div
      ref={ref}
      className={`gpu-layer ${className}`}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
      transition={{ ...springStamp, delay }}
    >
      {children}
    </motion.div>
  )
}
