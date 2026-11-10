// D-317 (26 Oct 2026): visible text cleaned of build notes and page narration, Tahir's instruction
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

/** D-321 (Tahir, 27 Oct 2026: "Compare only what both read"): the published-plan side (programmeSupply) reads these nutrients
 *  only. Calcium, humic acid, organic matter and amino acids are counted by the calculator alone, so they are never a range. */
const PLAN_READS = new Set(['N', 'P', 'K', 'S', 'Mg', 'Zn', 'B', 'Fe', 'Mn', 'Cu'])

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
    const c = calc[k] ?? 0
    const p = PLAN_READS.has(k) ? plan[k as Nutrient] ?? 0 : c   // D-321: not read on the plan side, so no comparison
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

// L2 fact check 9 Nov 2026 (crops-a W11): exact halves now round up. toFixed rounds some of them down because of how
// decimals are stored (74.35 printed 74.3, 48.65 printed 48.6, 81.55 printed 81.5) and others up (74.15 printed 74.2).
// The 1e-9 nudge only moves a figure that sits on a half. Exported so the balance table rounds the same way.
// Was: const fmt = (v: number, digits = 1) => v.toFixed(digits)
export const fmt = (v: number, digits = 1) => {
  const m = Math.pow(10, digits)
  return (Math.round(v * m + (v >= 0 ? 1e-9 : -1e-9)) / m).toFixed(digits)
}

/** "16.0 to 20.4 kg" where the two documents disagree, "11.4 kg" where they do not. */
// L1 7 Nov 2026 (crops-a 13, crops-b M3): now printed through fmtPair, so a total under 0.05 kg reads "under 0.1 kg" here
// too (chickpea boron 0.013 kg and sesame boron 0.015 kg printed "0.0 kg"), and a range whose 2 ends print the same
// reads as 1 figure. Was: !differs -> fmt(high); else fmt(low)–fmt(high). No figure is changed.
export function fmtRange(r: NutrientRange | undefined, unit = ' kg', digits = 1): string {
  if (!r) return 'n/a'
  return fmtPair(r.low, r.high, unit, digits)
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
  // L1 7 Nov 2026 (crops-a 2, crops-b m7): where the 2 ends print the same ("81.5–81.5 kg" on maize, "49.0–49.0 kg" on
  // basmati, "20.4–20.4 kg" on soybean), 1 figure is shown. The figures themselves are unchanged.
  if (fmt(lo, digits) === fmt(hi, digits)) return `${fmt(hi, digits)}${unit}`
  // L1 10 Nov 2026 (crops 5): house format, a range is written with "to" ("35.4 to 36.5 kg"), as the balance column beside it
  // ("−10.2 to −9.1 kg"). Was `${lo}–${hi}`. No figure is changed.
  return `${fmt(lo, digits)} to ${fmt(hi, digits)}${unit}`
}

/** L1 10 Nov 2026 (crops 4): which end of a printed range is which list. A range prints its lower figure first, whichever
 *  list it comes from, so on a crop where the published plan is lower for some nutrients and higher for others the
 *  sentence names each group. Read from the same figures the ranges are printed from, so it cannot drift from them.
 *  Potato today: nitrogen, phosphate and potash, the published plan is lower; zinc, the published plan is higher.
 *  Only the nutrients the Nutrition creator panel prints (MACRO_ORDER) are named. */
const RANGE_WORD: Record<string, string> = { N: 'nitrogen', P: 'phosphate', K: 'potash', S: 'sulfur', Ca: 'calcium', Mg: 'magnesium', Zn: 'zinc', B: 'boron' }
export function rangeEndsSentence(cropKey: string): string {
  const rs = nutrientRanges(cropKey)
  if (!rs) return ''
  const shown = ['N', 'P', 'K', 'S', 'Ca', 'Mg', 'Zn', 'B'].filter(k => { const r = rs[k as Nutrient]; return r && r.differs && r.calc > 0.01 })
  const planLow = shown.filter(k => rs[k as Nutrient]!.plan < rs[k as Nutrient]!.calc)
  const planHigh = shown.filter(k => rs[k as Nutrient]!.plan > rs[k as Nutrient]!.calc)
  const names = (ks: string[]) => ks.map(k => RANGE_WORD[k]).reduce((a, w, i, all) => i === 0 ? w : `${a}${i === all.length - 1 ? ' or ' : ', '}${w}`, '')
  const which = (ks: string[]) => ks.length === 1 ? `the ${names(ks)} total below is` : `a ${names(ks)} total below is`
  const hi = planHigh.length ? `Where ${which(planHigh)} a range, the higher figure comes from the published plan and the lower figure from the Nutrition creator.` : ''
  const lo = planLow.length ? `Where ${which(planLow)} a range, the lower figure comes from the published plan and the higher figure from the Nutrition creator.` : ''
  // The larger group is named first.
  return (planLow.length > planHigh.length ? [lo, hi] : [hi, lo]).filter(Boolean).join(' ')
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
// D-311 wording kept; only the tool's name changed, by Tahir's 6 Nov 2026 term ruling 2 ("Nutrition creator" everywhere).
export const RANGE_NOTE = 'A range means the Nutrition creator and VAN’s published plan use slightly different product lists for this crop.'
// D-311 (Tahir, 23 Oct 2026: short plain notes for the live site): was 'Where a figure is shown as a range, it is because VAN
// holds 2 documents for this crop: the crop calculator sheet and the published crop plan. They do not carry an identical
// product list, so they do not deliver an identical kilogram of nutrient. Both ends are VAN’s own arithmetic on VAN’s own
// figures and neither is estimated.'
// D-151 (A27): the last sentence was 'The plans are being brought onto the calculator crop by crop, and as each one is done its range closes to a single number.'
