import { rateUnits, packInfo } from './rateUnits'

/**
 * GREEN SULFUR: ONE QUANTITY IN KG, ONE PACK PER CROP. D-292, 21 Oct 2026, Tahir's ruling.
 *
 * VAN sells Green Sulfur in 1 kg and 20 kg packs (the price list also has a 5 kg pack, which no
 * plan uses after this rule). The published plans mixed them: "5 bag" of 1 kg in one crop, "¼ bag"
 * of 20 kg in another, "1 bag" of 5 kg in a third, all meaning the same 5 kg.
 *
 * His rule: a dose of 5 kg or less in an application is bought as 1 kg packs; a dose of more than
 * 5 kg is bought as the 20 kg bag. A crop has one shopping line for Green Sulfur, so the rule is read
 * per crop: if ANY application in the crop's plan is more than 5 kg, the crop's line is the 20 kg bag.
 * Otherwise it is 1 kg packs. Every plan row then says its dose in kg ("5 kg", "1.5 kg", "10 kg").
 *
 * The kilograms never change, only how they are written and which pack carries them, so the
 * nutrient totals, the costs per kg and the bags to buy still add up to the same sulfur.
 * Revert: delete the call to applySulfurRule in data/catalogue.ts and normaliseSulfurCost in
 * data/costPlans.ts.
 */
export const SULFUR_SPLIT_KG = 5
const SULFUR = 'Green Sulfur'

type Row = { product: string; rate: string; pack: string }
const kgOf = (r: Row) => rateUnits(r.rate, r.pack) * packInfo(r.pack).size
const fmt = (n: number) => String(Number(n.toFixed(2)))

/** Rewrites a crop plan in place. Returns the pack size chosen (1 or 20), or null if the crop has no Green Sulfur. */
export function applySulfurRule(plan: Row[]): 1 | 20 | null {
  const rows = plan.filter(r => r.product === SULFUR)
  if (!rows.length) return null
  const big = rows.some(r => kgOf(r) > SULFUR_SPLIT_KG + 1e-9)
  for (const r of rows) {
    // Only a plain single dose is rewritten. A range, a "+" sum or a per-plant / per-200 L basis is left as printed.
    if (/[+;]|\bto\b|\d\s*[-–]\s*\d/i.test(r.rate) || (r as { basis?: string }).basis) continue
    const kg = kgOf(r)
    if (!(kg > 0)) continue
    const tail = r.rate.match(/\s+in\s+[A-Za-z]+\s*$/i)?.[0] ?? ''   // "in April" stays
    r.rate = `${fmt(kg)} kg${tail}`
    r.pack = big ? 'Bag - 20 kg' : 'Pack - 1 kg'
  }
  return big ? 20 : 1
}

type CostRowLike = { product: string; packKg: number; qtyPerAcre: number; unitPricePkr: number }
/**
 * The calculator's Green Sulfur row, in the same pack as the crop's plan. Same kilograms. A row that
 * carried a price keeps one: the price of the new pack from the price list, or 0 if there is none.
 */
export function normaliseSulfurCost<T extends CostRowLike>(rows: T[], packKg: 1 | 20 | null, priceOf?: (packKg: number) => number | undefined): T[] {
  if (!packKg) return rows
  return rows.map(r => {
    if (r.product !== SULFUR) return r
    const kg = r.packKg * r.qtyPerAcre
    const unitPricePkr = r.unitPricePkr > 0 ? (priceOf?.(packKg) ?? 0) : 0
    return { ...r, packKg, qtyPerAcre: Number((kg / packKg).toFixed(4)), unitPricePkr }
  })
}
