import { useEffect, useState } from 'react'
import { FaMoon, FaSun } from 'react-icons/fa'

const STORAGE_KEY = 'portfolio-theme'

export function applyTheme(theme) {
  const next = theme === 'dark' ? 'dark' : 'light'
  document.documentElement.setAttribute('data-theme', next)
  try {
    localStorage.setItem(STORAGE_KEY, next)
  } catch {
    /* ignore */
  }
  return next
}

export function getInitialTheme() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === 'dark' || saved === 'light') return saved
  } catch {
    /* ignore */
  }
  if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark'
  }
  return 'light'
}

const ThemeToggle = ({ compact = false }) => {
  const [theme, setTheme] = useState('light')

  useEffect(() => {
    setTheme(applyTheme(getInitialTheme()))
  }, [])

  const set = (next) => setTheme(applyTheme(next))

  if (compact) {
    return (
      <button
        type="button"
        data-cursor="go"
        aria-label={theme === 'dark' ? 'Switch to white theme' : 'Switch to black theme'}
        onClick={() => set(theme === 'dark' ? 'light' : 'dark')}
        className="bubble-btn !h-12 !w-12 md:!h-14 md:!w-14"
      >
        {theme === 'dark' ? <FaSun size={14} /> : <FaMoon size={14} />}
      </button>
    )
  }

  return (
    <div className="theme-toggle" role="group" aria-label="Theme">
      <button
        type="button"
        data-cursor="go"
        data-active={theme === 'light'}
        onClick={() => set('light')}
        aria-pressed={theme === 'light'}
      >
        <FaSun size={10} className="mr-1" /> White
      </button>
      <button
        type="button"
        data-cursor="go"
        data-active={theme === 'dark'}
        onClick={() => set('dark')}
        aria-pressed={theme === 'dark'}
      >
        <FaMoon size={10} className="mr-1" /> Black
      </button>
    </div>
  )
}

export default ThemeToggle
