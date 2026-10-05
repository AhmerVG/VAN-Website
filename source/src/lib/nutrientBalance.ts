import { CROP_PLANS, type PlanRow } from '@/data/catalogue'
import { buildList } from '@/lib/season'

/**
 * WHAT THE PROGRAMME PUTS BACK — the supply half of nutrient removal and replacement.
 * Added 9 September 2026.
 *
 * A crop page can already tell a farmer how many bags to buy. It has never told him how many
 * KILOGRAMS OF NUTRIENT those bags contain. That number is the one that connects the shopping list
 * to the site's own national argument about soil overdraft, and it is arithmetic on figures VAN
 * itself publishes — nothing sourced from outside, nothing modelled.
 *
 * THE SOURCE IS THE PLAN ROW, NOT A PRODUCT TABLE. Every row of every published programme carries
 * its own `analysis` string, transcribed from the plan PDF: "P₂O₅ 32% · N 6%", "NPK 10-44-0",
 * "N 46%". That string is what the plan says about that row, so that is what is read. Joining to a
 * product table instead would quietly substitute today's registered analysis for the analysis the
 * plan was written against, and those have already diverged once on this site (Fusion Potash).
 *
 * WHAT IT REFUSES TO COUNT. Nine of the fifteen analysis strings in the plans are not analyses at
 * all — "Bio-stimulant", "Soil Conditioner", "Micronutrients", "Magnesium". They name a purpose,
 * not a percentage. Those rows are listed as UNCOUNTED by name rather than being dropped silently
 * or given a plausible number, because a supply total that quietly omits a product reads as a
 * complete answer and is not one.
 *
 * P AND K ARE OXIDES THROUGHOUT — P₂O₅ and K₂O, as the bags are labelled and as the plans print
 * them. Mixing an oxide figure with an elemental one is a 2.29× error on phosphorus and a 1.20×
 * error on potassium, so nothing here converts.
 *
 * LIQUIDS ARE COUNTED AT ONE LITRE = ONE KILOGRAM. The plans give liquid packs in litres and the
 * analysis as a percentage without stating whether it is w/w or w/v, so a density is unavoidable
 * and 1.0 is the assumption. Every liquid in these programmes is a micronutrient or a foliar at
 * one or two litres an acre, so the error is a fraction of a kilogram against macronutrient totals
 * in the tens — but it is an assumption and it is named, here and on the page.
 */

/** Nutrients this module accounts for, in the order a farmer reads them. */
export const NUTRIENTS = ['N', 'P', 'K', 'S', 'Zn', 'B', 'Mg', 'Fe', 'Mn', 'Cu'] as const
export type Nutrient = typeof NUTRIENTS[number]
export type NutrientTotals = Partial<Record<Nutrient, number>>

export const NUTRIENT_LABEL: Record<Nutrient, string> = {
  N: 'Nitrogen (N)', P: 'Phosphate (P₂O₅)', K: 'Potash (K₂O)', S: 'Sulfur (S)',
  Zn: 'Zinc (Zn)', B: 'Boron (B)', Mg: 'Magnesium (Mg)', Fe: 'Iron (Fe)', Mn: 'Manganese (Mn)', Cu: 'Copper (Cu)',
}

/**
 * Read a plan row's own analysis string into percentages.
 *
 * Handles the three shapes the plans actually use, and nothing else:
 *   "NPK 10-44-0" / "NPK 11.0.44"      an N-P₂O₅-K₂O grade
 *   "P₂O₅ 32% · N 6%"                  named nutrients with percentages
 *   "N 46%", "Zinc 21%", "Potash 50%"  a single named nutrient
 *
 * Returns null where the string names a purpose rather than a composition — "Bio-stimulant",
 * "Soil Conditioner", "Micronutrients", "Magnesium". Null is the honest answer there and the
 * caller reports it; a zero would read as "supplies nothing", which is a different claim.
 */
export function parseAnalysis(analysis: string): NutrientTotals | null {
  if (!analysis) return null
  const out: NutrientTotals = {}

  // "NPK 10-44-0" or "NPK 11.0.44" — three figures, N then P₂O₅ then K₂O.
  const npk = analysis.match(/NPK\s*(\d+(?:\.\d+)?)\s*[-.]\s*(\d+(?:\.\d+)?)\s*[-.]\s*(\d+(?:\.\d+)?)/i)
  if (npk) {
    const [n, p, k] = [Number(npk[1]), Number(npk[2]), Number(npk[3])]
    if (n) out.N = n
    if (p) out.P = p
    if (k) out.K = k
    return Object.keys(out).length ? out : null
  }

  /**
   * Otherwise: scan for NAME-then-PERCENTAGE pairs across the whole string.
   *
   * Pairing matters, and the first version of this got it wrong. Splitting the string into parts
   * and taking "the first percentage in this part" read V-Compost's "OM 25% + N 5%" as nitrogen 25%
   * — five times the real figure — because "+" is not one of the separators the plans use and the
   * 25 belonged to the organic matter. Reading name and number as a pair cannot make that mistake.
   */
  const NAMES: [RegExp, Nutrient][] = [
    [/^(?:P₂O₅|P2O5|phosphate|phosphorus|P)$/i, 'P'],
    [/^(?:K₂O|K2O|potash|potassium|K)$/i, 'K'],
    [/^(?:sulfur|sulphur|S)$/i, 'S'],
    [/^(?:zinc|Zn)$/i, 'Zn'],
    [/^(?:boron|B)$/i, 'B'],
    [/^(?:magnesium|MgO|Mg)$/i, 'Mg'],
    [/^(?:iron|Fe)$/i, 'Fe'],
    [/^(?:manganese|Mn)$/i, 'Mn'],
    [/^(?:copper|Cu)$/i, 'Cu'],
    [/^(?:nitrogen|N)$/i, 'N'],
  ]
  // A name is the word or symbol immediately before the number: "Potash 3.5%", "Mg 8.5%", "N 46%".
  // Anything else in front of a number — "OM", "Humic Acid", "Ca", "Liquid" — matches nothing and
  // that percentage is dropped rather than attached to whatever nutrient appears nearby.
  const re = /([A-Za-z₂₅0-9]+)\s*(\d+(?:\.\d+)?)\s*%/g
  let m: RegExpExecArray | null
  while ((m = re.exec(analysis)) !== null) {
    const word = m[1]
    const value = Number(m[2])
    const hit = NAMES.find(([r]) => r.test(word))
    if (hit) out[hit[1]] = (out[hit[1]] ?? 0) + value
  }
  return Object.keys(out).length ? out : null
}

export type SupplyLine = {
  product: string
  slug: string | null
  commodity: boolean
  analysis: string
  /** Packs per acre, from the published rate. */
  packs: number
  packKg: number
  measure: string
  contributes: NutrientTotals
}

export type Supply = {
  /** Kilograms of each nutrient the ticked stages deliver, per acre. */
  perAcre: NutrientTotals
  lines: SupplyLine[]
  /** Products whose plan row names a purpose, not a composition. Counted as nothing, named as such. */
  uncounted: { product: string; analysis: string }[]
  /** True where any counted line was a litre pack — the one-litre-is-one-kilogram assumption applies. */
  usedLitreAssumption: boolean
  /**
   * Rows the published plan gives PER TREE rather than per acre — mango's five, and any other
   * orchard row on that basis. They carry real nutrients and they are deliberately NOT in the
   * per-acre total, because turning a per-tree dose into a per-acre one needs the orchard's tree
   * count, which is the grower's number and not ours. Named so the total is not read as complete.
   */
  perPlantRows: { product: string; rate: string }[]
  /** Age-band plans (date palm) apply ONE band at a time. This is the band that was counted. */
  ageBand: string | null
}

/**
 * What one acre of a crop's published programme delivers, for the stages given.
 *
 * Everything is per acre; `buildList` is called with acres = 1 deliberately, so a caller scaling to
 * a field multiplies once, at the point where the reader can see it happen.
 */
export function programmeSupply(cropKey: string, stages: Set<string>): Supply {
  const cp = CROP_PLANS[cropKey]
  if (!cp) return { perAcre: {}, lines: [], uncounted: [], usedLitreAssumption: false, perPlantRows: [], ageBand: null }

  const analysisFor = new Map<string, string>()
  for (const r of cp.plan as PlanRow[]) if (!analysisFor.has(r.product)) analysisFor.set(r.product, r.analysis)

  const perAcre: NutrientTotals = {}
  const lines: SupplyLine[] = []
  const uncounted: { product: string; analysis: string }[] = []
  let litres = false

  // A per-tree rate is not a per-acre one and the two must never be added. The plan's own `basis`
  // field marks them; they are reported separately rather than silently dropped or multiplied.
  const perPlantRows = (cp.plan as PlanRow[])
    .filter(r => r.basis === 'plant' && stages.has(r.stage))
    .map(r => ({ product: r.product, rate: r.rate }))
    .filter((v, i, a) => a.findIndex(x => x.product === v.product && x.rate === v.rate) === i)

  for (const l of buildList(stages, 1, cp.plan)) {
    const analysis = analysisFor.get(l.product) ?? l.analysis
    const pct = parseAnalysis(analysis)
    if (!pct) {
      if (!uncounted.some(u => u.product === l.product)) uncounted.push({ product: l.product, analysis })
      continue
    }
    if (l.measure && l.measure.toUpperCase() === 'L') litres = true
    const kg = l.units * l.size            // packs × pack size; a litre is taken as a kilogram
    const contributes: NutrientTotals = {}
    for (const n of NUTRIENTS) {
      const p = pct[n]
      if (!p) continue
      const amount = (kg * p) / 100
      contributes[n] = amount
      perAcre[n] = (perAcre[n] ?? 0) + amount
    }
    lines.push({ product: l.product, slug: l.slug, commodity: l.commodity, analysis, packs: l.units, packKg: l.size, measure: l.measure, contributes })
  }

  return { perAcre, lines, uncounted, usedLitreAssumption: litres, perPlantRows, ageBand: cp.mode === 'age' ? [...stages][0] ?? null : null }
}

/**
 * The stages a balance is read over.
 *
 * For an ordinary programme that is the whole season — every stage, because the crop passes through
 * all of them. For an AGE-BAND programme (date palm) it is emphatically NOT: those bands are a
 * palm's age, exactly one applies, and adding a young palm's dose to a mature palm's produced 334 kg
 * of nitrogen an acre the first time this was run. The mature band is the default, matching the
 * shopping list's own default, and a caller wanting another band passes it.
 */
export function allStages(cropKey: string): Set<string> {
  const cp = CROP_PLANS[cropKey]
  if (!cp) return new Set()
  if (cp.mode === 'age') return new Set([cp.stages[cp.stages.length - 1]])
  return new Set(cp.stages)
}
