import AdaptiveCardView from './project-uis/AdaptiveCardView'
import FusionConsoleMini from './project-uis/FusionConsoleMini'
import AlgoLensMini from './project-uis/AlgoLensMini'
import PaymentsMini from './project-uis/PaymentsMini'
import PortfolioMini from './project-uis/PortfolioMini'

export function BrowserChrome({ title, children, accent = 'var(--signal)' }) {
  return (
    <div className="project-ui overflow-hidden rounded-[1.15rem] border border-[var(--line)] bg-[#0b1210] shadow-[0_24px_48px_rgba(0,0,0,0.32)]">
      <div className="flex items-center gap-2 border-b border-white/10 bg-[#111a17] px-3 py-2">
        <span className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        </span>
        <div className="ml-2 flex min-w-0 flex-1 items-center gap-2 rounded-md bg-black/35 px-3 py-1">
          <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: accent }} />
          <span className="truncate font-mono text-[11px] text-white/70">{title}</span>
        </div>
      </div>
      <div className="relative min-h-[340px] md:min-h-[420px] lg:min-h-[460px]">{children}</div>
    </div>
  )
}

export function UiFusionOps() {
  return (
    <BrowserChrome title="fusion-console · localhost:5173" accent="#7ea0ff">
      <FusionConsoleMini />
    </BrowserChrome>
  )
}

export function UiDailyCollection() {
  return (
    <BrowserChrome title="Microsoft Teams · Adaptive Card" accent="#6264a7">
      <AdaptiveCardView />
    </BrowserChrome>
  )
}

export function UiOutbox() {
  return (
    <BrowserChrome title="GET /api/v1/outbox/stats · payments-event-platform" accent="#ff6b4a">
      <PaymentsMini />
    </BrowserChrome>
  )
}

export function UiAlgoLens() {
  return (
    <BrowserChrome title="algolens · DSA Studio" accent="#fbbf24">
      <AlgoLensMini />
    </BrowserChrome>
  )
}

export function UiPortfolio() {
  return (
    <BrowserChrome title="sujaykumar.dev · portfolio" accent="#00b894">
      <PortfolioMini />
    </BrowserChrome>
  )
}

export const PROJECT_UI = {
  'fusion-ops': UiFusionOps,
  daily: UiDailyCollection,
  outbox: UiOutbox,
  algolens: UiAlgoLens,
  portfolio: UiPortfolio,
}
