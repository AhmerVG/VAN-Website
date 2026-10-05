import { CROPS, WHEAT_PLAN, type Crop, type PlanRow } from '@/data/catalogue'
import { CROP_LMS } from '@/data/cropLms'

export const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
export const MONTHS_LONG = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

export type Window = { start: number; end: number } // month index 0–11, inclusive; may wrap (Dec–Feb)

/** Parse the live site's sowing text: "Oct–Nov sowing", "Feb / Jun–Jul sowing", "Dec–Feb sowing". */
export function parseSowing(s: string): Window[] {
  const t = s.replace(/sowing/i, '').trim()
  return t.split('/').map(p => p.trim()).filter(Boolean).map(p => {
    const [a, b] = p.split(/[–-]/).map(x => x.trim())
    const start = MONTHS.indexOf(a)
    const end = b ? MONTHS.indexOf(b) : start
    return { start: start < 0 ? 0 : start, end: end < 0 ? start : end }
  })
}

export function inWindow(w: Window, m: number) {
  if (w.start <= w.end) return m >= w.start && m <= w.end
  return m >= w.start || m <= w.end
}
export function windowLabel(w: Window) {
  return w.start === w.end ? MONTHS[w.start] : `${MONTHS[w.start]}–${MONTHS[w.end]}`
}
export function sowingLabel(c: Crop) {
  return parseSowing(c.sowing).map(windowLabel).join(' / ')
}

export function cropSlug(c: Crop) { return c.page.replace(/\.html$/, '') }
export function cropBySlug(slug: string) { return CROPS.find(c => cropSlug(c) === slug) }
export function cropPdf(c: Crop) { return `https://www.van.com.pk/${c.pdf}` }
/** D-133: the crop's training deck, when it has one (see data/cropLms.ts); null otherwise. */
export function cropLms(c: Crop): { href: string; label: string } | null { const e = CROP_LMS[cropSlug(c)]; return e ? { href: `https://www.van.com.pk/lms/${e.file}.pdf`, label: e.label } : null }

export const GROUP_ORDER = ['cereal', 'oil', 'pulse', 'veg', 'fruit']
export function groupedCrops(list: Crop[] = CROPS) {
  return GROUP_ORDER.map(g => ({ group: g, label: list.find(c => c.group === g)?.groupLabel ?? CROPS.find(c => c.group === g)?.groupLabel ?? g, crops: list.filter(c => c.group === g) })).filter(x => x.crops.length)
}
// D-151 (QA 6): veg was #1F6FB2 (blue) and fruit #C0392B (red), outside VAN's palette; now navy-2 and rust.
export const GROUP_COLOUR: Record<string, string> = { cereal: '#2E7D4F', oil: '#B97F1C', pulse: '#7A5230', veg: '#1B4A6B', fruit: '#B5522A' }
/** D-151: the same groups as TEXT on sand or white (>= 4.5:1): deeper shades of the same VAN hues. */
export const GROUP_TEXT: Record<string, string> = { cereal: '#276B43', oil: '#8A5D0F', pulse: '#7A5230', veg: '#1B4A6B', fruit: '#9A3F1C' }

export function currentMonth() { return new Date().getMonth() }

/** Crops whose sowing window includes this month, and those whose window opens next month. */
export function sowingNowNext(month = currentMonth()) {
  const now = CROPS.filter(c => parseSowing(c.sowing).some(w => inWindow(w, month)))
  const next1 = (month + 1) % 12
  let next = CROPS.filter(c => !now.includes(c) && parseSowing(c.sowing).some(w => w.start === next1))
  if (!next.length) {
    const next2 = (month + 2) % 12
    next = CROPS.filter(c => !now.includes(c) && parseSowing(c.sowing).some(w => w.start === next2))
  }
  return { now, next }
}

/* ---------- Plan maths (arithmetic only: published rate × acres) ---------- */
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
export function fmtUnits(n: number) {
  const whole = Math.floor(n)
  const half = n - whole >= 0.5
  if (whole === 0 && half) return '½'
  // D-151: a quantity above 0 but under half a pack printed "0" (citrus VL-Boron, 0.2 L). Revert: delete.
  if (whole === 0 && n > 0) return 'under ½'
  return `${whole}${half ? '½' : ''}`
}
export function fmtQty(n: number, unit: 'bag' | 'pack') {
  return `${fmtUnits(n)} ${unit}${n > 1 ? 's' : ''}`
}

export type ListLine = { key: string; product: string; slug: string | null; commodity: boolean; analysis: string; pack: string; unit: 'bag' | 'pack'; size: number; measure: string; units: number; stages: string[] }

/**
 * A rate published PER TREE rather than per acre — mango's five. It has no acreage quantity and no
 * cost, because neither exists until the orchard's tree count is known, and that calculation is
 * VGreen's. Shown to the farmer as what it is, never multiplied by acres.
 */
export type PlantLine = { key: string; product: string; slug: string | null; analysis: string; rate: string; pack: string; stage: string; method: string }
/**
 * The published rate as a farmer should read it, with its basis attached. A rate with no `basis` is
 * per acre, which is how the site works, so it needs no suffix. The two exceptions must never be
 * printed bare: a per-tree dose and a per-200-litre spray concentration look identical to a per-acre
 * quantity on the page, and that is exactly the confusion that made mango cost a fifth of wheat.
 */
export function rateLabel(r: Pick<PlanRow, 'rate' | 'basis'>): string {
  const rate = r.rate.replace(/\s*dose\s*$/i, '').trim()
  if (r.basis === 'plant') return `${rate} per plant`
  if (r.basis === 'per200L') return `${rate} per 200 L water`
  return rate
}
export function hasSprayBasis(stages: Set<string>, rows: PlanRow[]): boolean {
  return rows.some(r => r.basis === 'per200L' && stages.has(r.stage))
}
export function buildPlantDoses(stages: Set<string>, rows: PlanRow[]): PlantLine[] {
  return rows
    .filter(r => r.basis === 'plant' && stages.has(r.stage))
    .map(r => ({ key: `${r.product}|${r.stage}|${r.rate}`, product: r.product, slug: r.slug, analysis: r.analysis, rate: r.rate, pack: r.pack, stage: r.stage, method: r.method }))
}
export function buildList(stages: Set<string>, acres: number, rows: PlanRow[] = WHEAT_PLAN): ListLine[] {
  const map = new Map<string, ListLine>()
  for (const r of rows) {
    if (!stages.has(r.stage)) continue
    if (r.basis === 'plant') continue   // per-tree dose. See buildPlantDoses
    const key = `${r.product}|${r.pack}`
    const p = packInfo(r.pack)
    const line = map.get(key) ?? { key, product: r.product, slug: r.slug, commodity: r.commodity, analysis: r.analysis, pack: r.pack, unit: p.unit, size: p.size, measure: p.measure, units: 0, stages: [] }
    line.units += rateUnits(r.rate, r.pack)
    if (!line.stages.includes(r.stage)) line.stages.push(r.stage)
    map.set(key, line)
  }
  return [...map.values()].map(l => ({ ...l, units: l.units * acres })).sort((a, b) => Number(a.commodity) - Number(b.commodity))
}
