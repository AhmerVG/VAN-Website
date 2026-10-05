import { useEffect, useMemo, useRef, useState } from 'react'
import { useSharedAcres } from '@/lib/sharedAcres'
import { CROP_PLANS, type PlanRow } from '@/data/catalogue'
import { FARMER_PRICE_SOURCE, NO_PRICE_REASON, NO_PACK_PRICE_REASON, priceForPack } from '@/data/pricing'
import { COST_PLANS } from '@/data/costPlans'
import { TEAM_CALCULATORS } from '@/data/teamCalculators'
import { calcPlan, NUTRIENT_LABELS, MACRO_ORDER, nutrientKey } from '@/lib/planCalc'
import { nutrientDelta, cropHasRange, fmtPair } from '@/lib/planRange'
import type { SoilInputs } from '@/lib/soilAdjustment'
import type { SoilBand, SoilParameter } from '@/data/soilThresholds'
import { SoilAdjustmentPanel } from './SoilAdjustmentPanel'
import type { BandSource } from './SoilAdjustmentPanel'
import { regionalProfile } from '@/data/regionalSoil'
import { wa } from '@/data/site'
import { PackShot, DrawnBag, WaButton } from './bits'

/** D-144: every crop with a calculator, from one registry (src/data/costPlans.ts). Was { wheat, potato }. */
const PLANS = COST_PLANS

/** D-151 (A13): crops whose calculator and published plan give the same N, P₂O₅ and K₂O totals but not the
 *  same product list, so no range shows the difference. From __teamcalccheck. Revert: delete. */
const LIST_DIFFS: Record<string, string> = {
  'rice-basmati': 'The product lists differ: the published plan also has Humi Grow, 1 bag, and 2 packs of Tornado where the calculator has 1. Neither changes the N, P₂O₅ or K₂O total.',
}

function fmtQty(n: number) {
  const r = Math.round(n * 100) / 100
  return r % 1 === 0 ? String(r) : r.toFixed(2).replace(/0$/, '')
}

/**
 * The dynamic nutrition-plan creator — currently wheat and potato only, because those are the two
 * crops with a real VAN-verified per-acre calculator behind them (F:\VAN Web APP\Fertilizer
 * Calculator-Wheat-Potato.xlsx). Acres and, for Wheat, a soil-test band per parameter are the live
 * variables today (soil adjustment wired 9 Sep 2026 — see soilAdjustment.ts; Potato doesn't have its
 * own product map yet, so its soil panel isn't shown). A yield-target input is still pending a rule
 * from Tahir on how a target above/below the calculator's baseline should scale dosage. Cost in PKR
 * is deliberately not shown: whether the spreadsheet's unit prices are list, dealer or VAN's internal
 * cost is still an open question, so a live PKR total would be putting an unconfirmed number in
 * front of a farmer.
 */
/** M2, 24 Sep 2026: the calculator sheet gives every pack in "kg", but the published plans sell these
 *  as litre packs (Pack - 1 L, Pack - 0.5 L, Pack - 4 L). The unit is read off the published plan
 *  rows for the same product, so a liquid prints L. The quantities are unchanged. */
const LIQUID_SLUGS = new Set(Object.values(CROP_PLANS).flatMap(p => p.plan as PlanRow[]).filter(r => r.slug && /\bL$/.test(r.pack.trim())).map(r => r.slug as string))
const packUnit = (slug: string | null) => (slug && LIQUID_SLUGS.has(slug) ? 'L' : 'kg')

/** D-144: `crop` is any slug in COST_PLANS; `cropName` is how the page names it ("basmati rice"). */
export function NutritionCreator({ crop, cropName = crop }: { crop: string; cropName?: string }) {
  const [acres, setAcres] = useSharedAcres(crop)   // M1: shared with the shopping list
  const [soilInputs, setSoilInputs] = useState<SoilInputs>({})
  // Where each band on screen came from — a farmer's own reading, or their district's survey average.
  // Kept separate from the values themselves so the panel can label a prefilled row honestly, and so
  // picking a district never quietly overwrites something the farmer has already told us.
  const [bandSource, setBandSource] = useState<BandSource>({})
  const [district, setDistrict] = useState('')
  // Price is off until asked for. This is a conditional render, not a hidden panel: while it is
  // false the figures are not in the DOM, not in the page source and not in the pre-rendered HTML,
  // so nothing indexes a VAN product against a rupee figure. Tahir's ruling, 8 Sep 2026.
  const [showCost, setShowCost] = useState(false)
  // Soil answers belong to one crop's plan; changing crop clears them rather than carrying a wheat
  // reading into a potato plan whose mapped parameters are not even the same set.
  const cropRef = useRef(crop)
  useEffect(() => {
    if (cropRef.current !== crop) { cropRef.current = crop; setSoilInputs({}); setBandSource({}); setDistrict('') }
  }, [crop])
  const costPlan = PLANS[crop]
  const totals = useMemo(() => calcPlan(costPlan, acres, soilInputs, crop), [costPlan, acres, soilInputs, crop])
  const macros = MACRO_ORDER.filter(n => totals.nutrientKg[n] > 0.01)
  // 11 Sep 2026, Tahir's ruling: where VAN's two documents disagree, print a range, not one number.
  // The other end is this same figure with the per-acre gap between the calculator sheet and the
  // published plan applied at the same acreage. The soil adjustment, which exists in neither
  // document, sits on both ends identically, so the range stays a document difference and does not
  // quietly become a soil difference. See src/lib/planRange.ts.
  const ranged = cropHasRange(crop)
  const otherEnd = (n: string) => totals.nutrientKg[n] + nutrientDelta(crop, n as Parameters<typeof nutrientDelta>[1]) * acres

  const setSoilBand = (p: SoilParameter, band: SoilBand | undefined) => {
    setSoilInputs(s => { const next = { ...s }; if (band) next[p] = band; else delete next[p]; return next })
    setBandSource(s => { const next = { ...s }; if (band) next[p] = 'farmer'; else delete next[p]; return next })
  }

  /** Fill every row the farmer hasn't answered themselves from the chosen district's survey average. */
  const pickDistrict = (key: string) => {
    setDistrict(key)
    const profile = regionalProfile(key)
    if (!profile) return
    setSoilInputs(s => {
      const next = { ...s }
      for (const [parameter, band] of Object.entries(profile.bands)) {
        if (bandSource[parameter as SoilParameter] === 'farmer') continue
        next[parameter as SoilParameter] = band
      }
      return next
    })
    setBandSource(s => {
      const next = { ...s }
      for (const parameter of Object.keys(profile.bands)) {
        if (next[parameter as SoilParameter] === 'farmer') continue
        next[parameter as SoilParameter] = 'district'
      }
      return next
    })
  }

  const clearSoil = () => { setSoilInputs({}); setBandSource({}); setDistrict('') }

  const cost = useMemo(() => {
    let total = 0
    const priced: { product: string; qty: number; line: number }[] = []
    const unpriced: { product: string; why: string }[] = []
    for (const l of totals.lines) {
      const qty = Math.max(0, l.qty + l.soilBumpQty + l.swapQty)
      if (qty <= 0.001) continue
      if (!l.slug) { unpriced.push({ product: l.product, why: 'A commodity input VAN does not sell. Buy it at the market rate.' }); continue }
      const p = priceForPack(l.slug, l.packKg)
      if (!p) {
        const why = NO_PRICE_REASON[l.slug] ?? NO_PACK_PRICE_REASON
        unpriced.push({ product: l.product, why })
        continue
      }
      const line = qty * p.pricePkr
      total += line
      priced.push({ product: l.product, qty, line })
    }
    return { total, priced, unpriced }
  }, [totals])

  const text = useMemo(() => {
    const l1 = `Hello VAN. My ${cropName} plan for ${acres} acre${acres > 1 ? 's' : ''}:`
    const ls = totals.lines.map(l => `• ${l.product}, ${fmtQty(l.qty + l.soilBumpQty)} × ${l.packKg} ${packUnit(l.slug)}`)
    const fractional = totals.lines.some(l => Math.abs((l.qty + l.soilBumpQty) - Math.round(l.qty + l.soilBumpQty)) > 1e-6)
    const profile = regionalProfile(district)
    const usedDistrictAvg = Object.values(bandSource).includes('district')
    const soilNote = profile
      ? usedDistrictAvg
        ? `Soil: no test of my own. Plan adjusted using the ${profile.name.replace(' (all districts)', '')} survey average.`
        : `My district: ${profile.name.replace(' (all districts)', '')}.`
      : null
    // L9, 24 Sep 2026: the "My district is:" prompt goes last, so the farmer types after it.
    return [l1, ...ls, ...(fractional ? ['(Round up to whole packs.)'] : []), ...(soilNote ? [soilNote] : []), 'Please confirm pricing and availability.', ...(soilNote ? [] : ['Please confirm my nearest dealer. My district is:'])].join('\n')
  }, [totals, acres, cropName, district, bandSource])

  return (
    <div className="panel p-5 lg:p-8" style={{ borderColor: 'var(--navy)', borderWidth: 2 }}>
      <div className="flex flex-wrap items-start justify-between gap-4 mb-2">
        <div>
          <span className="eyebrow">Dynamic nutrition creator · beta</span>
          <h3>Set your acres. Watch the plan scale.</h3>
          <p className="muted mt-2 small max-w-[140ch]">Every quantity below comes straight out of VAN's own {cropName} calculator, scaled by your acres, not estimated.{' '}Add your soil test below, or just pick your district, to adjust it further.</p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className="font-bold">Acres</span>
          <button className="step-btn" onClick={() => setAcres(a => Math.max(1, a - 1))} disabled={acres <= 1} aria-label="Fewer acres">−</button>
          <input type="number" min={1} max={50} value={acres} onChange={e => setAcres(Math.min(50, Math.max(1, parseInt(e.target.value || '1', 10) || 1)))} className="input text-center num" style={{ width: 88, fontSize: 24 }} aria-label="Acres" />
          <button className="step-btn" onClick={() => setAcres(a => Math.min(50, a + 1))} disabled={acres >= 50} aria-label="More acres">+</button>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1.3fr_0.7fr] gap-6 mt-5 items-start">
        <ul className="list-none p-0 m-0 grid gap-2">
          {totals.lines.map(l => (
            <li key={l.product} className={`panel flex items-center gap-3 px-3 py-2 ${l.slug ? '' : ''}`} style={l.slug ? {} : { background: '#F1F3EF', borderStyle: 'dashed' }}>
              <div style={{ width: 44, height: 52, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
                {l.slug ? <PackShot slug={l.slug} style={{ maxHeight: 50, width: 'auto' }} /> : <DrawnBag grey label={l.product} width={36} />}
              </div>
              <div className="min-w-0 flex-1">
                {l.slug
                  ? <a href={`#/products/${l.slug}`} className="display text-[16px] leading-tight no-underline hover:underline">{l.product}</a>
                  : <span className="display text-[16px] leading-tight" style={{ color: '#5B6A5E' }}>{l.product}<span className="tag tag-grey ml-1" style={{ fontSize: 10 }}>not a VAN product</span></span>}
                <div className="cap">{l.packKg} {packUnit(l.slug)} pack</div>
              </div>
              <div className="text-right shrink-0">
                <div className="num text-[22px] leading-none" style={{ color: l.slug ? 'var(--navy)' : '#5B6A5E' }}>{fmtQty(Math.max(0, l.qty + l.soilBumpQty + l.swapQty))}</div>
                <div className="cap">{Math.round(Math.max(0, l.qty + l.soilBumpQty + l.swapQty) * l.packKg * 10) / 10} {packUnit(l.slug)} total</div>
                {l.soilBumpQtyPerAcre > 0 && <div className="cap" style={{ color: 'var(--rust)' }}>+{fmtQty(l.soilBumpQty)} for your soil</div>}
                {l.soilBumpQtyPerAcre < 0 && <div className="cap" style={{ color: 'var(--green-text)' }}>−{fmtQty(-l.soilBumpQty)} for your soil, which reads healthy</div>}
                {l.swapQtyPerAcre > 0.001 && <div className="cap" style={{ color: 'var(--green)' }}>+{fmtQty(l.swapQty)}. Nitrogen moved here</div>}
                {l.swapQtyPerAcre < -0.001 && <div className="cap" style={{ color: 'var(--muted)' }}>{fmtQty(l.swapQty)}. Nitrogen moved out</div>}
              </div>
            </li>
          ))}
        </ul>

        <div className="grid gap-4">
          <div className="panel-soft p-4">
            <div className="cap font-bold uppercase tracking-[.06em] mb-3">Nutrient delivered · {acres} acre{acres > 1 ? 's' : ''}</div>
            <div className="grid gap-2">
              {macros.map(n => (
                <div key={n} className="flex items-baseline justify-between">
                  <span className="small">{NUTRIENT_LABELS[n] ?? n} <span className="cap">({nutrientKey(n)})</span></span>
                  <span className="num" style={{ color: 'var(--navy)' }}>{fmtPair(totals.nutrientKg[n], otherEnd(n))}</span>
                </div>
              ))}
            </div>
            {/**
              * 11 Sep 2026 · an independent audit found this panel and the removal table lower down
              * the same page reporting two different totals for one programme, 4.4 kg apart on
              * phosphate. They are not the same source: this panel reads VAN's own crop CALCULATOR
              * sheet, and the removal table reads VAN's PUBLISHED PLAN, and on wheat and potato the
              * two VAN documents do not carry the same product list. tools/costcheck reports the
              * difference in full. Until VAN says which document governs, the page names the source
              * of each figure rather than letting a reader find the gap and draw his own conclusion.
              */}
            {/* D-181, Tahir 26 Sep 2026: "show the gap and explain it". The team sheet this calculator reads also
                carries a general recommended dose per acre (by soil fertility on sugarcane, cotton and maize). The
                plan puts on less P and K than it on most crops. His reason: VAN's products need less. Shown as
                his reason, beside both sets of figures, per acre times the acres set above. */}
            {TEAM_CALCULATORS[crop]?.bands?.length ? (
              <div className="mt-3 pt-3" style={{ borderTop: '1px dashed var(--line)' }}>
                <div className="cap font-bold uppercase tracking-[.06em]">Against the general recommended dose · {acres} acre{acres > 1 ? 's' : ''}</div>
                <table className="nc-gap mt-2">
                  <thead><tr><th></th><th>N</th><th>P₂O₅</th><th>K₂O</th></tr></thead>
                  <tbody>
                    <tr className="nc-gap-plan"><th>This plan</th>{(['N', 'P', 'K'] as const).map(k => <td key={k} className="num">{Math.round(totals.nutrientKg[k] ?? 0)}</td>)}</tr>
                    {TEAM_CALCULATORS[crop].bands.map(b => (
                      <tr key={b.label}><th>{b.label === 'Recommended' ? 'General recommended dose' : `Recommended, ${b.label.toLowerCase()} soil`}</th>{(['N', 'P', 'K'] as const).map(k => <td key={k} className="num">{Math.round(b[k] * acres)}</td>)}</tr>
                    ))}
                  </tbody>
                </table>
                <p className="cap mt-2">kg in total. The recommended dose is the general figure in VAN’s own calculator sheet for this crop. VAN’s plan puts on less than it on most nutrients because VAN’s products lose less of what is applied, so the crop needs less of them for the same result.</p>
              </div>
            ) : null}
            <p className="cap mt-3" style={{ color: 'var(--muted)' }}>
              {ranged
                ? <>{/* D-151 (A11, A27): was "The lower end and the higher end are VAN's calculator sheet and VAN's published plan ... The plans are being brought onto the calculator crop by crop, and each range closes to one number as that is done." */}
                    A figure written as a range has 2 VAN documents behind it: VAN's {cropName} calculator
                    sheet and VAN's published {cropName} plan, which do not carry an identical product list
                    on this crop. Which of the 2 is higher depends on the nutrient. Both ends are arithmetic
                    on VAN's own printed analyses. Nothing here is estimated.</>
                : <>These totals are VAN's own arithmetic on VAN's {cropName} calculator sheet, and VAN's published {cropName} plan gives the same figures. Nothing
                    is estimated.{LIST_DIFFS[crop] ? <> {LIST_DIFFS[crop]}</> : null}</>}
            </p>
            <div className="mt-4 pt-3" style={{ borderTop: '1px dashed var(--line)' }}>
              {/* D-151 (QA 8, A27): was "Coming next" in var(--gold-2) and "Yield-target scaling, telling the plan you are aiming above or below the standard crop, is being calibrated against VAN's own trial data before it goes in." */}
              <div className="cap" style={{ color: 'var(--gold-text)' }}>Not in this calculator</div>
              <div className="small muted mt-1">Yield-target scaling is not in this calculator. The quantities are for the standard crop in VAN's plan.</div>
            </div>
          </div>
          <SoilAdjustmentPanel
              crop={crop}
              soilInputs={soilInputs}
              bandSource={bandSource}
              district={district}
              onChange={setSoilBand}
              onPickDistrict={pickDistrict}
              onClear={clearSoil}
            />
        </div>
      </div>

      {totals.swaps.length > 0 && (
        <div className="panel-soft p-4 mt-5" style={{ borderLeft: '4px solid var(--green)' }}>
          <div className="cap font-bold uppercase tracking-[.06em] mb-1">Same nitrogen, carried differently</div>
          <p className="small max-w-[140ch]">{totals.swaps[0].note} The swap itself adds no nitrogen: exactly as much leaves the urea line as arrives on the Vital Urea line, which is why one falls as the other rises. If the nitrogen total above moves slightly, that is the phosphate line, which carries a little nitrogen of its own.</p>
          <p className="cap mt-2 max-w-[140ch]">Sulfur goes up as a result, Vital Urea is 13% sulfur, which on alkaline calcareous ground is a second benefit rather than a side effect.</p>
        </div>
      )}

      {totals.advisories.map(a => (
        <div key={a.parameter} className="panel p-5 mt-5" style={{ borderColor: 'var(--rust)', borderWidth: 2 }}>
          <div className="cap font-bold uppercase tracking-[.06em]" style={{ color: 'var(--rust-text)' }}>Read this before you buy anything</div>
          <h4 className="mt-1">{a.headline}</h4>
          <p className="small mt-2 max-w-[140ch]">{a.body}</p>
          <WaButton href={wa(`Hello VAN. My soil report shows a salinity (EC) problem on my ${cropName} land. Can your agronomy team advise?`)} >Send the report to the agronomy team</WaButton>
        </div>
      ))}

      <div className="mt-5">
        {!showCost ? (
          <button className="btn btn-ghost" onClick={() => setShowCost(true)}>What will this cost me? →</button>
        ) : (
          <div className="panel p-5" style={{ borderColor: 'var(--navy)', borderWidth: 2 }}>
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <div>
                <span className="eyebrow navy">{FARMER_PRICE_SOURCE.label}</span>
                <div className="num" style={{ fontSize: 34, color: 'var(--navy)', lineHeight: 1.1 }}>PKR {Math.round(cost.total).toLocaleString()}</div>
                <div className="cap">for {acres} acre{acres > 1 ? 's' : ''} · VAN products in this plan</div>
              </div>
              <button className="btn btn-sm" onClick={() => setShowCost(false)}>Hide</button>
            </div>
            <div className="grid gap-1 mt-4">
              {cost.priced.map(c => (
                <div key={c.product} className="flex items-baseline justify-between gap-3 small">
                  <span>{c.product} <span className="cap">× {fmtQty(c.qty)}</span></span>
                  <span className="num">{Math.round(c.line).toLocaleString()}</span>
                </div>
              ))}
            </div>
            {cost.unpriced.length > 0 && (
              <div className="mt-4 pt-3" style={{ borderTop: '1px dashed var(--line)' }}>
                <div className="cap font-bold uppercase tracking-[.06em] mb-1">Not in that total</div>
                {cost.unpriced.map(u => <div key={u.product} className="cap">{u.product}. {u.why}</div>)}
              </div>
            )}
            <p className="cap mt-4 max-w-[140ch]">Prices as at {FARMER_PRICE_SOURCE.window}. {FARMER_PRICE_SOURCE.note}</p>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-3 mt-5">
        <WaButton href={wa(text)} lg>Send this list on WhatsApp</WaButton>
      </div>
      <p className="cap mt-3">VAN confirms the final price, availability and your nearest dealer on WhatsApp.</p>
      {totals.soilAdjusted && (
        <p className="cap mt-1">
          This is a pilot soil-adjustment model, not yet calibrated against a full season's results. Confirm any soil-driven change with your VAN dealer before applying.
          {Object.values(bandSource).includes('district') && ' Part of this plan is adjusted from your district\u2019s survey average rather than a test of your own land. A soil test would make it exact.'}
        </p>
      )}
    </div>
  )
}
