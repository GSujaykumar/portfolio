import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

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

export const TechMarquee = () => {
  const items = [
    'Java 17',
    'Spring Boot',
    'Spring Security',
    'JWT',
    'REST APIs',
    'Microservices',
    'Hibernate',
    'MySQL',
    'Oracle DB',
    'Apache Kafka',
    'Redis',
    'Docker',
    'Jenkins',
    'CI/CD',
    'JUnit',
    'Mockito',
    'Testcontainers',
    'Resilience4j',
    'Prometheus',
    'Grafana',
    'Zipkin',
    'Oracle Fusion',
    'SOLID',
    'Design Patterns',
  ]
  const row = [...items, ...items]

  return (
    <section className="overflow-hidden border-y border-[var(--line)] bg-[var(--bg-elevated)] py-8" aria-hidden="true">
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-[var(--bg-elevated)] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-[var(--bg-elevated)] to-transparent" />
        <motion.div
          className="flex w-max gap-10"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 32, ease: 'linear', repeat: Infinity }}
        >
          {row.map((item, i) => (
            <span
              key={`${item}-${i}`}
              className="font-display text-2xl font-semibold text-[var(--ink)]/15 md:text-4xl"
            >
              {item}
              <span className="ml-10 text-[var(--accent-2)]">●</span>
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

