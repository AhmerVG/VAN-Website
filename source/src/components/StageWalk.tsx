import { rateLabel } from '@/lib/season'
import { useEffect, useState } from 'react'
import { WHEAT_STAGES, WHEAT_PLAN } from '@/data/catalogue'
import { WHEAT } from '@/data/site'
import { useInView, useReducedMotion } from '@/hooks/useInView'
import { PackShot, MethodIcon, DrawnBag, bagSub } from './bits'

const SHORT = ['Land prep', 'Germination', 'Early growth', 'Grand growth', 'Grain & maturity']

/** The crop at each stage, drawn. */
export function StagePlant({ stage, size = 150 }: { stage: number; size?: number }) {
  const g = '#2F6B3A', g2 = '#6DA35C', gold = '#D9A21B'
  return (
    <svg viewBox="0 0 160 160" width={size} height={size} aria-hidden="true">
      <rect x="0" y="126" width="160" height="34" fill="#7A5230" opacity=".7" />
      {stage === 0 && [0, 1, 2, 3, 4, 5].map(i => <path key={i} d={`M${10 + i * 26} 132 q13 -8 26 0`} stroke="#5A3A20" strokeWidth="3" fill="none" />)}
      {stage === 0 && <g className="a-fade"><path d="M20 118 h120" stroke="#A9C7A0" strokeWidth="4" strokeLinecap="round" /><circle cx="50" cy="118" r="4" fill={gold} /><circle cx="80" cy="118" r="4" fill="#1F4B28" /><circle cx="110" cy="118" r="4" fill="#B0841A" /></g>}
      {stage === 1 && <g className="a-grow"><path d="M80 126 v-26" stroke={g2} strokeWidth="4" strokeLinecap="round" /><path d="M80 108 c-8 -3 -12 -9 -12 -16 c8 2 12 8 12 16z" fill={g2} /><path d="M80 104 c8 -3 12 -9 12 -16 c-8 2 -12 8 -12 16z" fill={g2} /></g>}
      {stage === 2 && <g className="a-grow">{[-14, 0, 14].map((dx, i) => <g key={i}><path d={`M${80 + dx} 126 c${dx * 0.3} -20 ${dx * 0.6} -30 ${dx * 0.8} -46`} stroke={g} strokeWidth="4" fill="none" strokeLinecap="round" /><path d={`M${80 + dx * 0.8} 82 c-10 -4 -14 -12 -14 -20 c10 2 14 10 14 20z`} fill={g} /></g>)}</g>}
      {stage === 3 && <g className="a-grow">{[-30, -15, 0, 15, 30].map((dx, i) => <g key={i}><path d={`M${80 + dx * 0.4} 126 c${dx * 0.4} -30 ${dx * 0.8} -40 ${dx} -76`} stroke={g} strokeWidth="4" fill="none" strokeLinecap="round" /><path d={`M${80 + dx} 52 c-10 -4 -15 -12 -15 -22 c10 2 15 12 15 22z`} fill={g} /><path d={`M${80 + dx * 0.7} 90 c10 -4 15 -12 15 -22 c-10 2 -15 12 -15 22z`} fill={g2} /></g>)}</g>}
      {stage === 4 && <g className="a-grow">{[-36, -18, 0, 18, 36].map((dx, i) => <g key={i}><path d={`M${80 + dx * 0.4} 126 c${dx * 0.3} -30 ${dx * 0.7} -50 ${dx} -86`} stroke="#B9A24A" strokeWidth="4" fill="none" strokeLinecap="round" /><g transform={`translate(${80 + dx} 40)`}>{[0, 1, 2, 3, 4].map(k => <ellipse key={k} cx={k % 2 ? 5 : -5} cy={-k * 5} rx="5" ry="4" fill={gold} stroke="#B0841A" strokeWidth="1" />)}<path d="M0 -22 v-10 M5 -20 l4 -9 M-5 -20 l-4 -9" stroke="#B0841A" strokeWidth="1.5" /></g></g>)}</g>}
    </svg>
  )
}

export function BagCard({ row }: { row: (typeof WHEAT_PLAN)[number] }) {
  const inner = (
    <>
      <div className="shot">{row.slug ? <PackShot slug={row.slug} /> : <DrawnBag grey label={row.product} sub={bagSub(row.analysis)} width={62} />}</div>
      <div className="min-w-0">
        <div className="cap uppercase tracking-[.08em] font-bold" style={{ color: row.commodity ? '#55645A' : 'var(--st-text, var(--st, var(--green)))' }}>{row.band}</div>
        <div className="display text-[19px] leading-tight mt-0.5">{row.product}</div>
        <div className="cap mt-0.5">{row.analysis}{row.commodity ? ' · commodity urea, not a VAN product' : ''}</div>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2">
          <span className="num text-[20px]" style={{ color: 'var(--navy)' }}>{rateLabel(row)}</span>
          <span className="small muted">{row.pack.replace(' - ', ' · ')}</span>
          <span className="small inline-flex items-center gap-1 muted"><MethodIcon method={row.method} size={18} />{row.method}</span>
        </div>
      </div>
    </>
  )
  return row.slug
    ? <a href={`#/products/${row.slug}`} className="panel bag-card">{inner}</a>
    : <div className="panel bag-card grey" title="Commodity urea, not a VAN product">{inner}</div>
}

/** Five stages, one walk. Autoplays when it scrolls into view; tap a stage to hold it. */
export function StageWalk({ limit, teaser = false }: { limit?: number; teaser?: boolean }) {
  const stages = WHEAT_STAGES.slice(0, limit ?? WHEAT_STAGES.length)
  const rm = useReducedMotion()
  const { ref, inView } = useInView({ threshold: 0.15 })
  const [i, setI] = useState(0)
  const [playing, setPlaying] = useState(!rm)
  useEffect(() => {
    if (!inView || !playing || rm) return
    const t = window.setInterval(() => setI(x => (x + 1) % stages.length), teaser ? 3600 : 5200)
    return () => window.clearInterval(t)
  }, [inView, playing, rm, stages.length, teaser])
  const g = WHEAT.gdd[i]
  const rows = WHEAT_PLAN.filter(r => r.stage === stages[i])
  const pick = (k: number) => { setI(k); setPlaying(false) }
  return (
    <div ref={ref} className={`st-${i} ${inView ? 'on' : ''}`}>
      <div className="flex flex-wrap items-center gap-3 mb-3">
        <button className={`btn btn-sm ${playing ? 'btn-navy' : 'btn-gold'}`} onClick={() => setPlaying(p => !p)} aria-pressed={playing}>{playing ? '❚❚ Pause' : '▶ Play the walk'}</button>
        <span className="cap" style={{ color: 'var(--gold-text)' }}>▸ Tap a stage</span>
        <div className="ml-auto flex gap-2">
          <button className="btn btn-ghost btn-sm" onClick={() => pick((i - 1 + stages.length) % stages.length)} aria-label="Previous stage">‹</button>
          <button className="btn btn-ghost btn-sm" onClick={() => pick((i + 1) % stages.length)} aria-label="Next stage">›</button>
        </div>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Wheat stages">
        {stages.map((s, k) => (
          <button key={s} role="tab" aria-selected={i === k} className={`stage-tab st-${k} ${i === k ? 'on' : ''}`} onClick={() => pick(k)} style={{ minWidth: 128 }}>
            <span className="n">Stage {k + 1}</span>
            <span className="t">{teaser ? SHORT[k] : s}</span>
          </button>
        ))}
      </div>
      <div className="rail mt-2"><i style={{ width: `${((i + 1) / WHEAT_STAGES.length) * 100}%` }} /></div>

      <div key={i} className="grid lg:grid-cols-[0.95fr_1.05fr] gap-4 mt-4 a-fade">
        <div className="panel p-5" style={{ background: 'var(--st-soft)', borderColor: 'var(--st)' }}>
          <div className="flex items-start gap-4">
            <StagePlant stage={i} size={120} />
            <div className="min-w-0 flex-1">
              <span className="eyebrow" style={{ color: 'var(--st-text, var(--st))' }}>Stage {i + 1} of {WHEAT_STAGES.length}</span>
              <h3 className="text-[clamp(26px,2.6vw,34px)]">{stages[i]}</h3>
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="tag tag-navy" title="Growing degree days, base 10 °C">GDD {g.gdd}</span>
                <span className="tag tag-navy">DAS {g.das}</span>
              </div>
            </div>
          </div>
          <table className="tbl mt-4" style={{ fontSize: 15 }}>
            <thead><tr><th>Sown Oct 20</th><th>Sown Nov 1</th><th>Sown Nov 20</th></tr></thead>
            <tbody><tr><td className="font-semibold">{g.oct20}</td><td className="font-semibold">{g.nov1}</td><td className="font-semibold">{g.nov20}</td></tr></tbody>
          </table>
          <p className="small mt-4">{g.events}</p>
        </div>
        <div>
          <div className="flex items-baseline justify-between mb-2">
            <div className="font-bold">What goes on at this stage · per acre</div>
            <div className="cap shrink-0 nowrap">{rows.length} row{rows.length === 1 ? '' : 's'}</div>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {rows.map((r, k) => <BagCard key={k} row={r} />)}
          </div>
          {!rows.length && <div className="panel-soft p-5"><p className="font-bold">The published plan puts nothing new on at this stage.</p><p className="small muted mt-1">Minimal N applications after boot; no new nutrient applications after grain fill begins. The season's work is done by the four stages before it.</p></div>}
          {teaser && <a className="btn btn-gold mt-4" href="#/crops/wheat">Walk all 5 stages of wheat →</a>}
        </div>
      </div>
    </div>
  )
}
