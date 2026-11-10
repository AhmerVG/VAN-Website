import { MASTER_PRODUCTS } from './pricing'

/**
 * ALTERNATE PRODUCTS — Tahir's ruling, 9 September 2026.
 *
 * *"Fusion Phosphate is optional, always shown as a choice between Green Phosphate and Fusion
 * Phosphate. No change in nutrition plan or PDF — just show as alternate option."*
 *
 * So this is a PRESENTATION layer and nothing else. No crop plan row changes, no PDF changes, no
 * published rate changes. Where a programme names Green Phosphate, the site also names Fusion
 * Phosphate as the other way to buy that line, and the farmer picks.
 *
 * WHY THE DIFFERENCE IS PRINTED RATHER THAN GLOSSED OVER. These two are not the same bag:
 *
 *   Green Phosphate   6:32:0, humic-coated acidic   50 kg bag →  16.0 kg P₂O₅  + 3.0 kg N
 *   Fusion Phosphate  TSP, P₂O₅ 46%                 50 kg bag →  23.0 kg P₂O₅  + no nitrogen
 *
 * Bag for bag, Fusion Phosphate carries about 44% more phosphate and no nitrogen, and it has none of
 * the humic coating that Green Phosphate is built around. Offering a swap without saying that would
 * be the same class of error as a per-tree rate sitting in a per-acre column: two numbers that look
 * interchangeable and are not. The rate is NOT recalculated when a farmer switches — the published
 * plan is the published plan, and adjusting it silently would be changing VAN's own agronomy in the
 * browser. The site states the difference and leaves the decision where it belongs.
 */
export type Alternative = {
  /** The product a plan names. */
  slug: string
  /** The product offered beside it. */
  altSlug: string
  altName: string
  /** One line, farmer-facing, on what actually differs. */
  difference: string
}

// L1 7 Nov 2026 (m15): "the humic-coated, acidic grade" now says which range it is a grade of.
export const ALTERNATIVES: Alternative[] = [
  {
    slug: 'green-phosphate',
    altSlug: 'fusion-phosphate',
    altName: 'Fusion Phosphate',
    // Settled PR-10 (L2 fact check 9 Nov 2026, W4): Green Phosphate has a 35 kg and a 50 kg bag. Was 'Both products come in the same bag size, but they contain ...'.
    difference: 'Both products come in a 50 kg bag, and Green Phosphate also comes in 35 kg. They contain different amounts of phosphate and nitrogen. Fusion Phosphate is TSP (triple superphosphate) at 46% P₂O₅: a 50 kg bag carries 23 kg of P₂O₅ and no nitrogen. A 50 kg bag of Green Phosphate (6:32:0) carries 16 kg of P₂O₅ and 3.0 kg of nitrogen. Green Phosphate is the humic-coated, acidic 6:32 grade of the VAN NP Range, made for alkaline soil. If you switch, the plan’s number of bags stays the same, but the amount of phosphate and nitrogen you apply changes.',
  },
]

export function alternativeFor(slug: string | null): Alternative | undefined {
  return slug ? ALTERNATIVES.find(a => a.slug === slug) : undefined
}

// Tahir 10 Nov 2026 (R3-7): no Fusion Phosphate choice on a Green Phosphate row applied by fertigation
// (banana, tomato and any other row whose method names fertigation). Other rows keep the choice.
export function offersAlternative(method: string): boolean {
  return !/fertigation/i.test(method)
}

/** kg of a nutrient in one pack of a product, read off its registered analysis. Nothing inferred. */
export function nutrientPerPack(slug: string, nutrient: string, packKg: number): number {
  const rows = MASTER_PRODUCTS.filter(m => m.slug === slug)
  const m = rows.length > 1 ? rows.find(x => Math.abs(x.packKg - packKg) < 0.001) ?? rows[0] : rows[0]
  if (!m) return 0
  return (packKg * (m.analysisPct[nutrient] ?? 0)) / 100
}
