import { useMemo, useState } from 'react'
import { CROPS, CROP_PLANS, shortCropName } from '@/data/catalogue'
import { MASTER_PRODUCTS } from '@/data/pricing'
import { programmeSupply, allStages, NUTRIENTS, NUTRIENT_LABEL, type Nutrient } from '@/lib/nutrientBalance'
import { WHEAT_YIELD_BASE, POTATO_YIELD_BASE } from '@/data/leverScorecard'
import { cropSlug } from '@/lib/season'
import { LIEBIG } from '@/data/nutrients'

/**
 * THE BARREL — Liebig's Law of the Minimum as a tool a grower can put his own bags into.
 * 26 September 2026, D-186. Tahir: "create a real artifact within the website so the farmer can see
 * what he put and where it leaks and how he can achieve the full potential by filling his grain
 * into the drum ... you can even imagine the VAN product as nutrients for this."
 *
 * WHAT IT COMPUTES, and from what.
 *   Need   = what VAN's published programme for the chosen crop delivers per acre, nutrient by
 *            nutrient (programmeSupply, the same arithmetic the crop page's balance block uses).
 *   Given  = what the grower typed: packs per acre of each product × pack size × declared analysis.
 *            Analyses come from MASTER_PRODUCTS (VAN's own product record; commodity rows are the
 *            declared grades printed on those bags). A litre is taken as a kilogram, the same
 *            assumption the balance block names.
 *   Stave  = Given ÷ Need, capped at 1. Extra above the programme is reported, not credited.
 *   Level  = the shortest stave. That is the law: the crop grows to its scarcest nutrient.
 *
 * THE YIELD LINE, and its 2 sources. Tahir chose a yield estimate (26 Sep). It rests on exactly
 * 2 of his rulings and nothing else: (1) one yield number per crop, "what a good progressive farmer
 * achieves", 60 maunds for wheat and 300 for potato (D-103); (2) "nutrition decides about 1/4 of
 * the yield" (24 Sep). So the barrel says: of the quarter of that yield which nutrition decides,
 * your mix reaches this share. It does NOT say what the field will yield, because the other 3/4
 * (sowing, seed, water, weeds, pests) are scored by the discipline simulator, not here. Crops with
 * no ruled yield number show the share only and say why. Labelled "model estimate" like the
 * simulator's own figures.
 *
 * Nothing here prices anything. Nothing here is stored.
 */

const CEILING: Record<string, { maunds: number; label: string }> = {
  wheat: { maunds: WHEAT_YIELD_BASE.operativeMaunds, label: WHEAT_YIELD_BASE.label },
  potato: { maunds: POTATO_YIELD_BASE.operativeMaunds, label: 'what a good progressive farmer achieves' },
}
const NUTRITION_SHARE = 0.25   // Tahir, 24 Sep 2026: nutrition decides about 1/4 of yield

/** The rows a grower can type into: the commodity bags first, then VAN's own brands. */
const INPUTS = MASTER_PRODUCTS.filter(p => Object.keys(p.analysisPct).some(k => (NUTRIENTS as readonly string[]).includes(k)))
const COMMODITY = INPUTS.filter(p => !p.slug)
const VAN = INPUTS.filter(p => !!p.slug)

const STAVE_COL: Record<Nutrient, string> = {
  N: '#2F7D3F', P: '#00598E', K: '#0F7A72', S: '#B0841A', Zn: '#6E4A8E', B: '#6E4A8E', Mg: '#7A5230', Fe: '#6E4A8E', Mn: '#6E4A8E', Cu: '#6E4A8E',
}
const SHORT: Record<Nutrient, string> = { N: 'N', P: 'P₂O₅', K: 'K₂O', S: 'S', Zn: 'Zn', B: 'B', Mg: 'Mg', Fe: 'Fe', Mn: 'Mn', Cu: 'Cu' }

const fmt = (n: number) => n === 0 ? '0' : n >= 10 ? Math.round(n).toLocaleString('en-PK') : n >= 1 ? n.toFixed(1) : n.toFixed(2)

export function LiebigBarrel() {
  const [crop, setCrop] = useState('wheat')
  const [qty, setQty] = useState<Record<string, number>>({})

  const need = useMemo(() => programmeSupply(crop, allStages(crop)).perAcre, [crop])
  const staves = useMemo(() => {
    const given: Partial<Record<Nutrient, number>> = {}
    for (const p of INPUTS) {
      const packs = qty[p.product] ?? 0
      if (!packs) continue
      for (const n of NUTRIENTS) {
        const pct = p.analysisPct[n]
        if (!pct) continue
        given[n] = (given[n] ?? 0) + packs * p.packKg * pct / 100
      }
    }
    return NUTRIENTS.filter(n => (need[n] ?? 0) > 0).map(n => {
      const g = given[n] ?? 0, nd = need[n] ?? 0
      return { n, given: g, need: nd, ratio: Math.min(1, g / nd) }
    })
  }, [qty, need])

  const anyInput = Object.values(qty).some(v => v > 0)
  const level = staves.length ? Math.min(...staves.map(s => s.ratio)) : 0
  const weakest = staves.length ? staves.reduce((a, b) => (b.ratio < a.ratio ? b : a)) : null
  const ceiling = CEILING[crop]
  const cropName = shortCropName(CROPS.find(c => cropSlug(c) === crop)?.name ?? crop)
  const surplus = staves.filter(s => s.given > s.need * 1.05)

  // The barrel drawing. Staves side by side; water to the shortest; the shortest stave gold.
  const W = 640, H = 300, top = 30, bottom = 262, left = 60
  const sw = staves.length ? (W - left * 2) / staves.length : 0
  const waterY = bottom - (bottom - top) * level

  const set = (k: string, v: string) => setQty(q => ({ ...q, [k]: Math.max(0, Number(v) || 0) }))

  return (
    <div className="lb" id="barrel">
      <div className="lb-grid">
        <div className="lb-inputs panel">
          <label className="lb-lab" htmlFor="lb-crop">Your crop</label>
          <select id="lb-crop" className="input input-sm" value={crop} onChange={e => { setCrop(e.target.value); setQty({}) }}>
            {CROPS.filter(c => CROP_PLANS[cropSlug(c)]).map(c => <option key={cropSlug(c)} value={cropSlug(c)}>{c.name}</option>)}
          </select>
          <p className="cap mt-3">What you put on 1 acre this season. Packs or bags of each, as printed on the bag.</p>
          {/* D-191: VAN's own products first, then the general commodity grades. No competitor brand names. */}
          <p className="lb-lab mt-3">VAN products</p>
          <div className="lb-rows">
            {VAN.map(p => (
              <div key={p.product} className="lb-row">
                <label htmlFor={`lb-${p.product}`}>{p.product} <span className="cap">{p.packKg} {p.packUnit ?? 'kg'} · {Object.entries(p.analysisPct).filter(([k, v]) => (NUTRIENTS as readonly string[]).includes(k) && v >= 0.5).map(([k, v]) => `${SHORT[k as Nutrient]} ${v}`).join(' · ')}</span></label>
                <input id={`lb-${p.product}`} type="number" min="0" step="0.5" inputMode="decimal" className="input input-sm lb-n" value={qty[p.product] || ''} placeholder="0" onChange={e => set(p.product, e.target.value)} />
              </div>
            ))}
          </div>
          <p className="lb-lab mt-4">General grades</p>
          <div className="lb-rows">
            {COMMODITY.map(p => (
              <div key={p.product} className="lb-row">
                <label htmlFor={`lb-${p.product}`}>{p.product} <span className="cap">{p.packKg} {p.packUnit ?? 'kg'} · {Object.entries(p.analysisPct).filter(([k, v]) => (NUTRIENTS as readonly string[]).includes(k) && v >= 0.5).map(([k, v]) => `${SHORT[k as Nutrient]} ${v}`).join(' · ')}</span></label>
                <input id={`lb-${p.product}`} type="number" min="0" step="0.5" inputMode="decimal" className="input input-sm lb-n" value={qty[p.product] || ''} placeholder="0" onChange={e => set(p.product, e.target.value)} />
              </div>
            ))}
          </div>
          {anyInput && <button type="button" className="btn btn-ghost btn-sm mt-3" onClick={() => setQty({})}>Clear</button>}
        </div>

        <div className="lb-view">
          <svg viewBox={`0 0 ${W} ${H}`} className="lb-svg" role="img" aria-label={`Barrel for ${cropName}: ${staves.length} staves, the shortest is ${weakest ? NUTRIENT_LABEL[weakest.n] : 'none'}`}>
            <rect x="0" y="0" width={W} height={H} fill="var(--paper)" />
            {/* water */}
            {anyInput && level > 0 && (
              <rect x={left} y={waterY} width={W - left * 2} height={bottom - waterY} fill="#9CC4D8" opacity=".75" />
            )}
            {/* staves */}
            {staves.map((s, i) => {
              const h = Math.max(6, (bottom - top) * s.ratio)
              const x = left + i * sw
              const isWeak = weakest && s.n === weakest.n && anyInput
              return (
                <g key={s.n}>
                  <rect x={x + 2} y={bottom - h} width={sw - 4} height={h} fill={isWeak ? 'var(--gold)' : STAVE_COL[s.n]} opacity={anyInput ? 1 : 0.25} />
                  <rect x={x + 2} y={bottom - (bottom - top)} width={sw - 4} height={bottom - top} fill="none" stroke="var(--line-2)" strokeDasharray="3 3" />
                  <text x={x + sw / 2} y={bottom + 18} textAnchor="middle" fontSize="12" fontWeight="700" fill="var(--navy)" fontFamily="Public Sans, sans-serif">{SHORT[s.n]}</text>
                  <text x={x + sw / 2} y={bottom + 32} textAnchor="middle" fontSize="10.5" fill="var(--muted)" fontFamily="Public Sans, sans-serif">{anyInput ? `${Math.round(s.ratio * 100)}%` : `${fmt(s.need)} kg`}</text>
                </g>
              )
            })}
            {/* hoops */}
            <rect x={left - 6} y={top + 40} width={W - left * 2 + 12} height="7" fill="var(--soil)" opacity=".9" />
            <rect x={left - 6} y={bottom - 50} width={W - left * 2 + 12} height="7" fill="var(--soil)" opacity=".9" />
            {/* leak at the shortest stave */}
            {anyInput && weakest && level < 1 && (() => {
              const i = staves.findIndex(s => s.n === weakest.n); const x = left + i * sw + sw / 2
              return <g fill="#9CC4D8"><circle cx={x} cy={waterY + 14} r="3.5" /><circle cx={x + 8} cy={waterY + 30} r="2.5" /><circle cx={x - 6} cy={waterY + 44} r="2" /></g>
            })()}
            <text x={W / 2} y="18" textAnchor="middle" fontSize="12" fill="var(--muted)" fontFamily="Public Sans, sans-serif">{anyInput ? `Full to the shortest stave: ${Math.round(level * 100)}% of the programme` : `Each stave is 1 nutrient. Full height = what VAN’s ${cropName.toLowerCase()} programme delivers per acre`}</text>
          </svg>

          <div className="lb-read">
            {!anyInput && <p className="small muted">Type what you applied and the staves fill. The dotted line on each is the programme’s figure; the label under it is that figure in kilograms an acre.</p>}
            {anyInput && weakest && (
              <>
                <p className="lb-verdict">
                  Your shortest stave is <b>{NUTRIENT_LABEL[weakest.n]}</b>: {fmt(weakest.given)} of {fmt(weakest.need)} kg an acre, {Math.round(weakest.ratio * 100)}% of the programme.
                  {level < 1 ? ' Everything else you applied is held back by it.' : ' Every stave is full. The programme is met.'}
                </p>
                {ceiling ? (
                  <p className="small mt-2">
                    <b>Model estimate.</b> Nutrition decides about 1/4 of the yield. For {cropName.toLowerCase()} the yield number this site uses is <b>{ceiling.maunds} maunds an acre</b> ({ceiling.label}), so nutrition decides about <b>{Math.round(ceiling.maunds * NUTRITION_SHARE)} maunds</b> of it. Your mix reaches about <b>{fmt(ceiling.maunds * NUTRITION_SHARE * level)}</b> of those {Math.round(ceiling.maunds * NUTRITION_SHARE)}. The other {Math.round(ceiling.maunds * (1 - NUTRITION_SHARE))} are decided by sowing, seed, water, weeds and pests, which the <a href={`#/simulator/${crop}`}>discipline simulator</a> scores.{level < 0.15 ? ' A stave at 0 pulls the whole barrel to 0. A real field is never quite there, because the soil itself supplies some of every nutrient and this barrel does not count the soil. Read it as a direction, and let the crop page adjust for your district.' : ''}
                  </p>
                ) : (
                  <p className="small mt-2"><b>Share only, no maunds.</b> A yield figure needs one ruled yield number for {cropName.toLowerCase()}, and this site holds one for wheat and potato only. Until then the barrel shows the share of the programme met.</p>
                )}
                {surplus.length > 0 && <p className="cap mt-2">Above the programme: {surplus.map(s => `${NUTRIENT_LABEL[s.n]} ${fmt(s.given)} of ${fmt(s.need)} kg`).join(', ')}. Extra is not credited. A tall stave does not hold water.</p>}
                <p className="cap mt-2">Figures are kilograms of nutrient per acre from the declared analysis of each bag. Litres are counted as kilograms. Need is VAN’s published {cropName.toLowerCase()} programme for the whole season. Your soil’s own supply is not counted here; the <a href={`#/crops/${crop}`}>crop page</a> adjusts for your district.</p>
              </>
            )}
          </div>
        </div>
      </div>
      <p className="cap mt-3 max-w-[120ch]">{LIEBIG.how}</p>
    </div>
  )
}
