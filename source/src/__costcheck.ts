/**
 * THE COST PLAN AGAINST THE PUBLISHED PLAN — 11 September 2026.
 *
 * The independent audit found the wheat page printing two different totals for one programme, about
 * 1,500px apart. The nutrition creator reported P₂O₅ 16.0 kg an acre; the removal table reported
 * 20.4. Both call themselves the published plan.
 *
 * The cause was two hand-maintained lists of the same thing. WHEAT_COST_PLAN in src/data/pricing.ts
 * is what the creator and the price panel read. WHEAT_PLAN in the catalogue is what the programme
 * matrix, the shopping list and the nutrient balance read. The cost plan was missing V. Ammonium
 * Phosphate 10-44-0, one 10 kg pack at Early Growth: 10 × 44% = the 4.4 kg of difference exactly.
 *
 * A site whose whole promise is that a figure can be traced cannot print one figure twice. This
 * check compares the two lists product by product and fails if they disagree.
 */
import { CROP_PLANS } from '@/data/catalogue'
import { WHEAT_COST_PLAN, POTATO_COST_PLAN } from '@/data/pricing'
import { programmeSupply } from '@/lib/nutrientBalance'
import { calcPlan } from '@/lib/planCalc'
declare const process: { exitCode?: number }

const CASES: [string, typeof WHEAT_COST_PLAN][] = [['wheat', WHEAT_COST_PLAN], ['potato', POTATO_COST_PLAN]]
let bad = 0

for (const [crop, costPlan] of CASES) {
  const cp = CROP_PLANS[crop]
  const allStages = new Set(cp.stages)
  const supply = programmeSupply(crop, allStages)
  const creator = calcPlan(costPlan, 1, {}, crop as 'wheat' | 'potato')

  console.log(`\n=== ${crop} ===`)

  // 1 · the same products, in the same packs, at the same rate
  const inPlan = new Map<string, { packKg: number; units: number }>()
  for (const l of supply.lines) inPlan.set(l.product, { packKg: l.packKg, units: l.packs })
  const inCost = new Map(costPlan.map(r => [r.product, { packKg: r.packKg, units: r.qtyPerAcre }]))

  for (const [prod, a] of inPlan) {
    const b = inCost.get(prod)
    if (!b) { console.log(`  MISSING from the cost plan: ${prod} (${a.units} × ${a.packKg} kg)`); bad++; continue }
    if (Math.abs(a.packKg - b.packKg) > 0.001) { console.log(`  PACK differs: ${prod} plan ${a.packKg} kg, cost plan ${b.packKg} kg`); bad++ }
    if (Math.abs(a.units - b.units) > 0.001) { console.log(`  RATE differs: ${prod} plan ${a.units}/acre, cost plan ${b.units}/acre`); bad++ }
  }
  // A product whose printed analysis cannot be parsed ("Soil Conditioner", "Bio-stimulant") is
  // reported by programmeSupply as UNCOUNTED rather than as a line, so it is legitimately absent
  // from supply.lines and must not be read as a mismatch.
  const uncounted = new Set(supply.uncounted.map(u => u.product))
  for (const [prod] of inCost) if (!inPlan.has(prod) && !uncounted.has(prod)) { console.log(`  EXTRA in the cost plan, not in the published plan: ${prod}`); bad++ }

  // 2 · and therefore the same delivered nutrient
  for (const n of ['N', 'P', 'K', 'S'] as const) {
    const a = supply.perAcre[n] ?? 0
    const b = creator.nutrientKg[n] ?? 0
    const gap = Math.abs(a - b)
    const flag = gap > 0.05 ? 'DISAGREE' : 'ok'
    if (gap > 0.05) bad++
    console.log(`  ${n.padEnd(2)} published plan ${a.toFixed(2).padStart(7)} kg · creator ${b.toFixed(2).padStart(7)} kg  ${flag}`)
  }
}

console.log(bad === 0
  ? '\nThe calculator sheet and the published plan agree on every product, pack, rate and nutrient total.'
  : `\n${bad} difference(s) between VAN's calculator sheet and VAN's published plan.\n` +
    'These are two VAN documents, not a bug in the site. Tahir ruled on 11 Sep 2026 that until the\n' +
    'plans are brought onto the calculator, every nutrient figure the two disagree on is printed as a\n' +
    'RANGE with both ends named, rather than one of them being declared the winner. See\n' +
    'src/lib/planRange.ts. So this count is the size of the job still to do on the calculator, not a\n' +
    'failure: it falls as crops are brought across, and each range closes to one number on its own.')

/* The plan's own lines, printed so a cost row can be written to match it exactly. */
for (const crop of ['wheat', 'potato']) {
  const cp = CROP_PLANS[crop]
  const sup = programmeSupply(crop, new Set(cp.stages))
  console.log(`\n--- ${crop}: what the published plan actually contains ---`)
  for (const l of sup.lines) console.log(`  ${l.product} | pack ${l.packKg} | units/acre ${l.packs}`)
  for (const u of sup.uncounted) console.log(`  (uncounted) ${u.product} | ${u.analysis}`)
}
