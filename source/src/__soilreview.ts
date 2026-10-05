/**
 * A READ-ONLY AGRONOMIC REVIEW of the derived soil maps — Tahir asked for a double-check of the 26
 * crops running on derived rules rather than his own rulings. It prints questions and changes
 * nothing.
 *
 * ONE ARTEFACT TO KNOW ABOUT BEFORE READING THE OUTPUT: this script measures delivered nutrient by
 * walking each crop's PUBLISHED plan. Potato's soil map comes from the Fertilizer Calculator
 * instead (his ruling, 9 Sep 2026 — the calculator is the source of truth), and V-Zinc is not in
 * potato's published plan, so potato's zinc line reads 0 g here. That is this script looking at the
 * wrong document for that one crop, not a hole on the site. Wheat is the same shape but its two
 * documents happen to agree on zinc.
 */
import { CROP_PLANS } from '@/data/catalogue'
import { soilMapForCrop } from '@/lib/cropSoilMap'
import { MASTER_PRODUCTS } from '@/data/pricing'
import { buildList } from '@/lib/season'

const NUT: Record<string, string> = { P2O: 'P', K2O: 'K', Zn: 'Zn', B: 'B', Fe: 'Fe', Cu: 'Cu', Mn: 'Mn' }
const pct = (slug: string, n: string) => MASTER_PRODUCTS.find(m => m.slug === slug)?.analysisPct[n] ?? 0

console.log('=== 1 · WHICH PROGRAMMES CARRY NO IRON CARRIER AT ALL ===')
const noFe: string[] = [], noZn: string[] = [], noB: string[] = []
for (const crop of Object.keys(CROP_PLANS)) {
  const m = soilMapForCrop(crop)
  const has = (p: string) => m.some(e => e.parameter === p)
  if (!has('Fe')) noFe.push(crop)
  if (!has('Zn')) noZn.push(crop)
  if (!has('B')) noB.push(crop)
}
console.log(`  no iron responder  (${noFe.length}/28): ${noFe.join(', ')}`)
console.log(`  no zinc responder  (${noZn.length}/28): ${noZn.join(', ') || 'none'}`)
console.log(`  no boron responder (${noB.length}/28): ${noB.join(', ')}`)

console.log('\n=== 2 · HOW MUCH OF THE NUTRIENT THE ZINC RESPONDER ACTUALLY DELIVERS ===')
console.log('  (a zinc deficiency answered by a product carrying grams is not the same answer as one')
console.log('   answered by a product carrying hundreds of grams)')
for (const crop of Object.keys(CROP_PLANS)) {
  const e = soilMapForCrop(crop).find(x => x.parameter === 'Zn')
  if (!e) continue
  const stages = new Set(CROP_PLANS[crop].mode === 'age' ? [CROP_PLANS[crop].stages.slice(-1)[0]] : CROP_PLANS[crop].stages)
  const kg = buildList(stages, 1, CROP_PLANS[crop].plan).filter(l => l.slug === e.slug).reduce((a, l) => a + l.units * l.size, 0)
  const zn = (kg * pct(e.slug, 'Zn')) / 100
  const artefact = kg === 0
  const flag = artefact ? '   (measured against the published plan, which is not this crop\'s source. See the header)'
    : zn < 0.15 ? '   << under 150 g of zinc an acre' : ''
  console.log(`  ${crop.padEnd(18)} ${e.slug.padEnd(16)} ${pct(e.slug, 'Zn')}% × ${kg.toFixed(1)} = ${(zn * 1000).toFixed(0)} g Zn/acre${flag}`)
}

console.log('\n=== 3 · POTASH RESPONDERS THAT ARE FOLIAR OR VERY SMALL ===')
for (const crop of Object.keys(CROP_PLANS)) {
  const e = soilMapForCrop(crop).find(x => x.parameter === 'K2O')
  if (!e) { console.log(`  ${crop.padEnd(18)} NO POTASH RESPONDER`); continue }
  const stages = new Set(CROP_PLANS[crop].mode === 'age' ? [CROP_PLANS[crop].stages.slice(-1)[0]] : CROP_PLANS[crop].stages)
  const rows = buildList(stages, 1, CROP_PLANS[crop].plan).filter(l => l.slug === e.slug)
  const kg = rows.reduce((a, l) => a + l.units * l.size, 0)
  const k = (kg * pct(e.slug, 'K')) / 100
  const methods = [...new Set(CROP_PLANS[crop].plan.filter(r => r.slug === e.slug).map(r => r.method))].join('/')
  if (k < 8) console.log(`  ${crop.padEnd(18)} ${e.slug.padEnd(18)} ${k.toFixed(1)} kg K₂O/acre via ${methods}   << small`)
}

console.log('\n=== 4 · THE SAME CROP ANSWERING DIFFERENTLY IN TWO OF ITS PLANS ===')
for (const [a, b] of [['sugarcane', 'sugarcane-ratoon'], ['rice-basmati', 'rice-hybrid'], ['banana-year1', 'banana-year2']]) {
  const ma = new Map(soilMapForCrop(a).map(e => [e.parameter, e.slug]))
  const mb = new Map(soilMapForCrop(b).map(e => [e.parameter, e.slug]))
  const keys = [...new Set([...ma.keys(), ...mb.keys()])]
  const diffs = keys.filter(k => ma.get(k) !== mb.get(k)).map(k => `${NUT[k] ?? k}: ${ma.get(k) ?? 'n/a'} vs ${mb.get(k) ?? 'n/a'}`)
  console.log(`  ${a} vs ${b}: ${diffs.length ? diffs.join(' | ') : 'identical'}`)
}
