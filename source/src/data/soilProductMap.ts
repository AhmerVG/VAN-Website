import type { SoilParameter } from './soilThresholds'

/**
 * Wheat soil-deficiency -> product map. Unlike the section 9 draft in the master framework doc (built
 * from New.xlsx's product-category table, much of it inferred), most entries here are read directly
 * off WHEAT_COST_PLAN's own analysisPct in pricing.ts — the same real, VAN-verified numbers the
 * Nutrition Creator already uses for its nutrient-delivered totals. Where a parameter maps to more
 * than one product, their bumps sum (see soilAdjustment.ts) — same behaviour as Fe/Cu/Mn all pointing
 * at VL-Micromix.
 *
 * pH and EC, confirmed by Tahir 9 Sep (previously left unmapped, not guessed): pH correctors are
 * Green Sulfur, Vital Urea (VAN's own sulfur-coated urea — see [[engro-scu-case]]) and Humi Grow, all
 * three. EC corrects via Humi Grow and Green Sulfur (Vital Urea not named for this one). Neither is
 * an analysisPct-derived pick like the nutrient rows below — both are Tahir's own agronomic call,
 * taken as given.
 *
 * K2O: Tahir's actual answer is stage/application-wise, not a single responder — Fusion Potash for
 * basal/early, Vital Potash for mid-life, "V Potash Plus" for fertigation, VL-Potash for foliar. The
 * flat, non-stage-aware Nutrition Creator (acres x one qtyPerAcre per product, no growth-stage
 * breakdown) can't represent that directly, so the K2O soil-bump still lands on Fusion Potash only —
 * closest match to "basal/early", which is what a single flat number represents. Vital Potash,
 * VL-Potash and "V Potash Plus" are left out of the K2O bump specifically, not because they're wrong,
 * but because a flat-plan bump can't tell them apart by stage. "V Potash Plus" isn't in WHEAT_COST_PLAN
 * at all (no pack size, analysis% or price on file) — flagged back to Tahir rather than guessed at.
 *
 * Nitrogen, other Secondary Nutrients (Mg/Ca as their own line) still aren't tested parameters in
 * VAN's own 5-band soil-test table at all (see soilThresholds.ts) — not a mapping gap, just outside
 * what a soil-test-band adjustment can drive.
 */

/* ── HOW pH AND EC ARE HANDLED, AND WHY IT CHANGED ────────────────────────────────────────────
 * Until 8 Sep 2026 a Critical pH raised Vital Urea, Green Sulfur and Humi Grow, and a Critical EC
 * raised Green Sulfur and Humi Grow. That was wrong in two different ways, and the site said so
 * itself: the Vital Urea page states in VAN's own words that the sulfur coating "will not move a
 * soil test, and VAN does not claim it does" — while the creator one click away sold 50% more of it
 * when pH read Critical. Tahir ruled on both, 8 Sep 2026.
 *
 * pH is not a nitrogen QUANTITY problem. It is three things:
 *   1. Urea volatilises as ammonia — a problem of FORM, not amount. Applying more urea to alkaline
 *      ground feeds the loss, which is the exact national pattern the Knowledge page argues against.
 *      So pH now triggers a SUBSTITUTION: nitrogen moves from plain urea to Vital Urea at the same
 *      total N. Same nitrogen to the crop, less of it lost. See SOIL_SUBSTITUTIONS below.
 *   2. Phosphorus is fixed as calcium phosphate — VAN's own copy says 70-80%. A real quantity
 *      effect: more must be applied to deliver the same available P.
 *   3. Zinc solubility falls — VAN's own soil data measures it across the pH bands.
 * Green Sulfur and Humi Grow came off the pH map as a consequence of that ruling. Neither has a
 * published VAN mechanism for shifting the pH of a lime-buffered calcareous soil at fertilizer rates.
 *
 * EC raises nothing at all. Fertilizer salts add to the salt load on saline ground, so bumping a
 * product there makes the measured problem worse. Elemental sulfur genuinely is the reclamation
 * pathway on sodic soil — sulfur to acid, acid dissolves lime, calcium displaces sodium — but that
 * needs something on the order of a tonne per acre, not the extra kilogram the old rule added, and
 * publishing a kilogram implies a fix that is not there. EC now returns an ADVISORY instead of a
 * dose. See SOIL_ADVISORIES.
 */

/** Nitrogen moved from one carrier to another at constant total N. Not a dose increase. */
export type SoilSubstitution = { parameter: SoilParameter; fromProduct: string; toSlug: string; nutrient: string; note: string }

export const SOIL_SUBSTITUTIONS: SoilSubstitution[] = [
  {
    parameter: 'pH', fromProduct: 'Urea', toSlug: 'vital-urea', nutrient: 'N',
    note: 'On ground above pH 8 surface-applied uncoated urea hydrolyses and escapes as ammonia before the crop takes it up. The answer is not more urea. It is the same nitrogen behind a coating that releases across the crop\'s demand curve.',
  },
]

/**
 * A reading the plan should not answer with a product at all.
 *
 * `crops` scopes an advisory to named crops. Omit it and the advisory is site-wide, which is what
 * salinity is. Mango's potash is the opposite case: it is a mango problem and nothing else's.
 */
export type SoilAdvisory = { parameter: SoilParameter; bands: string[]; headline: string; body: string; crops?: string[] }

export const SOIL_ADVISORIES: SoilAdvisory[] = [
  {
    parameter: 'EC', bands: ['critical', 'weak', 'average'],   // D-177: the site calls ground saline above 4 dS/m (Soil page); the warning started at 8
    headline: 'This is a salinity problem before it is a nutrition problem.',
    body: 'At this reading, adding fertilizer adds salt to ground that already has too much of it. What the field needs first is a gypsum requirement worked out against its own analysis, and enough water to leach the salt below the root zone, with drainage to take it away. VAN will not sell you a bag as the answer to this. Send the soil report and the agronomy team will tell you what the field actually needs.',
  },
  {
    // 11 Sep 2026, Tahir's ruling. Mango's real potash lines are published PER TREE and are correctly
    // excluded from per-acre arithmetic, so the only potash product left in the per-acre programme is
    // a foliar. The panel was answering a measured soil potash deficiency with 0.3 kg an acre of it,
    // which is not an answer. He ruled: name the product, print no quantity. See the matching
    // exclusion in cropSoilMap.ts, which is what stops the 0.3 kg being offered.
    parameter: 'K2O', bands: ['critical', 'weak', 'moderate'], crops: ['mango'],
    headline: 'Mango potash is worked out per tree, not per acre.',
    body: 'A low potash reading on a mango orchard is answered with Vital Potash, which VAN publishes per tree rather than per acre. Turning that into a quantity needs your own tree count and spacing, so no per-acre figure is shown here rather than a small one that would be wrong. Vital Green works the dose out against your orchard. The foliar potash in the programme is a top-up and is not the answer to a soil deficiency.',
  },
]

export type SoilProductMapEntry = {
  parameter: SoilParameter
  slug: string
  product: string
  confidence: 'direct' | 'inferred'
  note: string
}

export const WHEAT_SOIL_PRODUCT_MAP: SoilProductMapEntry[] = [
  { parameter: 'P2O', slug: 'green-phosphate', product: 'Green Phosphate', confidence: 'direct', note: 'Only phosphorus-bearing product in the Wheat plan (P: 32%).' },
  // O21 (24 Sep 2026): internal note moved out of the shipped bundle. Original: 'Tahir 9 Sep: stage-wise, Fusion Potash is his basal/early-stage potash. The closest match to a flat, non-stage-aware bump. Vital Potash (mid-life), VL-Potash (foliar) and "V Potash Plus" (fertigation, not yet in pricing.ts) are stage/method-specific and not represented here.'
  { parameter: 'K2O', slug: 'fusion-potash', product: 'Fusion Potash', confidence: 'inferred', note: 'Basal and early-stage potash line in the Wheat plan.' },
  // O21 (24 Sep 2026): internal note moved out of the shipped bundle. Original: 'Higher Zn concentration (21%) than VL-Micromix (5%, broad-spectrum). Picked as primary responder.'
  { parameter: 'Zn', slug: 'v-transform', product: 'V-Transform', confidence: 'inferred', note: 'Higher Zn concentration (21%) than VL-Micromix (5%, broad-spectrum).' },
  { parameter: 'B', slug: 'v-boron', product: 'VL-Boron', confidence: 'direct', note: 'Dedicated boron product (B: 5%); V-Mag Essential carries B only as a minor secondary (1%), not used here.' },
  { parameter: 'Fe', slug: 'vl-micro-mix', product: 'VL-Micromix', confidence: 'direct', note: 'Only Fe-bearing product in the Wheat plan (Fe: 2%).' },
  { parameter: 'Cu', slug: 'vl-micro-mix', product: 'VL-Micromix', confidence: 'direct', note: 'Only Cu-bearing product in the Wheat plan (Cu: 1%).' },
  { parameter: 'Mn', slug: 'vl-micro-mix', product: 'VL-Micromix', confidence: 'direct', note: 'Only Mn-bearing product in the Wheat plan (Mn: 2%).' },
  // O21 (24 Sep 2026): internal note moved out of the shipped bundle. Original: 'Higher humic-acid concentration (HA: 40%) than Humi Grow Plus (10%). Picked as primary; matches the old Sugarcane sheet\'s own precedent (a humic/compost product responding to OM).'
  { parameter: 'OM', slug: 'humi-grow', product: 'Humi Grow', confidence: 'inferred', note: 'Higher humic-acid concentration (HA: 40%) than Humi Grow Plus (10%).' },
  // O21 (24 Sep 2026): internal note moved out of the shipped bundle. Original: 'Alkalinity fixes applied phosphate as calcium phosphate. VAN\'s own copy puts it at 70-80%. More has to go on to deliver the same available P. A real quantity effect, unlike the nitrogen one.'
  { parameter: 'pH', slug: 'green-phosphate', product: 'Green Phosphate', confidence: 'direct', note: 'Alkalinity fixes applied phosphate as calcium phosphate, so more has to go on to deliver the same available P.' },
  // O21 (24 Sep 2026): internal note moved out of the shipped bundle. Original: 'Zinc solubility falls as pH rises. VAN\'s own 770,160-sample data shows it (1.45 -> 1.20 ppm across the pH bands). Same logic as phosphorus.'
  { parameter: 'pH', slug: 'v-transform', product: 'V-Transform', confidence: 'direct', note: 'Zinc solubility falls as pH rises: 1.45 -> 1.20 ppm across the pH bands in the 770,160-sample data.' },
]


/**
 * POTATO soil-deficiency -> product map, built 8 Sep 2026 the same way as Wheat's: read off
 * POTATO_COST_PLAN's own analysisPct in pricing.ts, not guessed, with the pH/EC rows carrying over
 * Tahir's own 9 Sep agronomic call (those correctors are product properties, not crop-specific).
 *
 * Three real differences from Wheat, none of them papered over:
 *
 * 1. Fe, Cu and Mn have NO responder in the Potato plan. VL-Micromix is not in POTATO_COST_PLAN at
 *    all, and no other product in that plan carries iron, copper or manganese. Those three rows are
 *    therefore absent here, and the panel will not show them for Potato — an honest gap, not a
 *    silent zero. If Potato should carry a micronutrient mix, that is a change to the plan itself,
 *    which is Tahir's call, not something to invent in a map.
 * 2. Phosphorus has TWO candidates, unlike Wheat's one: Green Phosphate (P 32%, 50 kg, 2 bags/acre
 *    basal) and V. Ammonium Phosphate (P 44%, 10 kg, 1.5/acre fertigation). Green Phosphate is used
 *    here because a soil-test phosphorus deficiency is a soil-loading problem and Green Phosphate is
 *    the plan's basal, broadcast, bulk phosphorus line — the same role Green Phosphate plays in
 *    Wheat. Flagged for Tahir: if he would rather correct soil P through the fertigated 10 kg line,
 *    this is a one-line change.
 * 3. Potash also has two in-plan candidates. Tahir's own rule (8 Sep) is that Vital Potash is for
 *    crops needing MORE potash and V-Potash Plus for crops needing LESS; potato is a high-potash
 *    crop and Vital Potash is the larger, mid-life line in its own plan, so K2O lands on Vital
 *    Potash here where Wheat's lands on Fusion Potash. Flagged for confirmation.
 */
export const POTATO_SOIL_PRODUCT_MAP: SoilProductMapEntry[] = [
  // O21 (24 Sep 2026): internal note moved out of the shipped bundle. Original: 'Basal, broadcast, bulk phosphorus line in the Potato plan (P 32%); V. Ammonium Phosphate (P 44%) is the fertigated alternative. See file note 2.'
  { parameter: 'P2O', slug: 'green-phosphate', product: 'Green Phosphate', confidence: 'inferred', note: 'Basal, broadcast, bulk phosphorus line in the Potato plan (P 32%); V. Ammonium Phosphate (P 44%) is the fertigated alternative.' },
  // O21 (24 Sep 2026): internal note moved out of the shipped bundle. Original: 'Potato is a high-potash crop and Vital Potash is Tahir\'s "more potash" product (N 11 · K 44), and the larger line in the Potato plan. See file note 3.'
  { parameter: 'K2O', slug: 'vital-potash', product: 'Vital Potash', confidence: 'inferred', note: 'Potato is a high-potash crop, and Vital Potash (N 11 · K 44) is the larger potash line in the Potato plan.' },
  { parameter: 'Zn', slug: 'v-zinc', product: 'V-Zinc 10%', confidence: 'direct', note: 'Only zinc-bearing product in the Potato plan (Zn 10%). V-Transform, Wheat\'s zinc responder, is not in this plan.' },
  { parameter: 'B', slug: 'v-boron', product: 'VL-Boron', confidence: 'direct', note: 'Dedicated boron product (B 5%); V-Mag Essential carries B only as a minor secondary (1%), not used here.' },
  // O21 (24 Sep 2026): internal note moved out of the shipped bundle. Original: 'Higher humic-acid concentration (HA 40%) than Humi Grow Plus (10%). Same pick as Wheat.'
  { parameter: 'OM', slug: 'humi-grow', product: 'Humi Grow', confidence: 'inferred', note: 'Higher humic-acid concentration (HA 40%) than Humi Grow Plus (10%).' },
  // O21 (24 Sep 2026): internal note moved out of the shipped bundle. Original: 'Alkalinity fixes applied phosphate. Same reasoning as the wheat map.'
  { parameter: 'pH', slug: 'green-phosphate', product: 'Green Phosphate', confidence: 'direct', note: 'Alkalinity fixes applied phosphate.' },
  { parameter: 'pH', slug: 'v-zinc', product: 'V-Zinc 10%', confidence: 'direct', note: 'Zinc solubility falls as pH rises. V-Zinc is the Potato plan\'s zinc line; V-Transform is not in it.' },
]

/** Which crops have a real soil map today. Anything not here shows no soil panel at all. */
export const SOIL_PRODUCT_MAPS: Record<'wheat' | 'potato', SoilProductMapEntry[]> = {
  wheat: WHEAT_SOIL_PRODUCT_MAP,
  potato: POTATO_SOIL_PRODUCT_MAP,
}
