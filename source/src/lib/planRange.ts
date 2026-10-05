import { COST_PLANS } from '@/data/costPlans'
import { programmeSupply, allStages, type Nutrient } from '@/lib/nutrientBalance'
import { calcPlan } from '@/lib/planCalc'

/**
 * ONE PROGRAMME, TWO VAN DOCUMENTS, ONE RANGE — 11 September 2026. Tahir's ruling.
 *
 * THE PROBLEM the independent audit found. The wheat page printed two different totals for the same
 * programme about 1,500px apart: the nutrition creator said P₂O₅ 16.0 kg an acre, the removal table
 * said 20.4. Neither was wrong and neither was modelled. They read two different VAN documents:
 *
 *   THE CALCULATOR SHEET  (Fertilizer Calculator-Wheat-Potato.xlsx) drives the creator and the
 *                         price panel. It exists for wheat and potato only.
 *   THE PUBLISHED PLAN    (the crop plan PDF, transcribed into the catalogue) drives the programme
 *                         matrix, the shopping list and the removal table. It exists for all 28.
 *
 * On wheat and potato the two do not carry an identical product list, so they do not deliver an
 * identical kilogram of nutrient.
 *
 * THE RULING, 11 Sep 2026, in his words: "We should mention it as a range 16.0 - 20.4 until we
 * update all nutrition plans based on the calculator. Once we are done with the website we will lay
 * the foundation and standard framework for updating all crops in the calculator."
 *
 * So neither document is declared the winner today. Where they disagree the page prints BOTH ends
 * and says why there are two. The direction of travel is stated on the page as he stated it: the
 * calculator becomes the standard, and the plans are brought onto it crop by crop, after the site
 * ships. When that happens this module's ranges collapse to single figures ON THEIR OWN, with no
 * code change, because `differs` goes false the moment the two documents agree.
 *
 * WHAT IT DELIBERATELY DOES NOT DO. It does not range the PRODUCT LIST or the bag counts. A range
 * is honest about a quantity; "buy one or two of a product that appears in one document and not the
 * other" is not a range, it is a shrug. Each list stays whole and named by its source, and
 * `run-enginetest.cjs __costcheck` still reports every product-level difference.
 */

export type NutrientRange = {
  /** The calculator sheet's figure. */
  calc: number
  /** The published plan's figure. */
  plan: number
  low: number
  high: number
  /** True where the two documents disagree by enough to be worth printing as a range. */
  differs: boolean
}

/** The crops with a VAN calculator sheet (D-144: wheat, potato and the team's crops, in
 *  src/data/costPlans.ts). Every other crop has one document and no range. */

/** Below this the two documents are the same answer written twice, and a range would be noise. */
const TOLERANCE_KG = 0.05

export const hasTwoSources = (cropKey: string): boolean => cropKey in COST_PLANS

/**
 * Per acre, per nutrient: what each of the two documents delivers. Null where the crop has only
 * one document (no calculator yet).
 */
export function nutrientRanges(cropKey: string): Partial<Record<Nutrient, NutrientRange>> | null {
  const costPlan = COST_PLANS[cropKey]
  if (!costPlan) return null

  const plan = programmeSupply(cropKey, allStages(cropKey)).perAcre
  const calc = calcPlan(costPlan, 1, {}, cropKey).nutrientKg

  const out: Partial<Record<Nutrient, NutrientRange>> = {}
  const keys = new Set<string>([...Object.keys(plan), ...Object.keys(calc)])
  for (const k of keys) {
    const p = plan[k as Nutrient] ?? 0
    const c = calc[k] ?? 0
    out[k as Nutrient] = {
      calc: c,
      plan: p,
      low: Math.min(p, c),
      high: Math.max(p, c),
      differs: Math.abs(p - c) > TOLERANCE_KG,
    }
  }
  return out
}

/** How far apart the two documents are on one nutrient, per acre. 0 where they agree. */
export function nutrientDelta(cropKey: string, n: Nutrient): number {
  const r = nutrientRanges(cropKey)?.[n]
  return r && r.differs ? r.plan - r.calc : 0
}

const fmt = (v: number, digits = 1) => v.toFixed(digits)

/** "16.0–20.4 kg" where the two documents disagree, "11.4 kg" where they do not. */
export function fmtRange(r: NutrientRange | undefined, unit = ' kg', digits = 1): string {
  if (!r) return 'n/a'
  if (!r.differs) return `${fmt(r.high, digits)}${unit}`
  return `${fmt(r.low, digits)}–${fmt(r.high, digits)}${unit}`
}

/** A pair of figures already scaled (by acreage, or by a soil adjustment) into one printed range. */
export function fmtPair(a: number, b: number, unit = ' kg', digits = 1): string {
  const lo = Math.min(a, b), hi = Math.max(a, b)
  // D-151 (A26): a product the list includes never prints as "0.0 kg". Below half the last digit it
  // reads "under 0.1 kg", and a range whose low end rounds to 0 reads "up to 0.1 kg".
  // Revert: delete the 3 lines using `small`.
  const small = 0.5 / Math.pow(10, digits)
  if (hi - lo <= TOLERANCE_KG) return hi > 0 && hi < small ? `under ${fmt(small * 2, digits)}${unit}` : `${fmt(hi, digits)}${unit}`
  if (hi < small) return `under ${fmt(small * 2, digits)}${unit}`
  if (lo < small) return `up to ${fmt(hi, digits)}${unit}`
  return `${fmt(lo, digits)}–${fmt(hi, digits)}${unit}`
}

/** True where any nutrient on this crop is printed as a range. */
export function cropHasRange(cropKey: string): boolean {
  const rs = nutrientRanges(cropKey)
  return !!rs && Object.values(rs).some(r => r?.differs)
}

/**
 * The one sentence that explains every range on the site. Written once here so the two places that
 * print a range cannot drift into explaining it two ways.
 */
export const RANGE_NOTE =
  'Where a figure is shown as a range, it is because VAN holds 2 documents for this crop: the crop ' +
  'calculator sheet and the published crop plan. They do not carry an identical product list, so they ' +
  'do not deliver an identical kilogram of nutrient. Both ends are VAN’s own arithmetic on VAN’s own ' +
  'figures and neither is estimated.'
// D-151 (A27): the last sentence was 'The plans are being brought onto the calculator crop by crop, and as each one is done its range closes to a single number.'
