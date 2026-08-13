import { useRef } from 'react'
import { motion, useInView, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { easeLux, springStamp } from '../../lib/motion'

/**
 * Dramatic section reveal + light scroll parallax on the inner layer.
 */
export default function PageReveal({ children, className = '', delay = 0, y = 56 }) {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const inView = useInView(ref, { once: true, amount: 0 })
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const parallax = useTransform(scrollYProgress, [0, 1], [24, -24])

  if (reduce) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y, scale: 0.97 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y, scale: 0.97 }}
      transition={{ duration: 0.95, ease: easeLux, delay }}
    >
      <motion.div style={{ y: parallax }}>{children}</motion.div>
    </motion.div>
  )
}

export function StampIn({ children, className = '', delay = 0 }) {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const inView = useInView(ref, { once: true, amount: 0.15 })

  if (reduce) return <div className={className}>{children}</div>

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, scale: 1.25, y: 48, rotate: -4 }}
      animate={
        inView
          ? { opacity: 1, scale: 1, y: 0, rotate: 0 }
          : { opacity: 0, scale: 1.25, y: 48, rotate: -4 }
      }
      transition={{ ...springStamp, delay }}
    >
      {children}
    </motion.div>
  )
}
