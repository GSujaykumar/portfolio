/** First-visit robot greeting — time of day, clock, day-elapsed. */

export const GREET_SEEN_KEY = 'portfolio-greeting-seen'
export const GREET_SOUND_KEY = 'portfolio-greeting-sound'
export const GREET_REPLAY_EVENT = 'portfolio:replay-greeting'

export const BLUR_HOLD_MS = 3000
export const UNVEIL_MS = 1400
export const EXIT_MS = 720

/** Morning 5am–12pm, Afternoon 12pm–5pm, Evening 5pm–5am */
export function greetingForHour(hour) {
  if (hour >= 5 && hour < 12) return { greeting: 'Good Morning', period: 'morning' }
  if (hour >= 12 && hour < 17) return { greeting: 'Good Afternoon', period: 'afternoon' }
  return { greeting: 'Good Evening', period: 'evening' }
}

export function getVisitMoment(date = new Date()) {
  const hour = date.getHours()
  const { greeting, period } = greetingForHour(hour)
  return {
    hour,
    minute: date.getMinutes(),
    greeting,
    period,
    dayElapsed: Math.round((hour / 24) * 100),
    timeLabel: date.toLocaleTimeString(undefined, {
      hour: 'numeric',
      minute: '2-digit',
    }),
    wish: `${greeting} — welcome in.`,
  }
}

export function hasSeenGreeting() {
  try {
    return sessionStorage.getItem(GREET_SEEN_KEY) === '1'
  } catch {
    return false
  }
}

export function markGreetingSeen() {
  try {
    sessionStorage.setItem(GREET_SEEN_KEY, '1')
  } catch {
    /* ignore */
  }
}

export function clearGreetingSeen() {
  try {
    sessionStorage.removeItem(GREET_SEEN_KEY)
  } catch {
    /* ignore */
  }
}

export function isGreetingSoundOn() {
  try {
    return localStorage.getItem(GREET_SOUND_KEY) === '1'
  } catch {
    return false
  }
}

export function setGreetingSound(on) {
  try {
    localStorage.setItem(GREET_SOUND_KEY, on ? '1' : '0')
  } catch {
    /* ignore */
  }
}

export function speakWish(text) {
  if (typeof window === 'undefined' || !window.speechSynthesis) return
  window.speechSynthesis.cancel()
  const utter = new SpeechSynthesisUtterance(text)
  utter.rate = 0.96
  utter.pitch = 1.04
  utter.volume = 0.85
  window.speechSynthesis.speak(utter)
}

export function stopWishSpeech() {
  if (typeof window === 'undefined' || !window.speechSynthesis) return
  window.speechSynthesis.cancel()
}

export function requestGreetingReplay() {
  clearGreetingSeen()
  window.dispatchEvent(new Event(GREET_REPLAY_EVENT))
}
