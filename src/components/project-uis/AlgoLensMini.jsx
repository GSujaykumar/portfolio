import { useEffect, useState } from 'react'

const ARRAY = [2, 7, 11, 15]
const STEPS = [
  { l: 0, r: 3, note: 'left=2 · right=15 · sum=17 > 9 → move right' },
  { l: 0, r: 2, note: 'left=2 · right=11 · sum=13 > 9 → move right' },
  { l: 0, r: 1, note: 'left=2 · right=7 · sum=9 = target' },
]

/** Mini of AlgoLens DSA Studio — two-pointer pair sum, same pointer colors as Array1DView. */
export default function AlgoLensMini() {
  const [i, setI] = useState(0)
  const [playing, setPlaying] = useState(true)
  const step = STEPS[i]

  useEffect(() => {
    if (!playing) return undefined
    const t = window.setInterval(() => setI((n) => (n + 1) % STEPS.length), 1400)
    return () => window.clearInterval(t)
  }, [playing])

  return (
    <div className="flex h-full min-h-[280px] flex-col bg-[#09090b] md:min-h-[340px]">
      <div className="flex items-center gap-2 border-b border-zinc-800 px-3 py-2">
        <span className="grid h-7 w-7 place-items-center rounded-lg border border-amber-400/25 bg-amber-400/10 text-[10px] font-bold text-amber-400">
          {'</>'}
        </span>
        <div>
          <p className="text-[12px] font-semibold text-zinc-100">
            DSA <span className="text-amber-400">Studio</span>
          </p>
          <p className="font-mono text-[8px] uppercase tracking-[0.14em] text-zinc-500">Two Pointers · Pair Sum</p>
        </div>
        <div className="ml-auto flex gap-0.5 rounded-lg border border-zinc-800 p-0.5">
          {['JS', 'Py', 'Java'].map((lang, idx) => (
            <span
              key={lang}
              className={`rounded-md px-2 py-0.5 font-mono text-[9px] ${idx === 2 ? 'bg-indigo-400/15 text-indigo-300' : 'text-zinc-500'}`}
            >
              {lang}
            </span>
          ))}
        </div>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-[1fr_0.85fr] gap-2 p-3">
        <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-2">
          <p className="mb-2 font-mono text-[8px] uppercase tracking-[0.14em] text-zinc-500">nums · target = 9</p>
          <div className="flex items-end justify-center gap-2 pt-5">
            {ARRAY.map((n, idx) => {
              const isL = idx === step.l
              const isR = idx === step.r
              return (
                <div key={idx} className="relative flex flex-col items-center">
                  {isL && (
                    <span className="absolute -top-5 font-mono text-[8px] font-bold text-amber-400">L</span>
                  )}
                  {isR && (
                    <span className="absolute -top-5 font-mono text-[8px] font-bold text-sky-400">R</span>
                  )}
                  <span
                    className={`grid h-10 w-10 place-items-center rounded-lg border text-sm font-semibold ${
                      isL
                        ? 'border-amber-400 bg-amber-400/20 text-amber-50 shadow-[0_0_16px_rgba(251,191,36,0.35)]'
                        : isR
                          ? 'border-sky-400 bg-sky-400/20 text-sky-50 shadow-[0_0_16px_rgba(56,189,248,0.35)]'
                          : 'border-zinc-800 bg-zinc-900 text-zinc-200'
                    }`}
                  >
                    {n}
                  </span>
                  <span className="mt-1 font-mono text-[8px] text-zinc-600">{idx}</span>
                </div>
              )
            })}
          </div>
          <p className="mt-3 font-mono text-[9px] leading-relaxed text-zinc-400">{step.note}</p>
        </div>
        <div className="flex flex-col rounded-xl border border-zinc-800 bg-zinc-950/60 p-2">
          <pre className="flex-1 overflow-hidden font-mono text-[9px] leading-relaxed text-zinc-400">{`int l = 0, r = n-1;
while (l < r) {
  int s = a[l] + a[r];
  if (s == t) return;
  if (s > t) r--;
  else l++;
}`}</pre>
          <div className="mt-2 flex gap-1">
            <button
              type="button"
              onClick={() => setPlaying((p) => !p)}
              className="rounded-md bg-amber-400/15 px-2 py-1 font-mono text-[9px] text-amber-300"
            >
              {playing ? 'Pause' : 'Play'}
            </button>
            <button
              type="button"
              onClick={() => setI((n) => (n + 1) % STEPS.length)}
              className="rounded-md border border-zinc-800 px-2 py-1 font-mono text-[9px] text-zinc-400"
            >
              Step
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
