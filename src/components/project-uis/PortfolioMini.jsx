const SKILLS = ['Java 17', 'Spring Boot', 'JWT', 'MySQL', 'Oracle DB', 'Docker', 'Jenkins']
const WORK = ['Fusion Console', 'Teams Adaptive Card', 'AlgoLens', 'Payments Outbox']

/** Recursive mini of this portfolio — same type, signal color, and sections. */
export default function PortfolioMini() {
  return (
    <div className="flex h-full min-h-[280px] flex-col bg-[#eef3f1] text-[#0a1210] md:min-h-[340px]">
      <div className="flex items-center justify-between border-b border-black/10 px-3 py-2">
        <p className="font-display text-[13px] font-extrabold tracking-tight">SUJAY</p>
        <div className="hidden gap-3 font-mono text-[8px] uppercase tracking-[0.14em] text-black/40 sm:flex">
          {['Work', 'Skills', 'Contact'].map((l) => (
            <span key={l}>{l}</span>
          ))}
        </div>
        <span className="h-2 w-2 rounded-full bg-[#00b894]" />
      </div>
      <div className="relative flex-1 overflow-hidden px-4 py-5">
        <div className="pointer-events-none absolute -right-6 top-2 h-24 w-24 rounded-full bg-[#00b894]/20 blur-2xl" />
        <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-[#00b894]">Backend · Hyderabad</p>
        <p className="mt-2 font-display text-[22px] leading-[0.9] tracking-tight md:text-[26px]">
          Stack that
          <br />
          ships backends.
        </p>
        <p className="mt-2 max-w-[220px] text-[10px] leading-relaxed text-[#3d4f49]">
          Java 17 · Spring Boot · Oracle Fusion ops · live operator console.
        </p>
        <div className="mt-3 flex flex-wrap gap-1">
          {SKILLS.map((s) => (
            <span key={s} className="rounded-md border border-black/10 bg-white px-1.5 py-0.5 font-mono text-[8px] text-[#3d4f49]">
              {s}
            </span>
          ))}
        </div>
        <div className="mt-4 grid grid-cols-2 gap-1.5">
          {WORK.map((w) => (
            <div key={w} className="rounded-lg border border-black/10 bg-white px-2 py-1.5">
              <p className="text-[10px] font-semibold">{w}</p>
              <p className="font-mono text-[8px] text-black/40">Selected work</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
