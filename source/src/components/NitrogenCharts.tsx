import { useState } from 'react'
import { useFitWidth } from '@/hooks/useFitWidth'
import { useTip } from '@/hooks/useInView'
import { Source, Tip } from '@/components/Charts'
import { NR_NUE, NR_PK, NR_RANK, NR_SURPLUS_HA, NR_FERT_HARVEST, NR_LASSALETTA, NR_RATIO, HA_PER_ACRE } from '@/data/nitrogenReport'

/**
 * Charts for "The real price of nitrogen" (D-325, 4 Nov 2026). Same drawing rules as the Soil Poverty report:
 * the title is the finding, Pakistan in red, the world in navy, every chart says how to read it and names its
 * source. Per-hectare FAO values are converted to per acre here, once (kg/ha x 0.40468564224 = kg/acre).
 */
const NAVY = '#1F3A5F', RED = '#B42318', MUTED = '#5B6A5E', RULE = 'rgba(20,35,26,0.16)', GREEN = '#2F6B3A', GREY = '#9AA39C'
const at = (s: (number | null)[] | undefined, y: number) => { if (!s) return null; const i = y - (s[0] as number) + 1; return i >= 1 && i < s.length ? s[i] : null }
const f1 = (v: number | null | undefined, d = 1) => v == null ? 'no data' : v.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d })
const RATE = { pk: at(NR_NUE.Pakistan, 2023) as number }

/* 1 · NUE 1961 to 2023 */
const PEERS: [string, string][] = [['Bangladesh', '#C9731F'], ['Egypt', '#7A5AC8'], ['China (mainland)', '#1B98A6'], ['European Union', '#2F6DB5'], ['United States', '#5B6670'], ['World', NAVY]]
export function NueLines() {
  const fit = useFitWidth(760)
  const { tip, show, hide } = useTip()
  const [on, setOn] = useState<string[]>(['Bangladesh', 'Egypt', 'China (mainland)', 'World'])
  const W = fit.W, H = Math.round(W * (fit.narrow ? 0.9 : 0.5)), L = 36, R = fit.narrow ? 46 : 150, T = 14, B = 30
  const x = (y: number) => L + (y - 1961) / 62 * (W - L - R)
  const y = (v: number) => T + (1 - v / 90) * (H - T - B)
  const path = (s: (number | null)[]) => { let d = ''; for (let yr = 1961; yr <= 2023; yr++) { const v = at(s, yr); if (v == null) continue; d += `${d ? 'L' : 'M'}${x(yr).toFixed(1)} ${y(v).toFixed(1)}` } return d }
  const series: [string, string][] = [...PEERS.filter(p => on.includes(p[0])), ['Pakistan', RED]]
  // end labels, nudged apart so they never sit on top of each other
  const ends = series.map(([n, c]) => ({ n, c, v: at(NR_NUE[n], 2023) as number, ly: y(at(NR_NUE[n], 2023) as number) })).sort((a, b) => a.ly - b.ly)
  for (let i = 1; i < ends.length; i++) if (ends[i].ly - ends[i - 1].ly < 15) ends[i].ly = ends[i - 1].ly + 15
  return (
    <div className="chart panel p-5">
      <div className="flex items-baseline justify-between gap-4 flex-wrap"><h4>Pakistan&rsquo;s nitrogen use efficiency fell from 54% in 1961 to 29% in 2023; the world&rsquo;s was 55% at both ends</h4><span className="cap">% of nitrogen added that leaves the field in the harvest</span></div>
      <div className="flex flex-wrap gap-2 mt-3">{PEERS.map(([n, c]) => <button key={n} type="button" className="chip chip-xs" aria-pressed={on.includes(n)} onClick={() => setOn(o => o.includes(n) ? o.filter(z => z !== n) : [...o, n])} style={{ borderColor: c, background: on.includes(n) ? c : 'transparent', color: on.includes(n) ? '#fff' : 'var(--ink)' }}>{n}</button>)}</div>
      <div ref={fit.ref}><svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ marginTop: 10 }} role="img" aria-label="Nitrogen use efficiency, Pakistan and other countries, 1961 to 2023">
        {[0, 20, 40, 60, 80].map(g => <g key={g}><line x1={L} x2={W - R} y1={y(g)} y2={y(g)} stroke={RULE} strokeDasharray="2 3" /><text x={L - 6} y={y(g) + 4} textAnchor="end" fontSize={12} fill={MUTED}>{g}</text></g>)}
        {(fit.narrow ? [1961, 1990, 2023] : [1961, 1970, 1980, 1990, 2000, 2010, 2023]).map(t => <text key={t} x={x(t)} y={H - 8} textAnchor="middle" fontSize={12} fill={MUTED}>{t}</text>)}
        {series.map(([n, c]) => <path key={n} d={path(NR_NUE[n])} fill="none" stroke={c} strokeWidth={n === 'Pakistan' ? 3.5 : 2} strokeLinejoin="round" />)}
        {ends.map(e => <g key={e.n}><circle cx={x(2023)} cy={y(e.v)} r={e.n === 'Pakistan' ? 5 : 3.5} fill={e.c} /><text x={x(2023) + 8} y={e.ly + 4} fontSize={12.5} fontWeight={e.n === 'Pakistan' ? 700 : 400} fill={e.c}>{fit.narrow ? Math.round(e.v) : `${e.n} ${Math.round(e.v)}%`}</text></g>)}
        {Array.from({ length: 63 }, (_, i) => 1961 + i).map(yr => <rect key={yr} x={x(yr) - (W - L - R) / 124} y={T} width={(W - L - R) / 62} height={H - T - B} fill="transparent" onMouseMove={e => show(e, `<b>${yr}</b><br/>` + series.map(([n]) => `${n}: ${f1(at(NR_NUE[n], yr))}%`).reverse().join('<br/>'))} onMouseLeave={hide} />)}
      </svg></div>
      <Tip tip={tip} />
      <p className="small mt-2">Each line is the nitrogen removed in harvested crops as a share of all nitrogen added to cropland that year: fertilizer, manure, rain and dust, fixation by legumes, and seed. Tap a name to add or remove it. Pakistan is always shown.</p>
      <Source>FAOSTAT, Cropland Nutrient Balance, December 2025 release, nitrogen, 1961 to 2023. FAO marks these values as estimates. China is mainland China. A share, so it is the same per acre or per hectare.</Source>
    </div>
  )
}

/* 2 · the 29 big users, 2023 */
export function RankBars() {
  const fit = useFitWidth(760)
  const { tip, show, hide } = useTip()
  const rows = NR_RANK
  const W = fit.W, rowH = 21, T = 26, B = 26, L = fit.narrow ? 108 : 150, R = 44
  const H = T + rows.length * rowH + B
  const x = (v: number) => L + Math.min(v, 105) / 105 * (W - L - R)
  return (
    <div className="chart panel p-5">
      <div className="flex items-baseline justify-between gap-4 flex-wrap"><h4>Of the 29 countries that add 1 million tonnes of nitrogen or more to their cropland, only Spain is lower than Pakistan</h4><span className="cap">nitrogen use efficiency, 2023, %</span></div>
      <div ref={fit.ref}><svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ marginTop: 10 }} role="img" aria-label="Nitrogen use efficiency in 2023 for 29 countries adding 1 million tonnes of nitrogen or more">
        <rect x={x(50)} y={T - 4} width={x(90) - x(50)} height={rows.length * rowH + 4} fill={GREEN} opacity={0.08} />
        <text x={(x(50) + x(90)) / 2} y={T - 9} textAnchor="middle" fontSize={11.5} fill={GREEN}>{fit.narrow ? '50 to 90%' : 'EU Nitrogen Expert Panel range, 50 to 90%'}</text>
        {[0, 25, 50, 75, 100].map(g => <g key={g}><line x1={x(g)} x2={x(g)} y1={T - 4} y2={T + rows.length * rowH} stroke={RULE} strokeDasharray="2 3" /><text x={x(g)} y={H - 8} textAnchor="middle" fontSize={12} fill={MUTED}>{g}</text></g>)}
        {rows.map(([n, mt, v], i) => {
          const pk = n === 'Pakistan', yy = T + i * rowH
          const nm0 = n === 'India' ? 'India (warning)' : n
          const nm = fit.narrow ? nm0.replace('China (mainland)', 'China').replace('United Kingdom', 'UK').replace('United States', 'USA').replace('Russian Federation', 'Russia') : nm0.replace('Russian Federation', 'Russia')
          return <g key={n} onMouseMove={e => show(e, `<b>${n}</b><br/>${f1(v)}% in the harvest<br/>${f1(mt, 2)} million tonnes of nitrogen added`)} onMouseLeave={hide}>
            <rect x={0} y={yy} width={W} height={rowH} fill="transparent" />
            <text x={L - 8} y={yy + 14.5} textAnchor="end" fontSize={12.5} fontWeight={pk ? 700 : 400} fill={pk ? RED : 'var(--ink)'}>{nm}</text>
            <rect x={L} y={yy + 4} width={x(v) - L} height={rowH - 8} fill={pk ? RED : v > 90 ? '#C9A27A' : GREY} />
            <text x={x(v) + 5} y={yy + 14.5} fontSize={12} fontWeight={pk ? 700 : 400} fill={pk ? RED : MUTED}>{Math.round(v)}</text>
          </g>
        })}
      </svg></div>
      <Tip tip={tip} />
      <p className="small mt-2">Lowest first. Hover a bar to see how much nitrogen each country adds. Above 90% (brown) there is a risk the soil is being drawn down; above 100% crops take out more nitrogen than goes in. That is not the goal either.</p>
      <Source>FAOSTAT, Cropland Nutrient Balance, December 2025 release (2023). Countries listed by FAO name; China is mainland China. Range: EU Nitrogen Expert Panel 2015.</Source>
    </div>
  )
}

/* 3 · where the 5.7 Mt came from and went, 2023 */
export function WhereItWent() {
  const fit = useFitWidth(760)
  const y = 2023
  const v = (k: string) => (at(NR_PK[k], y) as number) / 1000
  const added: [string, number, string][] = [['Fertilizer', v('Mineral fertilizers'), RED], ['Manure', v('Manure applied'), '#C9731F'], ['Rain and dust', v('Atmospheric deposition'), '#A89F8C'], ['Legumes', v('Biological fixation'), GREEN], ['Seed', v('Seed'), '#5B6670']]
  const tot = v('Input')
  const harvest = v('Crop harvest removal'), resid = v('Crop residue removal'), air = v('Volatilisation'), water = v('Leaching')
  const went: [string, number, string][] = [['Harvest', harvest, NAVY], ['Straw and stalks taken off', resid, '#6E86A6'], ['Air', air, '#C9845F'], ['Water', water, '#2F6DB5'], ['Not accounted for', tot - harvest - resid - air - water, '#D9D6CC']]
  const W = fit.W, L = 0, R = 0
  const bar = (parts: [string, number, string][], yy: number) => { let xx = L; return parts.map(([n, val, c]) => { const w = val / tot * (W - L - R); const g = <g key={n}><rect x={xx} y={yy} width={w} height={44} fill={c} stroke="#fff" strokeWidth={1} />{w > 44 && <text x={xx + 6} y={yy + 28} fontSize={13} fontWeight={700} fill={n === 'Not accounted for' ? 'var(--ink)' : '#fff'}>{f1(val)}</text>}</g>; xx += w; return g }) }
  const legend = (parts: [string, number, string][]) => <div className="flex flex-wrap gap-x-4 gap-y-1 small mt-2">{parts.map(([n, val, c]) => <span key={n} className="inline-flex items-center gap-1"><span style={{ width: 10, height: 10, background: c, display: 'inline-block', border: '1px solid rgba(0,0,0,.1)' }} />{n} {f1(val, 2)} ({Math.round(val / tot * 100)}%)</span>)}</div>
  return (
    <div className="chart panel p-5">
      <div className="flex items-baseline justify-between gap-4 flex-wrap"><h4>Of 5.7 million tonnes of nitrogen added in 2023, 1.7 left in the harvest and an estimated 2.1 went to the air and water</h4><span className="cap">million tonnes of N, Pakistan, 2023</span></div>
      <div ref={fit.ref}>
        <p className="small mt-4"><b>Where it came from</b></p>
        <svg viewBox={`0 0 ${W} 44`} width="100%" role="img" aria-label="Nitrogen added to Pakistan's cropland in 2023, by source">{bar(added, 0)}</svg>
        {legend(added)}
        <p className="small mt-5"><b>Where it went</b></p>
        <svg viewBox={`0 0 ${W} 44`} width="100%" role="img" aria-label="Where the nitrogen added in 2023 went">{bar(went, 0)}</svg>
        {legend(went)}
      </div>
      <p className="small mt-3">Harvest, air, water, and straw and stalks taken off are FAO estimates. FAO counts only the harvest in its efficiency figure; straw and stalks taken off the field (for fodder or fuel) are a separate FAO estimate. &ldquo;Not accounted for&rdquo; is what is left after the other 4: it is calculated, not measured, and holds whatever stays in the soil and whatever is lost by routes FAO does not list.</p>
      <Source>FAOSTAT, Cropland Nutrient Balance, December 2025 release (2023): inputs, crop harvest removal, crop residue removal, volatilisation and leaching. &ldquo;Not accounted for&rdquo;: VAN calculation.</Source>
    </div>
  )
}

/* 4 · 62 years of inputs against the harvest */
export function InputsArea() {
  const fit = useFitWidth(760)
  const { tip, show, hide } = useTip()
  const W = fit.W, H = Math.round(W * (fit.narrow ? 0.9 : 0.5)), L = 36, R = fit.narrow ? 40 : 130, T = 14, B = 30
  const x = (yr: number) => L + (yr - 1961) / 62 * (W - L - R)
  const y = (v: number) => T + (1 - v / 6000) * (H - T - B)
  const layers: [string, string, string][] = [['Mineral fertilizers', 'Fertilizer', RED], ['Manure applied', 'Manure', '#C9731F'], ['Atmospheric deposition', 'Rain and dust', '#A89F8C'], ['Biological fixation', 'Legumes', GREEN], ['Seed', 'Seed', '#5B6670']]
  const yrs = Array.from({ length: 63 }, (_, i) => 1961 + i)
  const cum = yrs.map(yr => { let s = 0; return layers.map(([k]) => (s += (at(NR_PK[k], yr) as number) || 0)) })
  const area = (j: number) => yrs.map((yr, i) => `${i ? 'L' : 'M'}${x(yr)} ${y(cum[i][j])}`).join(' ') + ' ' + yrs.slice().reverse().map((yr, i) => `L${x(yr)} ${y(j ? cum[yrs.length - 1 - i][j - 1] : 0)}`).join(' ') + ' Z'
  const harv = yrs.map((yr, i) => `${i ? 'L' : 'M'}${x(yr)} ${y(at(NR_PK['Crop harvest removal'], yr) as number)}`).join(' ')
  const last = cum[cum.length - 1]
  return (
    <div className="chart panel p-5">
      <div className="flex items-baseline justify-between gap-4 flex-wrap"><h4>Since 2000, nitrogen added rose 72%; nitrogen in the harvest rose 45%</h4><span className="cap">thousand tonnes of N a year, Pakistan</span></div>
      <div ref={fit.ref}><svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ marginTop: 10 }} role="img" aria-label="Nitrogen added to Pakistan's cropland by source and nitrogen in the harvest, 1961 to 2023">
        {[0, 2000, 4000, 6000].map(g => <g key={g}><line x1={L} x2={W - R} y1={y(g)} y2={y(g)} stroke={RULE} strokeDasharray="2 3" /><text x={L - 6} y={y(g) + 4} textAnchor="end" fontSize={12} fill={MUTED}>{g / 1000}k</text></g>)}
        {(fit.narrow ? [1961, 1990, 2023] : [1961, 1970, 1980, 1990, 2000, 2010, 2023]).map(t => <text key={t} x={x(t)} y={H - 8} textAnchor="middle" fontSize={12} fill={MUTED}>{t}</text>)}
        {layers.map(([k, , c], j) => <path key={k} d={area(j)} fill={c} opacity={0.78} />)}
        <path d={harv} fill="none" stroke={NAVY} strokeWidth={3.2} />
        {!fit.narrow && <><text x={W - R + 6} y={y(last[0] / 2) + 4} fontSize={12} fill={RED} fontWeight={700}>Fertilizer</text><text x={W - R + 6} y={y((last[0] + last[1]) / 2) + 4} fontSize={12} fill="#C9731F">Manure</text><text x={W - R + 6} y={y((last[1] + last[4]) / 2) + 4} fontSize={12} fill={MUTED}>Other</text><text x={W - R + 6} y={y(at(NR_PK['Crop harvest removal'], 2023) as number) + 16} fontSize={12.5} fontWeight={700} fill={NAVY}>In the harvest</text></>}
        {yrs.map((yr, i) => <rect key={yr} x={x(yr) - (W - L - R) / 124} y={T} width={(W - L - R) / 62} height={H - T - B} fill="transparent" onMouseMove={e => show(e, `<b>${yr}</b><br/>Added: ${Math.round(cum[i][4]).toLocaleString('en-US')}<br/>of which fertilizer ${Math.round(at(NR_PK['Mineral fertilizers'], yr) as number).toLocaleString('en-US')}<br/>In the harvest: ${Math.round(at(NR_PK['Crop harvest removal'], yr) as number).toLocaleString('en-US')}`)} onMouseLeave={hide} />)}
      </svg></div>
      <Tip tip={tip} />
      <p className="small mt-2">Coloured layers: nitrogen added each year, by source. Navy line: nitrogen removed in harvested crops. The gap between the top of the layers and the line is the nitrogen balance, which FAO counts as surplus.</p>
      <Source>FAOSTAT, Cropland Nutrient Balance, December 2025 release, Pakistan, 1961 to 2023 (estimates).</Source>
    </div>
  )
}

/* 5 · the real price */
export function RealPrice() {
  const fit = useFitWidth(760)
  const rows: [string, number][] = [['Pakistan', RATE.pk], ['Bangladesh', at(NR_NUE.Bangladesh, 2023) as number], ['Egypt', at(NR_NUE.Egypt, 2023) as number], ['China (mainland)', at(NR_NUE['China (mainland)'], 2023) as number], ['World', at(NR_NUE.World, 2023) as number], ['United States', at(NR_NUE['United States'], 2023) as number]]
  const W = fit.W, rowH = 34, T = 8, L = fit.narrow ? 104 : 150, R = 92
  const H = T + rows.length * rowH + 6
  const x = (v: number) => L + v / 700 * (W - L - R)
  return (
    <div className="chart panel p-5">
      <div className="flex items-baseline justify-between gap-4 flex-wrap"><h4>At Rs 193 a kg on the bag, each kg of nitrogen in Pakistan&rsquo;s harvest carries a urea-price equivalent of about Rs 660</h4><span className="cap">Rs per kg of N in the harvest, at the Rabi 2024-25 urea price</span></div>
      <div ref={fit.ref}><svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ marginTop: 10 }} role="img" aria-label="Urea-price equivalent per kg of nitrogen in the harvest at different efficiency rates">
        <line x1={x(193)} x2={x(193)} y1={T - 4} y2={H} stroke={MUTED} strokeDasharray="4 3" />
        {rows.map(([n, r], i) => { const v = 193 / (r / 100), yy = T + i * rowH, pk = n === 'Pakistan'; return <g key={n}>
          <text x={L - 8} y={yy + 20} textAnchor="end" fontSize={12.5} fontWeight={pk ? 700 : 400} fill={pk ? RED : 'var(--ink)'}>{fit.narrow ? n.replace('China (mainland)', 'China').replace('United States', 'USA') : `${n}, ${Math.round(r)}%`}</text>
          <rect x={L} y={yy + 6} width={x(v) - L} height={rowH - 12} fill={pk ? RED : GREY} />
          <text x={x(v) + 6} y={yy + 21} fontSize={13} fontWeight={700} fill={pk ? RED : 'var(--ink)'}>Rs {Math.round(v / 10) * 10}</text>
        </g> })}
      </svg></div>
      <p className="small mt-2">Each bar is the same Rs 193 bag price divided by that country&rsquo;s 2023 efficiency: what a kg of nitrogen in the harvest would carry at Pakistan&rsquo;s urea price if Pakistan&rsquo;s fields worked at that rate. Dashed line: Rs 193, the price on the bag. Rounded to the nearest Rs 10.</p>
      <Source>NFDC Annual Fertilizer Review 2024-25, Table 38 (nitrogen from urea, Rabi 2024-25, Rs 193 a kg); FAOSTAT, Cropland Nutrient Balance, December 2025 release (2023). VAN calculation; an equivalent, not a price anyone pays.</Source>
    </div>
  )
}

/* 6 · the illustrative national value, with a slider */
export function ValueSlider() {
  const [t, setT] = useState(at(NR_NUE.Bangladesh, 2023) as number)
  const SALES = 3387, PRICE = 193
  const saved = Math.max(0, SALES * (1 - RATE.pk / t))
  const marks: [string, number][] = [['Bangladesh', at(NR_NUE.Bangladesh, 2023) as number], ['Egypt', at(NR_NUE.Egypt, 2023) as number], ['China', at(NR_NUE['China (mainland)'], 2023) as number], ['World', at(NR_NUE.World, 2023) as number]]
  return (
    <div className="chart panel p-5">
      <div className="flex items-baseline justify-between gap-4 flex-wrap"><h4>Illustrative N-equivalent value, not projected farmer savings: each 1% less nitrogen for the same harvest is worth about Rs 6.5 billion a year</h4></div>
      <label className="block mt-4 small" htmlFor="nr-slider"><b>If Pakistan&rsquo;s fields reached an efficiency of {t.toFixed(1)}%</b> (today {RATE.pk.toFixed(1)}%)</label>
      <input id="nr-slider" type="range" min={29.5} max={60} step={0.1} value={t} onChange={e => setT(+e.target.value)} style={{ width: '100%', accentColor: GREEN }} />
      <div className="flex flex-wrap gap-2 mt-2">{marks.map(([n, r]) => <button key={n} type="button" className="chip chip-xs" aria-pressed={Math.abs(t - r) < 0.05} onClick={() => setT(r)}>{n} {r.toFixed(1)}%</button>)}</div>
      <div className="grid sm:grid-cols-3 gap-3 mt-4">
        <div className="panel-soft p-4"><div className="cap">Less nitrogen for the same harvest</div><div className="num" style={{ fontSize: 26, fontWeight: 700, color: GREEN }}>{Math.round((1 - RATE.pk / t) * 100)}%</div></div>
        <div className="panel-soft p-4"><div className="cap">Nitrogen not needed, at 2024-25 sales</div><div className="num" style={{ fontSize: 26, fontWeight: 700, color: GREEN }}>{Math.round(saved).toLocaleString('en-US')} thousand t</div></div>
        <div className="panel-soft p-4"><div className="cap">Urea-price equivalent a year</div><div className="num" style={{ fontSize: 26, fontWeight: 700, color: GREEN }}>Rs {Math.round(saved * PRICE / 1000)} billion</div></div>
      </div>
      <p className="small mt-3">Move the slider or tap a country. The same harvest needs less nitrogen in proportion: at {t.toFixed(1)}%, it needs {RATE.pk.toFixed(1)} &divide; {t.toFixed(1)} of today&rsquo;s nitrogen. The saving is applied to the nitrogen sold in 2024-25 ({SALES.toLocaleString('en-US')} thousand tonnes) and valued at Rs {PRICE} a kg, the Rabi 2024-25 price of nitrogen from urea. It assumes every source of nitrogen falls in the same proportion and the harvest stays the same. It is a size, not a forecast and not a saving any farmer is promised.</p>
      <Source>NFDC Annual Fertilizer Review 2024-25, Tables 3 and 38; FAOSTAT, Cropland Nutrient Balance, December 2025 release (2023). VAN calculation.</Source>
    </div>
  )
}

/* 7 · balance: P and K per 100 kg N */
export function RatioBars() {
  const fit = useFitWidth(760)
  const order = ['Pakistan', 'Egypt', 'Bangladesh', 'China', 'United States', 'World']
  const W = fit.W, rowH = 40, T = 6, L = fit.narrow ? 96 : 130, R = 50
  const H = T + order.length * rowH + 22
  const x = (v: number) => L + v / 75 * (W - L - R)
  return (
    <div className="chart panel p-5">
      <div className="flex items-baseline justify-between gap-4 flex-wrap"><h4>For every 100 kg of nitrogen, Pakistan used 1.2 kg of potash in 2023; the world used 34</h4><span className="cap">kg of P₂O₅ and K₂O per 100 kg of N, 2023</span></div>
      <div ref={fit.ref}><svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ marginTop: 10 }} role="img" aria-label="Phosphate and potash used per 100 kg of nitrogen in 2023">
        {[0, 25, 50, 75].map(g => <g key={g}><line x1={x(g)} x2={x(g)} y1={T} y2={T + order.length * rowH} stroke={RULE} strokeDasharray="2 3" /><text x={x(g)} y={H - 6} textAnchor="middle" fontSize={12} fill={MUTED}>{g}</text></g>)}
        {order.map((n, i) => { const [p, k] = NR_RATIO[n], yy = T + i * rowH, pk = n === 'Pakistan'; return <g key={n}>
          <text x={L - 8} y={yy + 22} textAnchor="end" fontSize={12.5} fontWeight={pk ? 700 : 400} fill={pk ? RED : 'var(--ink)'}>{fit.narrow ? n.replace('United States', 'USA') : n}</text>
          <rect x={L} y={yy + 6} width={x(p) - L} height={13} fill="#C9731F" /><text x={x(p) + 5} y={yy + 17} fontSize={11.5} fill={MUTED}>{f1(p)}</text>
          <rect x={L} y={yy + 21} width={Math.max(1.5, x(k) - L)} height={13} fill={pk ? RED : '#7A5AC8'} /><text x={Math.max(x(k), L + 2) + 5} y={yy + 32} fontSize={11.5} fontWeight={pk ? 700 : 400} fill={pk ? RED : MUTED}>{f1(k)}</text>
        </g> })}
      </svg></div>
      <p className="small mt-2"><span style={{ color: '#C9731F', fontWeight: 700 }}>Upper bar</span>: phosphate (P₂O₅) per 100 kg of nitrogen. <span style={{ color: '#7A5AC8', fontWeight: 700 }}>Lower bar</span>: potash (K₂O) per 100 kg of nitrogen. Pakistan&rsquo;s potash bar is red.</p>
      <Source>FAOSTAT, Fertilizers by Nutrient, agricultural use per hectare of cropland, via Our World in Data (2023); China as Our World in Data reports it. Ratios: VAN calculation. NFDC&rsquo;s 2024-25 sales give the same picture: 3,387 thousand tonnes of N, 919 of P₂O₅ and 44.5 of K₂O.</Source>
    </div>
  )
}

/* 8 · China's turn, against Pakistan, indexed to 2015 */
export function ChinaTurn() {
  const fit = useFitWidth(760)
  const W = fit.W, panelW = fit.narrow ? W : Math.floor((W - 24) / 2), H = Math.round(panelW * 0.72), L = 34, R = 56, T = 14, B = 28
  const one = (name: string, label: string) => {
    const s = NR_FERT_HARVEST[name]
    const x = (yr: number) => L + (yr - 2010) / 13 * (panelW - L - R)
    const y = (v: number) => T + (1 - (v - 60) / 80) * (H - T - B)
    const base = (k: 'fert' | 'harvest') => ((at(s[k], 2014) as number) + (at(s[k], 2015) as number) + (at(s[k], 2016) as number)) / 3
    const line = (k: 'fert' | 'harvest') => Array.from({ length: 14 }, (_, i) => 2010 + i).map((yr, i) => `${i ? 'L' : 'M'}${x(yr)} ${y((at(s[k], yr) as number) / base(k) * 100)}`).join(' ')
    const end = (k: 'fert' | 'harvest') => Math.round(((at(s[k], 2021) as number) + (at(s[k], 2022) as number) + (at(s[k], 2023) as number)) / 3 / base(k) * 100)
    return <svg key={name} viewBox={`0 0 ${panelW} ${H}`} width="100%" role="img" aria-label={`${label}: fertilizer nitrogen and harvest nitrogen, 2015 = 100`}>
      <text x={L} y={11} fontSize={13} fontWeight={700} fill={name === 'Pakistan' ? RED : 'var(--ink)'}>{label}</text>
      {[60, 80, 100, 120, 140].map(g => <g key={g}><line x1={L} x2={panelW - R} y1={y(g)} y2={y(g)} stroke={RULE} strokeDasharray={g === 100 ? '0' : '2 3'} /><text x={L - 5} y={y(g) + 4} textAnchor="end" fontSize={11} fill={MUTED}>{g}</text></g>)}
      {[2010, 2015, 2023].map(t => <text key={t} x={x(t)} y={H - 6} textAnchor="middle" fontSize={11} fill={MUTED}>{t}</text>)}
      <path d={line('fert')} fill="none" stroke={RED} strokeWidth={2.6} /><path d={line('harvest')} fill="none" stroke={NAVY} strokeWidth={2.6} />
      <text x={x(2023) + 5} y={y(end('fert')) + 4} fontSize={11.5} fontWeight={700} fill={RED}>{end('fert')}</text>
      <text x={x(2023) + 5} y={y(end('harvest')) + 4} fontSize={11.5} fontWeight={700} fill={NAVY}>{end('harvest')}</text>
    </svg>
  }
  return (
    <div className="chart panel p-5">
      <div className="flex items-baseline justify-between gap-4 flex-wrap"><h4>Between 2014-16 and 2021-23, mainland China used 20% less fertilizer nitrogen and harvested 10% more nitrogen in its crops</h4><span className="cap">index, average of 2014-16 = 100</span></div>
      <div ref={fit.ref} className="mt-3" style={{ display: 'grid', gridTemplateColumns: fit.narrow ? '1fr' : '1fr 1fr', gap: 24 }}>{one('China (mainland)', 'Mainland China')}{one('Pakistan', 'Pakistan')}</div>
      <p className="small mt-2"><span style={{ color: RED, fontWeight: 700 }}>Red</span>: nitrogen from fertilizer applied to cropland. <span style={{ color: NAVY, fontWeight: 700 }}>Navy</span>: nitrogen removed in the harvest. Both are indexed to their 2014-16 average; the end label is the 2021-23 average. China set its target of zero growth in fertilizer use by 2020 in 2015.</p>
      <Source>FAOSTAT, Cropland Nutrient Balance, December 2025 release (mineral fertilizers and crop harvest removal, nitrogen). The 2015 target: Yu, Li and Doluschitz 2020, Sustainability 12(17):7028. VAN calculation of the index.</Source>
    </div>
  )
}

/* 9 · surplus per acre, 2000 and 2023 */
export function SurplusAcre() {
  const fit = useFitWidth(760)
  const { tip, show, hide } = useTip()
  const order = ['Egypt', 'Bangladesh', 'China (mainland)', 'Pakistan', 'India', 'World', 'European Union', 'United States']
  const W = fit.W, rowH = 32, T = 22, L = fit.narrow ? 100 : 140, R = 40
  const H = T + order.length * rowH + 24
  const ac = (v: number) => v * HA_PER_ACRE
  const x = (v: number) => L + v / 90 * (W - L - R)
  const nep = ac(80)
  return (
    <div className="chart panel p-5">
      <div className="flex items-baseline justify-between gap-4 flex-wrap"><h4>Pakistan&rsquo;s nitrogen surplus nearly doubled from 2000 to 2023, from 28 to 53 kg an acre</h4><span className="cap">kg of N an acre of cropland not removed in the harvest</span></div>
      <div ref={fit.ref}><svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ marginTop: 10 }} role="img" aria-label="Nitrogen surplus per acre of cropland, 2000 and 2023">
        <line x1={x(nep)} x2={x(nep)} y1={T - 6} y2={T + order.length * rowH} stroke={GREEN} strokeDasharray="5 4" />
        <text x={x(nep) + 4} y={T - 8} fontSize={11.5} fill={GREEN}>{fit.narrow ? '32' : 'EU panel ceiling, 32'}</text>
        {[0, 30, 60, 90].map(g => <g key={g}><line x1={x(g)} x2={x(g)} y1={T} y2={T + order.length * rowH} stroke={RULE} strokeDasharray="2 3" /><text x={x(g)} y={H - 6} textAnchor="middle" fontSize={12} fill={MUTED}>{g}</text></g>)}
        {order.map((n, i) => { const [a, b] = NR_SURPLUS_HA[n].map(ac), yy = T + i * rowH + rowH / 2, pk = n === 'Pakistan', ind = n === 'India'; return <g key={n} onMouseMove={e => show(e, `<b>${n}</b><br/>2000: ${f1(a)} kg an acre<br/>2023: ${f1(b)} kg an acre`)} onMouseLeave={hide}>
          <rect x={0} y={yy - rowH / 2} width={W} height={rowH} fill="transparent" />
          <text x={L - 8} y={yy + 4} textAnchor="end" fontSize={12.5} fontWeight={pk ? 700 : 400} fill={pk ? RED : 'var(--ink)'}>{(fit.narrow ? n.replace('China (mainland)', 'China').replace('European Union', 'EU').replace('United States', 'USA') : n) + (ind ? ' (warning)' : '')}</text>
          <line x1={x(a)} x2={x(b)} y1={yy} y2={yy} stroke={pk ? RED : GREY} strokeWidth={3} />
          <circle cx={x(a)} cy={yy} r={5} fill="#fff" stroke={pk ? RED : MUTED} strokeWidth={2} />
          <circle cx={x(b)} cy={yy} r={5.5} fill={pk ? RED : MUTED} />
          <text x={x(Math.max(a, b)) + 9} y={yy + 4} fontSize={12} fontWeight={pk ? 700 : 400} fill={pk ? RED : MUTED}>{Math.round(b)}</text>
        </g> })}
      </svg></div>
      <Tip tip={tip} />
      <p className="small mt-2">Open dot: 2000. Filled dot: 2023, with its value. Green dashed line: the EU Nitrogen Expert Panel&rsquo;s upper limit for a desirable surplus, 80 kg a hectare (32 kg an acre). India is shown as a warning, not a model: its surplus rose with a national fertilizer subsidy.</p>
      <Source>FAOSTAT, Cropland Nutrient Balance, December 2025 release, nitrogen balance per hectare of cropland, 2000 and 2023, converted to per acre (1 acre = 0.4047 hectare). EU Nitrogen Expert Panel 2015.</Source>
    </div>
  )
}

/* 10 · wheat to buy 1 kg of N */
export function WheatPerKg() {
  const fit = useFitWidth(760)
  const rows: [string, number, number][] = [['2023-24', 2.22, at(NR_NUE.Pakistan, 2023) as number], ['2024-25', 3.48, at(NR_NUE.Pakistan, 2023) as number]]
  const W = fit.W, rowH = 58, T = 6, L = fit.narrow ? 70 : 90, R = 150
  const H = T + rows.length * rowH + 4
  const x = (v: number) => L + v / 13 * (W - L - R)
  return (
    <div className="chart panel p-5">
      <div className="flex items-baseline justify-between gap-4 flex-wrap"><h4>In 2024-25, 3.5 kg of wheat bought 1 kg of nitrogen on the bag, and about 12 kg of wheat for each kg in the harvest</h4><span className="cap">kg of wheat at the market price</span></div>
      <div ref={fit.ref}><svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ marginTop: 10 }} role="img" aria-label="Kg of wheat needed to buy 1 kg of nitrogen">
        {rows.map(([n, bag, r], i) => { const yy = T + i * rowH, h = bag / (r / 100); return <g key={n}>
          <text x={L - 8} y={yy + 30} textAnchor="end" fontSize={13} fontWeight={700} fill="var(--ink)">{n}</text>
          <rect x={L} y={yy + 4} width={x(bag) - L} height={20} fill={GREY} /><text x={x(bag) + 6} y={yy + 19} fontSize={12} fill={MUTED}>{f1(bag, 2)} on the bag</text>
          <rect x={L} y={yy + 28} width={x(h) - L} height={20} fill={RED} /><text x={x(h) + 6} y={yy + 43} fontSize={12} fontWeight={700} fill={RED}>{f1(h)} in the harvest</text>
        </g> })}
      </svg></div>
      <p className="small mt-2">Grey: kg of wheat, at the market price after harvest, needed to buy 1 kg of nitrogen from urea (NFDC). Red: the same divided by 29.1%, Pakistan&rsquo;s 2023 efficiency across all crops, an illustration of what each kg of nitrogen that leaves in the harvest carries. Wheat&rsquo;s own efficiency is not published by FAO.</p>
      <Source>NFDC Annual Fertilizer Review 2024-25, Tables 38 and 39 (market prices; wheat Rs 84.2 a kg in 2023-24 and Rs 55.4 in 2024-25); FAOSTAT, Cropland Nutrient Balance, December 2025 release (2023). VAN calculation.</Source>
    </div>
  )
}

/* 11 · why the site's earlier figure differs */
export function Revision() {
  const fit = useFitWidth(760)
  const W = fit.W, H = Math.round(W * (fit.narrow ? 0.8 : 0.42)), L = 34, R = fit.narrow ? 40 : 270, T = 14, B = 28
  const x = (yr: number) => L + (yr - 1961) / 62 * (W - L - R)
  const y = (v: number) => T + (1 - v / 70) * (H - T - B)
  const p = (s: (number | null)[], y1: number) => { let d = ''; for (let yr = 1961; yr <= y1; yr++) { const v = at(s, yr); if (v == null) continue; d += `${d ? 'L' : 'M'}${x(yr).toFixed(1)} ${y(v).toFixed(1)}` } return d }
  const lines: [string, (number | null)[], number, string, string | undefined][] = [
    ['Pakistan, FAO 2025', NR_NUE.Pakistan, 2023, RED, undefined], ['Pakistan, Lassaletta 2014', NR_LASSALETTA.Pakistan, 2014, RED, '5 4'],
    ['Bangladesh, FAO 2025', NR_NUE.Bangladesh, 2023, '#C9731F', undefined], ['Bangladesh, Lassaletta 2014', NR_LASSALETTA.Bangladesh, 2014, '#C9731F', '5 4']]
  return (
    <div className="chart panel p-5">
      <div className="flex items-baseline justify-between gap-4 flex-wrap"><h4>2 published series, 2 answers: in 2014 FAO puts Pakistan at 31% and Bangladesh at 39%; the older series put them at 27% and 28%</h4><span className="cap">% of nitrogen added that leaves in the harvest</span></div>
      <div ref={fit.ref}><svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ marginTop: 10 }} role="img" aria-label="Two published nitrogen use efficiency series for Pakistan and Bangladesh">
        {[0, 20, 40, 60].map(g => <g key={g}><line x1={L} x2={W - R} y1={y(g)} y2={y(g)} stroke={RULE} strokeDasharray="2 3" /><text x={L - 6} y={y(g) + 4} textAnchor="end" fontSize={12} fill={MUTED}>{g}</text></g>)}
        {[1961, 1990, 2014, 2023].map(t => <text key={t} x={x(t)} y={H - 8} textAnchor="middle" fontSize={12} fill={MUTED}>{t}</text>)}
        {lines.map(([n, s, y1, c, dash]) => <path key={n} d={p(s, y1)} fill="none" stroke={c} strokeWidth={2.4} strokeDasharray={dash} />)}
        {!fit.narrow && lines.map(([n, s, , c], i) => <text key={n} x={W - R + 8} y={T + 16 + i * 18} fontSize={12} fill={c}>{n}: {f1(at(s, 2014))}% (2014)</text>)}
      </svg></div>
      <p className="small mt-2">Solid: FAOSTAT Cropland Nutrient Balance, December 2025 release, 1961 to 2023. Dashed: Lassaletta, Billen, Grizzetti, Anglade and Garnier 2014, an older series that ends in 2014. Both divide nitrogen in the harvest by nitrogen added; they differ in how they estimate manure, fixation and the harvest.</p>
      <Source>FAOSTAT, Cropland Nutrient Balance, December 2025 release; Lassaletta et al. 2014, Environmental Research Letters 9:105011, via Our World in Data (CC BY 4.0).</Source>
    </div>
  )
}

/* 12 · what each practice did to ammonia loss, global synthesis */
export function LossByPractice() {
  const fit = useFitWidth(760)
  const rows: [string, number, string][] = [['Controlled-release urea', -68, 'Technology'], ['Urease inhibitor', -54, 'Technology'], ['Deep placement', -55, 'Placement'], ['Irrigation after application', -35, 'Placement'], ['Split application', 0, 'Timing'], ['Nitrification inhibitor', 38, 'Technology']]
  const W = fit.W, rowH = fit.narrow ? 44 : 34, T = fit.narrow ? 14 : 8, L = fit.narrow ? 30 : 290, R = 50
  const H = T + rows.length * rowH + 24
  const x = (v: number) => L + (v + 80) / 130 * (W - L - R)
  const by = (yy: number) => fit.narrow ? yy + 8 : yy
  return (
    <div className="chart panel p-5">
      <div className="flex items-baseline justify-between gap-4 flex-wrap"><h4>Across 824 measurements worldwide, deep placement and urease inhibitors cut ammonia loss from nitrogen fertilizer by 54% to 55%</h4><span className="cap">% change in ammonia lost, against the usual practice</span></div>
      <div ref={fit.ref}><svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ marginTop: 10 }} role="img" aria-label="Change in ammonia loss by practice, global synthesis">
        {[-75, -50, -25, 0, 25].map(g => <g key={g}><line x1={x(g)} x2={x(g)} y1={T} y2={T + rows.length * rowH} stroke={g === 0 ? MUTED : RULE} strokeDasharray={g === 0 ? '0' : '2 3'} /><text x={x(g)} y={H - 6} textAnchor="middle" fontSize={12} fill={MUTED}>{g}</text></g>)}
        {rows.map(([n, v, lever], i) => { const yy = T + i * rowH; return <g key={n}>
          <text x={fit.narrow ? 0 : L - 8} y={fit.narrow ? yy + 4 : yy + 21} textAnchor={fit.narrow ? 'start' : 'end'} fontSize={12.5} fill="var(--ink)">{n}{fit.narrow ? '' : ` (${lever.toLowerCase()})`}</text>
          {v !== 0 ? <rect x={Math.min(x(0), x(v))} y={by(yy) + 7} width={Math.abs(x(v) - x(0))} height={20} fill={v < 0 ? GREEN : RED} /> : <circle cx={x(0)} cy={by(yy) + 17} r={4} fill={MUTED} />}
          <text x={v < 0 ? x(v) - 6 : x(v) + 6} y={by(yy) + 21} textAnchor={v < 0 ? 'end' : 'start'} fontSize={12} fontWeight={700} fill={v < 0 ? GREEN : v > 0 ? RED : MUTED}>{v > 0 ? `+${v}` : v === 0 ? 'no effect' : v}</text>
        </g> })}
      </svg></div>
      <p className="small mt-2">Green: less ammonia lost. Red: more. Split application did not change ammonia loss; its gain, where there is one, comes from the crop taking up more, not from less going to the air. These are averages from many countries, mostly outside Pakistan, and they cannot be added together.</p>
      <Source>Pan, Lam, Mosier, Luo and Chen 2016, Agriculture, Ecosystems and Environment 232:283-289 (global synthesis of 824 observations).</Source>
    </div>
  )
}
