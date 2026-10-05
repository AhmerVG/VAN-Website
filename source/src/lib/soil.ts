// Helpers over the Punjab soil survey module. Every figure shown on the site is read from SOIL / SOIL_GRID;
// nothing here invents a number — it formats, looks up, and sums what the module already carries.
import { SOIL, SOIL_GRID, type BandStats, type District, type GridCell } from '@/data/soil'
import { SOIL_MEDIANS } from '@/data/soilMedians'

export type AnalyteKey = 'ph' | 'om' | 'p' | 'k' | 'zn' | 'caco3' | 'b' | 'ec'

/** Colour scales, sequential, one per analyte. `lo`/`hi` name the legend ends (values are clamped to them). */
export const ANALYTES: { key: AnalyteKey; label: string; short: string; unit: string; lo: number; hi: number; dec: number; stops: string[]; note: string }[] = [
  { key: 'ph', label: 'pH', short: 'pH', unit: '', lo: 7.4, hi: 8.8, dec: 2, stops: ['#2E7D4F', '#E3A93C', '#B5522A'], note: 'green below 7.5, gold around 8, rust above 8.5' },
  { key: 'om', label: 'Organic matter', short: 'OM', unit: '%', lo: 0.3, hi: 1.0, dec: 2, stops: ['#F3EDDD', '#C9A86A', '#5A3A20'], note: 'sand where there is almost none, deep brown at 1%' },
  { key: 'p', label: 'Phosphorus, available', short: 'P', unit: 'ppm', lo: 3, hi: 12, dec: 1, stops: ['#B5522A', '#E3A93C', '#2E7D4F'], note: 'rust where short (below 7 ppm), green towards adequate (15)' },
  { key: 'k', label: 'Potash, available', short: 'K', unit: 'ppm', lo: 60, hi: 200, dec: 0, stops: ['#B5522A', '#E3A93C', '#2E7D4F'], note: 'rust where short (below 180 ppm), green above' },
  { key: 'zn', label: 'Zinc', short: 'Zn', unit: 'ppm', lo: 0.3, hi: 2.0, dec: 2, stops: ['#B5522A', '#E3A93C', '#2E7D4F'], note: 'rust below 1.0 ppm, green above' },
  { key: 'caco3', label: 'Calcium carbonate', short: 'CaCO₃', unit: '%', lo: 1, hi: 14, dec: 1, stops: ['#FBF7EE', '#9FB8CC', '#0E3550'], note: 'pale where there is little carbonate, navy where it is heavy' },
  { key: 'b', label: 'Boron', short: 'B', unit: 'ppm', lo: 0.2, hi: 1.2, dec: 2, stops: ['#B5522A', '#E3A93C', '#2E7D4F'], note: 'rust below 0.5 ppm, green above' },
  { key: 'ec', label: 'Electrical conductivity', short: 'EC', unit: 'dS/m', lo: 0, hi: 6, dec: 2, stops: ['#DCEBF5', '#E3A93C', '#B5522A'], note: 'sky where fresh, rust where saline (above 4 dS/m)' },
]
export const analyteByKey = (k: AnalyteKey) => ANALYTES.find(a => a.key === k)!

function hex(c: string): [number, number, number] { return [parseInt(c.slice(1, 3), 16), parseInt(c.slice(3, 5), 16), parseInt(c.slice(5, 7), 16)] }
export function rampRgb(stops: string[], t: number): [number, number, number] {
  const tt = Math.max(0, Math.min(1, t))
  const n = stops.length - 1
  const i = Math.min(n - 1, Math.floor(tt * n))
  const f = tt * n - i
  const a = hex(stops[i]), b = hex(stops[i + 1])
  return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f, a[2] + (b[2] - a[2]) * f]
}
export function colourFor(a: AnalyteKey, v: number | null): [number, number, number] | null {
  if (v == null) return null
  const d = analyteByKey(a)
  return rampRgb(d.stops, (v - d.lo) / (d.hi - d.lo))
}
export function rampCss(a: AnalyteKey) { const d = analyteByKey(a); return `linear-gradient(90deg, ${d.stops.join(', ')})` }
export function fmtVal(a: AnalyteKey, v: number | null): string {
  if (v == null) return 'not determined'
  const d = analyteByKey(a)
  return `${v.toFixed(d.dec)}${d.unit ? ' ' + d.unit : ''}`
}

/** Grid geometry: cell (x, y) = floor(lon / 0.05), floor(lat / 0.05). Longitude squeezed by cos(31.5°) so a square on screen is roughly a square on the ground. */
/** D-241: a map square carries its MEDIAN in the analyte fields (what the map colours and the tables
 *  read) and its mean under `.mean`, so the tap tip can show both. */
export type AtlasCell = GridCell & { mean: Pick<GridCell, 'ph' | 'om' | 'p' | 'k' | 'zn' | 'caco3' | 'b' | 'ec'> }
export const GRID = (() => {
  const cells: AtlasCell[] = SOIL_GRID.cells.map((c, i) => {
    const row = SOIL_MEDIANS.cells[i]
    const med: Record<string, number | null> = {}
    SOIL_MEDIANS.gridOrder.forEach((a, j) => { med[a] = row[j] })
    return { ...c, ...med, mean: { ph: c.ph, om: c.om, p: c.p, k: c.k, zn: c.zn, caco3: c.caco3, b: c.b, ec: c.ec } }
  })
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity
  for (const c of cells) { if (c.x < minX) minX = c.x; if (c.x > maxX) maxX = c.x; if (c.y < minY) minY = c.y; if (c.y > maxY) maxY = c.y }
  const cols = maxX - minX + 1, rows = maxY - minY + 1
  const byKey = new Map<string, AtlasCell>()
  for (const c of cells) byKey.set(`${c.x},${c.y}`, c)
  return { cells, minX, maxX, minY, maxY, cols, rows, byKey, xScale: Math.cos((31.5 * Math.PI) / 180), deg: SOIL_GRID.cell_deg }
})()

export const DISTRICTS: District[] = SOIL.districts

/**
 * D-241, Tahir 1 Oct 2026: the Atlas classifies the MEDIAN, and shows the mean beside it. medianStats()
 * returns the same shape as a summary (so every reader of BandStats works unchanged) with the analyte
 * fields replaced by the median. The shares (ph_gt75 and the rest) are counts over samples and stay as
 * they are. key null = Punjab, all 770,160 samples pooled.
 */
export function medianStats(s: BandStats, key: string | null): BandStats {
  const m = key ? SOIL_MEDIANS.districts[key] : SOIL_MEDIANS.province
  return m ? ({ ...s, ...m } as BandStats) : s
}
export const districtByKey = (k: string | null | undefined) => (k ? DISTRICTS.find(d => d.key === k) ?? null : null)
export const districtName = (k: string) => districtByKey(k)?.name ?? k

/** Province histograms = the 36 district histograms summed (the module carries them per district). */
export const PROVINCE_HIST = (() => {
  const sum = (key: 'ph' | 'om' | 'p') => {
    const n = SOIL.hist_bins[key].length - 1
    const out = new Array<number>(n).fill(0)
    for (const d of DISTRICTS) for (let i = 0; i < n; i++) out[i] += d.hist[key][i] ?? 0
    return out
  }
  return { ph: sum('ph'), om: sum('om'), p: sum('p') }
})()

export type Band = { key: string; label: string; stats: BandStats }
export const X_AXES: { key: 'phband' | 'omband' | 'cacoband' | 'texture'; label: string; short: string; caption: string }[] = [
  { key: 'phband', label: 'pH band', short: 'pH', caption: 'pH bands 7.0–7.5 · 7.5–8.0 · 8.0–8.5 · ≥ 8.5' },
  { key: 'omband', label: 'Organic-matter band', short: 'OM', caption: 'organic matter bands, %' },
  { key: 'cacoband', label: 'Calcium-carbonate band', short: 'CaCO₃', caption: 'calcium carbonate bands, %' },
  { key: 'texture', label: 'Texture class', short: 'Texture', caption: 'texture classes as recorded in the workbooks' },
]
export const Y_AXES: { key: 'caco3' | 'zn' | 'p' | 'k' | 'b' | 'om'; label: string; unit: string; dec: number; colour: string }[] = [
  { key: 'caco3', label: 'Calcium carbonate', unit: '%', dec: 2, colour: '#0E3550' },
  { key: 'zn', label: 'Zinc', unit: 'ppm', dec: 2, colour: '#2E7D4F' },
  { key: 'p', label: 'Phosphorus', unit: 'ppm', dec: 2, colour: '#1B4A6B' },
  { key: 'k', label: 'Potash', unit: 'ppm', dec: 0, colour: '#B97F1C' },
  { key: 'b', label: 'Boron', unit: 'ppm', dec: 2, colour: '#7A5230' },
  { key: 'om', label: 'Organic matter', unit: '%', dec: 2, colour: '#5A3A20' },
]
// Texture classes drawn: the ones with a clean recorded name and at least 3,000 samples. Minor spellings are counted, not drawn.
const TEXTURE_DRAWN = ['loam', 'sandy loam', 'clay loam', 'heavy loam', 'heavy clay', 'sand']
const PH_DRAWN = ['70_75', '75_80', '80_85', 'ge85']

/** The series for an X axis — from the province or one district. Returns the bands to draw and a note about what is left out. */
export function bandsFor(x: (typeof X_AXES)[number]['key'], d: District | null): { bands: Band[]; note: string } {
  if (x === 'texture') {
    const src = d ? d.texture : SOIL.province_texture
    const bands = TEXTURE_DRAWN.filter(k => src[k] && src[k].n > 0).map(k => ({ key: k, label: k, stats: src[k] }))
    const left = Object.entries(src).filter(([k]) => !TEXTURE_DRAWN.includes(k)).reduce((a, [, v]) => a + v.n, 0)
    return { bands, note: left > 0 ? `${left.toLocaleString('en-US')} samples carry minor or truncated texture spellings and are counted but not drawn.` : '' }
  }
  const src = d ? d.bands[x] : SOIL.province_bands[x]
  const labels = SOIL.meta.bands[x]
  const keys = x === 'phband' ? PH_DRAWN : Object.keys(labels)
  const bands = keys.filter(k => src[k] && src[k].n > 0).map(k => ({ key: k, label: labels[k] ?? k, stats: src[k] }))
  const note = x === 'phband' ? `${(src['lt70']?.n ?? 0).toLocaleString('en-US')} samples below pH 7.0 are not drawn (the 4 bands shown carry 99.9% of the province).` : ''
  return { bands, note }
}

export const pct = (v: number | null, dec = 1) => (v == null ? 'n/a' : `${v.toFixed(dec)}%`)
export const num = (v: number | null, dec = 2) => (v == null ? 'n/a' : v.toFixed(dec))
export const thousands = (n: number) => n.toLocaleString('en-US')

/** Deficiency shares for a summary — "below Punjab's working threshold", never a diagnosis. */
export function shareRows(s: BandStats): { label: string; threshold: string; v: number | null }[] {
  return [
    { label: 'Organic matter', threshold: 'below 0.86%', v: s.om_lt086 },
    { label: 'Phosphorus', threshold: 'below 15 ppm (adequate)', v: s.p_lt15 },
    { label: 'Phosphorus', threshold: 'below 7 ppm (low)', v: s.p_lt7 },
    { label: 'Potash', threshold: 'below 180 ppm', v: s.k_lt180 },
    { label: 'Zinc', threshold: 'below 1.0 ppm', v: s.zn_lt10 },
    { label: 'Boron', threshold: 'below 0.5 ppm', v: s.b_lt05 },
    { label: 'Salinity', threshold: 'EC above 4 dS/m', v: s.ec_gt4 },
  ]
}

/** Texture split for a summary: classes sorted by sample count, minor spellings folded into "other". */
/**
 * How many samples carry a recorded texture class at all — 11 September 2026.
 *
 * The soil page printed loam twice, as 77.5% and as 78.8%, because two components divided the same
 * count by two different denominators: all pH-valid samples in one place, texture-classified samples
 * in the other. Tahir ruled on the texture-classified denominator: a texture percentage should be
 * out of samples that were actually texture-tested. This is that denominator, exported once so the
 * two cannot drift apart again.
 */
export function textureTotal(t: Record<string, BandStats>): number {
  return Object.values(t).reduce((a, v) => a + v.n, 0)
}

export function textureSplit(t: Record<string, BandStats>): { label: string; n: number; share: number }[] {
  const total = textureTotal(t)
  const rows = Object.entries(t).filter(([k]) => TEXTURE_DRAWN.includes(k)).map(([k, v]) => ({ label: k, n: v.n, share: (v.n / total) * 100 })).sort((a, b) => b.n - a.n)
  const other = total - rows.reduce((a, r) => a + r.n, 0)
  if (other > 0) rows.push({ label: 'other spellings', n: other, share: (other / total) * 100 })
  return rows
}
