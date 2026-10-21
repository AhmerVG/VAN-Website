/**
 * Reading a published rate and a published pack. Pure arithmetic, no data imports, so that the plan
 * data itself (data/catalogue.ts) can use it without a circular import. Moved out of lib/season.ts
 * on 21 Oct 2026 (D-292); season.ts re-exports both functions, so no caller changes.
 */
/**
 * How many PACKS a published rate means.
 *
 * Rewritten 8 Sep 2026 after the shopping list was found mis-counting. The old version read the
 * leading integer and nothing else, which broke four ways at once:
 *   "400 g"      -> 400 packs   (it was a weight, not a count — citrus costed at PKR 1.46m/acre)
 *   "¼ bag"      -> 0 packs     (the product vanished from the list entirely)
 *   "1/5 pack"   -> 1 pack      (five times too much)
 *   "1.5 bag"    -> 1 bag       (decimals truncated)
 *   "½ bag + 1 bag (two applications)" -> 0.5 (the second application was dropped)
 *
 * The rules now: unicode and ASCII fractions are read; every "+"- or ";"-joined term is summed, so a
 * split application counts both halves; a rate given as a WEIGHT or VOLUME is converted to packs
 * using that product's own pack size; and a range ("1-2 bag") takes the LOW end, because the plan
 * table beside it shows the range and buying a farmer more than VAN's own minimum without saying so
 * is not ours to decide.
 *
 * Arithmetic only — the published rate and the published pack size, nothing inferred.
 */
const FRACTIONS: Record<string, number> = {
  '½': 0.5, '¼': 0.25, '¾': 0.75, '⅓': 1 / 3, '⅔': 2 / 3,
  '⅕': 0.2, '⅖': 0.4, '⅗': 0.6, '⅘': 0.8, '⅙': 1 / 6, '⅛': 0.125,
}
/** grams and millilitres are converted to the pack's own measure; a pack is never a weight. */
const TO_PACK_MEASURE: Record<string, { measure: 'kg' | 'L'; factor: number }> = {
  g: { measure: 'kg', factor: 0.001 }, kg: { measure: 'kg', factor: 1 },
  ml: { measure: 'L', factor: 0.001 }, l: { measure: 'L', factor: 1 },
}

export function rateUnits(rate: string, pack?: string): number {
  if (!rate) return 0
  let s = rate.toLowerCase()
  // 11 Sep 2026 · a MIXED number, "1½ bag" or "4¼ pack", used to lose its fraction: the glyph became
  // a second number in the same term and only the first number was read, so 4¼ read as 4. One row
  // already on the site ("1½ bag") had been reading as 1 since it was transcribed, and the V-Zinc
  // rows added today are mostly mixed numbers. A whole number glued to a fraction is now one value.
  for (const [glyph, value] of Object.entries(FRACTIONS)) {
    s = s.replace(new RegExp(`(\\d+)\\s*${glyph}`, 'g'), (_, whole) => String(Number(whole) + value))
    s = s.split(glyph).join(` ${value} `)
  }
  // A range means the low end: "1-2 bag", "1 to 2 bag", "3–5 trolleys".
  s = s.replace(/(\d+(?:\.\d+)?)\s*(?:-|–|. |to)\s*(\d+(?:\.\d+)?)/g, '$1')

  const p = pack ? packInfo(pack) : null
  let total = 0
  for (const term of s.split(/[;+]/)) {
    const m = term.match(/(\d+(?:\.\d+)?)\s*\/\s*(\d+(?:\.\d+)?)|(\d+(?:\.\d+)?)/)
    if (!m) continue
    const qty = m[1] ? Number(m[1]) / Number(m[2]) : Number(m[3])
    if (!isFinite(qty) || qty <= 0) continue
    // What follows the number decides whether it is a count of packs or a weight/volume.
    const after = term.slice((m.index ?? 0) + m[0].length).trim()
    const unit = after.match(/^(kg|g|ml|l)\b/)?.[1]
    const conv = unit ? TO_PACK_MEASURE[unit] : undefined
    if (conv && p && p.size > 0 && p.measure.toLowerCase() === conv.measure.toLowerCase()) {
      total += (qty * conv.factor) / p.size
    } else {
      total += qty
    }
  }
  return total
}
export function packInfo(pack: string): { unit: 'bag' | 'pack'; size: number; measure: string; label: string } {
  const unit = /^pack/i.test(pack) ? 'pack' : 'bag'
  const m = pack.match(/(\d+(?:\.\d+)?)\s*(kg|L)/i)
  const size = m ? parseFloat(m[1]) : 0
  const measure = m ? m[2] : ''
  return { unit, size, measure, label: m ? `${size} ${measure}` : pack }
}
