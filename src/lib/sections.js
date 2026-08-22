/** Section ids in page order — used by the dock, keyboard hop, and tour robot. */
export const SECTION_IDS = [
  'home',
  'work',
  'impact',
  'highlights',
  'about',
  'experience',
  'terminal',
  'skills',
  'education',
  'resume',
  'contact',
]

/** Last section whose top has crossed `offsetRatio` of the viewport. */
export function readActiveSection(offsetRatio = 0.36) {
  if (typeof window === 'undefined') return 'home'
  const line = window.innerHeight * offsetRatio
  let current = SECTION_IDS[0]
  for (const id of SECTION_IDS) {
    const el = document.getElementById(id)
    if (!el) continue
    if (el.getBoundingClientRect().top <= line) current = id
  }
  return current
}
