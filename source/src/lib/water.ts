import { STATIONS, normalTemp, dayOfYear, type Station } from '@/data/climate'

/**
 * CROP WATER REQUIREMENT — FAO-56, added 9 September 2026.
 *
 * Irrigation binds Pakistani yields more often than nutrition does, and until now this site had
 * nothing to say about it. This computes how much water a crop needs across its season, for the
 * reader's own district and sowing date, and sets it beside the rain that normally falls in the
 * same window.
 *
 * THE METHOD, AND EVERY EQUATION IS FAO'S OWN.
 *
 *   ETc = Kc × ETo.  Reference evapotranspiration times a crop coefficient — the standard of
 *   FAO Irrigation and Drainage Paper 56, which is what every irrigation department in the region
 *   already uses.
 *
 *   ETo by HARGREAVES, which is FAO-56's documented method when only temperature is available
 *   (Eq. 52):  ETo = 0.0023 (Tmean + 17.8) (Tmax − Tmin)^0.5 × 0.408 Ra   [mm/day]
 *   The full Penman-Monteith equation needs humidity, wind and solar radiation. The Pakistan
 *   Meteorological Department normals this site carries have temperature and rain and not those, so
 *   Penman-Monteith is not available and pretending otherwise would be worse than using the method
 *   FAO wrote for exactly this case.
 *
 *   Ra, extraterrestrial radiation, from FAO-56 Eq. 21, 23, 24 and 25 — latitude and day of year
 *   and nothing else. This part is astronomy and is exact.
 *
 * THREE LIMITS THAT MUST TRAVEL WITH EVERY NUMBER THIS PRODUCES, and they are printed on the page:
 *
 *   1. HARGREAVES IS AN ESTIMATE, not Penman-Monteith. FAO offers it when the data are missing,
 *      which they are.
 *   2. FAO'S Kc TABLE ASSUMES A SUB-HUMID CLIMATE — its own caption says RHmin about 45% and wind
 *      about 2 m/s. Punjab in the dry season is neither. FAO-56 gives an adjustment for arid
 *      climates (Eq. 62) which raises Kc, and it needs the humidity and wind figures this site does
 *      not have. So these numbers most likely UNDERSTATE what a Punjab crop needs, and the page
 *      says so rather than quietly presenting a floor as an answer.
 *   3. THIS IS CROP WATER REQUIREMENT, NOT IRRIGATION REQUIREMENT. It is what the crop transpires
 *      and the soil evaporates. It makes no allowance for what a watercourse loses on the way, for
 *      what runs past the root zone, or for leaching a saline soil. The rain figure beside it is
 *      total rainfall, not effective rainfall — how much of a July downpour a field actually keeps
 *      depends on the soil and the slope, and there is no honest way to compute it from here.
 */

const GSC = 0.0820          // solar constant, MJ m⁻² min⁻¹. FAO-56 Eq. 21
const MJ_TO_MM = 0.408      // evaporation equivalent. FAO-56 Eq. 20

/** Extraterrestrial radiation, MJ m⁻² day⁻¹. FAO-56 Eq. 21 with 23, 24 and 25. */
export function extraterrestrialRadiation(latitudeDeg: number, doy: number): number {
  const phi = (Math.PI / 180) * latitudeDeg
  const J = ((doy % 365) + 365) % 365 + 1
  const dr = 1 + 0.033 * Math.cos((2 * Math.PI * J) / 365)          // Eq. 23
  const delta = 0.409 * Math.sin((2 * Math.PI * J) / 365 - 1.39)     // Eq. 24
  let x = -Math.tan(phi) * Math.tan(delta)                           // Eq. 25
  x = Math.max(-1, Math.min(1, x))                                   // polar guard; never hit in Punjab
  const ws = Math.acos(x)
  return ((24 * 60) / Math.PI) * GSC * dr *
    (ws * Math.sin(phi) * Math.sin(delta) + Math.cos(phi) * Math.cos(delta) * Math.sin(ws))
}

/** Reference evapotranspiration, mm/day. FAO-56 Eq. 52 (Hargreaves). */
export function eto(station: Station, doy: number): number {
  const tmax = normalTemp(station, doy, 'tmax')
  const tmin = normalTemp(station, doy, 'tmin')
  // The GDD work uses the published daily mean; Hargreaves is defined on the midpoint, so the
  // midpoint is what it gets. Using the other one here would be reading FAO's equation loosely.
  const tmean = (tmax + tmin) / 2
  const ra = extraterrestrialRadiation(station.lat, doy)
  const range = Math.max(0, tmax - tmin)
  return 0.0023 * (tmean + 17.8) * Math.sqrt(range) * MJ_TO_MM * ra
}

/** Normal rainfall on a given day, mm — the monthly total spread evenly across its days. */
const DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
export function normalRainfall(station: Station, doy: number): number {
  const d = ((doy % 365) + 365) % 365
  let acc = 0
  for (let m = 0; m < 12; m++) {
    if (d < acc + DAYS_IN_MONTH[m]) return station.precip[m] / DAYS_IN_MONTH[m]
    acc += DAYS_IN_MONTH[m]
  }
  return station.precip[11] / 31
}

export type StageWater = { stage: string; days: number; kc: number; etc: number; rain: number; from: number; to: number }
export type WaterResult = {
  stages: StageWater[]
  /** Season crop water requirement, mm. */
  etcMm: number
  /** Normal rainfall over the same window, mm — total, not effective. */
  rainMm: number
  /** What has to come from irrigation before any losses: ETc − rain, floored at zero. */
  irrigationMm: number
  seasonDays: number
  station: Station
}

export type CropWaterModel = {
  crop: string
  label: string
  /** FAO-56 Table 11 stage lengths, days: initial, development, mid-season, late. */
  lengths: [number, number, number, number]
  /** FAO-56 Table 12 crop coefficients. */
  kc: { ini: number; mid: number; end: number }
  /** The Table 11 row used, verbatim, so it can be found. */
  table11: string
  /** The Table 12 row used, verbatim. */
  table12: string
  /** Region the Table 11 row is for — named, because it is often not Pakistan. */
  region: string
}

/**
 * ETc across the season, day by day.
 *
 * Kc follows FAO-56's own shape: flat at Kc_ini through the initial stage, rising linearly across
 * development, flat at Kc_mid through mid-season, then falling linearly to Kc_end. That linear
 * interpolation is FAO's construction, not an approximation invented here.
 */
export function seasonWater(model: CropWaterModel, stationKey: string, sownDoy: number): WaterResult {
  const station = STATIONS[stationKey]
  const [lIni, lDev, lMid, lLate] = model.lengths
  const total = lIni + lDev + lMid + lLate
  const bounds = [lIni, lIni + lDev, lIni + lDev + lMid, total]
  const names = ['Initial', 'Development', 'Mid-season', 'Late season']

  const stages: StageWater[] = names.map((stage, i) => ({
    stage, days: model.lengths[i], kc: 0, etc: 0, rain: 0,
    from: i === 0 ? 0 : bounds[i - 1], to: bounds[i],
  }))

  let etcMm = 0, rainMm = 0
  for (let d = 0; d < total; d++) {
    let kc: number
    let idx: number
    if (d < bounds[0]) { kc = model.kc.ini; idx = 0 }
    else if (d < bounds[1]) { const f = (d - bounds[0]) / Math.max(1, lDev); kc = model.kc.ini + (model.kc.mid - model.kc.ini) * f; idx = 1 }
    else if (d < bounds[2]) { kc = model.kc.mid; idx = 2 }
    else { const f = (d - bounds[2]) / Math.max(1, lLate); kc = model.kc.mid + (model.kc.end - model.kc.mid) * f; idx = 3 }
    const day = eto(station, sownDoy + d) * kc
    const rain = normalRainfall(station, sownDoy + d)
    etcMm += day
    rainMm += rain
    stages[idx].etc += day
    stages[idx].rain += rain
  }
  for (let i = 0; i < stages.length; i++) {
    stages[i].kc = [model.kc.ini, (model.kc.ini + model.kc.mid) / 2, model.kc.mid, (model.kc.mid + model.kc.end) / 2][i]
  }
  return { stages, etcMm, rainMm, irrigationMm: Math.max(0, etcMm - rainMm), seasonDays: total, station }
}

/**
 * Millimetres over a hectare are litres × 10; what a Pakistani grower counts is acre-inches and
 * number of waterings. One millimetre over one acre is 4,046.86 litres — geometry, not agronomy.
 */
export const LITRES_PER_MM_PER_ACRE = 4046.86
export function mmToAcreInches(mm: number): number { return mm / 25.4 }
/** A canal watering ("rauni"/nakka) is commonly reckoned at about 3 acre-inches — see the page note. */
export function mmToIrrigations(mm: number, acreInchesPerWatering: number): number {
  return mmToAcreInches(mm) / acreInchesPerWatering
}
export { dayOfYear }
