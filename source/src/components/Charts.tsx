import type { ReactNode } from 'react'
import { NATIONAL } from '@/data/site'
import { useInView, useReducedMotion, useCountUp, useTip } from '@/hooks/useInView'
import { useFitWidth } from '@/hooks/useFitWidth'

/* Demo A's charts restyled into Demo B's palette: ink navy bars, gold for Pakistan,
   field green for "crop" series, soil brown / rust for "loss" series, hairline rules
   inside white panels, the source line under every chart. */
const INK = '#14231A', GOLD = '#D9A21B', GREEN = '#2F6B3A', RUST = '#9C4E2A', MUTED = '#5B6A5E', RULE = 'rgba(20,35,26,0.16)', PBLUE = '#1F4B28'
const ease = 'cubic-bezier(.2,.8,.2,1)'
const fmt = (n: number) => n.toLocaleString('en-US')
/** D-143: per-acre figures carry 1 decimal (33.0, not 33). */
const fmt1 = (n: number) => n.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })

export function Source({ children, label = 'Source' }: { children: ReactNode; label?: string }) {
  return <p className="src"><b>{label} ·</b> {children}</p>
}
export function Tip({ tip }: { tip: { x: number; y: number; html: string } | null }) {
  if (!tip) return null
  return <div className="chart-tip" style={{ left: tip.x, top: tip.y }} dangerouslySetInnerHTML={{ __html: tip.html }} />
}

/* ————— 01 · Fertilizer use per hectare — horizontal bars, Pakistan lit ————— */
export function UseChart({ autoplay = false }: { autoplay?: boolean }) {
  const d = NATIONAL.usePerHa
  const { ref, inView } = useInView({ threshold: 0.15 })
  const rm = useReducedMotion()
  const { tip, show, hide } = useTip()
  const on = inView || autoplay || rm
  const max = 80 // D-143: was 200 (kg/ha). Revert with the data.
  // D-151 (QA 5): W follows the box on a phone, so 14-unit text renders at 14px. Was W = 620.
  const fit = useFitWidth(620)
  const labelW = 128, valW = 44, rowH = 40, W = fit.W, H = d.rows.length * rowH + 8
  const barW = W - labelW - valW
  return (
    <div ref={ref} className={`chart panel p-5 ${on ? 'in' : ''}`}>
      <div className="flex items-baseline justify-between gap-4 flex-wrap"><h4>{d.title}</h4><span className="cap">{d.unit}</span></div>
      <div ref={fit.ref}><svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ marginTop: 10 }} role="img" aria-label={d.title}>
        {[20, 40, 60, 80].map(g => <line key={g} x1={labelW + (g / max) * barW} x2={labelW + (g / max) * barW} y1={0} y2={H - 8} stroke={RULE} strokeDasharray="2 3" />)}
        {d.rows.map(([name, v], i) => {
          const y = i * rowH + 4, w = (v / max) * barW, pk = name === 'Pakistan'
          return (
            <g key={name} onMouseMove={e => show(e, `<b>${name}</b><br/>${v} ${d.unit}`)} onMouseLeave={hide} style={{ cursor: 'default' }}>
              <rect x={0} y={y} width={W} height={rowH - 6} fill="transparent" />
              <text x={labelW - 12} y={y + (rowH - 6) / 2 + 5} textAnchor="end" fontSize={14} fontWeight={pk ? 700 : 500} fill={pk ? INK : MUTED}>{name}</text>
              <rect className="bar-grow" x={labelW} y={y + 4} width={w} height={rowH - 14} rx="4" fill={pk ? GOLD : INK} style={{ transitionDelay: `${i * 90}ms` }} />
              <text className="fade-late num" x={labelW + w + 8} y={y + (rowH - 6) / 2 + 5} fontSize={14} fontWeight={700} fill={INK}>{v}</text>
            </g>
          )
        })}
      </svg></div>
      <Tip tip={tip} />
      <p className="small mt-2">{d.note}</p>
      <Source>{d.source}</Source>
    </div>
  )
}

/* ————— 02 · Balance — N / P₂O₅ / K₂O shares, Pakistan vs India ————— */
export function BalanceChart() {
  const b = NATIONAL.balance
  const { ref, inView } = useInView({ threshold: 0.15 })
  const rm = useReducedMotion()
  const { tip, show, hide } = useTip()
  const on = inView || rm
  const rows = [{ name: 'Pakistan', d: b.pakistan }, { name: 'India', d: b.india }]
  // D-151 (QA 5): on a phone W follows the box and the country names sit above the bars. Was W = 700, names at left.
  const fit = useFitWidth(700), narrow = fit.narrow
  const nameH = narrow ? 22 : 0
  const W = fit.W, labelW = narrow ? 0 : 90, barH = 44, gap = 22, tail = 70, barW = W - labelW - tail, H = rows.length * (barH + gap + nameH) + 4
  const segs = (d: typeof b.pakistan) => [
    { k: 'Nitrogen (N)', t: d.N, s: d.shareN, c: INK },
    { k: 'Phosphate (P₂O₅)', t: d.P, s: d.shareP, c: PBLUE },
    { k: 'Potash (K₂O)', t: d.K, s: d.shareK, c: GOLD },
  ]
  return (
    <div ref={ref} className={`chart panel p-5 ${on ? 'in' : ''}`}>
      <div className="flex items-baseline justify-between gap-4 flex-wrap"><h4>{b.title}</h4><span className="cap">share of total nutrient applied · hover a segment</span></div>
      <div className="flex gap-5 mt-3 cap flex-wrap">{segs(b.pakistan).map(s => <span key={s.k} className="inline-flex items-center gap-2"><i style={{ width: 12, height: 12, background: s.c, display: 'inline-block', borderRadius: 3 }} />{s.k}</span>)}</div>
      <div ref={fit.ref}><svg viewBox={`0 0 ${W} ${H}`} width="100%" className="mt-2" role="img" aria-label={b.title}>
        {rows.map((r, ri) => {
          const y = ri * (barH + gap + nameH) + 2 + nameH
          let x = labelW
          return (
            <g key={r.name}>
              {narrow
                ? <text x={0} y={y - 7} fontSize={14} fontWeight={700} fill={INK}>{r.name}</text>
                : <text x={labelW - 14} y={y + barH / 2 + 5} textAnchor="end" fontSize={15} fontWeight={700} fill={INK}>{r.name}</text>}
              {segs(r.d).map((s, si) => {
                const w = Math.max((s.s / 100) * barW, 3)
                const el = (
                  <g key={s.k} onMouseMove={e => show(e, `<b>${r.name} · ${s.k}</b><br/>${fmt(s.t)} t · ${s.s}%`)} onMouseLeave={hide} style={{ cursor: 'default' }}>
                    <rect className="bar-grow" x={x} y={y} width={w} height={barH} fill={s.c} style={{ transitionDelay: `${ri * 250 + si * 120}ms` }} />
                    {w > (narrow ? 42 : 60) && <text className="fade-late num" x={x + (w < 60 ? 5 : 12)} y={y + barH / 2 + 5} fontSize={w < 60 ? 12 : 14} fontWeight={700} fill={si === 2 ? INK : '#fff'}>{s.s}%</text>}
                    {w <= (narrow ? 42 : 60) && si === 2 && <text className="fade-late num" x={labelW + barW + 10} y={y + barH / 2 + 5} fontSize={14} fontWeight={700} fill="#7A5A0E">{s.s}%</text>}
                  </g>
                )
                x += w
                return el
              })}
            </g>
          )
        })}
      </svg></div>
      <Tip tip={tip} />
      <div className="grid sm:grid-cols-2 gap-4 mt-4">
        {rows.map(r => (
          <div key={r.name} className="panel-soft p-4">
            <div className="cap uppercase tracking-[.08em] font-bold">For every 1 tonne of potash · {r.name}</div>
            <div className="pull text-[clamp(20px,1.8vw,26px)] mt-1">{r.d.perTonneK}</div>
            <div className="cap mt-1">N {fmt(r.d.N)} t · P₂O₅ {fmt(r.d.P)} t · K₂O {fmt(r.d.K)} t</div>
          </div>
        ))}
      </div>
      <Source>{b.source} Potash is {b.pakistan.shareK}% of nutrient use in Pakistan and {b.india.shareK}% in India.</Source>
    </div>
  )
}

/* ————— 03 · Productivity — two index lines, 2000 = 100 ————— */
export function IndexLinesChart() {
  const { ref, inView } = useInView({ threshold: 0.15 })
  const rm = useReducedMotion()
  const { tip, show, hide } = useTip()
  const on = inView || rm
  const n = NATIONAL.productivity.nutrientChange, w = NATIONAL.productivity.wheatChange
  const nIdx = Math.round((n.to / n.from) * 100), wIdx = Math.round((w.to / w.from) * 100) // derived from the two published end points
  // D-151 (QA 5): on a phone W follows the box and the 2 end labels move inside the plot, as the
  // percentage only; the cards under the chart carry the full labels. Was W = 660, padR = 215.
  const fit = useFitWidth(660), narrow = fit.narrow
  const W = fit.W, H = 300, padL = 54, padR = narrow ? 20 : 215, padT = 22, padB = 40
  const x0 = padL, x1 = W - padR, yMin = 90, yMax = 180
  const y = (v: number) => padT + (1 - (v - yMin) / (yMax - yMin)) * (H - padT - padB)
  const series = [
    { key: 'n', label: 'Nutrient per acre', from: n.from, to: n.to, unit: n.unit, idx: nIdx, pct: n.pct, c: RUST, src: n.source },
    { key: 'w', label: 'Wheat yield', from: w.from, to: w.to, unit: w.unit, idx: wIdx, pct: w.pct, c: GREEN, src: w.source },
  ]
  const nV = useCountUp(nIdx, on, 1500), wV = useCountUp(wIdx, on, 1500)
  return (
    <div ref={ref} className={`chart panel p-5 ${on ? 'in' : ''}`}>
      <div className="flex items-baseline justify-between gap-4 flex-wrap"><h4>Nutrient applied and wheat yield, 1999-2000 → 2023-24</h4><span className="cap">index, 2000 = 100</span></div>
      <div ref={fit.ref}><svg viewBox={`0 0 ${W} ${H}`} width="100%" className="mt-3" role="img" aria-label="Two index lines, nutrient per acre and wheat yield">
        {[100, 120, 140, 160, 180].map(g => (
          <g key={g}><line x1={x0} x2={x1} y1={y(g)} y2={y(g)} stroke={g === 100 ? INK : RULE} strokeDasharray={g === 100 ? undefined : '2 3'} /><text x={x0 - 8} y={y(g) + 4} textAnchor="end" fontSize={12} fill={MUTED}>{g}</text></g>
        ))}
        <text x={x0} y={H - 12} fontSize={12.5} fill={MUTED}>1999-2000</text>
        <text x={x1} y={H - 12} fontSize={12.5} fill={MUTED} textAnchor="end">2023-24</text>
        {series.map((s, i) => (
          <g key={s.key} onMouseMove={e => show(e, `<b>${s.label}</b><br/>${fmt1(s.from)} → ${fmt1(s.to)} ${s.unit} · ${s.pct}<br/>index 100 → ${s.idx}`)} onMouseLeave={hide} style={{ cursor: 'default' }}>
            <line className="trace" pathLength={1} x1={x0} y1={y(100)} x2={x1} y2={y(s.idx)} stroke={s.c} strokeWidth={3} strokeLinecap="round" style={{ transitionDelay: `${i * 200}ms` }} />
            <circle className="fade-late" cx={x1} cy={y(s.idx)} r={5} fill={s.c} />
            <circle cx={x0} cy={y(100)} r={4} fill={INK} />
            {narrow
              ? <text className="fade-late" x={x1 - 8} y={y(s.idx) + (s.key === 'w' ? 24 : -12)} textAnchor="end" fontSize={14} fontWeight={700} fill={s.c}>{s.pct} · {s.key === 'n' ? 'nutrient' : 'wheat'}</text>
              : <>
                <text className="fade-late" x={x1 + 12} y={y(s.idx) + 5} fontSize={14} fontWeight={700} fill={s.c}>{s.pct} · {s.label}</text>
                <text className="fade-late" x={x1 + 12} y={y(s.idx) + 21} fontSize={12} fill={MUTED}>{fmt1(s.from)} → {fmt1(s.to)} {s.unit}</text>
              </>}
          </g>
        ))}
      </svg></div>
      <Tip tip={tip} />
      <div className="grid grid-cols-2 gap-4 mt-3">
        <div className="pt-3" style={{ borderTop: `2px solid ${RUST}` }}><div className="pull text-[clamp(28px,2.4vw,36px)]" style={{ color: RUST }}>{nV}</div><div className="cap">{n.label} · {n.from} → {n.to} {n.unit} ({n.pct}) · {n.source}</div></div>
        <div className="pt-3" style={{ borderTop: `2px solid ${GREEN}` }}><div className="pull text-[clamp(28px,2.4vw,36px)]" style={{ color: GREEN }}>{wV}</div><div className="cap">{w.label} · {fmt1(w.from)} → {fmt1(w.to)} {w.unit} ({w.pct}) · {w.source}</div></div>
      </div>
      <p className="cap mt-3">2 published end points, index 2000 = 100 (derived). Each line is drawn straight between its 2 end points, no intermediate years are published here, and none are implied.</p>
      <Source>{NATIONAL.productivity.source}</Source>
    </div>
  )
}

/* ————— 03b · the four-crop table, method note collapsible ————— */
export function ProductivityTable({ withSource = true }: { withSource?: boolean }) {
  const rows = NATIONAL.productivity.rows
  return (
    <div className="panel p-5">
      <h4>Yield per kilogram of nutrient applied. The change since 2000</h4>
      <p className="cap mb-2">yield in maunds an acre, 1999-2000 against 2023-24 · the last column is derived</p>
      <div className="overflow-x-auto tbl-scroll">
        <table className="tbl">
          <thead><tr><th>Crop</th><th className="r">1999-2000</th><th className="r">2023-24</th><th className="r">Change</th><th className="r" style={{ color: RUST }}>Per kg nutrient</th></tr></thead>
          <tbody>{rows.map(r => <tr key={r.crop}><td className="font-semibold">{r.crop}</td><td className="r num">{fmt1(r.y1)}</td><td className="r num">{fmt1(r.y2)}</td><td className="r num font-semibold" style={{ color: GREEN }}>{r.change}</td><td className="r num font-bold" style={{ color: RUST }}>{r.perKg}</td></tr>)}</tbody>
        </table>
      </div>
      <details className="disc mt-2"><summary>How this is calculated, and its limit</summary><p className="cap pb-2 max-w-[140ch]">{NATIONAL.productivity.method}</p></details>
      {withSource && <Source>{NATIONAL.productivity.source}</Source>}
    </div>
  )
}

/** More went on, less came back — two before/after pairs and the per-crop table (About page). */
export function ProductivityChart({ wide = false, table = true }: { wide?: boolean; table?: boolean }) {
  const p = NATIONAL.productivity
  const { ref, inView } = useInView({ threshold: 0.15 })
  const rm = useReducedMotion()
  const pairs = [p.nutrientChange, p.wheatChange]
  return (
    <div ref={ref} className="panel p-5">
      <h4>More went on. Less came back.</h4>
      <p className="cap">1999-2000 → 2023-24</p>
      <div className={wide ? 'grid lg:grid-cols-[1fr_1.1fr] gap-6 mt-4 items-start' : ''}>
        <div className="grid sm:grid-cols-2 gap-4 mt-4">
          {pairs.map((c, i) => {
            const max = c.to
            return (
              <div key={c.label} className="panel-soft p-4">
                <div className="small font-semibold" style={{ minHeight: 44 }}>{c.label}</div>
                {/* O-16b, 9 Sep 2026 (Tahir): the value label and the percentage overlapped on EVERY
                    render. The value sat centred at x=180 (font 15) and the percentage right-anchored
                    at x=230 (font 20), so "160.7" and "+68%" shared 18px and both were unreadable.
                    Fixed by giving the percentage its own row above the plot and dropping the bar
                    band, rather than nudging pixels until it looked right at one width. */}
                <div className="flex items-baseline justify-between gap-3 mt-1">
                  <span className="cap">{fmt1(c.from)} → {fmt1(c.to)} {c.unit}</span>
                  <span className="num font-bold" style={{ fontSize: 22, color: i ? GREEN : RUST }}>{c.pct}</span>
                </div>
                <svg viewBox="0 0 240 132" width="100%" role="img" aria-label={`${c.label}: ${c.from} to ${c.to} ${c.unit}, ${c.pct}`}>
                  {[c.from, c.to].map((v, k) => {
                    const h = (v / max) * 88 // D-143: was 100, which put the taller bar's value label above the top of the drawing
                    return (
                      <g key={k}>
                        <rect x={40 + k * 110} y={112 - (inView || rm ? h : 0)} width="60" height={inView || rm ? h : 0} rx="6" fill={k ? (i ? GREEN : RUST) : 'var(--line-2)'} style={{ transition: rm ? 'none' : `all 1s ${ease} ${k * 0.2}s` }} />
                        <text x={70 + k * 110} y={112 - (inView || rm ? h : 0) - 8} textAnchor="middle" fontSize="15" fontWeight="700" fill={INK} className="num" style={{ transition: rm ? 'none' : `all 1s ${ease} ${k * 0.2}s` }}>{fmt1(v)}</text>
                        <text x={70 + k * 110} y="128" textAnchor="middle" fontSize="12" fill={MUTED}>{k ? '2023-24' : '1999-2000'}</text>
                      </g>
                    )
                  })}
                </svg>
                <div className="cap">{c.unit} · {c.source}</div>
              </div>
            )
          })}
        </div>
        {/* D-151 (QA 23): `table={false}` where the page already shows the same rows in ProductivityTable. */}
        {table && <div className="overflow-x-auto mt-4 tbl-scroll">
          <table className="tbl">
            <thead><tr><th>Crop</th><th className="r">1999-2000</th><th className="r">2023-24</th><th className="r">Yield change</th><th className="r">Per kg of nutrient</th></tr></thead>
            <tbody>{p.rows.map(r => <tr key={r.crop}><td className="font-semibold">{r.crop}</td><td className="r num">{fmt1(r.y1)}</td><td className="r num">{fmt1(r.y2)}</td><td className="r num" style={{ color: GREEN }}>{r.change}</td><td className="r num" style={{ color: RUST }}>{r.perKg}</td></tr>)}</tbody>
          </table>
        </div>}
      </div>
      {table && <p className="cap mt-3">{p.method}</p>}
      {table && <Source>{p.source}</Source>}
    </div>
  )
}

/* ————— 04 · Where it goes — nitrogen taken up vs lost ————— */
export function UptakeSplit() {
  const { ref, inView } = useInView({ threshold: 0.15 })
  const rm = useReducedMotion()
  const { tip, show, hide } = useTip()
  const on = inView || rm
  const rows = [{ name: 'Pakistan', up: NATIONAL.nitrogen.pk }, { name: 'United States', up: NATIONAL.nitrogen.us }]
  // D-151 (QA 5): on a phone W follows the box and the names sit above the bars. Was W = 700, names at left.
  const fit = useFitWidth(700), narrow = fit.narrow
  const nameH = narrow ? 22 : 0
  const W = fit.W, labelW = narrow ? 0 : 120, barH = 50, gap = 22, barW = W - labelW, H = rows.length * (barH + gap + nameH)
  return (
    <div ref={ref} className={`chart panel p-5 ${on ? 'in' : ''}`}>
      <div className="flex items-baseline justify-between gap-4 flex-wrap"><h4>Share of applied nitrogen taken up by the crop</h4><span className="cap">national cropland estimate</span></div>
      <div className="flex gap-5 mt-2 cap flex-wrap"><span className="inline-flex items-center gap-2"><i style={{ width: 12, height: 12, background: GREEN, display: 'inline-block', borderRadius: 3 }} />Taken up by the crop</span><span className="inline-flex items-center gap-2"><i style={{ width: 12, height: 12, background: RUST, display: 'inline-block', borderRadius: 3 }} />Lost. Ammonia, nitrate, denitrification</span></div>
      <div ref={fit.ref}><svg viewBox={`0 0 ${W} ${H}`} width="100%" className="mt-2" role="img" aria-label="Nitrogen uptake, Pakistan against the United States">
        {rows.map((r, i) => {
          const y = i * (barH + gap + nameH) + 6 + nameH, wUp = (r.up / 100) * barW
          return (
            <g key={r.name}>
              {narrow
                ? <text x={0} y={y - 7} fontSize={14} fontWeight={700} fill={INK}>{r.name}</text>
                : <text x={labelW - 14} y={y + barH / 2 + 5} textAnchor="end" fontSize={15} fontWeight={700} fill={INK}>{r.name}</text>}
              <g onMouseMove={e => show(e, `<b>${r.name}</b> · taken up ≈${r.up}%`)} onMouseLeave={hide}>
                <rect className="bar-grow" x={labelW} y={y} width={wUp} height={barH} rx="4" fill={GREEN} style={{ transitionDelay: `${i * 200}ms` }} />
                <text className="fade-late num" x={labelW + 12} y={y + barH / 2 + 6} fontSize={17} fontWeight={700} fill="#fff">≈{r.up}%</text>
              </g>
              <g onMouseMove={e => show(e, `<b>${r.name}</b> · lost ≈${100 - r.up}%`)} onMouseLeave={hide}>
                <rect className="bar-grow" x={labelW + wUp} y={y} width={barW - wUp} height={barH} rx="4" fill={RUST} style={{ transitionDelay: `${i * 200 + 300}ms` }} />
                <text className="fade-late num" x={labelW + barW - 12} y={y + barH / 2 + 6} fontSize={17} fontWeight={700} fill="#fff" textAnchor="end">≈{100 - r.up}% lost</text>
              </g>
            </g>
          )
        })}
      </svg></div>
      <Tip tip={tip} />
      <Source>{NATIONAL.nitrogen.source}</Source>
    </div>
  )
}

/** Nitrogen taken up by the crop — 25% here, 72% in the United States. Two rings (kept from Demo B). */
export function NitrogenRings() {
  const n = NATIONAL.nitrogen
  const { ref, inView } = useInView({ threshold: 0.15 })
  const rm = useReducedMotion()
  const R = 54, C = 2 * Math.PI * R
  const Ring = ({ v, label, col }: { v: number; label: string; col: string }) => (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 140 140" width="140" height="140" role="img" aria-label={`${label}: ${v}%`}>
        <circle cx="70" cy="70" r={R} fill="none" stroke="var(--sand-2)" strokeWidth="16" />
        <circle cx="70" cy="70" r={R} fill="none" stroke={col} strokeWidth="16" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={inView || rm ? C * (1 - v / 100) : C} transform="rotate(-90 70 70)" style={{ transition: rm ? 'none' : `stroke-dashoffset 1.4s ${ease}` }} />
        <text x="70" y="78" textAnchor="middle" fontSize="28" fontWeight="700" fill={INK} className="num">{v}%</text>
      </svg>
      <div className="font-bold">{label}</div>
    </div>
  )
  return (
    <div ref={ref} className="panel p-5">
      <h4>Share of applied nitrogen taken up by the crop</h4>
      <div className="flex flex-wrap justify-around gap-4 mt-4"><Ring v={n.pk} label="Pakistan" col={GOLD} /><Ring v={n.us} label="United States" col={GREEN} /></div>
      <p className="small mt-3"><b>About {n.pk}%</b> {n.text}</p>
      <Source>{n.source}</Source>
    </div>
  )
}

/* ————— Knowledge 5.1 · paddy per kg N (figures from the live knowledge page) ————— */
export const RICE_ROWS: { c: string; n: string; y: string; per: number; farm: string }[] = [
  // D-143: converted to per acre (kg/ha ÷ 2.471) and maunds an acre (t/ha × 1000 ÷ 40 ÷ 2.471). Was, in order,
  // 91.8 / 127.6 / 177.6 / 120.6 / 92.5 / 135.4 kg/ha and 5.21 / 6.11 / 7.14 / 4.07 / 2.99 / 4.31 t/ha (kept on the
  // source line). The paddy-per-kg-N column is a ratio and does not change. Revert: restore those strings.
  { c: 'Bangladesh', n: '37.2 kg/acre', y: '52.7 maunds/acre', per: 56.8, farm: '1.29 acres' },
  { c: 'Vietnam', n: '51.6 kg/acre', y: '61.8 maunds/acre', per: 47.9, farm: 'n/a' },
  { c: 'China', n: '71.9 kg/acre', y: '72.2 maunds/acre', per: 40.2, farm: 'n/a' },
  { c: 'Pakistan', n: '48.8 kg/acre', y: '41.2 maunds/acre', per: 33.7, farm: '5.3 acres' },
  { c: 'Thailand', n: '37.4 kg/acre', y: '30.3 maunds/acre', per: 32.3, farm: 'n/a' },
  { c: 'India', n: '54.8 kg/acre', y: '43.6 maunds/acre', per: 31.8, farm: 'n/a' },
]
export function RiceChart() {
  const { ref, inView } = useInView({ threshold: 0.15 })
  const rm = useReducedMotion()
  const { tip, show, hide } = useTip()
  const on = inView || rm
  // D-151 (QA 5): W follows the box on a phone. Was W = 620.
  const fit = useFitWidth(620)
  const max = 60, labelW = 110, valW = 60, rowH = 34, W = fit.W, H = RICE_ROWS.length * rowH + 8, barW = W - labelW - valW
  return (
    <div ref={ref} className={`chart panel p-5 ${on ? 'in' : ''}`}>
      <div className="flex items-baseline justify-between gap-4 flex-wrap"><h4>Paddy produced per kilogram of nitrogen applied to rice</h4><span className="cap">kg of paddy per kg N</span></div>
      <div ref={fit.ref}><svg viewBox={`0 0 ${W} ${H}`} width="100%" className="mt-3" role="img" aria-label="Paddy per kilogram of nitrogen">
        {RICE_ROWS.map((r, i) => {
          const y = i * rowH + 4, w = (r.per / max) * barW, pk = r.c === 'Pakistan'
          return (
            <g key={r.c} onMouseMove={e => show(e, `<b>${r.c}</b><br/>N applied ${r.n} · paddy ${r.y}<br/>${r.per} kg paddy per kg N`)} onMouseLeave={hide}>
              <rect x={0} y={y} width={W} height={rowH - 6} fill="transparent" />
              <text x={labelW - 12} y={y + (rowH - 6) / 2 + 5} textAnchor="end" fontSize={14} fontWeight={pk ? 700 : 500} fill={pk ? INK : MUTED}>{r.c}</text>
              <rect className="bar-grow" x={labelW} y={y + 4} width={w} height={rowH - 14} rx="4" fill={pk ? GOLD : GREEN} style={{ transitionDelay: `${i * 80}ms` }} />
              <text className="fade-late num" x={labelW + w + 8} y={y + (rowH - 6) / 2 + 5} fontSize={14} fontWeight={700} fill={INK}>{r.per}</text>
            </g>
          )
        })}
      </svg></div>
      <Tip tip={tip} />
      <Source>N rates: IFA Fertilizer Use by Crop 2017/18, via Ludemann, Gruère, Heffer &amp; Dobermann (2022), Scientific Data 9. Paddy yields: FAOSTAT via Our World in Data (2023). Farm size: PBS 7th Agricultural Census 2024 (Pakistan); BBS Agricultural Census 2019 via FAO WCA-2020 (Bangladesh). Paddy per kg N derived. Published per hectare (N applied, kg/ha: Bangladesh 91.8, Vietnam 127.6, China 177.6, Pakistan 120.6, Thailand 92.5, India 135.4; paddy, t/ha: 5.21, 6.11, 7.14, 4.07, 2.99, 4.31) and converted at 1 hectare = 2.471 acres, 40 kg = 1 maund.</Source>
    </div>
  )
}

/** A number that counts up when it scrolls into view. */
export function CountUp({ to, decimals = 0, prefix = '', suffix = '', className = '', style, format }: { to: number; decimals?: number; prefix?: string; suffix?: string; className?: string; style?: React.CSSProperties; format?: (n: number) => string }) {
  const { ref, inView } = useInView<HTMLSpanElement>({ threshold: 0.3 })
  const v = useCountUp(to, inView, 1400, decimals)
  return <span ref={ref} className={`num ${className}`} style={style}>{prefix}{format ? format(v) : v.toFixed(decimals)}{suffix}</span>
}
