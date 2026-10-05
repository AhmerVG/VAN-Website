import type { SoilBand, SoilParameter } from '@/data/soilThresholds'
import { SOIL_BUMP_MULTIPLIER } from '@/data/soilThresholds'
import { SOIL_SUBSTITUTIONS, SOIL_ADVISORIES } from '@/data/soilProductMap'
import { soilMapForCrop, mappedParametersForCrop } from '@/lib/cropSoilMap'
import type { CostRow } from '@/data/pricing'

/**
 * Any crop slug. Was 'wheat' | 'potato' until 9 Sep 2026, when the layer was extended to all 28 —
 * wheat and potato keep their reviewed, hand-written maps and the other 26 are derived from each
 * crop's own published plan by the two rules in cropSoilMap.ts.
 */
export type SoilCrop = string

/**
 * Soil-test-based dosage adjustment — the "soilAdjustment" extension point planCalc.ts flagged as
 * stubbed. This is the section 15 proposal from the master framework doc, built 9 Sep 2026 per
 * Tahir's direction: graduate the bump across all 5 of VAN's soil-test bands (not just the old
 * Sugarcane sheet's Critical/Weak-only trigger), driven by WHEAT_SOIL_PRODUCT_MAP.
 *
 * Sizing rule (a design choice, not from any VAN source file — the old sheet used a flat 0.5/0.25
 * bags/acre regardless of product size, which doesn't generalise across a 50kg bag and a 1kg liquid
 * line): bump = the product's own standard qtyPerAcre x 0.5 x the band's multiplier. So a Critical
 * reading can add up to +50% on top of the standard dose for that product; Healthy adds nothing.
 * Flagged for Tahir's correction if a different sizing makes more sense.
 *
 * When more than one soil parameter maps to the same product (Fe, Cu and Mn all point at
 * VL-Micromix), their bumps sum — same behaviour as the old Sugarcane "Dependency" sheet — but the
 * total added quantity is capped at the product's own standard qtyPerAcre (i.e. at most a 2x dose),
 * so three simultaneous Critical readings can't silently multiply the dose past a sane bound. This
 * cap is also a design choice, flagged for review.
 */
export type SoilInputs = Partial<Record<SoilParameter, SoilBand>>

export type SoilBumpBySlug = Record<string, { bagsPerAcre: number; parameters: SoilParameter[] }>

/**
 * D-181, Tahir 26 Sep 2026: "allow a reduction on high-testing soil? yes, carefully." Only where a soil
 * test normally lowers a dose (phosphorus, potash, zinc), only on a Healthy reading, only by a quarter of
 * that product's own standard quantity, and never on nitrogen. A product answering several readings can
 * never fall below half its standard quantity. The size (a quarter) is a starting choice, labelled pilot.
 */
export const SOIL_REDUCE: Partial<Record<SoilParameter, number>> = { P2O: 0.25, K2O: 0.25, Zn: 0.25 }

export function computeSoilBumps(soilInputs: SoilInputs, qtyPerAcreBySlug: Record<string, number>, crop: SoilCrop = 'wheat'): SoilBumpBySlug {
  const bumps: SoilBumpBySlug = {}
  for (const entry of soilMapForCrop(crop)) {
    const band = soilInputs[entry.parameter]
    if (!band) continue // no soil-test input for this parameter -> no adjustment, not defaulted to "Average"
    const multiplier = SOIL_BUMP_MULTIPLIER[band]
    const reduce = band === 'healthy' ? SOIL_REDUCE[entry.parameter] : undefined
    if (reduce) {
      const baseQty = qtyPerAcreBySlug[entry.slug] ?? 0
      if (!bumps[entry.slug]) bumps[entry.slug] = { bagsPerAcre: 0, parameters: [] }
      bumps[entry.slug].bagsPerAcre -= baseQty * reduce
      bumps[entry.slug].parameters.push(entry.parameter)
      continue
    }
    if (multiplier <= 0) continue
    const baseQty = qtyPerAcreBySlug[entry.slug] ?? 0
    const addedQty = baseQty * 0.5 * multiplier
    if (!bumps[entry.slug]) bumps[entry.slug] = { bagsPerAcre: 0, parameters: [] }
    bumps[entry.slug].bagsPerAcre += addedQty
    bumps[entry.slug].parameters.push(entry.parameter)
  }
  // Cap: total bump per product capped at its own standard qtyPerAcre (max 2x dose).
  for (const slug of Object.keys(bumps)) {
    const cap = qtyPerAcreBySlug[slug] ?? Infinity
    if (bumps[slug].bagsPerAcre > cap) bumps[slug].bagsPerAcre = cap
    // D-181: a reduction never takes a product below half its standard quantity.
    const floor = -(qtyPerAcreBySlug[slug] ?? 0) * 0.5
    if (bumps[slug].bagsPerAcre < floor) bumps[slug].bagsPerAcre = floor
  }
  return bumps
}

/**
 * Which parameters have a live mapping for a given crop — drives which rows the UI shows. Coverage
 * is not uniform and is not meant to be: wheat has all ten, potato seven, date palm four, mango five.
 * A parameter with no responder in that crop's own plan is NOT OFFERED, rather than being offered and
 * silently doing nothing.
 */
export function mappedParameters(crop: SoilCrop): SoilParameter[] {
  // A parameter earns a row if the plan can DO something with it. That is normally a product, but
  // it can also be a substitution (pH moves nitrogen between carriers) or an advisory (a saline
  // reading is answered with words, not a bag). Leaving EC off because it no longer bumps a product
  // would take away the farmer's only way to tell us the field is salty.
  return mappedParametersForCrop(crop)
}


/**
 * NITROGEN SUBSTITUTION — added 8 Sep 2026 on Tahir's ruling.
 *
 * A high-pH reading does not mean the crop needs more nitrogen; it means the nitrogen applied as
 * uncoated urea escapes as ammonia before the crop reaches it. So the plan moves nitrogen from the
 * commodity urea line to Vital Urea and keeps the TOTAL NITROGEN THE SAME. One line goes down, the
 * other goes up, and the nutrient-delivered figure barely moves — which is the point.
 *
 * How much moves: the same 0.5x sizing, graduated by band, that Tahir confirmed for the dose bumps,
 * so the two rules are consistent. It can never move more nitrogen than the commodity line actually
 * carries.
 */
export type SoilSwap = { fromProduct: string; toSlug: string; nutrient: string; fromDelta: number; toDelta: number; parameter: SoilParameter; note: string }

export function computeSoilSwaps(soilInputs: SoilInputs, costPlan: CostRow[]): SoilSwap[] {
  const swaps: SoilSwap[] = []
  for (const sub of SOIL_SUBSTITUTIONS) {
    const band = soilInputs[sub.parameter]
    if (!band) continue
    const multiplier = SOIL_BUMP_MULTIPLIER[band]
    if (multiplier <= 0) continue
    const from = costPlan.find(r => r.product === sub.fromProduct)
    const to = costPlan.find(r => r.slug === sub.toSlug)
    if (!from || !to) continue
    const fromPctN = from.analysisPct[sub.nutrient] ?? 0
    const toPctN = to.analysisPct[sub.nutrient] ?? 0
    if (!fromPctN || !toPctN) continue

    const nInFrom = from.qtyPerAcre * from.packKg * (fromPctN / 100)
    const shiftN = Math.min(nInFrom, nInFrom * 0.5 * multiplier)
    if (shiftN <= 0.01) continue

    swaps.push({
      fromProduct: sub.fromProduct,
      toSlug: sub.toSlug,
      nutrient: sub.nutrient,
      fromDelta: -(shiftN / (from.packKg * (fromPctN / 100))),
      toDelta: shiftN / (to.packKg * (toPctN / 100)),
      parameter: sub.parameter,
      note: sub.note,
    })
  }
  return swaps
}

/**
 * Readings the plan answers with words rather than a product.
 *
 * `crop` is optional and omitting it is safe: a crop-scoped advisory is then left out rather than
 * shown everywhere, so a caller that does not know its crop can never leak mango's potash advisory
 * onto a wheat page.
 */
export function soilAdvisories(soilInputs: SoilInputs, crop?: SoilCrop) {
  return SOIL_ADVISORIES.filter(a => {
    if (a.crops && !(crop && a.crops.includes(crop))) return false
    const band = soilInputs[a.parameter]
    return band ? a.bands.includes(band) : false
  })
}
