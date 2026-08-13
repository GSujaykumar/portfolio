import card from '../../data/teams-adaptive-card.json'

function cellText(cell) {
  return cell?.items?.[0]?.text ?? ''
}

function cellColor(cell) {
  const c = cell?.items?.[0]?.color
  if (c === 'Good') return 'text-[#13a10e]'
  if (c === 'Attention') return 'text-[#c4314b]'
  return 'text-[#242424]'
}

function TeamsTable({ table }) {
  const rows = table.rows || []
  const cols = table.columns || []
  return (
    <div className="overflow-x-auto rounded-md border border-[#d1d1d1]">
      <table className="w-full border-collapse text-[10px] leading-snug">
        <tbody>
          {rows.map((row, ri) => {
            const header = ri === 0 || row.style === 'accent'
            return (
              <tr key={ri} className={header ? 'bg-[#6264a7] text-white' : ri % 2 ? 'bg-[#f5f5f5]' : 'bg-white'}>
                {(row.cells || []).map((cell, ci) => {
                  const align = cell.items?.[0]?.horizontalAlignment === 'Right' ? 'text-right' : 'text-left'
                  const w = cols[ci]?.width
                  return (
                    <td
                      key={ci}
                      className={`border border-[#d1d1d1] px-1.5 py-1 ${align} ${
                        header ? 'font-semibold text-white' : cellColor(cell)
                      }`}
                      style={w ? { width: `${(w / cols.reduce((s, c) => s + (c.width || 1), 0)) * 100}%` } : undefined}
                    >
                      {cellText(cell)}
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

function Block({ block }) {
  if (block.type === 'TextBlock') {
    const large = block.size === 'Large'
    const small = block.size === 'Small' || block.isSubtle
    return (
      <p
        className={`${large ? 'text-[15px] font-bold text-[#242424]' : small ? 'text-[10px] text-[#616161]' : 'text-[12px] text-[#242424]'} ${
          block.weight === 'Bolder' && !large ? 'font-semibold' : ''
        }`}
      >
        {block.text}
      </p>
    )
  }

  if (block.type !== 'Container') return null

  const good = block.style === 'good'
  const bad = block.style === 'attention' || block.style === 'warning'
  const tables = (block.items || []).filter((i) => i.type === 'Table')
  const texts = (block.items || []).filter((i) => i.type === 'TextBlock')

  return (
    <div
      className={`space-y-2 rounded-md px-2.5 py-2 ${
        good
          ? 'bg-[#dff6dd] text-[#0b6a0b]'
          : bad
            ? 'bg-[#fde7e9] text-[#a4262c]'
            : 'bg-transparent'
      }`}
    >
      {texts.map((t, i) => (
        <p
          key={i}
          className={`${t.size === 'Medium' ? 'text-[12px] font-bold text-[#242424]' : 'text-[12px]'} ${
            t.weight === 'Bolder' ? 'font-bold' : ''
          } ${t.color === 'Good' ? 'text-[#0b6a0b]' : t.color === 'Attention' ? 'text-[#a4262c]' : ''}`}
        >
          {t.text}
        </p>
      ))}
      {tables.map((t, i) => (
        <TeamsTable key={i} table={t} />
      ))}
    </div>
  )
}

/** Renders the production teams-adaptive-card.json inside a Teams chat chrome. */
export default function AdaptiveCardView() {
  const body = card.body || []
  return (
    <div className="flex h-full min-h-[280px] flex-col bg-[#1f1f1f] md:min-h-[340px]">
      <div className="flex items-center gap-2 border-b border-white/10 px-3 py-2">
        <span className="grid h-7 w-7 place-items-center rounded-md bg-[#6264a7] text-[10px] font-bold text-white">
          WC
        </span>
        <div className="min-w-0">
          <p className="text-[11px] font-semibold text-white">Workflows</p>
          <p className="font-mono text-[9px] text-white/45">Incoming webhook · Daily Collection Checker</p>
        </div>
        <span className="ml-auto rounded bg-[#13a10e]/20 px-1.5 py-0.5 font-mono text-[9px] text-[#6cce5a]">
          POSTED
        </span>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto bg-[#1b1b1b] p-3">
        <div className="overflow-hidden rounded-lg border border-[#e1e1e1] bg-white shadow-xl">
          <div className="border-b border-[#eee] bg-[#f3f2f1] px-3 py-1.5">
            <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#6264a7]">
              Adaptive Card · v{card.version}
            </p>
          </div>
          <div className="space-y-2 p-3">
            {body.map((b, i) => (
              <Block key={i} block={b} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
