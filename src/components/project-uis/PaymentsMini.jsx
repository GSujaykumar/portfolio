import { OUTBOX_EVENTS, OUTBOX_STATS, PAYMENTS } from '../../data/fusion'

/** Operator view matching payments-event-platform REST: /api/v1/outbox/stats + /api/v1/payments */
export default function PaymentsMini() {
  return (
    <div className="flex h-full min-h-[340px] flex-col bg-[#0b1210] text-[12px] text-white/80 md:min-h-[420px] lg:min-h-[460px]">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/40">GET /api/v1/outbox/stats</p>
          <p className="text-[15px] font-semibold text-white">OutboxStatsResponse</p>
        </div>
        <span className="rounded-md bg-[#ff6b4a]/20 px-2.5 py-1 font-mono text-[10px] font-bold text-[#ff9b82]">
          relay · running
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2.5 p-4">
        {[
          ['pending', OUTBOX_STATS.pending, '#ffb020'],
          ['published', OUTBOX_STATS.published.toLocaleString(), '#00f0c0'],
          ['failed', OUTBOX_STATS.failed, '#ff6b4a'],
        ].map(([k, v, c]) => (
          <div key={k} className="rounded-xl border border-white/10 bg-white/[0.04] p-3">
            <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-white/40">{k}</p>
            <p className="mt-1 font-display text-[22px] leading-none" style={{ color: c }}>
              {v}
            </p>
          </div>
        ))}
      </div>

      <div className="min-h-0 flex-1 px-4 pb-3">
        <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.14em] text-white/40">
          GET /api/v1/payments · PaymentResponse
        </p>
        <div className="overflow-hidden rounded-xl border border-white/10">
          <div className="grid grid-cols-5 bg-white/5 px-3 py-2 font-mono text-[9px] uppercase tracking-[0.12em] text-white/40">
            <span>id</span>
            <span>reference</span>
            <span>amount</span>
            <span>channel</span>
            <span>status</span>
          </div>
          {PAYMENTS.map((p) => (
            <div key={p.id} className="grid grid-cols-5 border-t border-white/5 px-3 py-2.5 font-mono text-[11px]">
              <span className="text-[#00f0c0]">{p.id}</span>
              <span className="truncate text-white/80">{p.reference}</span>
              <span className="text-white">
                {p.amount} {p.currency}
              </span>
              <span className="text-white/70">{p.channel}</span>
              <span className={p.status === 'POSTED' ? 'font-bold text-emerald-300' : 'font-bold text-[#ff6b4a]'}>
                {p.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-white/10 px-4 py-3">
        <p className="mb-2 font-mono text-[10px] text-white/40">
          POST /api/v1/payments · Idempotency-Key · PENDING → PUBLISHED
        </p>
        <div className="overflow-hidden rounded-lg border border-white/10">
          {OUTBOX_EVENTS.map((e) => (
            <div
              key={e.id}
              className="flex items-center justify-between border-t border-white/5 px-3 py-1.5 font-mono text-[11px] first:border-0"
            >
              <span className="text-[#00f0c0]">{e.id}</span>
              <span className="text-white/50">{e.topic}</span>
              <span className={e.status === 'PUBLISHED' ? 'text-emerald-300' : 'text-[#ffb020]'}>{e.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
