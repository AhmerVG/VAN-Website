import { useMemo, useState } from 'react'
import { useSharedAcres } from '@/lib/sharedAcres'
import { WHEAT_STAGES, WHEAT_PLAN, type PlanRow } from '@/data/catalogue'
import { WHEAT, wa } from '@/data/site'
import { buildList, buildPlantDoses, hasSprayBasis, fmtQty, fmtUnits } from '@/lib/season'
import { PackShot, DrawnBag, WaButton } from './bits'
import { FARMER_PRICE_SOURCE, NO_PRICE_REASON, NO_PACK_PRICE_REASON, priceForPack } from '@/data/pricing'
import { SoilAdjustmentPanel, type BandSource } from './SoilAdjustmentPanel'
import { computeSoilBumps, computeSoilSwaps, soilAdvisories, type SoilInputs } from '@/lib/soilAdjustment'
import { costRowsForCrop } from '@/lib/cropSoilMap'
import { regionalProfile } from '@/data/regionalSoil'
import { alternativeFor, nutrientPerPack } from '@/data/alternatives'
import { Ur, UrduReviewNotice } from './Ur'
import { useUrduMode } from '@/lib/readingMode'
import { ur as urStage } from '@/data/urdu'
import type { SoilBand, SoilParameter } from '@/data/soilThresholds'

/**
 * Tick the stages you want, set your acres, get a shopping list. No prices — VAN replies with those
 * on WhatsApp.
 *
 * Built for wheat, then opened to every crop on 8 Sep 2026: the maths is published rate x acres and
 * every one of the 28 programmes carries the same stage/product/rate/pack fields, so there was no
 * reason for 27 crops to go without it. `crop` and `pdf` default to wheat so the wheat page is
 * unchanged.
 */
export function ListBuilder({ stages = WHEAT_STAGES, plan = WHEAT_PLAN, cropName = 'wheat', pdfPath = WHEAT.pdf, mode = 'stage', cropKey = 'wheat', soil = false }: { stages?: string[]; plan?: PlanRow[]; cropName?: string; pdfPath?: string; mode?: 'stage' | 'age'; cropKey?: string; soil?: boolean } = {}) {
  // In AGE mode the list is not a set of stages a farmer passes through in one season — it is a set
  // of orchard-age bands, and exactly one applies. Ticking several would add a young palm's dose to a
  // mature palm's. So the control is single-select and opens on the mature band.
  const isAge = mode === 'age'
  const [ticked, setTicked] = useState<Set<string>>(() => new Set(isAge ? [stages[stages.length - 1]] : stages))
  const [acres, setAcres] = useSharedAcres(cropKey)   // M1: shared with the nutrition creator
  // Off until asked for, and conditionally rendered — see the ruling in pricing.ts. Nothing here is
  // in the page source until the farmer presses the button.
  const [showCost, setShowCost] = useState(false)
  // ── The soil layer (9 Sep 2026) ──────────────────────────────────────────────────────────────
  // Wheat and potato carry this inside the nutrition creator; the other 26 crops carry it here, on
  // the shopping list, because the list is the thing a farmer actually acts on. `soil` is off by
  // default so the wheat page does not end up with the same panel twice.
  // Which lines the farmer has switched to their alternate product. Tahir's ruling, 9 Sep 2026:
  // Fusion Phosphate is optional and always shown as a choice beside Green Phosphate. It changes
  // nothing in the plan or the PDF — only what the farmer decides to buy against that line.
  const [swapped, setSwapped] = useState<Record<string, boolean>>({})
  const [soilInputs, setSoilInputs] = useState<SoilInputs>({})
  const [bandSource, setBandSource] = useState<BandSource>({})
  const [district, setDistrict] = useState('')

  const rawLines = useMemo(() => buildList(ticked, acres, plan), [ticked, acres, plan])
  // Bumps are sized off the PER-ACRE quantity and multiplied up, so a 10-acre field gets ten times
  // the correction rather than a correction ten times the size.
  const perAcreBySlug = useMemo(() => {
    const m: Record<string, number> = {}
    for (const l of buildList(ticked, 1, plan)) if (l.slug) m[l.slug] = (m[l.slug] ?? 0) + l.units
    return m
  }, [ticked, plan])
  const costRows = useMemo(() => (soil ? costRowsForCrop(cropKey) : []), [soil, cropKey])
  const bumps = useMemo(() => (soil ? computeSoilBumps(soilInputs, perAcreBySlug, cropKey) : {}), [soil, soilInputs, perAcreBySlug, cropKey])
  const swaps = useMemo(() => (soil ? computeSoilSwaps(soilInputs, costRows as never) : []), [soil, soilInputs, costRows])
  const advisories = useMemo(() => (soil ? soilAdvisories(soilInputs, cropKey) : []), [soil, soilInputs, cropKey])

  /**
   * Apply the correction to the list. A product can appear twice in one plan at two pack sizes, so
   * the per-slug correction is split between those lines in proportion to what each already carries —
   * otherwise the same bump would be added to both and the farmer would be sold it twice.
   */
  const lines = useMemo(() => {
    if (!soil) return rawLines
    return rawLines.map(l => {
      const slugTotal = l.slug ? perAcreBySlug[l.slug] ?? 0 : 0
      const perAcreHere = slugTotal > 0 ? (l.units / acres) : 0
      const share = slugTotal > 0 ? perAcreHere / slugTotal : 0
      const bump = l.slug ? (bumps[l.slug]?.bagsPerAcre ?? 0) * share * acres : 0
      const swap = swaps.reduce((a, w) =>
        a + (w.fromProduct === l.product ? w.fromDelta * acres : 0) + (l.slug && w.toSlug === l.slug ? w.toDelta * acres : 0), 0)
      const added = bump + swap
      return { ...l, units: Math.max(0, l.units + added), added }
    })
  }, [rawLines, soil, bumps, swaps, perAcreBySlug, acres])

  // The swap is applied AFTER the soil layer, on purpose: the soil correction is sized against the
  // line the plan names, and switching which bag you buy it in must not change how much correction
  // the plan asked for.
  const shown = useMemo(() => lines.map(l => {
    const alt = alternativeFor(l.slug)
    if (!alt || !swapped[l.key]) return { ...l, alt, isAlt: false }
    return { ...l, alt, isAlt: true, product: alt.altName, slug: alt.altSlug }
  }), [lines, swapped])

  const soilAdjusted = soil && (Object.keys(bumps).length > 0 || swaps.length > 0)
  const van = shown.filter(l => !l.commodity)
  const commodity = shown.filter(l => l.commodity)

  const setSoilBand = (p: SoilParameter, band: SoilBand | undefined) => {
    setSoilInputs(st => { const n = { ...st }; if (band) n[p] = band; else delete n[p]; return n })
    setBandSource(st => { const n = { ...st }; if (band) n[p] = 'farmer'; else delete n[p]; return n })
  }
  /** Fill every row the farmer has not answered themselves from the district's survey median. */
  const pickDistrict = (key: string) => {
    setDistrict(key)
    const profile = regionalProfile(key)
    if (!profile) return
    setSoilInputs(st => {
      const n = { ...st }
      for (const [parameter, band] of Object.entries(profile.bands)) {
        if (bandSource[parameter as SoilParameter] === 'farmer') continue
        n[parameter as SoilParameter] = band
      }
      return n
    })
    setBandSource(st => {
      const n = { ...st }
      for (const parameter of Object.keys(profile.bands)) {
        if (n[parameter as SoilParameter] === 'farmer') continue
        n[parameter as SoilParameter] = 'district'
      }
      return n
    })
  }
  const clearSoil = () => { setSoilInputs({}); setBandSource({}); setDistrict('') }
  const toggle = (s: string) => setTicked(t => { if (isAge) return new Set([s]); const n = new Set(t); if (n.has(s)) n.delete(s); else n.add(s); return n })
  const plantDoses = useMemo(() => buildPlantDoses(ticked, plan), [ticked, plan])
  const sprayBasis = useMemo(() => hasSprayBasis(ticked, plan), [ticked, plan])
  const pdf = `https://www.van.com.pk/${pdfPath}`
  const cost = useMemo(() => {
    let total = 0
    const priced: { product: string; units: number; line: number }[] = []
    const unpriced: { product: string; why: string }[] = []
    for (const l of shown) {
      if (l.units <= 0.001) continue
      if (!l.slug) { unpriced.push({ product: l.product, why: 'A commodity input VAN does not sell.' }); continue }
      const pr = priceForPack(l.slug, l.size)
      if (!pr) { unpriced.push({ product: l.product, why: NO_PRICE_REASON[l.slug] ?? NO_PACK_PRICE_REASON }); continue }
      const line = l.units * pr.pricePkr
      total += line
      priced.push({ product: l.product, units: l.units, line })
    }
    return { total, priced, unpriced }
  }, [shown])
  const text = useMemo(() => {
    const st = stages.filter(s => ticked.has(s))
    const l1 = isAge
      ? `Hello VAN. My ${cropName} list for ${acres} acre${acres > 1 ? 's' : ''} (orchard age: ${st.join(', ') || 'none'}):`
      : `Hello VAN. My ${cropName} list for ${acres} acre${acres > 1 ? 's' : ''} (stages: ${st.join(', ') || 'none'}):`
    const ls = van.map(l => `• ${l.product}, ${fmtQty(l.units, l.unit)} of ${l.size} ${l.measure}`)
    const cs = commodity.map(l => `(plus commodity urea, not a VAN product: ${fmtQty(l.units, l.unit)} of ${l.size} ${l.measure})`)
    const soilNote = soilAdjusted
      ? ['(these quantities are adjusted for my soil reading: ' +
         Object.entries(soilInputs).map(([k, v]) => `${k} ${v}`).join(', ') + ')']
      : []
    return [l1, ...ls, ...cs, ...soilNote, 'Please send price, availability and my nearest dealer. My district is:'].join('\n')
  }, [ticked, acres, van, commodity, soilAdjusted, soilInputs])

  return (
    <div className="panel p-5 lg:p-8" style={{ borderColor: 'var(--navy)', borderWidth: 2 }}>
      <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-8 items-start">
        <div className="lg:sticky lg:top-24">
          <span className="eyebrow">Per-acre list builder</span>
          <h3>{isAge ? 'How old is the orchard? Set your acres. Send the list.' : 'Tick the stages. Set your acres. Send the list.'}</h3>
          <p className="muted mt-2 small">{isAge ? 'One age band applies at a time. A palm is one age. Counts are that band’s published per-acre rates multiplied by your acres.' : 'Counts are the published per-acre rates added up across the stages you tick, multiplied by your acres.'} VAN confirms the final price, availability and delivery on WhatsApp.</p>
          <div className="grid gap-2 mt-5">
            {stages.map((s, k) => (
              <label key={s} className={`flex items-center gap-3 panel px-4 py-3 cursor-pointer st-${k}`} style={{ borderColor: ticked.has(s) ? 'var(--st)' : undefined, background: ticked.has(s) ? 'var(--st-soft)' : '#fff' }}>
                <input type={isAge ? 'radio' : 'checkbox'} name={isAge ? 'van-age-band' : undefined} checked={ticked.has(s)} onChange={() => toggle(s)} style={{ width: 24, height: 24, accentColor: '#14231A' }} />
                <span className="font-bold flex-1 min-w-0" style={{ overflowWrap: 'anywhere' }}><Ur kind="stage" en={s} /></span>
                {/* D-151 (QA 28): a stage with no rows says so instead of "0 rows". */}
                <span className="cap shrink-0 text-right" style={{ maxWidth: '45%' }}>{plan.filter(r => r.stage === s).length ? `${plan.filter(r => r.stage === s).length} rows` : 'nothing applied at this stage'}</span>
              </label>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-3 mt-5">
            <span className="font-bold">Acres</span>
            <button className="step-btn" onClick={() => setAcres(a => Math.max(1, a - 1))} disabled={acres <= 1} aria-label="Fewer acres">−</button>
            <input type="number" min={1} max={50} value={acres} onChange={e => setAcres(Math.min(50, Math.max(1, parseInt(e.target.value || '1', 10) || 1)))} className="input text-center num" style={{ width: 96, fontSize: 26 }} aria-label="Acres" />
            <button className="step-btn" onClick={() => setAcres(a => Math.min(50, a + 1))} disabled={acres >= 50} aria-label="More acres">+</button>
            <span className="cap">1–50</span>
          </div>
          {soil && (
            <div className="mt-5">
              <SoilAdjustmentPanel
                crop={cropKey}
                soilInputs={soilInputs}
                bandSource={bandSource}
                district={district}
                onChange={setSoilBand}
                onPickDistrict={pickDistrict}
                onClear={clearSoil}
              />
            </div>
          )}
        </div>
        <div>
          <div className="flex items-baseline justify-between">
            <div className="font-bold">Your list · {acres} acre{acres > 1 ? 's' : ''}</div>
            <div className="cap">{van.length} VAN product{van.length === 1 ? '' : 's'}</div>
          </div>
          {!lines.length && <p className="muted mt-3 p-4 panel-soft">{isAge ? 'Choose your orchard age to build a list.' : 'Tick at least one stage to build a list.'}</p>}
          <ul className="list-none p-0 m-0 mt-2 grid gap-2">
            {van.map(l => (
              // D-151 (QA 2, 3): the row wraps; the stage caption breaks after "/" and anywhere it must; the
              // Green Phosphate choice sits full width under the row instead of in the middle column.
              <li key={l.key} className="panel flex flex-wrap items-center gap-3 px-3 py-2">
                <div style={{ width: 48, height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}><PackShot slug={l.slug} style={{ maxHeight: 58, width: 'auto' }} /></div>
                <div className="min-w-0 flex-1">
                  <a href={l.slug ? `#/products/${l.slug}` : undefined} className="display text-[18px] leading-tight no-underline hover:underline">{l.product}</a>
                  <div className="cap" style={{ overflowWrap: 'anywhere' }}>{l.size} {l.measure} {l.unit} · {l.stages.map(st => st.replace(/\//g, '/\u200B')).join(', ')}</div>
                  <UrOnlyStages stages={l.stages} />
                </div>
                <div className="text-right shrink-0">
                  <div className="num text-[26px] leading-none" style={{ color: 'var(--navy)' }}>{fmtUnits(l.units)}</div>
                  <div className="cap">{l.unit}{l.units > 1 ? 's' : ''} · {Math.round(l.units * l.size * 100) / 100} {l.measure}</div>
                  {'added' in l && Math.abs((l as { added: number }).added) > 0.01 && (
                    <div className="cap" style={{ color: (l as { added: number }).added > 0 ? 'var(--rust-text)' : 'var(--green)' }}>
                      {(l as { added: number }).added > 0 ? '+' : '−'}{fmtUnits(Math.abs((l as { added: number }).added))} for your soil
                    </div>
                  )}
                </div>
                  {l.alt && (
                    <div className="basis-full w-full pt-2" style={{ borderTop: '1px dashed var(--line)' }}>
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="cap">Your choice:</span>
                        <button
                          className={`chip chip-xs ${!l.isAlt ? 'on' : ''}`}
                          aria-pressed={!l.isAlt}
                          onClick={() => setSwapped(sw => ({ ...sw, [l.key]: false }))}
                        >Green Phosphate</button>
                        <button
                          className={`chip chip-xs ${l.isAlt ? 'on' : ''}`}
                          aria-pressed={l.isAlt}
                          onClick={() => setSwapped(sw => ({ ...sw, [l.key]: true }))}
                        >{l.alt.altName}</button>
                      </div>
                      <p className="cap mt-1 max-w-[140ch]">
                        {l.alt.difference}{' '}
                        <b>
                          At {l.size} {l.measure} a bag: Green Phosphate {nutrientPerPack('green-phosphate', 'P', l.size).toFixed(1)} kg P₂O₅
                          {' '}+ {nutrientPerPack('green-phosphate', 'N', l.size).toFixed(1)} kg N,
                          {' '}{l.alt.altName} {nutrientPerPack(l.alt.altSlug, 'P', l.size).toFixed(1)} kg P₂O₅ and no nitrogen.
                        </b>
                      </p>
                    </div>
                  )}
              </li>
            ))}
            {commodity.map(l => (
              <li key={l.key} className="panel flex items-center gap-3 px-3 py-2" style={{ background: '#F1F3EF', borderStyle: 'dashed' }}>
                <div style={{ width: 48, height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}><DrawnBag grey label={l.product} width={40} /></div>
                <div className="min-w-0 flex-1">
                  <div className="display text-[18px] leading-tight" style={{ color: '#5B6A5E' }}>{l.product} <span className="tag tag-grey ml-1">not a VAN product</span></div>
                  <div className="cap" style={{ overflowWrap: 'anywhere' }}>commodity input · {l.size > 0 ? `${l.size} ${l.measure} ${l.unit} · ` : ''}{l.stages.map(st => st.replace(/\//g, '/\u200B')).join(', ')}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="num text-[26px] leading-none" style={{ color: '#5B6A5E' }}>{fmtUnits(l.units)}</div>
                  <div className="cap">{l.unit}{l.units > 1 ? 's' : ''}{l.size > 0 ? ` · ${Math.round(l.units * l.size * 100) / 100} ${l.measure || 'kg'}` : ''}</div>
                  {'added' in l && (l as { added: number }).added < -0.01 && (
                    <div className="cap" style={{ color: 'var(--green)' }}>−{fmtUnits(Math.abs((l as { added: number }).added))} moved to Vital Urea</div>
                  )}
                </div>
              </li>
            ))}
          </ul>
          {soilAdjusted && (
            <div className="panel-soft p-4 mt-3">
              <div className="cap font-bold uppercase tracking-[.06em] mb-1">What your soil answers changed</div>
              <p className="small max-w-[140ch]">
                The quantities above now carry your soil reading, not just the crop programme. Where the
                ground reads short, more of the product that carries that nutrient goes on. Where the
                reading is healthy, nothing is added.
              </p>
              {swaps.length > 0 && (
                <p className="small mt-2 max-w-[140ch]">
                  <b>Nitrogen has been moved, not increased.</b> {swaps[0].note} The total nitrogen going
                  on your field is unchanged. It is simply carried by a form that stays where you put it.
                </p>
              )}
            </div>
          )}
          {advisories.map(a => (
            <div key={a.parameter} className="panel p-4 mt-3" style={{ borderColor: 'var(--rust)', borderWidth: 2 }}>
              <span className="eyebrow rust">Read this before buying anything</span>
              <h4 className="mt-1">{a.headline}</h4>
              <p className="small mt-2 max-w-[140ch]">{a.body}</p>
              <WaButton href={wa(`Hello VAN. My ${cropName} field reads high on salts (EC). Please advise before I buy fertilizer. My district and soil report:`)} className="btn-wa btn-sm mt-3">Send my soil report</WaButton>
            </div>
          ))}
          {sprayBasis && (
            <p className="cap mt-3 p-3 panel-soft max-w-[140ch]">
              The spray rates in this programme are published <b>per 200 litres of water</b>, and are
              counted here as one 200-litre tank to the acre. A larger canopy takes more water to cover,
              so it takes more product. Tell VAN your tree size and spray volume and the count is
              adjusted.
            </p>
          )}
          {plantDoses.length > 0 && (
            <div className="panel p-4 mt-3" style={{ borderStyle: 'dashed' }}>
              <span className="eyebrow navy">Per-plant doses, not counted above</span>
              <p className="small muted mt-2 max-w-[140ch]">
                These rates are published <b>per tree</b>, not per acre, so they cannot be turned into
                bags until the orchard&rsquo;s tree count and spacing are known. <b>Vital Green works that out
                against your own orchard</b>. Send your tree count and row spacing and you get the
                quantities back.
              </p>
              <ul className="list-none p-0 m-0 mt-3 grid gap-2">
                {plantDoses.map(d => (
                  <li key={d.key} className="flex flex-wrap items-baseline gap-x-3 gap-y-1 small">
                    <span className="font-bold">{d.product}</span>
                    <span className="num" style={{ color: 'var(--navy)' }}>{d.rate.replace(/dose/i, '').trim()} per plant</span>
                    <span className="cap" style={{ flexBasis: '100%' }}>{d.stage} · {d.method}</span>
                  </li>
                ))}
              </ul>
              <WaButton href={wa(`Hello VAN. My ${cropName} orchard. Please calculate the per-plant doses for me. My tree count and spacing:`)} className="btn-wa btn-sm mt-4">Send my orchard details</WaButton>
            </div>
          )}
          {showCost && (
            <div className="panel p-5 mb-4" style={{ borderColor: 'var(--navy)', borderWidth: 2 }}>
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <div>
                  <span className="eyebrow navy">{FARMER_PRICE_SOURCE.label}</span>
                  <div className="num" style={{ fontSize: 32, color: 'var(--navy)', lineHeight: 1.1 }}>PKR {Math.round(cost.total).toLocaleString()}</div>
                  <div className="cap">for {acres} acre{acres > 1 ? 's' : ''} · VAN products {isAge ? 'at this orchard age' : 'in the stages you ticked'}</div>
                </div>
                <button className="btn btn-sm" onClick={() => setShowCost(false)}>Hide</button>
              </div>
              <div className="grid gap-1 mt-4">
                {cost.priced.map(c => (
                  <div key={c.product} className="flex items-baseline justify-between gap-3 small">
                    <span>{c.product} <span className="cap">× {fmtUnits(c.units)}</span></span>
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

          <div className="flex flex-wrap gap-3 mt-5">
            {!showCost
              ? <button className="btn btn-ghost btn-lg" onClick={() => setShowCost(true)}>What will this cost me? →</button>
              : null}
            <WaButton href={wa(text)} lg>Send this list on WhatsApp</WaButton>
            <a className="btn btn-ghost btn-lg" href={pdf} target="_blank" rel="noopener">Download the PDF ↓</a>
          </div>
          <UrduReviewNotice />
          <p className="cap mt-3">The message carries the list above. Add your district and VAN replies with price and the nearest dealer.</p>
        </div>
      </div>
    </div>
  )
}

/** The stages a line belongs to, in Urdu, under the English line. Renders nothing when the Urdu
 *  layer is off or when none of the stage names has a translation. */
function UrOnlyStages({ stages }: { stages: string[] }) {
  const [urdu] = useUrduMode()
  if (!urdu) return null
  const t = stages.map(s => urStage('stage', s)).filter(Boolean)
  if (!t.length) return null
  return <div dir="rtl" lang="ur" className="cap urdu">{t.join(' · ')}</div>
}
