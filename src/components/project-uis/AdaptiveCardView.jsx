import card from '../../data/teams-adaptive-card.json'

function walk(node, type, acc = []) {
  if (!node) return acc
  if (Array.isArray(node)) {
    node.forEach((n) => walk(n, type, acc))
    return acc
  }
  if (typeof node !== 'object') return acc
  if (node.type === type) acc.push(node)
  if (node.body) walk(node.body, type, acc)
  if (node.items) walk(node.items, type, acc)
  return acc
}

function cellText(cell) {
  return cell?.items?.[0]?.text ?? ''
}

function tallyRows(table) {
  return (table?.rows || []).map((row) => ({
    step: cellText(row.cells?.[0]),
    result: cellText(row.cells?.[1]),
    header: row.style === 'accent',
    good: row.cells?.[1]?.items?.[0]?.color === 'Good',
  }))
}

function countFrom(table, needle) {
  const rows = table?.rows || []
  for (const row of rows) {
    const type = cellText(row.cells?.[2])
    const status = cellText(row.cells?.[3]) || cellText(row.cells?.[1])
    if (String(type).toLowerCase().includes(needle) && /success|^i$|^p$/i.test(status)) {
      return cellText(row.cells?.[4]) || '—'
    }
  }
  const firstData = rows[1]
  return firstData ? cellText(firstData.cells?.[4]) || cellText(firstData.cells?.[1]) : '—'
}

/** Production Teams Adaptive Card — cropped to the tally operators actually read. */
export default function AdaptiveCardView() {
  const texts = walk(card, 'TextBlock')
  const tables = walk(card, 'Table')
  const title = texts.find((t) => t.size === 'Large')?.text || 'Daily Collection Checker'
  const generated = texts.find((t) => t.size === 'Small')?.text || ''
  const tally = tallyRows(tables[0]).filter((r) => r.step)
  const scaits = countFrom(tables[1], 'collection')
  const varna = countFrom(tables[2], 'collection')

  return (
    <div className="flex h-full min-h-[340px] flex-col bg-[#1f1f1f] md:min-h-[420px] lg:min-h-[460px]">
      <div className="flex items-center gap-2.5 border-b border-white/10 px-4 py-2.5">
        <span className="grid h-8 w-8 place-items-center rounded-md bg-[#6264a7] text-[11px] font-bold text-white">
          WC
        </span>
        <div className="min-w-0">
          <p className="text-[13px] font-semibold text-white">Workflows</p>
          <p className="font-mono text-[10px] text-white/50">Incoming webhook · Daily Collection Checker</p>
        </div>
        <span className="ml-auto rounded bg-[#13a10e]/20 px-2 py-0.5 font-mono text-[10px] font-bold text-[#6cce5a]">
          POSTED
        </span>
      </div>

      <div className="min-h-0 flex-1 overflow-hidden bg-[#1b1b1b] p-4">
        <div className="h-full overflow-hidden rounded-xl border border-[#e1e1e1] bg-white shadow-xl">
          <div className="border-b border-[#eee] bg-[#f3f2f1] px-4 py-2">
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#6264a7]">
              Adaptive Card · v{card.version}
            </p>
          </div>
          <div className="space-y-3 p-4">
            <div>
              <p className="text-[17px] font-bold leading-tight text-[#242424]">{title}</p>
              <p className="mt-1 text-[11px] text-[#616161]">{generated}</p>
            </div>

            <div className="rounded-md bg-[#dff6dd] px-4 py-2.5 text-center text-[15px] font-bold text-[#0b6a0b]">
              STATUS: OK
            </div>

            <p className="text-[13px] font-bold text-[#242424]">Tally results</p>
            <div className="overflow-hidden rounded-md border border-[#d1d1d1]">
              <table className="w-full border-collapse text-[12px]">
                <tbody>
                  {tally.map((row) => (
                    <tr
                      key={row.step}
                      className={row.header ? 'bg-[#6264a7] text-white' : 'odd:bg-white even:bg-[#f5f5f5]'}
                    >
                      <td className={`border border-[#d1d1d1] px-3 py-2 ${row.header ? 'font-semibold' : 'text-[#242424]'}`}>
                        {row.step}
                      </td>
                      <td
                        className={`border border-[#d1d1d1] px-3 py-2 text-right font-bold ${
                          row.header ? 'text-white' : row.good ? 'text-[#13a10e]' : 'text-[#242424]'
                        }`}
                      >
                        {row.result}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-md border border-[#d1d1d1] bg-[#fafafa] px-3 py-2">
                <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#6264a7]">SCAITS</p>
                <p className="mt-0.5 text-[16px] font-bold text-[#242424]">{scaits}</p>
                <p className="text-[10px] text-[#616161]">collections · Success</p>
              </div>
              <div className="rounded-md border border-[#d1d1d1] bg-[#fafafa] px-3 py-2">
                <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#6264a7]">VARNA</p>
                <p className="mt-0.5 text-[16px] font-bold text-[#242424]">{varna}</p>
                <p className="text-[10px] text-[#616161]">collections · Posted</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
