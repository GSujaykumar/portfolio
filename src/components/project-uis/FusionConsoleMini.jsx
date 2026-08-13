import { useState } from 'react'
import { FUSION_MODULES, FUSION_NAV, MAIL_RUNS, MAIL_STATS, API_PRESETS } from '../../data/fusion'

const TONE = {
  ok: 'text-[#20c997]',
  idle: 'text-[#6b7690]',
  warn: 'text-[#ffb020]',
  fail: 'text-[#ff6b8a]',
}

function Overview() {
  const healthy = FUSION_MODULES.filter((m) => m.status === 'ok').length
  return (
    <div className="space-y-2.5 p-3">
      <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#7ea0ff]">Oracle Fusion Ops</p>
      <p className="font-[Syne,sans-serif] text-[15px] font-extrabold tracking-tight text-[#f0f3fa]">
        Production control for finance automation
      </p>
      <div className="grid grid-cols-2 gap-1.5 md:grid-cols-4">
        {[
          ['Mail OK', `${MAIL_STATS.ok}/${MAIL_STATS.total}`],
          ['Failed', String(MAIL_STATS.failed)],
          ['Modules', `${healthy}/${FUSION_MODULES.length}`],
          ['Daily', 'OK'],
        ].map(([k, v]) => (
          <div key={k} className="rounded-lg border border-white/10 bg-white/5 px-2 py-1.5">
            <p className="font-mono text-[8px] uppercase tracking-[0.12em] text-white/40">{k}</p>
            <p className="mt-0.5 text-[13px] font-bold text-[#7ea0ff]">{v}</p>
          </div>
        ))}
      </div>
      <div className="space-y-1">
        {FUSION_MODULES.slice(0, 4).map((m) => (
          <div key={m.name} className="flex items-center justify-between rounded-md bg-white/5 px-2 py-1.5 text-[10px]">
            <span className="truncate text-white/80">{m.name}</span>
            <span className={`font-mono uppercase ${TONE[m.status]}`}>{m.status}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function Modules() {
  return (
    <div className="space-y-1.5 overflow-y-auto p-3">
      {FUSION_MODULES.map((m) => (
        <div key={m.name} className="rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-2">
          <div className="flex items-center justify-between gap-2">
            <p className="truncate text-[11px] font-semibold text-white">{m.name}</p>
            <span className={`font-mono text-[9px] uppercase ${TONE[m.status]}`}>{m.status}</span>
          </div>
          <p className="mt-1 truncate font-mono text-[9px] text-white/40">
            {m.launcher} · {m.table}
          </p>
        </div>
      ))}
    </div>
  )
}

function Mail() {
  return (
    <div className="overflow-y-auto p-3">
      <p className="mb-2 font-mono text-[9px] uppercase tracking-[0.14em] text-white/40">Mail-History.txt</p>
      {MAIL_RUNS.map((r) => (
        <div key={r.when + r.file} className="mb-1.5 flex items-start gap-2 border-b border-white/5 pb-1.5 text-[10px]">
          <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#20c997]" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-white/90">{r.file}</p>
            <p className="font-mono text-[9px] text-white/40">
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
    <div className="space-y-2 p-3">
      <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-white/40">saved-apis.json</p>
      <div className="flex flex-wrap gap-1">
        {API_PRESETS.map((a, idx) => (
          <button
            key={a.name}
            type="button"
            onClick={() => setI(idx)}
            className={`rounded-md px-2 py-1 font-mono text-[9px] ${
              idx === i ? 'bg-[#ffb020]/20 text-[#ffb020]' : 'bg-white/5 text-white/50'
            }`}
          >
            {a.method}
          </button>
        ))}
      </div>
      <p className="text-[11px] font-semibold text-white">{p.name}</p>
      <p className="break-all font-mono text-[9px] leading-relaxed text-[#74c0fc]">{p.url}</p>
      <p className="font-mono text-[9px] text-white/35">glDate token substituted per day in range</p>
    </div>
  )
}

function Daily() {
  return (
    <div className="space-y-2 p-3">
      <div className="rounded-md bg-[#dff6dd] px-3 py-2 text-center text-[12px] font-bold text-[#0b6a0b]">
        STATUS: OK
      </div>
      <p className="font-mono text-[9px] text-white/45">teams-adaptive-card.json · 14:33 IST · Asia/Kolkata</p>
      {['STEP1 TALLY (CASH & CARD)', 'STEP-5 BANK TALLY', 'STEP-6 DD TALLY', 'STEP-6 CHEQUE TALLY'].map((s) => (
        <div key={s} className="flex justify-between rounded-md bg-white/5 px-2 py-1.5 text-[10px]">
          <span className="text-white/70">{s}</span>
          <span className="font-mono text-[#20c997]">TALLY OK</span>
        </div>
      ))}
    </div>
  )
}

const VIEWS = { overview: Overview, modules: Modules, daily: Daily, mail: Mail, apirunner: ApiRunner }

/** Interactive Fusion Console — same nav + real workspace modules / mail / APIs. */
export default function FusionConsoleMini() {
  const [view, setView] = useState('overview')
  const Screen = VIEWS[view] || Overview

  return (
    <div className="grid h-full min-h-[280px] grid-cols-[108px_1fr] bg-[#06080f] text-[11px] md:min-h-[340px] md:grid-cols-[128px_1fr]">
      <aside className="border-r border-white/[0.07] bg-[#070a12] p-2">
        <div className="mb-3 flex items-center gap-1.5 px-1">
          <span className="grid h-6 w-6 place-items-center rounded-md bg-[#7ea0ff] text-[9px] font-bold text-white">
            F
          </span>
          <div>
            <p className="text-[10px] font-bold text-white">Fusion</p>
            <p className="font-mono text-[8px] uppercase tracking-[0.12em] text-white/35">Oracle Ops</p>
          </div>
        </div>
        {FUSION_NAV.map((n) => (
          <button
            key={n.id}
            type="button"
            onClick={() => setView(n.id)}
            className={`mb-0.5 w-full rounded-md px-2 py-1.5 text-left text-[10px] ${
              view === n.id ? 'bg-[#7ea0ff]/15 text-[#7ea0ff]' : 'text-white/50 hover:bg-white/5 hover:text-white/80'
            }`}
          >
            {n.label}
          </button>
        ))}
      </aside>
      <div className="min-h-0 overflow-y-auto">
        <div className="flex h-8 items-center justify-between border-b border-white/[0.07] px-3">
          <span className="font-mono text-[9px] text-white/40">{FUSION_NAV.find((n) => n.id === view)?.label}</span>
          <span className="rounded bg-[#20c997]/15 px-1.5 py-0.5 font-mono text-[8px] text-[#20c997]">LIVE</span>
        </div>
        <Screen />
      </div>
    </div>
  )
}
