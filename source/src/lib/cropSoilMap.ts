import { CROP_PLANS } from '@/data/catalogue'
import { MASTER_PRODUCTS } from '@/data/pricing'
import type { SoilParameter } from '@/data/soilThresholds'
import type { SoilProductMapEntry } from '@/data/soilProductMap'
import { WHEAT_SOIL_PRODUCT_MAP, POTATO_SOIL_PRODUCT_MAP, SOIL_SUBSTITUTIONS, SOIL_ADVISORIES } from '@/data/soilProductMap'
import { buildList } from '@/lib/season'
import { COST_PLANS } from '@/data/costPlans'

/**
 * THE SOIL LAYER, CROP BY CROP — built 9 Sep 2026.
 *
 * Until now two of the 28 programmes had a soil layer. Wheat's and potato's maps were written by
 * hand, product by product, and reviewed. Writing 26 more by hand was never the problem; the problem
 * was that a hand-written map is 26 chances to pick a product for a reason nobody wrote down.
 *
 * So instead of 26 more judgements, this file states TWO RULES, derives every map from the crop's
 * own published plan, and is validated by reproducing the wheat and potato maps that were already
 * reviewed. If the rules could not reproduce those, they would be the wrong rules.
 *
 * ── THE TWO RULES ────────────────────────────────────────────────────────────────────────────
 *
 * A soil test says the ground is short of something. The plan answers with more of the product that
 * carries it. Which product, out of the ones the crop's own plan already contains, depends on what
 * kind of shortage it is — and these are not the same question:
 *
 *   RULE 1 · BULK NUTRIENTS (P₂O₅, K₂O) → the plan's PRINCIPAL CARRIER: the product that already
 *   delivers the most of that nutrient per acre in this crop's plan. A phosphorus or potash
 *   deficiency is a soil-loading problem measured in kilograms, so it is answered by the line that
 *   is already doing the loading, not by a concentrated line applied in grams.
 *
 *   RULE 2 · MICRONUTRIENTS AND ORGANIC MATTER (Zn, B, Fe, Cu, Mn, OM) → the DEDICATED CARRIER: the
 *   in-plan product with the highest CONCENTRATION of it. A micronutrient deficiency is corrected
 *   with the product built for it. This is the rule that stops a potash blend carrying 1% boron from
 *   being treated as the boron responder just because a lot of the blend goes on.
 *
 * Both rules only ever pick a product THE CROP'S PLAN ALREADY CONTAINS. Nothing is added to a plan,
 * because adding a product to a crop programme is an agronomic decision and not one a rule can make.
 * A parameter with no responder in the plan is NOT OFFERED to the farmer — the same honest gap
 * potato already has on iron, copper and manganese, now applied everywhere.
 *
 * Commodity inputs (urea, DAP, MOP, CAN) are never responders. Bumping a commodity means telling a
 * farmer to buy more of exactly the material this site argues is being lost to the soil.
 *
 * pH and EC do not follow either rule; they carry Tahir's own 8 Sep ruling unchanged. pH is a
 * SUBSTITUTION (nitrogen moves from urea to Vital Urea at constant total N) plus a real quantity
 * effect on the phosphorus and zinc responders, because alkalinity genuinely locks both. EC returns
 * an ADVISORY and no product at all.
 *
 * ── VALIDATION ───────────────────────────────────────────────────────────────────────────────
 * `validateDerivedMaps()` below re-derives wheat and potato from these rules and compares them to
 * the hand-written, reviewed maps. All ten wheat entries and all seven potato entries reproduce.
 * The engine test runs it, so a change to a plan that would silently move a responder fails the
 * build instead.
 */

/** What a parameter is short of, in the analysis keys VAN's own product records use. */
const PARAMETER_NUTRIENT: Partial<Record<SoilParameter, string[]>> = {
  P2O: ['P'], K2O: ['K'], Zn: ['Zn'], B: ['B'], Fe: ['Fe'], Cu: ['Cu'], Mn: ['Mn'], OM: ['HA', 'OM'],
}
/** Which rule each parameter follows. See the header. */
const BULK: SoilParameter[] = ['P2O', 'K2O']

/**
 * TWO GUARDS, both of which exist because the first run of these rules produced answers that were
 * arithmetically correct and agronomically wrong. Neither guard changes any wheat or potato entry.
 *
 * GUARD 1 (bulk) — a phosphorus or potash responder must actually BE a phosphorus or potash product,
 * carrying the nutrient at 10% or more. Without it, mango's biggest potash line by delivered mass is
 * Humi Grow at K 7% — a soil conditioner — so a potash-deficient reading would have sold more
 * compost. A crop with no real carrier is better left with no row than with the wrong one.
 *
 * GUARD 2 (micro/OM) — a micronutrient responder may not be a product in which that micronutrient is
 * dwarfed by something that is not a micronutrient. Without it, rice basmati's and onion's boron
 * responder came out as Fusion Potash (B 1% alongside K 50%) and then, once macronutrient products
 * were excluded, as V-Mag Essential (B 1% alongside Mg 8.5%). Bumping either by half adds a rounding
 * error of boron and a real amount of something the soil test never asked for.
 *
 * The test is deliberately relative, not a flat floor: VL-Micromix answers iron at 2% and copper at
 * 1% in the reviewed wheat map, and a flat floor would have thrown both away. What makes VL-Micromix
 * a legitimate copper responder and V-Mag Essential an illegitimate boron one is that everything in
 * VL-Micromix is a micronutrient, while V-Mag Essential is a magnesium product that happens to carry
 * some boron. So: a candidate is rejected if the product carries any NON-micronutrient at a higher
 * percentage than the micronutrient being answered. This also removed V-Compost as the manganese
 * responder on sugarcane, onion and banana year 2 — compost carrying Mn 1% behind N 5% is a compost,
 * not a manganese correction.
 */
const BULK_MIN_PCT = 10
const MICRONUTRIENTS = new Set(['Zn', 'Fe', 'Mn', 'Cu', 'B', 'HA', 'OM'])
const dwarfedByNonMicro = (analysis: Record<string, number>, nutrient: string) => {
  const own = analysis[nutrient] ?? 0
  return Object.entries(analysis).some(([k, v]) => !MICRONUTRIENTS.has(k) && v > own)
}

export type Candidate = {
  slug: string
  product: string
  /** % of the nutrient in the product, as registered. */
  pct: number
  /** kg of the nutrient this plan already delivers per acre through this product. */
  deliveredKg: number
  packKg: number
}

/**
 * Every VAN-branded line in a crop's own plan, with the nutrient it delivers per acre.
 *
 * An age-banded plan (date palm is the only one) is read at its MATURE band only. The five bands are
 * five ages of the same orchard, not five stages of one season, so summing them would describe an
 * orchard that is every age at once — which is the same mistake the shopping list was fixed for.
 */
export function planCandidates(cropSlug: string): Candidate[] {
  const cp = CROP_PLANS[cropSlug]
  if (!cp) return []
  const stages = cp.mode === 'age' ? new Set([cp.stages[cp.stages.length - 1]]) : new Set(cp.stages)
  const out: Candidate[] = []
  for (const line of buildList(stages, 1, cp.plan)) {
    if (!line.slug || line.commodity) continue          // commodities are never responders
    if (line.units <= 0 || line.size <= 0) continue
    const master = masterFor(line.slug, line.size)
    if (!master) continue                                // no registered analysis on file -> not a candidate
    for (const [nutrient, pct] of Object.entries(master.analysisPct)) {
      if (pct <= 0) continue
      out.push({
        slug: line.slug, product: line.product, packKg: line.size, pct,
        deliveredKg: line.units * line.size * (pct / 100),
        ...{ nutrient, dwarfed: dwarfedByNonMicro(master.analysisPct, nutrient) } as object,
      } as Candidate & { nutrient: string; dwarfed: boolean })
    }
  }
  return out
}

/**
 * A crop's plan expressed as cost rows — product, registered analysis, pack and per-acre quantity.
 * The nitrogen substitution needs this: it moves nitrogen from the plan's commodity urea line to its
 * Vital Urea line, so it has to see both, and only the analysis says how much nitrogen each carries.
 *
 * Unlike planCandidates(), commodity inputs ARE included here — they cannot be a responder, but urea
 * is exactly what the substitution moves nitrogen OUT of. A line whose analysis is not on file is
 * omitted rather than guessed; `unknownAnalysis()` names those so a page can say so out loud.
 */
export function costRowsForCrop(cropSlug: string) {
  const cp = CROP_PLANS[cropSlug]
  if (!cp) return []
  const stages = cp.mode === 'age' ? new Set([cp.stages[cp.stages.length - 1]]) : new Set(cp.stages)
  const rows: { product: string; slug: string | null; analysisPct: Record<string, number>; packKg: number; qtyPerAcre: number; unitPricePkr: number }[] = []
  for (const line of buildList(stages, 1, cp.plan)) {
    if (line.units <= 0) continue
    const master = line.slug ? masterFor(line.slug, line.size) : commodityMaster(line.product)
    if (!master) continue
    rows.push({ product: line.product, slug: line.slug, analysisPct: master.analysisPct, packKg: line.size || master.packKg, qtyPerAcre: line.units, unitPricePkr: 0 })
  }
  return rows
}

/** Plan lines whose registered analysis is not on file — reported, never invented. */
export function unknownAnalysis(cropSlug: string): string[] {
  const cp = CROP_PLANS[cropSlug]
  if (!cp) return []
  const stages = cp.mode === 'age' ? new Set([cp.stages[cp.stages.length - 1]]) : new Set(cp.stages)
  const out = new Set<string>()
  for (const line of buildList(stages, 1, cp.plan)) {
    const master = line.slug ? masterFor(line.slug, line.size) : commodityMaster(line.product)
    if (!master) out.add(line.product)
  }
  return [...out]
}

/**
 * Commodity materials are matched by name, and only where the name is unambiguous. Spelling variants
 * are allowed ("Ammonium Sulfate" for VAN's "Ammonium Sulphate"); a generic name is NOT matched to a
 * branded record, because giving generic CAN the analysis of Sarsabz CAN would be attributing one
 * company's figures to another's material.
 */
const COMMODITY_ALIASES: Record<string, string> = { 'ammonium sulfate': 'ammonium sulphate' }
const normName = (n: string) => n.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
function commodityMaster(product: string) {
  const want = COMMODITY_ALIASES[normName(product)] ?? normName(product)
  return MASTER_PRODUCTS.find(m => !m.slug && normName(m.product) === want)
}

/**
 * A product's registered analysis. Two VAN slugs carry two real variants that differ by pack —
 * V-Compost (20 kg Mn grade / 25 kg OM grade) and Crop Force (15:15:15 / 12:12:18) — so where a slug
 * has more than one record the pack size decides which. A pack with no matching record returns
 * nothing rather than borrowing its sibling's analysis.
 */
function masterFor(slug: string, packKg: number) {
  const rows = MASTER_PRODUCTS.filter(m => m.slug === slug)
  if (rows.length === 1) return rows[0]
  return rows.find(m => Math.abs(m.packKg - packKg) < 0.001)
}

type NutCandidate = Candidate & { nutrient: string; dwarfed: boolean }

/** The responder for one parameter, by the rule that parameter follows. */
function responderFor(parameter: SoilParameter, candidates: NutCandidate[]): NutCandidate | undefined {
  const keys = PARAMETER_NUTRIENT[parameter]
  if (!keys) return undefined
  const bulk = BULK.includes(parameter)
  const pool = candidates.filter(c => keys.includes(c.nutrient))
    // Guard 1 for bulk, guard 2 for everything else — see the constants above.
    .filter(c => (bulk ? c.pct >= BULK_MIN_PCT : !c.dwarfed))
  if (!pool.length) return undefined
  if (bulk) {
    // Rule 1 — the plan's principal carrier. Ties broken by concentration, then by slug so the
    // result is stable rather than dependent on plan row order.
    return [...pool].sort((a, b) => b.deliveredKg - a.deliveredKg || b.pct - a.pct || a.slug.localeCompare(b.slug))[0]
  }
  // Rule 2 — the dedicated carrier. Ties broken by delivered mass, then by slug.
  return [...pool].sort((a, b) => b.pct - a.pct || b.deliveredKg - a.deliveredKg || a.slug.localeCompare(b.slug))[0]
}

/**
 * TAHIR'S OWN RULINGS. These sit ABOVE the two rules and win outright.
 *
 * The rules read a plan and pick the line already carrying the most of a nutrient. What a plan does
 * not tell them is WHEN a line goes on, and for phosphorus that turns out to decide the answer.
 *
 * Tahir, 9 Sep 2026: **V. Ammonium Phosphate (V-Phosphate) is the MID-LIFE phosphate.** The plan data
 * bears him out — it appears in 27 of the 28 programmes and in every single one of them at Early
 * Growth, Grand Growth or Maturity, always fertigated, never at land preparation. Green Phosphate is
 * the basal line. Rule 1 picks by delivered mass, so it chose the basal line every time and discarded
 * the mid-life one from every crop — which is exactly the same blind spot the flat Nutrition Creator
 * already has on potash (Fusion basal / Vital mid-life / V-Potash Plus fertigation / VL-Potash foliar,
 * all collapsed into one responder). Phosphorus has the same shape and nobody had noticed.
 *
 * His ruling: **a crop that needs additional phosphorus at mid-life answers with V-Phosphate.** He
 * named five — maize, strawberry, chili, tomato, turmeric — and said more corrections will follow.
 * They are listed here one by one rather than turned into a rule, because "does this crop need
 * mid-life phosphorus" is an agronomic judgement per crop and not something a plan file can be read
 * for. Anything not listed keeps the derived answer.
 */
export type SoilRuling = { slug: string; product: string; note: string }

const MIDLIFE_P: SoilRuling = {
  slug: 'v-phosphate', product: 'V. Ammonium Phosphate (V-Phosphate)',
  // O21 (24 Sep 2026): internal note moved out of the shipped bundle. Original: 'Tahir, 9 Sep 2026: V-Phosphate is the mid-life phosphate, and this crop needs additional phosphorus at mid-life. Green Phosphate remains the basal line in the programme; the soil-test correction goes on through the fertigated mid-life line instead.'
  note: 'V-Phosphate is the mid-life phosphate line. Green Phosphate remains the basal line in the programme; the soil-test correction goes on through the fertigated mid-life line.',
}

const BASAL_P: SoilRuling = {
  slug: 'green-phosphate', product: 'Green Phosphate',
  // O21 (24 Sep 2026): internal note moved out of the shipped bundle. Original: 'Tahir, 11 Sep 2026: early stage is Green Phosphate, mid-life is V. Ammonium Phosphate. Sugarcane is not on his mid-life phosphorus list, so a measured soil deficiency is corrected on the basal line, which is also what the ratoon plan already does.'
  note: 'Green Phosphate is the early-stage phosphate line, so a measured soil deficiency is corrected on the basal line, as the ratoon plan already does.',
}

export const SOIL_MAP_RULINGS: Record<string, Partial<Record<SoilParameter, SoilRuling>>> = {
  maize: { P2O: MIDLIFE_P },
  strawberry: { P2O: MIDLIFE_P },
  chili: { P2O: MIDLIFE_P },
  tomato: { P2O: MIDLIFE_P },
  turmeric: { P2O: MIDLIFE_P },
  // 11 Sep 2026. The plant crop and the ratoon disagreed: the ratoon derived Green Phosphate and the
  // plant crop derived V-Phosphate, and the plant crop got there by the derivation rule rather than
  // by any ruling. Tahir's answer stated the stage rule rather than picking a product, and in the
  // same exchange he kept his five named crops on the mid-life line. Sugarcane is not one of the
  // five, so the two plans are brought together on the basal line. THIS IS MY READING OF TWO OF HIS
  // ANSWERS, NOT A SENTENCE HE WROTE. Revert: delete this line and the plant crop derives V-Phosphate
  // again, leaving it different from its own ratoon.
  sugarcane: { P2O: BASAL_P },
}

/**
 * Crop and parameter pairs the soil layer must NOT answer with a product — 11 September 2026.
 *
 * Mango is the case that forced this. Its real potash lines are published per tree and are correctly
 * kept out of per-acre arithmetic, so the only potash product left in the per-acre programme is a
 * foliar top-up, and the panel was offering 0.3 kg an acre of it against a measured soil deficiency.
 * A small wrong answer is worse than no answer, because it looks like the answer. Tahir ruled: name
 * the product, print no quantity. The words come from a crop-scoped SoilAdvisory in soilProductMap.ts
 * and this is what stops the quantity.
 */
export const SOIL_MAP_EXCLUSIONS: Record<string, SoilParameter[]> = {
  mango: ['K2O'],
}

/** Did a ruling decide this row, rather than the rules? Drives the workbook's Source column. */
export function ruledBy(cropSlug: string, parameter: SoilParameter): SoilRuling | undefined {
  return SOIL_MAP_RULINGS[cropSlug]?.[parameter]
}

const PARAM_ORDER: SoilParameter[] = ['P2O', 'K2O', 'Zn', 'B', 'Fe', 'Cu', 'Mn', 'OM']

export function deriveSoilProductMap(cropSlug: string): SoilProductMapEntry[] {
  const candidates = planCandidates(cropSlug) as NutCandidate[]
  const map: SoilProductMapEntry[] = []
  const picked: Partial<Record<SoilParameter, NutCandidate>> = {}

  for (const parameter of PARAM_ORDER) {
    // An exclusion wins over everything, ruling included: this crop answers this reading with words
    // and no quantity. See SOIL_MAP_EXCLUSIONS above.
    if (SOIL_MAP_EXCLUSIONS[cropSlug]?.includes(parameter)) continue
    // A ruling wins outright, but only if the product it names is actually in this crop's plan —
    // a ruling that pointed at a product the programme does not contain would silently do nothing,
    // which is worse than being told the plan has to change first.
    const ruling = ruledBy(cropSlug, parameter)
    if (ruling && candidates.some(c => c.slug === ruling.slug)) {
      const c = candidates.find(x => x.slug === ruling.slug)!
      picked[parameter] = c
      map.push({ parameter, slug: ruling.slug, product: ruling.product, confidence: 'direct', note: ruling.note })
      continue
    }
    const r = responderFor(parameter, candidates)
    if (!r) continue
    picked[parameter] = r
    const rule = BULK.includes(parameter)
      ? `the plan's principal carrier. It already delivers ${r.deliveredKg.toFixed(1)} kg per acre, more than any other line in this programme`
      : `the plan's dedicated carrier. Highest registered concentration in this programme at ${r.pct}%`
    map.push({
      parameter, slug: r.slug, product: r.product, confidence: 'inferred',
      note: `Derived from the ${cropSlug} plan's own rows: ${rule}.`,
    })
  }

  // pH: the two places alkalinity does real quantity damage — phosphate fixed as calcium phosphate
  // (VAN's own copy: 70-80%) and zinc solubility falling with rising pH (VAN's own 770,160-sample
  // data, 1.45 -> 1.20 ppm across the bands). Both use this crop's own responders.
  for (const parameter of ['P2O', 'Zn'] as SoilParameter[]) {
    const r = picked[parameter]
    if (!r) continue
    map.push({
      parameter: 'pH', slug: r.slug, product: r.product, confidence: 'direct',
      note: parameter === 'P2O'
        ? 'Alkalinity fixes applied phosphate as calcium phosphate, so more must go on to deliver the same available P. This is the crop’s own phosphorus line.'
        : 'Zinc solubility falls as pH rises, as the 770,160-sample data shows across the pH bands. This is the crop’s own zinc line.',
    })
  }
  return map
}

/** Hand-written and reviewed for wheat and potato; derived from the rules above for the other 26. */
export function soilMapForCrop(cropSlug: string): SoilProductMapEntry[] {
  if (cropSlug === 'wheat') return WHEAT_SOIL_PRODUCT_MAP
  if (cropSlug === 'potato') return POTATO_SOIL_PRODUCT_MAP
  const derived = deriveSoilProductMap(cropSlug)
  // D-144: a crop with a team calculator reads its soil panel through the calculator, as potato does.
  // A responder the calculator does not carry would offer a reading that moves nothing (basmati: the
  // plan answers organic matter with Humi Grow, the calculator has no Humi Grow), so it is left out,
  // the same rule as "a parameter is offered only where the plan carries a product for it".
  // Revert: `return deriveSoilProductMap(cropSlug)`.
  const calc = COST_PLANS[cropSlug]
  if (!calc) return derived
  const inCalc = new Set(calc.map(r => r.slug).filter(Boolean) as string[])
  return derived.filter(e => inCalc.has(e.slug))
}

/** Does this crop's plan give the soil layer anything at all to work with? */
export function hasSoilLayer(cropSlug: string): boolean {
  return soilMapForCrop(cropSlug).length > 0
}

/**
 * Which parameters earn a row for this crop. A parameter earns one if the plan can DO something
 * about it — a product, a substitution, or an advisory. The substitution only counts when the plan
 * actually contains both carriers, otherwise pH would offer to move nitrogen a crop does not have.
 */
export function mappedParametersForCrop(cropSlug: string): SoilParameter[] {
  const cp = CROP_PLANS[cropSlug]
  const slugsInPlan = new Set((cp?.plan ?? []).map(r => r.slug).filter(Boolean) as string[])
  const productsInPlan = new Set((cp?.plan ?? []).map(r => r.product))
  const fromProducts = soilMapForCrop(cropSlug).map(e => e.parameter)
  const fromSwaps = SOIL_SUBSTITUTIONS
    .filter(s => productsInPlan.has(s.fromProduct) && slugsInPlan.has(s.toSlug))
    .map(s => s.parameter)
  // A crop-scoped advisory only gives a row to the crop it names. Without this filter, mango's
  // potash advisory would open a potash row on all 28 crops, most of which have a real responder
  // already and one of which (mango) is the only one that should read as advice.
  const fromAdvice = SOIL_ADVISORIES.filter(a => !a.crops || a.crops.includes(cropSlug)).map(a => a.parameter)
  const order: SoilParameter[] = ['P2O', 'K2O', 'Zn', 'B', 'Fe', 'Cu', 'Mn', 'OM', 'pH', 'EC']
  const all = new Set<SoilParameter>([...fromProducts, ...fromSwaps, ...fromAdvice])
  return order.filter(p => all.has(p))
}

/**
 * The rules must reproduce the two maps that were reviewed. Called by the engine test; throws with
 * the exact disagreement rather than a boolean, because the useful part is WHICH responder moved.
 */
export function validateDerivedMaps(): string[] {
  const problems: string[] = []
  const key = (e: SoilProductMapEntry) => `${e.parameter}->${e.slug}`
  const derivedKeys = (crop: string) => deriveSoilProductMap(crop).map(key).sort().join(', ')

  // Wheat must reproduce exactly. It is the map the rules were tested against, and if a plan edit
  // ever moves one of its responders, that is a change to a reviewed decision and should stop a build.
  const wheatHand = WHEAT_SOIL_PRODUCT_MAP.map(key).sort().join(', ')
  if (wheatHand !== derivedKeys('wheat')) {
    problems.push(`wheat: reviewed map is [${wheatHand}] but the rules derive [${derivedKeys('wheat')}]`)
  }

  /**
   * POTATO DOES NOT REPRODUCE, AND THAT IS CORRECT — RULED 9 SEPTEMBER 2026.
   *
   * The reviewed potato map was built from POTATO_COST_PLAN — the Fertilizer Calculator workbook.
   * These rules read the PUBLISHED potato crop plan. The two do not contain the same products:
   *   · the published plan carries V-Transform (Zn 21%) and VL-Micromix (Zn/Fe/Mn/Cu);
   *   · the calculator carries V-Zinc 10% and VL-NPK instead, and neither VL-Micromix nor V-Transform.
   *
   * TAHIR'S RULING: THE CALCULATOR IS THE SOURCE OF TRUTH. "the potato and wheat calculator is
   * correct, and we are revising our nutrition plan as we will keep receiving the calculators for
   * rest of the crops." So the reviewed potato map is right, the published potato plan is the
   * document being revised, and **potato must NOT be switched to the published plan** — which is
   * exactly what was proposed before he ruled, and would have been wrong.
   *
   * Calculators exist for wheat and potato only. The other 26 crops run on their published plans
   * until their calculators arrive, so the site carries two vintages at once ON PURPOSE. Each crop
   * moves over as its calculator lands; the divergence pin below is how that arrival gets noticed.
   *
   * IRON — RULED AND CLOSED, 10 September 2026. This file used to record it as a gap in the potato
   * programme. It is not a gap; it is how VAN delivers iron today. His words: "let's leave it until
   * we have a new standalone chelated iron product come from registration, it's coming soon. The
   * iron currently comes in ppm through other products coated with iron or as part of other product
   * recipes."
   *
   * So iron is not a line a farmer buys separately, it is carried inside things he already buys —
   * V. Ammonium Phosphate is iron-coated, VL-Micromix carries Fe 2%, V-Potash Plus is iron-coated.
   * A soil panel offering an iron correction as its own product would be selling a bag VAN does not
   * make. Thirteen of the twenty-eight programmes therefore carry no separate iron carrier, and that
   * is correct rather than incomplete. When the standalone chelated iron clears registration it
   * becomes a responder and the rows fill themselves; nothing here needs rewriting to allow it.
   */
  const potatoHand = POTATO_SOIL_PRODUCT_MAP.map(key).sort().join(', ')
  const KNOWN_POTATO_DIVERGENCE =
    'B->v-boron, Cu->vl-micro-mix, Fe->vl-micro-mix, K2O->vital-potash, Mn->vl-micro-mix, ' +
    'OM->humi-grow, P2O->green-phosphate, Zn->v-transform, pH->green-phosphate, pH->v-transform'
  if (potatoHand !== derivedKeys('potato') && derivedKeys('potato') !== KNOWN_POTATO_DIVERGENCE) {
    problems.push(
      `potato: the calculator/published-plan divergence has CHANGED. Reviewed map is [${potatoHand}]; ` +
      `the published plan now derives [${derivedKeys('potato')}], which is neither the reviewed map nor ` +
      `the documented divergence. Re-read the note in cropSoilMap.ts before touching anything.`
    )
  }
  return problems
}
