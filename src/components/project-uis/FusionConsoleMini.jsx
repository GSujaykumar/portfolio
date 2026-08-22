import { useEffect, useMemo, useRef, useState } from 'react'
import { FUSION_MODULES, FUSION_NAV, MAIL_RUNS, MAIL_STATS, API_PRESETS, GENERATE_SCALES } from '../../data/fusion'

const fmt = (n) => new Intl.NumberFormat('en-IN').format(Math.max(0, Math.floor(n)))

function useGenerateJob(scale, runKey) {
  const [done, setDone] = useState(0)
  const [status, setStatus] = useState('running')
  const started = useRef(performance.now())

  useEffect(() => {
    started.current = performance.now()
    setDone(0)
    setStatus('running')
    let raf = 0
    let lastUi = 0
    const tick = () => {
      const p = Math.min(1, (performance.now() - started.current) / scale.simMs)
      const now = performance.now()
      const crash = scale.crashAt != null && p >= scale.crashAt
      const doneNow = crash ? scale.queries * scale.crashAt : p >= 1 ? scale.queries : scale.queries * p
      if (now - lastUi > 80 || crash || p >= 1) {
        lastUi = now
        setDone(doneNow)
        if (crash) {
          setStatus('oom')
          return
        }
        if (p >= 1) {
          setStatus('done')
          return
        }
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [scale, runKey])

  return { done, status, progress: done / scale.queries }
}

function Generate() {
  const [activeId, setActiveId] = useState('proven')
  const [runKey, setRunKey] = useState(0)
  const [clock, setClock] = useState(() =>
    new Date().toLocaleTimeString('en-IN', { hour12: false, timeZone: 'Asia/Kolkata' })
  )
  const scale = useMemo(() => GENERATE_SCALES.find((s) => s.id === activeId) || GENERATE_SCALES[0], [activeId])
  const job = useGenerateJob(scale, runKey)

  useEffect(() => {
    const id = window.setInterval(() => {
      setClock(new Date().toLocaleTimeString('en-IN', { hour12: false, timeZone: 'Asia/Kolkata' }))
    }, 1000)
    return () => window.clearInterval(id)
  }, [])

  const tone =
    job.status === 'oom' ? '#ff6b8a' : job.status === 'done' ? '#20c997' : '#7ea0ff'
  const label = job.status === 'running' ? 'GENERATING' : job.status === 'done' ? 'COMPLETE' : 'OOM ABORT'

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="border-b border-white/10 px-4 py-3">
        <div className="flex items-center justify-between gap-2">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#7ea0ff]">
            Segment 3/5 · live generate
          </p>
          <span className="font-mono text-[10px] text-[#6b7690]">{clock} IST</span>
        </div>
        <div className="mt-2 flex items-end justify-between gap-3">
          <div>
            <p className="font-mono text-[22px] font-bold tabular-nums text-white">
              {fmt(job.done)}
              <span className="ml-1 text-[11px] font-medium text-[#6b7690]">/ {fmt(scale.queries)} queries</span>
            </p>
            <p className="mt-0.5 font-mono text-[10px] text-[#6b7690]">{scale.rowsLabel} · 7thoctSeg5-sql.txt</p>
          </div>
          <span
            className="rounded-md px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-[0.14em]"
            style={{ color: tone, background: `${tone}22` }}
          >
            {label}
          </span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full transition-[width] duration-150"
            style={{
              width: `${Math.min(100, job.progress * 100)}%`,
              background: job.status === 'oom' ? '#ff6b8a' : 'linear-gradient(90deg,#7ea0ff,#20c997)',
            }}
          />
        </div>
      </div>
      <div className="min-h-0 flex-1 overflow-auto">
        <table className="w-full min-w-[560px] border-collapse text-left text-[11px] text-[#d5dce8]">
          <thead className="sticky top-0 bg-[#06080f]">
            <tr className="border-b border-white/10 font-mono text-[9px] uppercase tracking-[0.12em] text-[#6b7690]">
              <th className="px-3 py-2 font-medium">Excel rows</th>
              <th className="px-3 py-2 font-medium">Queries</th>
              <th className="px-3 py-2 font-medium">Time</th>
              <th className="px-3 py-2 font-medium">Finish?</th>
            </tr>
          </thead>
          <tbody>
            {GENERATE_SCALES.map((row) => {
              const on = row.id === activeId
              const c = row.verdict === 'ok' ? '#20c997' : row.verdict === 'warn' ? '#ffb020' : '#ff6b8a'
              return (
                <tr
                  key={row.id}
                  onClick={() => {
                    setActiveId(row.id)
                    setRunKey((n) => n + 1)
                  }}
                  className={`cursor-pointer border-b border-white/[0.06] ${on ? 'bg-white/[0.06]' : 'hover:bg-white/[0.03]'}`}
                >
                  <td className="px-3 py-2 font-semibold text-white">{row.rowsLabel}</td>
                  <td className="px-3 py-2 font-mono tabular-nums">
                    {on ? fmt(job.done) : fmt(row.queries)}
                  </td>
                  <td className="px-3 py-2">{row.time}</td>
                  <td className="px-3 py-2">
                    <span className="font-medium" style={{ color: c }}>
                      {row.finish}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

const TONE = {
  ok: { text: 'text-[#20c997]', bg: 'bg-[#20c997]/15', label: 'OK' },
  idle: { text: 'text-[#ffb020]', bg: 'bg-[#ffb020]/15', label: 'IDLE' },
  warn: { text: 'text-[#ffb020]', bg: 'bg-[#ffb020]/15', label: 'WARN' },
  fail: { text: 'text-[#ff6b8a]', bg: 'bg-[#ff6b8a]/15', label: 'FAIL' },
}

const SPARK = [8, 11, 9, 14, 12, 16, 13, 18, 15, 19]

function Spark({ color = '#7ea0ff' }) {
  const max = Math.max(...SPARK)
  return (
    <div className="mt-2 flex h-9 items-end gap-[3px]">
      {SPARK.map((v, i) => (
        <span
          key={i}
          className="flex-1 rounded-[2px]"
          style={{ height: `${Math.max(18, (v / max) * 100)}%`, background: color, opacity: 0.35 + (i / SPARK.length) * 0.65 }}
        />
      ))}
    </div>
  )
}

function Overview() {
  const healthy = FUSION_MODULES.filter((m) => m.status === 'ok').length
  return (
    <div className="space-y-3 p-4">
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#7ea0ff]">Oracle Fusion Ops</p>
        <p className="mt-1 font-[Syne,sans-serif] text-[18px] font-extrabold leading-tight tracking-tight text-[#f0f3fa] md:text-[20px]">
          Production control for finance automation
        </p>
      </div>
      <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
        {[
          ['Mail OK', `${MAIL_STATS.ok}/${MAIL_STATS.total}`, '#20c997'],
          ['Failed', String(MAIL_STATS.failed), '#ff6b8a'],
          ['Modules', `${healthy}/${FUSION_MODULES.length}`, '#7ea0ff'],
          ['Daily', 'OK', '#20c997'],
        ].map(([k, v, c]) => (
          <div key={k} className="rounded-xl border border-white/10 bg-[#101624] px-2.5 py-2">
            <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#6b7690]">{k}</p>
            <p className="mt-1 text-[16px] font-bold" style={{ color: c }}>
              {v}
            </p>
            <Spark color={c} />
          </div>
        ))}
      </div>
      <div className="space-y-1.5">
        {FUSION_MODULES.slice(0, 4).map((m) => {
          const tone = TONE[m.status] || TONE.idle
          return (
            <div
              key={m.name}
              className="flex items-center justify-between gap-3 rounded-lg border border-white/[0.06] bg-white/[0.03] px-3 py-2"
            >
              <div className="min-w-0">
                <p className="truncate text-[12px] font-semibold text-white">{m.name}</p>
                <p className="truncate font-mono text-[10px] text-[#6b7690]">{m.table}</p>
              </div>
              <span className={`shrink-0 rounded-md px-2 py-0.5 font-mono text-[9px] uppercase ${tone.bg} ${tone.text}`}>
                {tone.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function Modules() {
  return (
    <div className="space-y-2 overflow-y-auto p-4">
      {FUSION_MODULES.map((m) => {
        const tone = TONE[m.status] || TONE.idle
        return (
          <div key={m.name} className="rounded-xl border border-white/10 bg-[#101624] px-3 py-2.5">
            <div className="flex items-center justify-between gap-2">
              <p className="truncate text-[13px] font-semibold text-white">{m.name}</p>
              <span className={`rounded-md px-2 py-0.5 font-mono text-[9px] uppercase ${tone.bg} ${tone.text}`}>
                {tone.label}
              </span>
            </div>
            <p className="mt-1 font-mono text-[10px] text-[#6b7690]">
              {m.launcher} · {m.table}
            </p>
          </div>
        )
      })}
    </div>
  )
}

function Mail() {
  return (
    <div className="overflow-y-auto p-4">
      <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.16em] text-[#6b7690]">Mail-History.txt</p>
      {MAIL_RUNS.map((r) => (
        <div key={r.when + r.file} className="mb-2 flex items-start gap-3 rounded-lg border border-white/[0.06] bg-white/[0.03] px-3 py-2">
          <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#20c997]" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[12px] font-medium text-white">{r.file}</p>
            <p className="font-mono text-[10px] text-[#6b7690]">
              {r.task} · {r.from} · {r.when}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}

function ApiRunner() {
  const [i, setI] = useState(0)
  const p = API_PRESETS[i]
  return (
    <div className="space-y-3 p-4">
      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#6b7690]">saved-apis.json</p>
      <div className="flex flex-wrap gap-1.5">
        {API_PRESETS.map((a, idx) => (
          <button
            key={a.name}
            type="button"
            onClick={() => setI(idx)}
            className={`rounded-md px-2.5 py-1 font-mono text-[10px] font-bold ${
              idx === i ? 'bg-[#ffb020]/20 text-[#ffb020]' : 'bg-white/5 text-white/50'
            }`}
          >
            {a.method}
          </button>
        ))}
      </div>
      <p className="text-[14px] font-semibold text-white">{p.name}</p>
      <p className="break-all rounded-lg border border-white/10 bg-black/30 px-3 py-2 font-mono text-[11px] leading-relaxed text-[#74c0fc]">
        {p.url}
      </p>
      <p className="font-mono text-[10px] text-[#6b7690]">glDate token substituted per day in range</p>
    </div>
  )
}

function Daily() {
  return (
    <div className="space-y-2.5 p-4">
      <div className="rounded-lg bg-[#dff6dd] px-4 py-3 text-center text-[15px] font-bold text-[#0b6a0b]">
        STATUS: OK
      </div>
      <p className="font-mono text-[10px] text-[#6b7690]">teams-adaptive-card.json · 14:33 IST · Asia/Kolkata</p>
      {['STEP1 TALLY (CASH & CARD)', 'STEP-5 BANK TALLY', 'STEP-6 DD TALLY', 'STEP-6 CHEQUE TALLY'].map((s) => (
        <div key={s} className="flex items-center justify-between rounded-lg border border-white/10 bg-[#101624] px-3 py-2.5">
          <span className="text-[12px] text-white/80">{s}</span>
          <span className="font-mono text-[11px] font-bold text-[#20c997]">TALLY OK</span>
        </div>
      ))}
    </div>
  )
}

const VIEWS = { generate: Generate, overview: Overview, modules: Modules, daily: Daily, mail: Mail, apirunner: ApiRunner }

const GROUPS = [
  { label: 'Live', ids: ['generate'] },
  { label: 'Workspace', ids: ['overview', 'modules'] },
  { label: 'Tools', ids: ['daily'] },
  { label: 'Automation', ids: ['mail', 'apirunner'] },
]

/** Interactive Fusion Console — same nav + real workspace modules / mail / APIs. */
export default function FusionConsoleMini() {
  const [view, setView] = useState('generate')
  const Screen = VIEWS[view] || Generate

  return (
    <div className="grid h-full min-h-[340px] grid-cols-[132px_1fr] bg-[#06080f] text-[12px] md:min-h-[420px] md:grid-cols-[168px_1fr] lg:min-h-[460px]">
      <aside className="flex flex-col border-r border-white/[0.07] bg-[#070a12] p-2.5">
        <div className="mb-4 flex items-center gap-2 px-1">
          <span className="grid h-8 w-8 place-items-center rounded-[10px] bg-gradient-to-br from-[#7ea0ff] to-[#3d5bd6] text-[11px] font-bold text-white">
            F
          </span>
          <div className="min-w-0">
            <p className="truncate text-[12px] font-bold text-white">Fusion Console</p>
            <p className="font-mono text-[8px] uppercase tracking-[0.14em] text-[#6b7690]">Oracle Ops</p>
          </div>
        </div>
        {GROUPS.map((g) => (
          <div key={g.label} className="mb-3">
            <p className="px-2 pb-1 font-mono text-[8px] uppercase tracking-[0.16em] text-[#6b7690]">{g.label}</p>
            {g.ids.map((id) => {
              const n = FUSION_NAV.find((item) => item.id === id)
              if (!n) return null
              return (
                <button
                  key={n.id}
                  type="button"
                  onClick={() => setView(n.id)}
                  className={`mb-0.5 w-full rounded-md px-2 py-1.5 text-left text-[11px] ${
                    view === n.id ? 'bg-[#7ea0ff]/15 font-semibold text-[#7ea0ff]' : 'text-[#9aa6c0] hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {n.label}
                </button>
              )
            })}
          </div>
        ))}
        <div className="mt-auto px-2 pt-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#20c997]/15 px-2 py-0.5 font-mono text-[8px] uppercase tracking-[0.12em] text-[#20c997]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#20c997]" />
            All systems go
          </span>
        </div>
      </aside>
      <div className={`flex min-h-0 flex-col ${view === 'generate' ? 'overflow-hidden' : 'overflow-y-auto'}`}>
        <div className="flex h-10 shrink-0 items-center justify-between border-b border-white/[0.07] px-4">
          <span className="text-[12px] font-semibold text-white/80">
            {FUSION_NAV.find((n) => n.id === view)?.label}
          </span>
          <span className="rounded bg-[#20c997]/15 px-2 py-0.5 font-mono text-[9px] font-bold text-[#20c997]">LIVE</span>
        </div>
        <div className={view === 'generate' ? 'min-h-0 flex-1 overflow-hidden' : ''}>
          <Screen />
        </div>
      </div>
    </div>
  )
}
