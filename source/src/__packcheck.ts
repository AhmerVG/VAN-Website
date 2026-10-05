/**
 * PACK CHECK — added 10 September 2026, after garlic.
 *
 * Tahir: "Garlic 5 kg, is 1/4 bag of same 20 kg bag." Garlic's Crop Force row was written against a
 * 5 kg bag that VAN does not register, so the row could not be costed and that one line on that one
 * page said "ask on WhatsApp" instead of a price. It is the same fault as sugarcane's Green Sulfur
 * on 9 September: a fraction of a bag read against the wrong bag size.
 *
 * Two faults hide in the same place, so this checks for both across all 28 programmes:
 *   1. A plan row whose pack is NOT one of the sizes VAN prices for that product.
 *   2. A plan row that IS priced, so you can see the ones that are fine.
 *
 * It reports rather than fixes. Which bag a rate was meant against is agronomy, and it is his call.
 */
import { CROP_PLANS } from '@/data/catalogue'
import { FARMER_PRICE } from '@/data/pricing'

const packSize = (pack: string): number | null => {
  const m = pack.match(/([\d.]+)\s*(kg|l|litre|liter)/i)
  return m ? parseFloat(m[1]) : null
}

let bad = 0, ok = 0, unpriced = 0
const rows: string[] = []
const blank: string[] = []

for (const [crop, plan] of Object.entries(CROP_PLANS)) {
  for (const r of plan.plan) {
    if (!r.slug || r.commodity) continue
    const sizes = FARMER_PRICE[r.slug]
    if (!sizes) { unpriced++; continue }          // product carries no price at all; a separate question
    const want = packSize(String(r.pack))
    if (want == null) { blank.push(`${crop.padEnd(18)} ${String(r.product).padEnd(34)} pack is EMPTY, rate "${r.rate}"`); continue }
    if (sizes.some(p => Math.abs(p.size - want) < 0.01)) { ok++; continue }
    bad++
    rows.push(
      `${crop.padEnd(18)} ${String(r.product).padEnd(34)} pack "${r.pack}" rate "${r.rate}"` +
      `  -> VAN prices ${sizes.map(p => p.size + p.unit).join(' / ')}`,
    )
  }
}

console.log('=== PLAN ROWS WHOSE PACK IS NOT A PRICED SIZE ===')
if (!rows.length) console.log('  none')
for (const r of rows) console.log('  ' + r)
console.log('\n=== PLAN ROWS WITH NO PACK AT ALL ===')
if (!blank.length) console.log('  none')
for (const r of blank) console.log('  ' + r)
console.log(`\n${ok} rows cost cleanly · ${bad} rows cannot be costed · ${unpriced} rows on products with no price at all`)
