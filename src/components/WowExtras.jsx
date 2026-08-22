import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'

export const AnimatedCounter = ({ value, suffix = '', decimals = 0, className = '' }) => {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const [n, setN] = useState(0)
  const isNum = typeof value === 'number'

  useEffect(() => {
    if (!inView || !isNum) return
    let frame
    const start = performance.now()
    const dur = 1200
    const tick = (t) => {
      const p = Math.min(1, (t - start) / dur)
      const eased = 1 - Math.pow(1 - p, 3)
      const raw = value * eased
      setN(decimals > 0 ? Number(raw.toFixed(decimals)) : Math.round(raw))
      if (p < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [inView, value, isNum, decimals])

  return (
    <span ref={ref} className={className}>
      {isNum ? n : value}
      {suffix}
    </span>
  )
}


