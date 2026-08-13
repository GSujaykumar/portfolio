import { useEffect } from 'react'
import { toast } from './UxChrome'

const CODE = 'shipit'

/** Type “shipit” anywhere to unlock a tiny celebration */
export default function EasterEgg() {
  useEffect(() => {
    let buf = ''
    const onKey = (e) => {
      if (e.target && ['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return
      if (e.key.length !== 1) return
      buf = (buf + e.key.toLowerCase()).slice(-CODE.length)
      if (buf === CODE) {
        buf = ''
        toast('Secret unlocked · backends that ship ⚡')
        burst()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return null
}

function burst() {
  const root = document.createElement('div')
  root.style.cssText = 'pointer-events:none;position:fixed;inset:0;z-index:99999;overflow:hidden'
  document.body.appendChild(root)
  for (let n = 0; n < 28; n += 1) {
    const d = document.createElement('span')
    const x = 40 + Math.random() * 20
    const color = n % 2 ? '#00b894' : '#ff5a36'
    d.style.cssText = `
      position:absolute;left:${x}%;top:45%;width:8px;height:8px;border-radius:999px;
      background:${color};opacity:0.95;
      transform:translate(-50%,-50%);
      animation:egg-burst 900ms ease-out forwards;
      animation-delay:${n * 12}ms;
      --dx:${(Math.random() - 0.5) * 420}px;
      --dy:${-80 - Math.random() * 280}px;
    `
    root.appendChild(d)
  }
  if (!document.getElementById('egg-burst-style')) {
    const style = document.createElement('style')
    style.id = 'egg-burst-style'
    style.textContent =
      '@keyframes egg-burst{to{transform:translate(calc(-50% + var(--dx)), calc(-50% + var(--dy)));opacity:0}}'
    document.head.appendChild(style)
  }
  window.setTimeout(() => root.remove(), 1200)
}
