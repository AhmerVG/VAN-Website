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
 *   Green Phosphate   6-32-0, humic-coated acidic   50 kg bag →  16.0 kg P₂O₅  + 3.0 kg N
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

export const ALTERNATIVES: Alternative[] = [
  {
    slug: 'green-phosphate',
    altSlug: 'fusion-phosphate',
    altName: 'Fusion Phosphate',
    difference: 'Same bag size, different bag. Fusion Phosphate is TSP at 46% P₂O₅. About 44% more phosphate per bag than Green Phosphate’s 6-32-0, and no nitrogen with it. Green Phosphate is the humic-coated acidic grade, built for alkaline ground. The plan’s number of bags does not change if you switch; what you put on the field does.',
  },
]

export function alternativeFor(slug: string | null): Alternative | undefined {
  return slug ? ALTERNATIVES.find(a => a.slug === slug) : undefined
}

/** kg of a nutrient in one pack of a product, read off its registered analysis. Nothing inferred. */
export function nutrientPerPack(slug: string, nutrient: string, packKg: number): number {
  const rows = MASTER_PRODUCTS.filter(m => m.slug === slug)
  const m = rows.length > 1 ? rows.find(x => Math.abs(x.packKg - packKg) < 0.001) ?? rows[0] : rows[0]
  if (!m) return 0
  return (packKg * (m.analysisPct[nutrient] ?? 0)) / 100
}
