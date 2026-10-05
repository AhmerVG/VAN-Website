/**
 * ONE SEVERITY SCALE FOR THE WHOLE SOIL PAGE — 10 September 2026.
 *
 * Tahir: "the panel on how to read or how bad should be coloured and designed in a manner it
 * indicates the intensity, urgency", and then, choosing between the options: a severity scale used
 * everywhere on the page, so the same colour always means the same thing wherever it appears.
 *
 * NOTHING IS INVENTED HERE. The scale is VAN's own 5-band soil-test table, already in the repo at
 * src/data/soilThresholds.ts, read 1:1 out of `Report, Color, VAC add, Order of Nutrition Plan.xlsx`
 * — including its colours. It is the same table VAN prints on a farmer's soil report, so a reader
 * who has held one of those already knows what red means before he reads the legend.
 *
 * WHAT THIS FILE ADDS is the bridge: the survey names its analytes ph / om / p / k / zn / b / ec /
 * fe, and VAN's table names its rows pH / OM / P2O / K2O / Zn / B / EC / Fe. They are the same
 * quantities in the same units (elemental P and K in ppm — SOIL_P_K_BASIS; EC in dS/m, which is
 * mS/cm), so the mapping below is a rename, not a conversion. Anything that would need a real
 * conversion is deliberately absent.
 *
 * CALCIUM CARBONATE has no row in VAN's table, so it has no band, and this file returns undefined
 * for it rather than picking one. It stays a map layer and an analyte-list row.
 *
 * TWO SCALES, BOTH NAMED WHERE THEY ARE USED. VAN's five bands classify a MEASURED VALUE (a district
 * mean, a field's own report). Punjab's working thresholds — OM < 0.86%, P < 7 ppm, K < 180 ppm,
 * Zn < 1.0 ppm, B < 0.5 ppm, EC > 4 dS/m — are what the SHARES are counted against. The page shows
 * both and says which is which; it never colours one with the other's authority.
 */
import { SOIL_BAND_COLOR, SOIL_BAND_LABEL, SOIL_BAND_ORDER, bandForValue, type SoilBand, type SoilParameter } from '@/data/soilThresholds'
import type { BandStats } from '@/data/soil'

export type { SoilBand }
export { SOIL_BAND_COLOR, SOIL_BAND_LABEL, SOIL_BAND_ORDER }

/** Every column the matrix can show. `stat` reads BandStats; `param` picks the row in VAN's table. */
export type SoilColKey = 'ph' | 'om' | 'p' | 'k' | 'zn' | 'b' | 'fe' | 'ec' | 'cu' | 'mn' | 'caco3'

export type SoilCol = {
  key: SoilColKey
  param?: SoilParameter          // undefined = VAN's table defines no band for it
  label: string                  // full name, for the tooltip and the phone layout
  short: string                  // the column head
  unit: string
  dec: number
  /** The Punjab working threshold this analyte's share is counted against, where there is one. */
  share?: { field: keyof BandStats; label: string }
  /** Extra columns are off until the reader asks for them. */
  extra?: boolean
}

export const SOIL_COLS: SoilCol[] = [
  { key: 'ph', param: 'pH', label: 'pH', short: 'pH', unit: '', dec: 2, share: { field: 'ph_gt75', label: 'above 7.5' } },
  { key: 'om', param: 'OM', label: 'Organic matter', short: 'OM', unit: '%', dec: 2, share: { field: 'om_lt086', label: 'below 0.86%' } },
  { key: 'p', param: 'P2O', label: 'Phosphorus, available', short: 'P', unit: 'ppm', dec: 1, share: { field: 'p_lt15', label: 'below 15 ppm' } },
  { key: 'k', param: 'K2O', label: 'Potash, available', short: 'K', unit: 'ppm', dec: 0, share: { field: 'k_lt180', label: 'below 180 ppm' } },
  { key: 'zn', param: 'Zn', label: 'Zinc', short: 'Zn', unit: 'ppm', dec: 2, share: { field: 'zn_lt10', label: 'below 1.0 ppm' } },
  { key: 'b', param: 'B', label: 'Boron', short: 'B', unit: 'ppm', dec: 2, share: { field: 'b_lt05', label: 'below 0.5 ppm' } },
  { key: 'fe', param: 'Fe', label: 'Iron', short: 'Fe', unit: 'ppm', dec: 2 },
  { key: 'ec', param: 'EC', label: 'Electrical conductivity', short: 'EC', unit: 'dS/m', dec: 2, share: { field: 'ec_gt4', label: 'above 4 dS/m' } },
  { key: 'cu', param: 'Cu', label: 'Copper', short: 'Cu', unit: 'ppm', dec: 2, extra: true },
  { key: 'mn', param: 'Mn', label: 'Manganese', short: 'Mn', unit: 'ppm', dec: 2, extra: true },
  // No row in VAN's table. Carried so the matrix can show the value, never a colour.
  { key: 'caco3', label: 'Calcium carbonate', short: 'CaCO₃', unit: '%', dec: 2, extra: true },
]

export const colByKey = (k: SoilColKey) => SOIL_COLS.find(c => c.key === k)!

export const readVal = (s: BandStats, k: SoilColKey): number | null => (s[k] as number | null) ?? null

export function bandOf(k: SoilColKey, v: number | null | undefined): SoilBand | undefined {
  const c = colByKey(k)
  if (!c.param) return undefined
  return bandForValue(c.param, v)
}

/**
 * The fill behind a value. Graduated on purpose rather than one flat alpha for all five: at a single
 * opacity, critical red and weak orange arrive at the eye as two pale pinks and the reader has to
 * check the legend for every cell. Weighting the alpha to the bad end makes the worst cells the ones
 * you see first from across the table, which is the whole job of a heat map. Text stays ink, so
 * every value is still read at contrast.
 */
const TINT: Record<SoilBand, string> = {
  critical: '5C', weak: '4A', average: '3D', moderate: '38', healthy: '33',
}
export function bandTint(b: SoilBand | undefined, strength: 'cell' | 'chip' = 'cell'): string {
  if (!b) return 'transparent'
  return `${SOIL_BAND_COLOR[b]}${strength === 'cell' ? TINT[b] : '22'}`
}

export function fmt(k: SoilColKey, v: number | null | undefined): string {
  const c = colByKey(k)
  if (v == null || !Number.isFinite(v)) return 'n.d.'
  return v.toFixed(c.dec)
}

/**
 * How urgent a district is, taken across every banded column it has a value for. Used only to order
 * the matrix when the reader asks for "worst first" — it is a sort key on this page, never a score
 * published as a finding about a district.
 */
export function urgencyScore(s: BandStats, districtKey?: string): number {
  const weight: Record<SoilBand, number> = { critical: 4, weak: 3, average: 2, moderate: 1, healthy: 0 }
  let sum = 0, n = 0
  for (const c of SOIL_COLS) {
    if (!c.param || c.extra) continue
    if (districtKey && notComparable(districtKey, c.key)) continue   // D-181
    const b = bandOf(c.key, readVal(s, c.key))
    if (!b) continue
    sum += weight[b]; n++
  }
  return n ? sum / n : 0
}

/**
 * D-181, Tahir 26 Sep 2026: iron and copper in these 4 districts read far below the other 32 (iron median
 * 0.59 to 0.82 ppm against 1.4 to 5.9 elsewhere), which looks like a different laboratory method rather than
 * different soil. No conversion factor exists, so the readings are kept exactly as surveyed and marked
 * "not comparable" rather than corrected. His choice: mark them, do not normalise.
 */
export const NOT_COMPARABLE: Record<string, SoilColKey[]> = {
  FAISALABAD: ['fe', 'cu'], JHANG: ['fe', 'cu'], CHINNIOT: ['fe', 'cu'], 'TOBA TEK SINGH': ['fe', 'cu'],
}
export const notComparable = (districtKey: string | null | undefined, col: SoilColKey) =>
  !!districtKey && (NOT_COMPARABLE[districtKey] ?? []).includes(col)
