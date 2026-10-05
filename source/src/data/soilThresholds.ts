// VAN's own 5-band soil-test thresholds, sourced 1:1 from `Report, Color, VAC add, Order of
// Nutrition Plan.xlsx`, Sheet1 P2:U12 (extracted 8 Sep 2026) — see master framework doc section 3.
// Cu and Mn only have 3 of the 5 bands defined in the source file (Weak/Moderate left blank there,
// not guessed here either).
export type SoilBand = 'critical' | 'weak' | 'average' | 'moderate' | 'healthy'

export const SOIL_BAND_ORDER: SoilBand[] = ['critical', 'weak', 'average', 'moderate', 'healthy']

export const SOIL_BAND_LABEL: Record<SoilBand, string> = {
  critical: 'Critical', weak: 'Weak', average: 'Average', moderate: 'Moderate', healthy: 'Healthy',
}

// VAN's own colour code for each band, as given in the source file.
export const SOIL_BAND_COLOR: Record<SoilBand, string> = {
  critical: '#BE2A3E', weak: '#EA7649', average: '#F4D166', moderate: '#68AC65', healthy: '#367640',
}

export type SoilParameter = 'EC' | 'pH' | 'OM' | 'P2O' | 'K2O' | 'Zn' | 'B' | 'Fe' | 'Cu' | 'Mn'

export const SOIL_PARAMETER_LABEL: Record<SoilParameter, string> = {
  EC: 'EC (salinity)', pH: 'pH', OM: 'Organic matter', P2O: 'Phosphorus (P₂O₅)', K2O: 'Potash (K₂O)',
  Zn: 'Zinc', B: 'Boron', Fe: 'Iron', Cu: 'Copper', Mn: 'Manganese',
}

/** A label inside a sentence: lower-case the first letter of a word, leave acronyms and formulae (EC, P₂O₅) as they are. */
export const soilParameterInline = (p: SoilParameter) => {
  const s = SOIL_PARAMETER_LABEL[p]
  return /^[A-Z][a-z]/.test(s) ? s[0].toLowerCase() + s.slice(1) : s
}

export const SOIL_PARAMETER_UNIT: Record<SoilParameter, string> = {
  EC: 'mS/cm', pH: '', OM: '%', P2O: 'ppm', K2O: 'ppm', Zn: 'ppm', B: 'ppm', Fe: 'ppm', Cu: 'ppm', Mn: 'ppm',
}

/**
 * PROVENANCE OF THE MICRONUTRIENT ROWS, checked 8 Sep 2026 against the literature (not against a VAN
 * file — the source spreadsheet gives the numbers without saying where they came from). All four
 * DTPA micronutrient rows line up with Lindsay, W.L. & Norvell, W.A. (1978), "Development of a DTPA
 * Soil Test for Zinc, Iron, Manganese, and Copper", Soil Science Society of America Journal
 * 42(3):421-428, doi:10.2136/sssaj1978.03615995004200030009x — the paper that defined the DTPA test
 * and whose stated critical levels (for corn) are Zn 0.8, Fe 4.5, Mn 1.0 (tentative), Cu 0.2 ppm:
 *   - Cu: VAN's Healthy floor is exactly 0.2 — Lindsay & Norvell's Cu critical level.
 *   - Mn: VAN's Healthy floor is exactly 1.0 — their (tentative) Mn critical level.
 *   - Fe: their 4.5 falls inside VAN's Moderate band (4-5), i.e. just below Healthy.
 *   - Zn: their 0.8 is VAN's Moderate floor; VAN's Healthy floor of 1.0 matches the Punjab soil
 *     testing programme's own working threshold ("Zn low < 1.0 ppm").
 * So the table is not arbitrary and the Cu cutoff in particular is the internationally standard
 * figure, also the one Pakistani soil-test interpretation uses (cited in Pakistani work via
 * Martens & Lindsay 1990 / Zia et al. 2004). Note it is Cu and Mn — the two rows whose critical
 * value sits at the Healthy boundary — that are also the two the source file leaves at 3 bands.
 *
 * OPEN, and it matters: neither VAN's table nor the Punjab survey metadata records WHICH EXTRACTANT
 * the copper figures come from. Lindsay & Norvell's 0.2 is a DTPA number; if either side used
 * AB-DTPA (Soltanpour) instead, the comparison does not hold and the Cu (and Fe/Mn/Zn) bands would
 * need restating. Pakistani literature uses both. Not resolved here, and not guessed at.
 *
 * Numeric cutoffs per band, low-value-is-worse for every parameter except pH (both extremes read
 * worse — VAN's own table treats HIGH pH as Critical, since Punjab's calcareous soils run alkaline,
 * not acidic; there is no low-pH band in the source file, so an unusually acidic reading has nothing
 * to classify against here — left out rather than guessed). undefined = band not defined in source.
 */
export const SOIL_PARAMETER_THRESHOLDS: Record<SoilParameter, { critical: string; weak?: string; average: string; moderate?: string; healthy: string }> = {
  EC:  { critical: '> 12',        weak: '8–12',       average: '4–8',        moderate: '2–4',      healthy: '< 2' },
  pH:  { critical: '> 9',         weak: '8.5–9',       average: '8–8.5',      moderate: '7.5–8',    healthy: '7–7.5' },
  OM:  { critical: '< 0.5',       weak: '0.5–0.75',    average: '0.75–1.0',   moderate: '1–1.25',   healthy: '> 1.25' },
  P2O: { critical: '< 5',         weak: '5–10',        average: '10–15',      moderate: '15–20',    healthy: '> 20' },
  K2O: { critical: '< 50',        weak: '50–100',      average: '100–150',    moderate: '150–200',  healthy: '> 200' },
  Zn:  { critical: '< 0.6',       weak: '0.6–0.7',      average: '0.7–0.8',    moderate: '0.8–1',    healthy: '> 1' },
  B:   { critical: '< 0.2',       weak: '0.2–0.4',      average: '0.4–0.6',    moderate: '0.6–1',    healthy: '> 1' },
  Fe:  { critical: '< 2',         weak: '2–3',          average: '3–4',        moderate: '4–5',      healthy: '> 5' },
  Cu:  { critical: '< 0.1',       average: '0.1–0.2',   healthy: '> 0.2' }, // Weak/Moderate not defined in source
  Mn:  { critical: '< 0.5',       average: '0.5–1',     healthy: '> 1' },   // Weak/Moderate not defined in source
}

/**
 * Proposed graduated bump multiplier — replaces the old Sugarcane sheet's blunt 2-tier trigger
 * (Critical/Weak only, Average/Moderate/Healthy = nothing) with a multiplier across all 5 of VAN's
 * own bands. This IS the section 15 proposal from the master framework doc — Tahir asked to build it
 * (9 Sep), so it's live here, but the specific multiplier values are a design choice presented for
 * his review/correction, not a number that came from any VAN source file (none defines one — the old
 * sheet only ever used a flat 0.5/0.25/0 bump amount, not band-graduated multipliers at all).
 */
export const SOIL_BUMP_MULTIPLIER: Record<SoilBand, number> = {
  critical: 1.0, weak: 0.6, average: 0.3, moderate: 0.1, healthy: 0,
}

/**
 * The same cutoffs as SOIL_PARAMETER_THRESHOLDS above, expressed numerically so a measured value can
 * be classified in code. Nothing new is decided here — every boundary is read straight off the same
 * source rows (`Report, Color, VAC add, Order of Nutrition Plan.xlsx`, Sheet1 P2:U12); the strings
 * above stay the display form. Ranges are [min, max) — a value equal to a boundary falls in the
 * higher band, which is the ordinary reading of "5–10" following "< 5".
 *
 * pH is the one non-monotonic row: VAN's table classifies only the alkaline side (7 upward), because
 * Punjab's calcareous soils run alkaline. A reading below 7 has nothing to classify against in the
 * source, so bandForValue returns undefined for it rather than inventing an acid band.
 *
 * Cu and Mn have only 3 of 5 bands in the source file (Weak and Moderate left blank there) — the
 * gaps are simply absent here too, so a value in what would be the Weak range classifies to the
 * nearest band the source actually defines.
 */
export type BandRange = { band: SoilBand; min: number; max: number }

export const SOIL_PARAMETER_RANGES: Record<SoilParameter, BandRange[]> = {
  EC:  [{ band: 'healthy', min: -Infinity, max: 2 }, { band: 'moderate', min: 2, max: 4 }, { band: 'average', min: 4, max: 8 }, { band: 'weak', min: 8, max: 12 }, { band: 'critical', min: 12, max: Infinity }],
  pH:  [{ band: 'healthy', min: 7, max: 7.5 }, { band: 'moderate', min: 7.5, max: 8 }, { band: 'average', min: 8, max: 8.5 }, { band: 'weak', min: 8.5, max: 9 }, { band: 'critical', min: 9, max: Infinity }],
  OM:  [{ band: 'critical', min: -Infinity, max: 0.5 }, { band: 'weak', min: 0.5, max: 0.75 }, { band: 'average', min: 0.75, max: 1 }, { band: 'moderate', min: 1, max: 1.25 }, { band: 'healthy', min: 1.25, max: Infinity }],
  P2O: [{ band: 'critical', min: -Infinity, max: 5 }, { band: 'weak', min: 5, max: 10 }, { band: 'average', min: 10, max: 15 }, { band: 'moderate', min: 15, max: 20 }, { band: 'healthy', min: 20, max: Infinity }],
  K2O: [{ band: 'critical', min: -Infinity, max: 50 }, { band: 'weak', min: 50, max: 100 }, { band: 'average', min: 100, max: 150 }, { band: 'moderate', min: 150, max: 200 }, { band: 'healthy', min: 200, max: Infinity }],
  Zn:  [{ band: 'critical', min: -Infinity, max: 0.6 }, { band: 'weak', min: 0.6, max: 0.7 }, { band: 'average', min: 0.7, max: 0.8 }, { band: 'moderate', min: 0.8, max: 1 }, { band: 'healthy', min: 1, max: Infinity }],
  B:   [{ band: 'critical', min: -Infinity, max: 0.2 }, { band: 'weak', min: 0.2, max: 0.4 }, { band: 'average', min: 0.4, max: 0.6 }, { band: 'moderate', min: 0.6, max: 1 }, { band: 'healthy', min: 1, max: Infinity }],
  Fe:  [{ band: 'critical', min: -Infinity, max: 2 }, { band: 'weak', min: 2, max: 3 }, { band: 'average', min: 3, max: 4 }, { band: 'moderate', min: 4, max: 5 }, { band: 'healthy', min: 5, max: Infinity }],
  Cu:  [{ band: 'critical', min: -Infinity, max: 0.1 }, { band: 'average', min: 0.1, max: 0.2 }, { band: 'healthy', min: 0.2, max: Infinity }],
  Mn:  [{ band: 'critical', min: -Infinity, max: 0.5 }, { band: 'average', min: 0.5, max: 1 }, { band: 'healthy', min: 1, max: Infinity }],
}

/**
 * Which convention the P and K rows are written in. Confirmed by Tahir 8 Sep 2026: VAN's cutoffs read
 * against ELEMENTAL P and K in ppm, exactly as a lab report gives them — not P2O5/K2O oxide values.
 * So survey figures (also elemental) feed in unconverted, with no x2.29 / x1.205 applied anywhere.
 * The row labels "P2O"/"K2O" are VAN's own naming in the source file, kept for continuity with the
 * printed soil report a farmer holds; they do not signal an oxide basis.
 */
export const SOIL_P_K_BASIS = 'elemental' as const

/** Classify a measured value into VAN's own band. undefined = the source table defines no band for it. */
export function bandForValue(parameter: SoilParameter, value: number | null | undefined): SoilBand | undefined {
  if (value === null || value === undefined || !Number.isFinite(value)) return undefined
  for (const r of SOIL_PARAMETER_RANGES[parameter]) {
    if (value >= r.min && value < r.max) return r.band
  }
  return undefined
}
