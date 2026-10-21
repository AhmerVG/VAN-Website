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
export { rateUnits, packInfo } from './rateUnits'
import { rateUnits, packInfo } from './rateUnits'

export function fmtUnits(n: number) {
  // D-286: this rounded down to the half, so 0.75 of a bag printed "½" (canola Vital Potash, "½ bag ·
  // 15 kg" beside a ¾ bag plan). It now reads to the nearest quarter. Revert: put back the half-only version.
  const whole = Math.floor(n)
  const f = n - whole
  // D-151: a quantity above 0 but under half a pack printed "0" (citrus VL-Boron, 0.2 L).
  if (whole === 0 && n > 0 && f < 0.375) return 'under ½'
  if (f >= 0.875) return `${whole + 1}`
  const frac = f >= 0.625 ? '¾' : f >= 0.375 ? '½' : f >= 0.125 ? '¼' : ''
  return `${whole || ''}${frac}` || '0'
}
export function fmtQty(n: number, unit: 'bag' | 'pack') {
  return `${fmtUnits(n)} ${unit}${n >= 1.125 ? 's' : ''}`
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
/**
 * D-286: plan rates were stored as typed on the PDFs: "2 Pack", "1 to 2 bag", "½ Bag". Shown as they
 * stand they read "2 Pack" next to "1 pack" and "5 bag". This sets the unit word in lower case and
 * pluralises it when the quantity (the upper end of a range) is above 1: "2 packs", "1 to 2 bags",
 * "1½ bags", "½ bag", "0.3 pack". Display only: the stored strings, and rateUnits() which parses
 * them, are untouched. Revert: delete this function and the call in rateLabel.
 */
const VULGAR: Record<string, number> = { '½': 0.5, '¼': 0.25, '¾': 0.75 }
function qtyValue(q: string): number {
  const m = q.match(/^(\d+)?\s*([½¼¾])$/)
  if (m) return Number(m[1] ?? 0) + VULGAR[m[2]]
  const f = q.match(/^(\d+)\/(\d+)$/)
  if (f) return Number(f[1]) / Number(f[2])
  return Number(q)
}
export function tidyUnits(text: string): string {
  const Q = '(?:\\d+\\s*[½¼¾]|[½¼¾]|\\d+\\/\\d+|\\d+(?:\\.\\d+)?)'
  const re = new RegExp(`(${Q})(?:(\\s*(?:to|-|–)\\s*)(${Q}))?(\\s*)(bag|pack)s?\\b`, 'gi')
  return text.replace(re, (_m, a: string, sep: string | undefined, b: string | undefined, sp: string, unit: string) => {
    const top = qtyValue((b ?? a).replace(/\s+/g, ''))
    const word = unit.toLowerCase() + (top > 1 ? 's' : '')
    return `${a}${sep ?? ''}${b ?? ''}${sp}${word}`
  })
}

export function rateLabel(r: Pick<PlanRow, 'rate' | 'basis'>): string {
  const rate = tidyUnits(r.rate.replace(/\s*dose\s*$/i, '').trim())
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
