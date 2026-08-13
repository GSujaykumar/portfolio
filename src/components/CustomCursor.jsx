import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'

const CustomCursor = () => {
  const [mounted, setMounted] = useState(false)
  const [enabled, setEnabled] = useState(false)
  const [mode, setMode] = useState('default')
  const [label, setLabel] = useState('')
  const [clickPulse, setClickPulse] = useState(0)

  const dotRef = useRef(null)
  const ringRef = useRef(null)
  const pos = useRef({ x: 0, y: 0, rx: 0, ry: 0, shown: false })
  const rafRef = useRef(0)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const canHover =
      window.matchMedia('(hover: hover)').matches ||
      window.matchMedia('(any-pointer: fine)').matches ||
      window.matchMedia('(pointer: fine)').matches

    if (!canHover) {
      setEnabled(false)
      return undefined
    }

    setEnabled(true)

    const posNow = pos.current
    const paint = () => {
      posNow.rx += (posNow.x - posNow.rx) * 0.22
      posNow.ry += (posNow.y - posNow.ry) * 0.22

      const dot = dotRef.current
      const ring = ringRef.current
      if (dot) {
        dot.style.transform = `translate3d(${posNow.x}px, ${posNow.y}px, 0) translate(-50%, -50%)`
      }
      if (ring) {
        ring.style.transform = `translate3d(${posNow.rx}px, ${posNow.ry}px, 0) translate(-50%, -50%)`
      }
      rafRef.current = requestAnimationFrame(paint)
    }
    rafRef.current = requestAnimationFrame(paint)

    const show = () => {
      if (posNow.shown) return
      posNow.shown = true
      document.documentElement.classList.add('crazy-cursor')
      dotRef.current?.style.setProperty('opacity', '1')
      ringRef.current?.style.setProperty('opacity', '1')
    }

    const hide = () => {
      posNow.shown = false
      document.documentElement.classList.remove('crazy-cursor')
      dotRef.current?.style.setProperty('opacity', '0')
      ringRef.current?.style.setProperty('opacity', '0')
    }

    const onMove = (e) => {
      posNow.x = e.clientX
      posNow.y = e.clientY
      if (!posNow.shown) {
        posNow.rx = e.clientX
        posNow.ry = e.clientY
      }
      show()
    }

    const onOver = (e) => {
      const el = e.target.closest?.('[data-cursor], a, button, .project-card, .magnetic-hit')
      if (!el) {
        setMode('default')
        setLabel('')
        return
      }
      const custom = el.getAttribute?.('data-cursor')
      if (custom === 'view') {
        setMode('hover')
        setLabel('VIEW')
      } else if (custom === 'go' || custom === 'mail') {
        setMode('hover')
        setLabel(custom === 'mail' ? 'MAIL' : 'GO')
      } else {
        setMode('hover')
        setLabel('')
      }
    }

    const onDown = () => setClickPulse((n) => n + 1)

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('pointerdown', onDown)
    document.addEventListener('mouseover', onOver)
    document.documentElement.addEventListener('mouseleave', hide)
    document.documentElement.addEventListener('mouseenter', show)

    return () => {
      cancelAnimationFrame(rafRef.current)
      document.documentElement.classList.remove('crazy-cursor')
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('pointerdown', onDown)
      document.removeEventListener('mouseover', onOver)
      document.documentElement.removeEventListener('mouseleave', hide)
      document.documentElement.removeEventListener('mouseenter', show)
    }
  }, [mounted])

  if (!mounted || !enabled) return null

  const isBig = mode === 'hover'

  return createPortal(
    <div className="pointer-events-none fixed inset-0 z-[99999]" aria-hidden="true">
      <div
        ref={ringRef}
        className={`absolute left-0 top-0 rounded-full border-2 border-[var(--signal)] transition-[width,height] duration-200 ease-out ${
          isBig ? 'h-[72px] w-[72px]' : 'h-9 w-9'
        }`}
        style={{ opacity: 0, willChange: 'transform' }}
      />
      <div
        ref={dotRef}
        className={`cursor-core absolute left-0 top-0 flex items-center justify-center rounded-full transition-[width,height,background-color] duration-200 ease-out ${
          isBig ? 'h-[52px] w-[52px] bg-[var(--ink)]' : 'h-3.5 w-3.5 bg-[var(--signal)]'
        }`}
        style={{ opacity: 0, willChange: 'transform' }}
      >
        <AnimatePresence>
          {label && (
            <motion.span
              key={label}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              className="font-display text-[10px] tracking-wider text-[var(--bg)]"
            >
              {label}
            </motion.span>
          )}
        </AnimatePresence>
        <AnimatePresence>
          <motion.div
            key={clickPulse}
            initial={{ scale: 0.3, opacity: 0.45 }}
            animate={{ scale: 2.4, opacity: 0 }}
            transition={{ duration: 0.45 }}
            className="absolute h-8 w-8 rounded-full border border-[var(--signal)]"
          />
        </AnimatePresence>
      </div>
    </div>,
    document.body
  )
}

export default CustomCursor
