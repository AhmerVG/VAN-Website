/**
 * THE TEAM'S CALCULATORS, CHECKED CROP BY CROP. D-144, 25 Sep 2026, owner's ruling 1.
 *
 *   npx tsc -p tsconfig.enginetest.json && node run-enginetest.cjs __teamcalccheck
 *
 * For every crop wired from the team's workbook (src/data/teamCalculators.ts, written by
 * tools/import-team-calculator.py) this prints the rows and products, and N / P₂O₅ / K₂O per acre three
 * ways: from the calculator (the creator's own engine), from the published plan (the programme the
 * page prints), and the workbook's own "Recommended Dose" band. The band is printed here only; no
 * page prints it or claims anything about it.
 *
 * It FAILS (exit code 1) if a wired crop:
 *   - has a row whose analysis or pack is not the site's own (MASTER_PRODUCTS, or the plan's own row
 *     for a commodity), or a quantity that is not a positive finite number
 *   - carries a price from the sheet (unitPricePkr must be 0; prices come from FARMER_PRICE after the
 *     click) or prices a slug that is not a VAN farmer brand (Tier 2 is never priced)
 *   - has an N, P₂O₅ or K₂O total outside the sane bounds, or no published plan, or a plan with
 *     per-plant rows or age bands
 *   - is not first in LIVE_CALC_CROPS order, i.e. the crop lists would not put it up front
 * Product-level differences from the published plan are REPORTED, not failed: D-77 prints them as a
 * range, as on wheat and potato.
 */
import { CROP_PLANS, CROPS } from '@/data/catalogue'
import { MASTER_PRODUCTS, FARMER_PRICE, isFarmerBrand, priceForPack } from '@/data/pricing'
import { TEAM_CALCULATORS, TEAM_CALC_SKIPPED, TEAM_CALC_SOURCE } from '@/data/teamCalculators'
import { COST_PLANS, LIVE_CALC_CROPS, TEAM_CALC_WAITING } from '@/data/costPlans'
import { programmeSupply, allStages, parseAnalysis } from '@/lib/nutrientBalance'
import { calcPlan } from '@/lib/planCalc'
import { nutrientRanges, fmtRange } from '@/lib/planRange'
import { cropSlug, buildList } from '@/lib/season'
declare const process: { exitCode?: number }

const SANE: Record<'N' | 'P' | 'K', [number, number]> = { N: [1, 200], P: [0, 150], K: [0, 150] }
const f = (v: number | undefined) => (v ?? 0).toFixed(1).padStart(6)
let fails = 0
const fail = (m: string) => { fails++; console.log(`  FAIL ${m}`) }

console.log(`Team calculator check · ${TEAM_CALC_SOURCE.file} (${TEAM_CALC_SOURCE.sheets} sheets, imported ${TEAM_CALC_SOURCE.imported})`)
console.log(`Live calculators, in list order: ${LIVE_CALC_CROPS.join(', ')}`)
if (LIVE_CALC_CROPS[0] !== 'wheat' || LIVE_CALC_CROPS[1] !== 'potato') fail('wheat and potato must lead LIVE_CALC_CROPS')

for (const [slug, c] of Object.entries(TEAM_CALCULATORS)) {
  const crop = CROPS.find(x => cropSlug(x) === slug)
  const cp = CROP_PLANS[slug]
  console.log(`\n=== ${crop?.name ?? slug} (${slug}) · sheet "${c.sheet}" ===`)
  if (!crop || !cp) { fail('no crop page or no published plan'); continue }
  if (cp.mode === 'age') fail('age-band plan')
  if (cp.plan.some(r => r.basis === 'plant')) fail('plan carries per-plant rows')
  // D-151: a crop held back for the team (TEAM_CALC_WAITING) must NOT be live; every other one must be.
  if (slug in TEAM_CALC_WAITING) {
    console.log(`  NOT LIVE, waiting for the team: ${TEAM_CALC_WAITING[slug]}`)
    if (slug in COST_PLANS || LIVE_CALC_CROPS.includes(slug)) fail('held back for the team but still live')
  } else if (COST_PLANS[slug] !== (c.rows as unknown)) fail('COST_PLANS does not carry this crop\'s rows')

  // Every row: the site's analysis and pack, a real quantity, no sheet price, farmer brands only.
  for (const r of c.rows) {
    if (!(r.qtyPerAcre > 0) || !Number.isFinite(r.qtyPerAcre)) fail(`${r.product}: quantity ${r.qtyPerAcre}`)
    if (r.unitPricePkr !== 0) fail(`${r.product}: carries a price from the sheet`)
    if (r.slug) {
      if (!isFarmerBrand(r.slug)) fail(`${r.product}: ${r.slug} is not a VAN farmer brand`)
      const recs = MASTER_PRODUCTS.filter(m => m.slug === r.slug)
      const same = recs.some(m => JSON.stringify(Object.entries(m.analysisPct).sort()) === JSON.stringify(Object.entries(r.analysisPct).sort()))
      if (!same) fail(`${r.product}: analysis ${JSON.stringify(r.analysisPct)} is not the site's (${recs.map(m => JSON.stringify(m.analysisPct)).join(' or ')})`)
      const planPacks = cp.plan.filter(p => p.slug === r.slug).map(p => Number((p.pack.match(/[\d.]+/) ?? ['0'])[0]))
      if (planPacks.length && !planPacks.includes(r.packKg)) fail(`${r.product}: pack ${r.packKg} is not a pack the plan uses (${planPacks.join(', ')})`)
      if (!planPacks.length && !recs.some(m => m.packKg === r.packKg)) fail(`${r.product}: pack ${r.packKg} is neither in the plan nor the catalogue`)
    } else {
      const planRow = cp.plan.find(p => !p.slug && p.product === r.product)
      if (!planRow) fail(`${r.product}: commodity not in the published plan under that name`)
      else {
        const pa = parseAnalysis(planRow.analysis) ?? {}
        for (const k of ['N', 'P', 'K', 'S'] as const) if (Math.abs((pa[k] ?? 0) - (r.analysisPct[k] ?? 0)) > 1e-9) fail(`${r.product}: ${k} ${r.analysisPct[k] ?? 0} against the plan's ${pa[k] ?? 0}`)
      }
    }
  }

  const calc = calcPlan(c.rows, 1, {}, slug).nutrientKg
  const plan = programmeSupply(slug, allStages(slug)).perAcre
  const ranges = nutrientRanges(slug)
  console.log(`  rows ${c.rows.length} · products ${new Set(c.rows.map(r => r.slug ?? r.product)).size} · rows the site figure replaced the sheet's: ${c.rows.filter(r => r.note).length}`)
  console.log('                         N    P₂O₅   K₂O   (kg an acre)')
  console.log(`  calculator        ${f(calc.N)}${f(calc.P)}${f(calc.K)}`)
  console.log(`  published plan    ${f(plan.N)}${f(plan.P)}${f(plan.K)}`)
  console.log(`  sheet's own sum   ${f(c.sheetTotals.N)}${f(c.sheetTotals.P)}${f(c.sheetTotals.K)}   (sheet analysis x sheet pack)`)
  for (const b of c.bands) {
    const pos = (k: 'N' | 'P' | 'K') => { const v = calc[k] ?? 0, t = b[k]; return `${Math.round((v / t - 1) * 100) >= 0 ? '+' : ''}${Math.round((v / t - 1) * 100)}%` }
    console.log(`  band ${('"' + b.label + '"').padEnd(18)}${f(b.N)}${f(b.P)}${f(b.K)}   calculator against this band: N ${pos('N')}, P₂O₅ ${pos('P')}, K₂O ${pos('K')}`)
  }
  if (!c.bands.length) console.log('  band: none on the sheet')
  console.log(`  page prints: N ${fmtRange(ranges?.N)} · P₂O₅ ${fmtRange(ranges?.P)} · K₂O ${fmtRange(ranges?.K)}`)
  for (const k of ['N', 'P', 'K'] as const) {
    const v = calc[k] ?? 0
    if (v < SANE[k][0] || v > SANE[k][1]) fail(`${k} ${v.toFixed(1)} kg an acre outside ${SANE[k][0]} to ${SANE[k][1]}`)
  }

  // Product by product against the published plan: reported, as __costcheck does for wheat and potato.
  // Every plan line, counted or not (buildList is what the shopping list reads).
  const sup = programmeSupply(slug, allStages(slug))
  const inPlan = new Map(buildList(allStages(slug), 1, cp.plan).map(l => [l.product, { pack: l.size, units: l.units }]))
  const uncounted = new Set(sup.uncounted.map(u => u.product))
  const diffs: string[] = []
  for (const [prod, a] of inPlan) {
    const b = c.rows.find(r => r.product === prod)
    if (!b) diffs.push(`in the plan, not the calculator: ${prod} (${+a.units.toFixed(3)} x ${a.pack})`)
    else if (Math.abs(a.pack - b.packKg) > 1e-9 || Math.abs(a.units - b.qtyPerAcre) > 1e-6) diffs.push(`${prod}: plan ${+a.units.toFixed(3)} x ${a.pack}, calculator ${b.qtyPerAcre} x ${b.packKg}`)
  }
  for (const r of c.rows) if (!inPlan.has(r.product)) diffs.push(`in the calculator, not the plan: ${r.product}`)
  for (const r of c.rows) if (uncounted.has(r.product)) diffs.push(`${r.product}: the plan prints no analysis for it ("${sup.uncounted.find(u => u.product === r.product)?.analysis}"), the calculator counts ${JSON.stringify(r.analysisPct)} from the site's catalogue`)
  console.log(diffs.length ? '  differences from the published plan (D-77, printed as a range where they move a nutrient):\n    ' + diffs.join('\n    ') : '  the calculator and the published plan carry the same products, packs and rates')
  for (const r of c.rows) if (r.note) console.log(`  sheet row ${r.sheetRow} ${r.sheetName}: ${r.note}`)
  const unpriced = c.rows.filter(r => r.slug && !priceForPack(r.slug, r.packKg)).map(r => `${r.product} ${r.packKg}`)
  console.log(`  priced after the click from FARMER_PRICE: ${c.rows.filter(r => r.slug && priceForPack(r.slug, r.packKg)).length} lines` + (unpriced.length ? `; no confirmed price, shown with a reason: ${unpriced.join(', ')}` : '') + `; commodity lines, never priced: ${c.rows.filter(r => !r.slug).map(r => r.product).join(', ') || 'none'}`)
  void FARMER_PRICE
}

console.log(TEAM_CALC_SKIPPED.length
  ? `\nSKIPPED:\n  ${TEAM_CALC_SKIPPED.map(s => `${s.slug} (${s.sheet}): ${s.reasons.join('; ')}`).join('\n  ')}`
  : '\nSKIPPED: none of the candidate crops failed a check')
console.log(`\nLive: ${LIVE_CALC_CROPS.length} crops (${Object.keys(TEAM_CALCULATORS).length - Object.keys(TEAM_CALC_WAITING).length} team, plus wheat and potato). Held for the team: ${Object.keys(TEAM_CALC_WAITING).join(', ') || 'none'}.`)
console.log(fails ? `\n${fails} FAILURE(S)` : `\nall ${Object.keys(TEAM_CALCULATORS).length} team calculators pass every check`)
if (fails) process.exitCode = 1
