import { OUTBOX_EVENTS, OUTBOX_STATS, PAYMENTS } from '../../data/fusion'

/** Operator view matching payments-event-platform REST: /api/v1/outbox/stats + /api/v1/payments */
export default function PaymentsMini() {
  return (
    <div className="flex h-full min-h-[280px] flex-col bg-[#0b1210] text-[11px] text-white/80 md:min-h-[340px]">
      <div className="flex items-center justify-between border-b border-white/10 px-3 py-2">
        <div>
          <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-white/40">GET /api/v1/outbox/stats</p>
          <p className="text-[12px] font-semibold text-white">OutboxStatsResponse</p>
        </div>
        <span className="rounded bg-[#ff6b4a]/20 px-2 py-0.5 font-mono text-[9px] text-[#ff9b82]">relay · running</span>
      </div>
      <div className="grid grid-cols-3 gap-2 p-3">
        {[
          ['pending', OUTBOX_STATS.pending],
          ['published', OUTBOX_STATS.published.toLocaleString()],
          ['failed', OUTBOX_STATS.failed],
        ].map(([k, v]) => (
          <div key={k} className="rounded-lg border border-white/10 bg-white/5 p-2">
            <p className="font-mono text-[8px] uppercase tracking-[0.12em] text-white/40">{k}</p>
            <p className="mt-1 font-display text-lg text-white">{v}</p>
          </div>
        ))}
      </div>
      <div className="px-3">
        <p className="mb-1 font-mono text-[8px] uppercase tracking-[0.14em] text-white/40">
          GET /api/v1/payments · PaymentResponse
        </p>
        <div className="overflow-hidden rounded-lg border border-white/10">
          <div className="grid grid-cols-5 bg-white/5 px-2 py-1.5 font-mono text-[8px] uppercase tracking-[0.1em] text-white/40">
            <span>id</span>
            <span>reference</span>
            <span>amount</span>
            <span>channel</span>
            <span>status</span>
          </div>
          {PAYMENTS.map((p) => (
            <div key={p.id} className="grid grid-cols-5 border-t border-white/5 px-2 py-1.5 font-mono text-[9px]">
              <span className="text-[#00f0c0]">{p.id}</span>
              <span className="truncate">{p.reference}</span>
              <span>
                {p.amount} {p.currency}
              </span>
              <span>{p.channel}</span>
              <span className={p.status === 'POSTED' ? 'text-emerald-300' : 'text-[#ff6b4a]'}>{p.status}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-auto border-t border-white/10 px-3 py-2">
        <p className="font-mono text-[8px] text-white/35">
          POST /api/v1/payments · header Idempotency-Key · OutboxStatus PENDING → PUBLISHED
        </p>
        <div className="mt-1.5 overflow-hidden rounded-md border border-white/10">
          {OUTBOX_EVENTS.map((e) => (
            <div key={e.id} className="flex justify-between border-t border-white/5 px-2 py-1 font-mono text-[9px] first:border-0">
              <span className="text-[#00f0c0]">{e.id}</span>
              <span className="text-white/50">{e.topic}</span>
              <span className={e.status === 'PUBLISHED' ? 'text-emerald-300' : 'text-[#ff6b4a]'}>{e.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
