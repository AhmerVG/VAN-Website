import { useEffect, useMemo, useState } from 'react'
import { useFitWidth } from '@/hooks/useFitWidth'
import { SOIL_RELATIONS, SOIL_SOURCE, SOIL_COPY, type Verdict } from '@/data/soilLens'
import { X_AXES, Y_AXES, DISTRICTS, bandsFor, districtByKey, thousands } from '@/lib/soil'
import { useInView } from '@/hooks/useInView'

type XKey = (typeof X_AXES)[number]['key']
type YKey = (typeof Y_AXES)[number]['key']

const VERDICT_CLASS: Record<Verdict, string> = { Holds: 'holds', 'Holds, with a limit': 'limit', 'Observed, not explained here': 'observed', 'Does not hold': 'no' }
export function VerdictBadge({ v }: { v: Verdict | null }) {
  if (!v) return <span className="verdict none">Observed series, no verdict recorded</span>
  const icon = v === 'Holds' ? '✓' : v === 'Holds, with a limit' ? '✓' : v === 'Does not hold' ? '✕' : '○'
  return <span className={`verdict ${VERDICT_CLASS[v]}`}><span aria-hidden="true">{icon}</span>{v}</span>
}

/** How one variable moves another — band means from the survey, drawn as bars; a verdict only where one is recorded. */
export function RelationExplorer({ initialRel }: { initialRel?: string | null }) {
  const init = SOIL_RELATIONS.find(r => r.key === initialRel)
  const [x, setX] = useState<XKey>(init?.x ?? 'phband')
  const [y, setY] = useState<YKey>(init?.y ?? 'caco3')
  const [dist, setDist] = useState<string>('')
  useEffect(() => { const r = SOIL_RELATIONS.find(k => k.key === initialRel); if (r) { setX(r.x); setY(r.y) } }, [initialRel])

  const d = districtByKey(dist || null)
  const { bands, note } = useMemo(() => bandsFor(x, d), [x, d])
  const rel = SOIL_RELATIONS.find(r => r.x === x && r.y === y) ?? null
  const Y = Y_AXES.find(a => a.key === y)!
  const X = X_AXES.find(a => a.key === x)!
  const { ref, inView } = useInView({ threshold: 0.2 })
  const vals = bands.map(b => b.stats[y])
  const max = Math.max(...vals.map(v => v ?? 0), 0.0001)
  // D-151 (QA 5): W follows the box on a phone (1 unit = 1 px). Where the bands are narrow the labels
  // alternate between 2 rows and the "n =" row is left to the tooltip. Was W = 640 always.
  const fit = useFitWidth(640, 240), narrow = fit.narrow
  const W = fit.W, H = 280, padL = 16, padR = 16, padT = narrow ? 68 : 52, padB = 52
  const bw = (W - padL - padR) / Math.max(1, bands.length)
  const tight = bw < 72
  const chartKey = `${x}|${y}|${dist}`

  return (
    <div ref={ref} className={`panel p-5 lg:p-6 ${inView ? 'in' : ''}`}>{/* the svg is keyed on (x, y, district) so the bars grow again on every change */}
      <div className="grid lg:grid-cols-[1fr_1fr] gap-4">
        <div>
          <div className="cap font-bold uppercase tracking-[.08em] mb-2">X · group the samples by</div>
          <div className="flex flex-wrap gap-2" role="tablist" aria-label="X axis">{X_AXES.map(a => <button key={a.key} role="tab" aria-selected={x === a.key} className={`chip chip-xs ${x === a.key ? 'on' : ''}`} onClick={() => setX(a.key)}>{a.label}</button>)}</div>
        </div>
        <div>
          <div className="cap font-bold uppercase tracking-[.08em] mb-2">Y · and read the mean of</div>
          <div className="flex flex-wrap gap-2" role="tablist" aria-label="Y axis">{Y_AXES.map(a => <button key={a.key} role="tab" aria-selected={y === a.key} className={`chip chip-xs ${y === a.key ? 'soil on' : ''}`} onClick={() => setY(a.key)}>{a.label}</button>)}</div>
        </div>
      </div>
      <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-6 mt-5 items-start">
        <div className="chart" ref={fit.ref}>
          <div className="flex items-baseline justify-between gap-3 flex-wrap">
            <h4>Mean {Y.label.toLowerCase()} by {X.key === 'phband' ? 'pH band' : X.label.toLowerCase()}{d ? ` · ${d.name}` : ' · Punjab'}</h4>
            <label className="cap flex items-center gap-2">for <select className="input input-sm" style={{ width: 'auto', minHeight: 36, padding: '4px 10px', fontSize: 13.5 }} value={dist} onChange={e => setDist(e.target.value)} aria-label="Province or district"><option value="">Punjab · all 36 districts</option>{DISTRICTS.map(k => <option key={k.key} value={k.key}>{k.name}</option>)}</select></label>
          </div>
          {inView && <svg key={chartKey} viewBox={`0 0 ${W} ${H}`} width="100%" className="mt-2" role="img" aria-label={`${Y.label} by ${X.label}`}>
            <line x1={padL} x2={W - padR} y1={H - padB} y2={H - padB} stroke="var(--line-2)" />
            {bands.map((b, i) => {
              const v = b.stats[y]
              const h = v == null ? 0 : (v / max) * (H - padT - padB)
              const cx = padL + i * bw + bw / 2
              const barW = Math.min(88, bw * 0.62)
              return (
                <g key={b.key}>
                  <rect className="bar-anim" x={cx - barW / 2} y={H - padB - h} width={barW} height={h} rx="5" fill={Y.colour} style={{ animationDelay: `${i * 110}ms` }}><title>{`${b.label}: ${v == null ? 'not determined' : v.toFixed(Y.dec) + ' ' + Y.unit} · n = ${thousands(b.stats.n)}`}</title></rect>
                  <text className="lbl-anim num" x={cx} y={H - padB - h - 8} textAnchor="middle" fontSize="15" fontWeight="700" fill="#14231A" style={{ animationDelay: `${i * 110 + 500}ms` }}>{v == null ? 'n.d.' : v.toFixed(Y.dec)}</text>
                  <text x={cx} y={H - padB + (tight && i % 2 ? 34 : 18)} textAnchor="middle" fontSize={tight ? 11.5 : 12.5} fontWeight="700" fill="#14231A">{b.label}</text>
                  {!tight && <text x={cx} y={H - padB + 34} textAnchor="middle" fontSize="11" fill="var(--muted)" className="num">n = {thousands(b.stats.n)}</text>}
                </g>
              )
            })}
            <text x={padL} y={16} fontSize="11.5" fill="var(--muted)">{Y.label} · mean · {Y.unit}</text>
            <text x={narrow ? padL : W - padR} y={narrow ? 33 : 16} fontSize="11.5" fill="var(--muted)" textAnchor={narrow ? 'start' : 'end'}>{X.caption}</text>
          </svg>}
          {!inView && <div style={{ aspectRatio: `${W} / ${H}` }} />}
          {note && <p className="cap mt-1">{note}</p>}
          {y === 'zn' && bands.some(b => b.stats[y] == null) && <p className="cap" style={{ color: 'var(--rust)' }}>n.d. = zinc not determined for this band.</p>}
        </div>
        <div key={rel?.key ?? 'none'} className="a-fade">
          <VerdictBadge v={rel?.verdict ?? null} />
          {rel ? (
            <>
              <h3 className="mt-3">{rel.title}</h3>
              <p className="cap mt-1 num">Province series · {rel.series}</p>
              <p className="mt-3 small">{rel.text}</p>
              {d && <p className="cap mt-3 p-3 rounded-lg" style={{ background: 'var(--gold-soft)' }}>The verdict is recorded for the province series. The bars now show <b>{d.name}</b> on its own. Read them as that district’s observed means, not as a test of the verdict.</p>}
            </>
          ) : (
            <p className="mt-3 small muted">The survey records this series; no relationship has been examined for it. The bars are observed band means with their sample counts. Nothing more is read into them here.</p>
          )}
          <p className="src"><b>Source ·</b> {SOIL_SOURCE.short}. Observational; establishes conditions, not mechanism. <a href="#/soil#caveats">Read this before quoting ›</a></p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 mt-4 pt-4" style={{ borderTop: '1px solid var(--line)' }}>
        <span className="cap mr-1 self-center">The 6 pairs with a verdict:</span>
        {SOIL_RELATIONS.map(r => <button key={r.key} className={`chip chip-xs ${rel?.key === r.key ? 'on' : ''}`} onClick={() => { setX(r.x); setY(r.y) }} aria-pressed={rel?.key === r.key}>{r.title}</button>)}
      </div>
      <p className="cap mt-3">{SOIL_COPY.relLead}</p>
    </div>
  )
}
