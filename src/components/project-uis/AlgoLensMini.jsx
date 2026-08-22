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
  const sum = ARRAY[step.l] + ARRAY[step.r]

  useEffect(() => {
    if (!playing) return undefined
    const t = window.setInterval(() => setI((n) => (n + 1) % STEPS.length), 1600)
    return () => window.clearInterval(t)
  }, [playing])

  return (
    <div className="flex h-full min-h-[340px] flex-col bg-[#09090b] md:min-h-[420px] lg:min-h-[460px]">
      <div className="flex items-center gap-3 border-b border-zinc-800 px-4 py-2.5">
        <span className="grid h-8 w-8 place-items-center rounded-lg border border-amber-400/25 bg-amber-400/10 text-[11px] font-bold text-amber-400">
          {'</>'}
        </span>
        <div>
          <p className="text-[14px] font-semibold text-zinc-100">
            DSA <span className="text-amber-400">Studio</span>
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-zinc-500">Two Pointers · Pair Sum</p>
        </div>
        <div className="ml-auto flex gap-0.5 rounded-lg border border-zinc-800 p-0.5">
          {['JS', 'Py', 'Java'].map((lang, idx) => (
            <span
              key={lang}
              className={`rounded-md px-2.5 py-1 font-mono text-[10px] ${idx === 2 ? 'bg-indigo-400/15 text-indigo-300' : 'text-zinc-500'}`}
            >
              {lang}
            </span>
          ))}
        </div>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-1 gap-3 p-4 md:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4">
          <div className="mb-4 flex items-center justify-between">
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-500">nums · target = 9</p>
            <p className="font-mono text-[12px] text-zinc-300">
              sum <span className={sum === 9 ? 'font-bold text-emerald-400' : 'text-amber-300'}>{sum}</span>
            </p>
          </div>
          <div className="flex items-end justify-center gap-3 pt-6">
            {ARRAY.map((n, idx) => {
              const isL = idx === step.l
              const isR = idx === step.r
              return (
                <div key={idx} className="relative flex flex-col items-center">
                  {isL && (
                    <span className="absolute -top-6 rounded bg-amber-400 px-1.5 py-0.5 font-mono text-[9px] font-bold text-zinc-950">
                      L
                    </span>
                  )}
                  {isR && !isL && (
                    <span className="absolute -top-6 rounded bg-sky-400 px-1.5 py-0.5 font-mono text-[9px] font-bold text-zinc-950">
                      R
                    </span>
                  )}
                  <span
                    className={`grid h-14 w-14 place-items-center rounded-xl border text-lg font-semibold ${
                      isL
                        ? 'border-amber-400 bg-amber-400/20 text-amber-50 shadow-[0_0_20px_rgba(251,191,36,0.4)]'
                        : isR
                          ? 'border-sky-400 bg-sky-400/20 text-sky-50 shadow-[0_0_20px_rgba(56,189,248,0.4)]'
                          : 'border-zinc-800 bg-zinc-900 text-zinc-200'
                    }`}
                  >
                    {n}
                  </span>
                  <span className="mt-1.5 font-mono text-[10px] text-zinc-600">{idx}</span>
                </div>
              )
            })}
          </div>
          <p className="mt-4 font-mono text-[12px] leading-relaxed text-zinc-300">{step.note}</p>
          <div className="mt-3 flex gap-1.5">
            {STEPS.map((_, idx) => (
              <span
                key={idx}
                className={`h-1.5 flex-1 rounded-full ${idx === i ? 'bg-amber-400' : 'bg-zinc-800'}`}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-col rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4">
          <pre className="flex-1 overflow-hidden font-mono text-[11px] leading-relaxed text-zinc-300 md:text-[12px]">{`int l = 0, r = n - 1;
while (l < r) {
  int s = a[l] + a[r];
  if (s == t) return;
  if (s > t) r--;
  else l++;
}`}</pre>
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={() => setPlaying((p) => !p)}
              className="rounded-lg bg-amber-400 px-3 py-1.5 font-mono text-[11px] font-bold text-zinc-950"
            >
              {playing ? 'Pause' : 'Play'}
            </button>
            <button
              type="button"
              onClick={() => {
                setPlaying(false)
                setI((n) => (n + 1) % STEPS.length)
              }}
              className="rounded-lg border border-zinc-700 px-3 py-1.5 font-mono text-[11px] text-zinc-300"
            >
              Step
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
