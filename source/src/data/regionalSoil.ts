import { DISTRICT_PROFILES, PARAMETER_ANALYTE } from './districtSoil'
import type { DistrictProfile } from './districtSoil'
import { bandForValue } from './soilThresholds'
import type { SoilBand, SoilParameter } from './soilThresholds'

/**
 * REGIONAL SOIL LAYER — a starting point for a farmer who has no soil report of their own.
 *
 * It does exactly one thing: take each district's MEDIAN reading from the Punjab soil testing
 * programme (see districtSoil.ts for why median and not mean) and classify it into VAN's own five
 * bands using VAN's own cutoffs. No new measurement, no new threshold, no modelling, no
 * interpolation — a lookup and a comparison.
 *
 * WHAT IT IS NOT, and why the UI has to keep saying so: a district figure is not a farm. Half the
 * fields in any district read worse than the middle, and the survey is now roughly eight years old —
 * fertiliser history since then has moved phosphorus in particular. It gives a farmer a plausible
 * place to start instead of a blank form; it does not replace a soil test, and every band it fills
 * in stays editable. Where a district has no valid data for an analyte (Jhelum returns no valid
 * zinc), nothing is filled in for it rather than substituting a provincial figure.
 *
 * Punjab districts only. The survey covers Punjab and nothing else, so a farmer outside Punjab gets
 * no district fill — deliberately. Handing them a Punjab number as if it described their land would
 * be worse than an empty form.
 */

export const REGIONAL_PARAMETERS = Object.keys(PARAMETER_ANALYTE) as SoilParameter[]

export type RegionalProfile = {
  key: string
  name: string
  /** Valid samples behind this profile. */
  n: number
  /** VAN band per parameter, from the district's median. Absent = no valid survey data. */
  bands: Partial<Record<SoilParameter, SoilBand>>
  /** The median itself, in the survey's own units — shown so the farmer can sanity-check it. */
  values: Partial<Record<SoilParameter, number>>
  /** Parameters this district has no valid survey data for. */
  missing: SoilParameter[]
}

function classify(d: DistrictProfile): RegionalProfile {
  const bands: Partial<Record<SoilParameter, SoilBand>> = {}
  const values: Partial<Record<SoilParameter, number>> = {}
  const missing: SoilParameter[] = []
  for (const parameter of REGIONAL_PARAMETERS) {
    const value = d.median[PARAMETER_ANALYTE[parameter]]
    const band = bandForValue(parameter, value)
    if (value === undefined || !band) { missing.push(parameter); continue }
    bands[parameter] = band
    values[parameter] = value
  }
  return { key: d.key, name: d.name, n: d.n, bands, values, missing }
}

/** All 36 Punjab districts, alphabetical, as a farmer would look for their own. */
export const REGIONAL_PROFILES: RegionalProfile[] = DISTRICT_PROFILES.map(classify)

export function regionalProfile(key: string | undefined): RegionalProfile | undefined {
  return key ? REGIONAL_PROFILES.find(p => p.key === key) : undefined
}

/** Survey provenance, in the words the public page is allowed to use. */
export const REGIONAL_SOURCE = {
  survey: 'Punjab soil testing programme',
  window: 'sampled c. 2016–2018',
  districts: REGIONAL_PROFILES.length,
  caution: 'This is the middle reading for your district, not a reading from your land. Half the fields around you test worse than it. The survey is also around eight years old, and phosphorus in particular moves with fertiliser history. Start here, then change any row you know to be different. It does not replace a soil test.',
}
