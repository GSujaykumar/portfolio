import { useRef } from 'react'
import { motion, useMotionTemplate, useMotionValue, useSpring, useReducedMotion } from 'framer-motion'

/** 3D tilt + spotlight on pointer move */
export default function TiltCard({ children, className = '', maxTilt = 10 }) {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const rotateX = useMotionValue(0)
  const rotateY = useMotionValue(0)
  const glareX = useMotionValue(50)
  const glareY = useMotionValue(50)

  const sx = useSpring(rotateX, { stiffness: 200, damping: 20 })
  const sy = useSpring(rotateY, { stiffness: 200, damping: 20 })
  const glare = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.28), transparent 55%)`

  if (reduce) {
    return <div className={className}>{children}</div>
  }

  const onMove = (e) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width
    const py = (e.clientY - rect.top) / rect.height
    rotateX.set((0.5 - py) * maxTilt * 2)
    rotateY.set((px - 0.5) * maxTilt * 2)
    glareX.set(px * 100)
    glareY.set(py * 100)
  }

  const onLeave = () => {
    rotateX.set(0)
    rotateY.set(0)
    glareX.set(50)
    glareY.set(50)
  }

  return (
    <motion.div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={{
        rotateX: sx,
        rotateY: sy,
        transformStyle: 'preserve-3d',
        perspective: 1000,
      }}
      className={`relative ${className}`}
    >
      {children}
      <motion.div
        aria-hidden
        style={{ background: glare }}
        className="pointer-events-none absolute inset-0 z-10 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />
    </motion.div>
  )
}
