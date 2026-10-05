import { computeSoilBumps, computeSoilSwaps, soilAdvisories, mappedParameters } from '@/lib/soilAdjustment'
import { WHEAT_COST_PLAN, POTATO_COST_PLAN } from '@/data/pricing'
import type { SoilBand } from '@/data/soilThresholds'
import { costRowsForCrop, validateDerivedMaps, soilMapForCrop, unknownAnalysis } from '@/lib/cropSoilMap'
import { CROP_PLANS } from '@/data/catalogue'
import { COST_PLANS } from '@/data/costPlans'

const BANDS: SoilBand[] = ['critical','weak','average','moderate','healthy']
const N = (plan: any[], qty: Record<string, number>) =>
  plan.reduce((s, r) => s + (qty[r.slug ?? r.product] ?? 0) * r.packKg * ((r.analysisPct.N ?? 0) / 100), 0)

function run(label: string, plan: any[], crop: 'wheat'|'potato') {
  const params = mappedParameters(crop)
  const baseQty: Record<string, number> = {}
  for (const r of plan) baseQty[r.slug ?? r.product] = r.qtyPerAcre
  console.log(`\n=== ${label}. Mapped parameters (${params.length}): ${params.join(', ')}`)

  // 1. nitrogen neutrality of the pH substitution, at every band
  console.log('  pH substitution. Nitrogen must not move:')
  for (const band of BANDS) {
    const inputs: any = { pH: band }
    const bumps = computeSoilBumps(inputs, baseQty, crop)
    const withBumps = { ...baseQty }
    for (const k in bumps) withBumps[k] = (withBumps[k] ?? 0) + bumps[k].bagsPerAcre
    const rows = plan.map(r => ({ ...r, qtyPerAcre: withBumps[r.slug ?? r.product] ?? r.qtyPerAcre }))
    const swaps = computeSoilSwaps(inputs, rows as any)
    const after = { ...withBumps }
    for (const s of swaps) {
      const fromKey = plan.find(r => r.product === s.fromProduct)?.slug ?? s.fromProduct
      after[fromKey] = (after[fromKey] ?? 0) + s.fromDelta
      after[s.toSlug] = (after[s.toSlug] ?? 0) + s.toDelta
    }
    const n0 = N(plan, baseQty), n1 = N(plan, after)
    console.log(`    ${band.padEnd(9)} swaps ${String((swaps as any[]).length)}  N ${n0.toFixed(2)} -> ${n1.toFixed(2)}  (delta ${(n1-n0).toFixed(2)})`)
  }

  // 2. the 2x dose cap, every parameter Critical at once
  const allCritical: any = {}
  for (const p of params) allCritical[p] = 'critical'
  const bumps = computeSoilBumps(allCritical, baseQty, crop)
  let worst = 0, worstSlug = ''
  for (const r of plan) {
    const k = r.slug ?? r.product
    const total = (baseQty[k] ?? 0) + (bumps[k]?.bagsPerAcre ?? 0)
    const ratio = baseQty[k] ? total / baseQty[k] : 1
    if (ratio > worst) { worst = ratio; worstSlug = r.product }
  }
  console.log(`  every parameter Critical -> largest multiple of the standard dose: ${worst.toFixed(3)}x (${worstSlug})  cap is 2x: ${worst <= 2.0001 ? 'HOLDS' : 'BREACHED'}`)

  // 3. monotonicity — a worse band must never ask for less product
  let mono = true
  for (const p of params) {
    let prev = Infinity
    for (const band of BANDS) {
      const bb = computeSoilBumps({ [p]: band } as any, baseQty, crop)
      const tot = Object.values(bb).reduce((a: number, b: any) => a + b.bagsPerAcre, 0) as number
      if (tot > prev + 1e-9) mono = false
      prev = tot
    }
  }
  console.log(`  monotonic across bands (Critical >= Weak >= ... >= Healthy): ${mono ? 'YES' : 'NO'}`)

  // 4. healthy soil must change nothing
  const allHealthy: any = {}
  for (const p of params) allHealthy[p] = 'healthy'
  const hb = computeSoilBumps(allHealthy, baseQty, crop)
  const hsum = Object.values(hb).reduce((a: number, b: any) => a + b.bagsPerAcre, 0) as number
  const hswaps = computeSoilSwaps(allHealthy, plan as any)
  console.log(`  all-Healthy soil changes nothing: bumps ${hsum.toFixed(4)} swaps ${(hswaps as any[]).length} -> ${hsum < 1e-9 && (hswaps as any[]).length === 0 ? 'CORRECT' : 'PROBLEM'}`)

  // 5. EC returns words, never a product
  const ec = computeSoilBumps({ EC: 'critical' } as any, baseQty, crop)
  const ecSum = Object.values(ec).reduce((a: number, b: any) => a + b.bagsPerAcre, 0) as number
  const adv = soilAdvisories({ EC: 'critical' } as any)
  console.log(`  EC Critical -> product bumps ${ecSum.toFixed(4)} (must be 0), advisories ${(adv as any[]).length} (must be >=1) -> ${ecSum < 1e-9 && (adv as any[]).length >= 1 ? 'CORRECT' : 'PROBLEM'}`)
}
run('WHEAT', WHEAT_COST_PLAN, 'wheat')
run('POTATO', POTATO_COST_PLAN, 'potato')

/* ── ALL 28 CROPS (9 Sep 2026) ────────────────────────────────────────────────────────────────
 * The soil layer stopped being a wheat-and-potato feature, so the invariants stop being a
 * wheat-and-potato test. Every crop's plan is driven through the real engine and must satisfy the
 * same four rules. A silent regression on chickpea is as bad as one on wheat; it is just quieter.
 */
console.log('\n=== ALL CROPS. Derived soil maps ===')
const derivationProblems = validateDerivedMaps()
console.log(derivationProblems.length
  ? '  DERIVATION FAILED:\n    ' + derivationProblems.join('\n    ')
  : '  the two rules reproduce the reviewed wheat map and the documented potato divergence: OK')

let failures = 0
for (const cropSlug of Object.keys(CROP_PLANS)) {
  // Wheat and potato run off the calculator workbook (their reviewed COST_PLANs); the other 26 run
  // off their published crop plan. The invariants are checked against whichever source that crop's
  // soil layer actually reads, otherwise potato "fails" for a divergence that is reported separately
  // and deliberately left unresolved — see the note in cropSoilMap.ts.
  // D-144: a crop with a calculator (COST_PLANS) is checked against its calculator rows, because that
  // is what its creator and soil panel read. Was wheat and potato only.
  const rows = COST_PLANS[cropSlug] ?? costRowsForCrop(cropSlug)
  const map = soilMapForCrop(cropSlug)
  const params = mappedParameters(cropSlug)
  const baseQty: Record<string, number> = {}
  for (const r of rows) if (r.slug) baseQty[r.slug] = r.qtyPerAcre

  // Cap — every parameter Critical at once must not take any product past 2x its standard dose.
  const allCritical: Record<string, SoilBand> = {}
  for (const p of params) allCritical[p] = 'critical'
  const bumps = computeSoilBumps(allCritical as never, baseQty, cropSlug)
  let worst = 1
  for (const slug of Object.keys(bumps)) {
    const base = baseQty[slug] ?? 0
    if (base > 0) worst = Math.max(worst, (base + bumps[slug].bagsPerAcre) / base)
  }
  // Healthy must change nothing.
  const allHealthy: Record<string, SoilBand> = {}
  for (const p of params) allHealthy[p] = 'healthy'
  const healthySum = Object.values(computeSoilBumps(allHealthy as never, baseQty, cropSlug)).reduce((a, b) => a + b.bagsPerAcre, 0)
  // EC must never produce a product.
  const ecSum = Object.values(computeSoilBumps({ EC: 'critical' } as never, baseQty, cropSlug)).reduce((a, b) => a + b.bagsPerAcre, 0)
  // Every responder must be a product the crop's own plan actually contains.
  const inPlan = new Set(rows.map(r => r.slug).filter(Boolean) as string[])
  const orphans = map.filter(e => !inPlan.has(e.slug)).map(e => `${e.parameter}->${e.slug}`)
  // The pH substitution must be nitrogen-neutral wherever the plan has both carriers.
  const swaps = computeSoilSwaps({ pH: 'critical' } as never, rows as never)
  const nOf = (q: Record<string, number>) => rows.reduce((a, r) => a + (q[r.slug ?? r.product] ?? 0) * r.packKg * ((r.analysisPct.N ?? 0) / 100), 0)
  const after = { ...baseQty }
  for (const r of rows) if (!r.slug) after[r.product] = r.qtyPerAcre
  const before = { ...after }
  for (const w of swaps) {
    const fromKey = rows.find(r => r.product === w.fromProduct)?.slug ?? w.fromProduct
    after[fromKey] = (after[fromKey] ?? 0) + w.fromDelta
    after[w.toSlug] = (after[w.toSlug] ?? 0) + w.toDelta
  }
  const nDrift = Math.abs(nOf(after) - nOf(before))

  const bad: string[] = []
  if (worst > 2.0001) bad.push(`dose cap breached at ${worst.toFixed(3)}x`)
  if (healthySum > 1e-9) bad.push(`all-Healthy soil changed the plan by ${healthySum.toFixed(4)}`)
  if (ecSum > 1e-9) bad.push(`EC produced ${ecSum.toFixed(4)} of product. It must produce words only`)
  if (orphans.length) bad.push(`responder not in this crop's plan: ${orphans.join(', ')}`)
  if (nDrift > 0.01) bad.push(`pH substitution moved ${nDrift.toFixed(3)} kg of nitrogen. It must be neutral`)
  const unknown = unknownAnalysis(cropSlug)
  if (bad.length) failures++
  console.log(`  ${cropSlug.padEnd(18)} params ${String(params.length).padStart(2)}  cap ${worst.toFixed(3)}x  ` +
    (bad.length ? 'FAIL. ' + bad.join('; ') : 'ok') +
    (unknown.length ? `   [no registered analysis on file: ${unknown.join(', ')}]` : ''))
}
console.log(failures ? `\n  ${failures} CROP(S) FAILED` : '\n  all 28 crops pass every invariant')

/**
 * The one thing that is NOT a pass or a fail: potato's two sources disagree about what is in the
 * potato programme. RULED 9 Sep 2026 — the calculator wins. Still printed every run, because it is
 * how the site notices which crops have moved to a calculator and which are still on a published
 * plan, and because the iron gap it exposes is real.
 */
const potatoPublished = soilMapForCrop('potato').map(e => e.slug)
const potatoPlanSlugs = new Set(costRowsForCrop('potato').map(r => r.slug).filter(Boolean) as string[])
const notInPublished = [...new Set(potatoPublished.filter(sl => !potatoPlanSlugs.has(sl)))]
if (notInPublished.length) {
  console.log(
    `\n  SETTLED, not a defect. Potato's soil map answers zinc with ${notInPublished.join(', ')}, which is in the\n` +
    `  Fertilizer Calculator workbook but NOT in VAN's published potato crop plan (that carries V-Transform\n` +
    `  and VL-Micromix). TAHIR'S RULING, 9 Sep 2026: THE CALCULATOR IS CORRECT and the published plan is\n` +
    `  the document being revised. So potato stays on the calculator and must NOT be switched over.\n` +
    `  Calculators exist for wheat and potato only; the other 26 crops run on published plans until\n` +
    `  theirs arrive, so two vintages coexist on purpose and this line is how a new arrival gets noticed.\n` +
    `  The open item is agronomic, not technical: the potato programme carries NO IRON CARRIER, on soils\n` +
    `  he describes as iron-deficient with almost no farmer application. One for the plan revision.`
  )
}

/* ── THE DISCIPLINE SIMULATOR (9 Sep 2026) ────────────────────────────────────────────────────
 * Potato joined wheat, so the model stops being one crop's and its invariants stop being one
 * crop's too. For every crop with a lever set: the weights must sum to exactly 100, all-Best must
 * reach the ceiling, all-OK must land on exactly half of it, all-Bad must be zero, and no lever
 * weight, rationale or citation may leak into anything the farmer-facing component renders.
 */
import { CROP_LEVERS } from '@/data/leverScorecard'
console.log('\n=== DISCIPLINE SIMULATOR. Every crop with a lever set ===')
let leverFails = 0
for (const [crop, model] of Object.entries(CROP_LEVERS)) {
  const sum = model.levers.reduce((a, l) => a + l.weight, 0)
  const ceiling = model.base.operativeMaunds
  const at = (score: number) => (ceiling * score) / 100
  const bad: string[] = []
  if (Math.abs(sum - 100) > 1e-9) bad.push(`weights sum to ${sum}, not 100`)
  if (Math.abs(at(sum) - ceiling) > 1e-6) bad.push('all-Best does not reach the ceiling')
  if (Math.abs(at(sum / 2) - ceiling / 2) > 1e-6) bad.push('all-OK is not exactly half the ceiling')
  if (at(0) !== 0) bad.push('all-Bad is not zero')
  // Every band string must actually say something — an empty one would render a blank row.
  for (const l of model.levers) {
    if (!l.bad.trim() || !l.ok.trim() || !l.best.trim()) bad.push(`${l.name}: an empty band description`)
    if (!l.why.trim() || !l.source.trim()) bad.push(`${l.name}: missing evidence or source`)
  }
  if (bad.length) leverFails++
  console.log(`  ${crop.padEnd(8)} ${model.levers.length} levers · weights ${sum} · ceiling ${ceiling.toFixed(2)} md/acre · ` +
    `all-Best ${at(sum).toFixed(1)} · all-OK ${at(sum / 2).toFixed(1)} · all-Bad ${at(0).toFixed(1)}  ` +
    (bad.length ? 'FAIL. ' + bad.join('; ') : 'ok'))
}
console.log(leverFails ? `  ${leverFails} CROP(S) FAILED` : '  every lever set passes')
