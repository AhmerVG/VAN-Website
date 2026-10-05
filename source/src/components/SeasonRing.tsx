import { useEffect, useMemo, useState, useSyncExternalStore } from 'react'
import { useFitWidth } from '@/hooks/useFitWidth'
import { CROPS, type Crop } from '@/data/catalogue'
import { MONTHS, MONTHS_LONG, parseSowing, cropSlug, currentMonth, GROUP_COLOUR, sowingLabel, sowingNowNext } from '@/lib/season'
import { useReducedMotion } from '@/hooks/useInView'

const CX = 300, CY = 300
function polar(r: number, deg: number) { const a = (deg - 90) * Math.PI / 180; return [CX + r * Math.cos(a), CY + r * Math.sin(a)] }
function arcPath(r: number, a0: number, a1: number) {
  const [x0, y0] = polar(r, a0); const [x1, y1] = polar(r, a1)
  const large = a1 - a0 > 180 ? 1 : 0
  return `M${x0.toFixed(1)} ${y0.toFixed(1)} A${r} ${r} 0 ${large} 1 ${x1.toFixed(1)} ${y1.toFixed(1)}`
}
function sectorPath(r0: number, r1: number, a0: number, a1: number) {
  const [ax, ay] = polar(r1, a0); const [bx, by] = polar(r1, a1); const [cx, cy] = polar(r0, a1); const [dx, dy] = polar(r0, a0)
  return `M${ax} ${ay} A${r1} ${r1} 0 0 1 ${bx} ${by} L${cx} ${cy} A${r0} ${r0} 0 0 0 ${dx} ${dy} Z`
}

/**
 * D-236, 1 Oct 2026. Tap a month. Crops that share a window sit about 3px apart on the ring (6 in
 * Feb to Mar, 3 in Oct to Nov), so a tap on a phone usually lands on the neighbour. Tahir chose:
 * tapping a month fills the list under the ring with the crops sown in it, each a full-size row.
 * The ring and the list are siblings on 2 pages, so the picked month lives in this small store
 * rather than in a parent. null = this month.
 */
let pickedMonth: number | null = null
const monthSubs = new Set<() => void>()
function setPickedMonth(m: number | null) { pickedMonth = m; monthSubs.forEach(f => f()) }
function usePickedMonth() {
  return useSyncExternalStore(f => { monthSubs.add(f); return () => { monthSubs.delete(f) } }, () => pickedMonth, () => null)
}

/** A 12-month ring; every crop's sowing window drawn as an arc; this month lit. Hover or tap an arc → the crop. */
export function SeasonRing({ size = 520, month = currentMonth(), selected, onSelect, className = '' }: { size?: number; month?: number; selected?: string | null; onSelect?: (c: Crop | null) => void; className?: string }) {
  const rm = useReducedMotion()
  const [hover, setHover] = useState<Crop | null>(null)
  const [sel, setSel] = useState<Crop | null>(() => (selected ? CROPS.find(c => cropSlug(c) === selected) ?? null : null))
  const [spun, setSpun] = useState(rm)
  useEffect(() => { const t = window.setTimeout(() => setSpun(true), 80); return () => window.clearTimeout(t) }, [])

  const crops = useMemo(() => {
    const withStart = CROPS.map(c => ({ c, w: parseSowing(c.sowing) }))
    return withStart.sort((a, b) => (a.w[0].start - b.w[0].start) || a.c.group.localeCompare(b.c.group))
  }, [])
  const r0 = 96, r1 = 252
  const step = (r1 - r0) / (crops.length - 1)
  const active = hover ?? sel
  const { now, next } = useMemo(() => sowingNowNext(month), [month])
  const picked = usePickedMonth()
  const view = picked ?? month
  const viewCount = useMemo(() => sowingNowNext(view).now.length, [view])
  const pickMonth = (i: number) => setPickedMonth(i === month || i === picked ? null : i)

  // D-151 (QA 5): the ring is 660 units across. On a phone it renders about 290px wide, so its text
  // would be 5 to 9px. The month names are drawn larger there (at least 11.5px rendered), and the
  // centre text moves out of the drawing into a caption under it, where it is real 13 to 16px text.
  // On a screen where the ring is at least 605px wide nothing changes.
  const fit = useFitWidth(size, 200)
  const scale = fit.W / 690
  const compact = 12 * scale < 11
  const monthFs = Math.max(15, 11.5 / scale)
  // D-238: on a phone the month names are drawn wider than their sector, so a sun at the sector's
  // centre sits on the name. There it moves to the month's leading edge; on a wide screen it stays centred.
  const monthAngle = month * 30 + (compact ? 4 : 15)

  const pick = (c: Crop) => {
    const n = sel && cropSlug(sel) === cropSlug(c) ? null : c
    setSel(n); onSelect?.(n)
  }

  return (
    <div ref={fit.ref} className={className} style={{ width: size, maxWidth: '100%' }}>
    <svg viewBox="-45 -45 690 690" width="100%" className={active ? 'ring-dim' : undefined} style={{ display: 'block', height: 'auto' }} role="group" aria-label="Season ring: sowing windows for 28 crops">
      {/* month sectors */}
      {MONTHS.map((m, i) => {
        const on = i === month
        const pk = picked === i
        return (
          <g key={m} role="button" tabIndex={0} aria-pressed={pk} aria-label={`${MONTHS_LONG[i]}: show the crops sown in it`} style={{ cursor: 'pointer' }}
            onClick={() => pickMonth(i)} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pickMonth(i) } }}>
            <path d={sectorPath(258, 300, i * 30 + 1, (i + 1) * 30 - 1)} fill="transparent" />
            <path d={sectorPath(262, 296, i * 30 + 1, (i + 1) * 30 - 1)} fill={on ? 'var(--gold)' : pk ? 'var(--paper)' : '#fff'} stroke={pk ? 'var(--navy)' : on ? 'var(--gold)' : 'var(--line)'} strokeWidth={pk ? 3 : 1.5} />
            <text {...(() => { const [x, y] = polar(279, i * 30 + 15); return { x, y } })()} textAnchor="middle" dominantBaseline="middle" fontSize={monthFs} fontWeight="700" fontFamily="Public Sans, sans-serif" fill={on ? 'var(--navy)' : 'var(--muted)'}>{m}</text>
          </g>
        )
      })}
      {/* this-month spoke */}
      <path d={sectorPath(r0 - 8, 258, month * 30, (month + 1) * 30)} fill="var(--gold)" opacity=".16" />
      {picked !== null && <path d={sectorPath(r0 - 8, 258, picked * 30, (picked + 1) * 30)} fill="var(--navy)" opacity=".07" style={{ pointerEvents: 'none' }} />}
      {/* faint rings */}
      {[r0 - 10, r1 + 8].map(r => <circle key={r} cx={CX} cy={CY} r={r} fill="none" stroke="var(--line)" strokeWidth="1" />)}
      {/* crop arcs */}
      {crops.map(({ c, w }, i) => {
        const r = r0 + i * step
        const col = GROUP_COLOUR[c.group] ?? 'var(--green)'
        const isOn = active ? cropSlug(active) === cropSlug(c) : false
        return (
          <g key={c.name} onMouseEnter={() => setHover(c)} onMouseLeave={() => setHover(null)} onClick={() => pick(c)} style={{ cursor: 'pointer' }} role="button" tabIndex={0} aria-label={`${c.name}: ${sowingLabel(c)}`} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(c) } }}>
            {w.map((win, j) => {
              const a0 = win.start * 30 + 2
              const a1 = (win.end < win.start ? win.end + 12 : win.end) * 30 + 30 - 2
              const d = arcPath(r, a0, a1)
              return <g key={j}><path d={d} fill="none" stroke="transparent" strokeWidth="14" style={{ pointerEvents: 'stroke' }} /><path d={d} className={`ring-arc ${isOn ? 'on' : ''}`} fill="none" stroke={col} strokeWidth={isOn ? 9 : 4.2} strokeLinecap="round" style={{ pointerEvents: 'none' }} /></g>
            })}
          </g>
        )
      })}
      {/* sun marker, rotates to this month on load */}
      <g style={{ pointerEvents: 'none', transform: `rotate(${spun ? monthAngle : 0}deg)`, transformOrigin: '300px 300px', transition: rm ? 'none' : 'transform 1.6s cubic-bezier(.2,.8,.2,1)' }}>
        <g transform={`translate(${CX} ${CY - 324})`}>
          <circle r="13" fill="var(--gold-2)" stroke="var(--navy)" strokeWidth="2" />
          {Array.from({ length: 8 }).map((_, k) => { const a = k * 45 * Math.PI / 180; return <line key={k} x1={Math.cos(a) * 16} y1={Math.sin(a) * 16} x2={Math.cos(a) * 21} y2={Math.sin(a) * 21} stroke="var(--navy)" strokeWidth="2.5" strokeLinecap="round" /> })}
        </g>
      </g>
      {/* centre */}
      <circle cx={CX} cy={CY} r={r0 - 16} fill="#fff" stroke="var(--line)" strokeWidth="1.5" />
      {compact ? null : active ? (
        <g style={{ pointerEvents: sel ? 'auto' : 'none' }}>
          <text x={CX} y={CY - 16} textAnchor="middle" fontSize={active.name.length > 16 ? 13 : 16} fontWeight="700" fontFamily="Public Sans, sans-serif" fill="var(--navy)">{active.name.length > 22 ? active.name.slice(0, 21) + '…' : active.name}</text>
          <text x={CX} y={CY + 6} textAnchor="middle" fontSize="13" fill="var(--muted)">{sowingLabel(active)}</text>
          <a href={`#/crops/${cropSlug(active)}`}><rect x={CX - 44} y={CY + 16} width="88" height="30" rx="15" fill="var(--gold)" /><text x={CX} y={CY + 35} textAnchor="middle" fontSize="13" fontWeight="700" fill="var(--navy)">Open plan →</text></a>
        </g>
      ) : (
        <g>
          <text x={CX} y={CY - 18} textAnchor="middle" fontSize="12" fontWeight="700" letterSpacing="1.5" fill="var(--green)">{picked === null ? 'THIS MONTH' : 'PICKED'}</text>
          <text x={CX} y={CY + 6} textAnchor="middle" fontSize="20" fontWeight="700" fontFamily="Public Sans, sans-serif" fill="var(--navy)">{MONTHS_LONG[view]}</text>
          <text x={CX} y={CY + 28} textAnchor="middle" fontSize="12" fill="var(--muted)">{picked === null ? `${now.length} sown now · ${next.length} next` : `${viewCount} crops sown, listed below`}</text>
          <text x={CX} y={CY + 48} textAnchor="middle" fontSize="11" fill="var(--muted)">▸ tap a month or an arc</text>
        </g>
      )}
      {compact && <circle cx={CX} cy={CY} r={10} fill={active ? GROUP_COLOUR[active.group] ?? 'var(--green)' : 'var(--gold)'} />}
    </svg>
    {compact && (
      <div className="text-center mt-2" aria-live="polite">
        {active ? (
          <>
            <div className="font-bold" style={{ fontSize: 16, color: 'var(--navy)', lineHeight: 1.2 }}>{active.name}</div>
            <div className="cap">{sowingLabel(active)}</div>
            <a className="btn btn-gold btn-sm mt-2" href={`#/crops/${cropSlug(active)}`}>Open plan →</a>
          </>
        ) : (
          <>
            <div className="cap font-bold" style={{ color: 'var(--green-text)', letterSpacing: '.1em' }}>{picked === null ? `THIS MONTH · ${MONTHS_LONG[view].toUpperCase()}` : MONTHS_LONG[view].toUpperCase()}</div>
            <div className="cap">{picked === null ? `${now.length} sown now · ${next.length} next · tap a month or an arc` : `${viewCount} crops sown, listed below`}</div>
          </>
        )}
      </div>
    )}
    </div>
  )
}

/** The list beside the ring: being sown now, and next. Derived from the windows only. */
export function SowingNowNext({ month: thisMonth = currentMonth() }: { month?: number }) {
  const picked = usePickedMonth()
  const month = picked ?? thisMonth
  const { now, next } = sowingNowNext(month)
  const nextStart = next.length ? (month + 1) % 12 : month
  const Row = ({ c }: { c: Crop }) => (
    <a href={`#/crops/${cropSlug(c)}`} className="flex items-center gap-3 no-underline py-2 hover:underline" style={{ borderBottom: '1px solid var(--line)' }}>
      <i style={{ width: 12, height: 12, borderRadius: 3, background: GROUP_COLOUR[c.group], flex: 'none' }} />
      <span className="min-w-0 flex-1"><span className="font-semibold block leading-tight">{c.name}</span><span className="cap block">{sowingLabel(c)}</span></span>
      <span aria-hidden="true" className="muted">›</span>
    </a>
  )
  return (
    <div aria-live="polite">
    {picked !== null && (
      <button type="button" className="cap mb-3" style={{ background: 'none', border: 0, padding: '6px 0', color: 'var(--navy-2)', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }} onClick={() => setPickedMonth(null)}>← Back to this month, {MONTHS_LONG[thisMonth]}</button>
    )}
    <div className="grid sm:grid-cols-2 gap-6">
      <div>
        <div className="eyebrow">{picked === null ? `Being sown now · ${MONTHS_LONG[month]}` : `Sown in ${MONTHS_LONG[month]}`}</div>
        {now.map(c => <Row key={c.name} c={c} />)}
      </div>
      <div>
        <div className="eyebrow soil">Next · {MONTHS_LONG[nextStart]}</div>
        {next.map(c => <Row key={c.name} c={c} />)}
      </div>
    </div>
    </div>
  )
}
