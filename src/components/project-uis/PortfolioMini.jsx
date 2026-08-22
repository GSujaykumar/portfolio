const SKILLS = ['Java 17', 'Spring Boot', 'JWT', 'MySQL', 'Oracle DB', 'Docker', 'Jenkins']
const WORK = [
  { name: 'Fusion Console', tag: 'Production' },
  { name: 'Teams Adaptive Card', tag: 'Ops' },
  { name: 'AlgoLens', tag: 'Studio' },
  { name: 'Payments Outbox', tag: 'Kafka' },
]

/** Recursive mini of this portfolio — same type, signal color, and sections. */
export default function PortfolioMini() {
  return (
    <div className="flex h-full min-h-[340px] flex-col bg-[#eef3f1] text-[#0a1210] md:min-h-[420px] lg:min-h-[460px]">
      <div className="flex items-center justify-between border-b border-black/10 px-4 py-2.5">
        <p className="font-display text-[15px] font-extrabold tracking-tight">SUJAY</p>
        <div className="hidden gap-4 font-mono text-[10px] uppercase tracking-[0.14em] text-black/40 sm:flex">
          {['Work', 'Skills', 'Contact'].map((l) => (
            <span key={l}>{l}</span>
          ))}
        </div>
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#00b894] opacity-50" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#00b894]" />
        </span>
      </div>
      <div className="relative flex-1 overflow-hidden px-5 py-6">
        <div className="pointer-events-none absolute -right-8 top-0 h-32 w-32 rounded-full bg-[#00b894]/25 blur-2xl" />
        <div className="pointer-events-none absolute bottom-4 left-8 h-24 w-24 rounded-full bg-[#ff5a36]/15 blur-2xl" />
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#00b894]">Backend Java · Hyderabad</p>
        <p className="mt-2 font-display text-[26px] leading-[0.9] tracking-tight md:text-[32px]">
          Stack that
          <br />
          ships backends.
        </p>
        <p className="mt-3 max-w-[280px] text-[12px] leading-relaxed text-[#3d4f49]">
          Java 17 · Spring Boot · Oracle Fusion ops — live operator console, not a mock.
        </p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {SKILLS.map((s) => (
            <span
              key={s}
              className="rounded-md border border-black/10 bg-white px-2 py-1 font-mono text-[10px] text-[#3d4f49]"
            >
              {s}
            </span>
          ))}
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          {WORK.map((w) => (
            <div key={w.name} className="rounded-xl border border-black/10 bg-white px-3 py-2">
              <p className="text-[12px] font-semibold">{w.name}</p>
              <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-[#00b894]">{w.tag}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 inline-flex rounded-full bg-[#0a1210] px-4 py-2 text-[11px] font-bold text-[#eef3f1]">
          Hire me
        </div>
      </div>
    </div>
  )
}
