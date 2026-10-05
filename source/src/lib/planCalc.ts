import type { CostRow } from '@/data/pricing'
import type { SoilInputs } from './soilAdjustment'
import { computeSoilBumps, computeSoilSwaps, soilAdvisories } from './soilAdjustment'
import type { SoilSwap } from './soilAdjustment'
import type { SoilCrop } from './soilAdjustment'

/**
 * The shared "plan engine" — the one calculation core meant to sit behind the dynamic nutrition
 * creator, the Farm Discipline Scorecard and the soil-report allocator alike, so all three read the
 * same numbers instead of drifting apart. The acreage scaler is real (8 Sep 2026): it multiplies
 * Tahir's own verified Wheat/Potato calculator rows by acres and sums nutrient kg delivered.
 * soilAdjustment is now wired in (9 Sep 2026) — see soilAdjustment.ts for the sizing/cap rules, both
 * flagged as design choices for Tahir's review, not sourced from a VAN file. One extension point
 * remains stubbed:
 *   - yieldMultiplier: how a yield target above/below the calculator's baseline should scale dosage.
 *     Not in the source spreadsheet — needs a rule from Tahir before this can move.
 */

export type PlanLine = {
  product: string
  slug: string | null
  packKg: number
  qtyPerAcre: number
  qty: number
  soilBumpQtyPerAcre: number
  soilBumpQty: number
  /** Nitrogen moved on or off this line by a substitution — negative on the line it leaves. */
  swapQtyPerAcre: number
  swapQty: number
  unitPricePkr: number
  analysisPct: Record<string, number>
}

export type PlanTotals = {
  lines: PlanLine[]
  nutrientKg: Record<string, number>
  costKnown: boolean
  soilAdjusted: boolean
  /** Nitrogen re-carried rather than added — see soilAdjustment.ts. */
  swaps: SoilSwap[]
  /** Readings answered with words, not a product (a saline soil is the case today). */
  advisories: ReturnType<typeof soilAdvisories>
}

export function calcPlan(costPlan: CostRow[], acres: number, soilInputs: SoilInputs = {}, crop: SoilCrop = 'wheat'): PlanTotals {
  const qtyPerAcreBySlug: Record<string, number> = {}
  for (const r of costPlan) if (r.slug) qtyPerAcreBySlug[r.slug] = r.qtyPerAcre
  const bumps = computeSoilBumps(soilInputs, qtyPerAcreBySlug, crop)
  const swaps = computeSoilSwaps(soilInputs, costPlan)
  const advisories = soilAdvisories(soilInputs, crop)
  const soilAdjusted = Object.keys(bumps).length > 0 || swaps.length > 0

  const lines: PlanLine[] = costPlan.map(r => {
    const bump = r.slug ? bumps[r.slug]?.bagsPerAcre ?? 0 : 0
    // A substitution shows as a negative on the line the nitrogen leaves and a positive on the one
    // it arrives at, so the farmer can see the trade rather than just a bigger number.
    const swap = swaps.reduce((a, w) => a + (w.fromProduct === r.product ? w.fromDelta : 0) + (r.slug && w.toSlug === r.slug ? w.toDelta : 0), 0)
    return {
      product: r.product,
      slug: r.slug,
      packKg: r.packKg,
      qtyPerAcre: r.qtyPerAcre,
      qty: r.qtyPerAcre * acres,
      soilBumpQtyPerAcre: bump,
      soilBumpQty: bump * acres,
      swapQtyPerAcre: swap,
      swapQty: swap * acres,
      unitPricePkr: r.unitPricePkr,
      analysisPct: r.analysisPct,
    }
  })

  const nutrientKg: Record<string, number> = {}
  for (const l of lines) {
    const totalKg = (l.qty + l.soilBumpQty + l.swapQty) * l.packKg
    for (const [nutrient, pct] of Object.entries(l.analysisPct)) {
      nutrientKg[nutrient] = (nutrientKg[nutrient] ?? 0) + (totalKg * pct) / 100
    }
  }

  return { lines, nutrientKg, soilAdjusted, swaps, advisories, costKnown: false /* price basis (list/dealer/internal) not yet confirmed. See pricing.ts */ }
}

export const NUTRIENT_LABELS: Record<string, string> = {
  N: 'Nitrogen', P: 'Phosphorus', K: 'Potash', S: 'Sulfur', Ca: 'Calcium', Mg: 'Magnesium',
  Zn: 'Zinc', Fe: 'Iron', Mn: 'Manganese', Cu: 'Copper', B: 'Boron', OM: 'Organic matter',
  HA: 'Humic acid', AA: 'Amino acid',
}

export const MACRO_ORDER = ['N', 'P', 'K', 'S', 'Ca', 'Mg', 'Zn', 'B']

/**
 * How each nutrient key is written on a fertilizer label. A grade's phosphorus and potash figures
 * are OXIDE (P2O5, K2O) by universal convention — printing them as "P" and "K" overstates the
 * element by 2.29x and 1.20x respectively, and disagreed with the soil panel on the same page,
 * which labels the same two parameters as oxides. Everything else is elemental.
 */
export const NUTRIENT_UNIT: Record<string, string> = { P: 'P₂O₅', K: 'K₂O' }
export const nutrientKey = (n: string) => NUTRIENT_UNIT[n] ?? n
