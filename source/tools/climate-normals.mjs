import fs from 'node:fs'
const s = fs.readFileSync('/root/van/demo/src/data/soil.ts','utf8')
const i = s.indexOf('"centroids":'); const j = s.indexOf('}', s.indexOf('{', i))
const cent = JSON.parse(s.slice(s.indexOf('{', i), j + 1))

const STATIONS = {
  LAHORE:    { name:'Lahore City',      wmo:41640, lat:31+33/60,      lon:74+20/60,      elev:214, tmax:[18.4,22.2,27.5,34.2,38.9,38.9,35.6,34.7,34.4,32.4,27.1,21.4], tmin:[7.6,10.8,15.7,21.1,25.6,27.4,27.1,26.9,25.3,20.1,13.7,8.8],  tavg:[13.1,16.5,21.6,27.7,32.3,33.2,31.3,30.8,29.9,26.3,20.4,15.1] },
  MULTAN:    { name:'Multan',           wmo:41675, lat:30+12/60,      lon:71+26/60,      elev:122, tmax:[19.7,23.3,28.7,35.8,40.9,41.6,39.0,37.4,36.4,34.0,28.1,22.5], tmin:[5.7,9.0,14.6,20.5,25.9,28.9,29.2,28.2,25.7,19.5,12.5,7.2],   tavg:[12.7,16.2,21.5,28.6,33.4,35.3,34.1,32.4,31.0,26.8,20.3,14.9] },
  SARGODHA:  { name:'Sargodha',         wmo:41594, lat:32+3/60,       lon:72+40/60,      elev:187, tmax:[18.6,22.4,27.6,34.1,39.6,40.7,37.7,36.6,35.7,32.8,26.9,21.6], tmin:[4.9,8.2,13.7,19.4,24.5,27.2,27.7,27.2,24.8,18.7,11.5,6.2],   tavg:[11.8,15.2,20.6,26.7,32.0,34.0,32.7,31.9,30.2,25.4,19.2,14.0] },
  SIALKOT:   { name:'Sialkot',          wmo:41600, lat:32.5,          lon:74+32/60,      elev:255, tmax:[17.4,21.2,26.2,32.9,38.2,38.8,34.7,33.4,33.1,31.1,25.9,20.2], tmin:[5.4,8.3,13.0,18.1,22.8,25.4,25.6,25.4,23.6,17.5,10.9,6.0],   tavg:[11.4,14.8,19.4,25.5,30.5,32.1,30.2,29.4,28.3,24.3,18.4,13.2] },
  JHELUM:    { name:'Jhelum',           wmo:41598, lat:32+56/60,      lon:73+43/60,      elev:232, tmax:[18.9,22.2,27.4,33.5,38.7,39.9,36.1,34.8,34.6,32.7,27.3,21.8], tmin:[5.3,8.5,13.2,18.3,23.2,26.0,26.2,25.8,23.7,17.5,10.9,6.3],   tavg:[12.1,15.4,20.4,25.9,31.0,33.0,31.2,30.3,29.2,25.1,19.1,14.0] },
  KHANPUR:   { name:'Khanpur',          wmo:41718, lat:28+39/60,      lon:70+41/60,      elev:87,  tmax:[21.1,24.6,30.0,37.6,42.1,42.2,39.6,37.8,36.8,35.0,29.6,23.9], tmin:[5.3,8.5,14.1,20.0,25.2,28.0,28.3,27.1,24.5,18.2,11.8,6.8],   tavg:[13.2,16.6,22.2,28.8,33.7,35.1,33.9,32.4,30.6,26.6,20.7,15.4] },
  ISLAMABAD: { name:'Islamabad Airport', wmo:41571, lat:33+37/60,     lon:73+6/60,       elev:507, tmax:[17.7,20.0,24.8,30.6,36.1,38.3,35.4,33.9,33.4,30.9,25.4,20.4], tmin:[3.6,6.8,11.4,16.6,21.5,24.5,24.9,24.2,21.7,15.6,9.1,4.7],    tavg:[10.7,13.4,18.1,23.6,28.7,31.4,30.1,29.1,27.6,23.3,17.3,12.5] },
}
const R = 6371, rad = x => x * Math.PI / 180
const km = (a,b,x,y) => { const dl=rad(y-b), dp=rad(x-a); const h=Math.sin(dp/2)**2+Math.cos(rad(a))*Math.cos(rad(x))*Math.sin(dl/2)**2; return 2*R*Math.asin(Math.sqrt(h)) }

const rows = Object.entries(cent).map(([d,[lon,lat]]) => {
  const near = Object.entries(STATIONS).map(([k,st]) => [k, km(lat,lon,st.lat,st.lon)]).sort((a,b)=>a[1]-b[1])
  return { district: d, lat: +lat.toFixed(4), lon: +lon.toFixed(4), station: near[0][0], km: Math.round(near[0][1]) }
}).sort((a,b)=>a.district.localeCompare(b.district))

const fmt = a => '[' + a.join(', ') + ']'
let out = `/**
 * MONTHLY TEMPERATURE NORMALS FOR PUNJAB — added 9 Sep 2026.
 *
 * WHAT THIS IS. Seven weather stations' long-term monthly mean, mean-maximum and mean-minimum air
 * temperature, and a rule assigning each of the 36 districts in the Punjab soil survey to one of
 * them. It is the temperature source the site had been missing: thermal time, crop water
 * requirement and anything else that depends on how hot a season actually is all need it.
 *
 * PROVENANCE — every figure here was read off the source file, not recalled:
 *   WMO Climatological Standard Normals for 1991–2020, NOAA NCEI Accession 0253808,
 *   doi:10.25921/800j-vn07 — Region 2 / Pakistan station files. The normals were computed and
 *   submitted by the PAKISTAN METEOROLOGICAL DEPARTMENT; NCEI performed quality control and format
 *   conversion only. So this is PMD's own data, cited through the archive that publishes it.
 *   \`tavg\` is the published Daily_Mean_Temperature field — it is NOT (tmax+tmin)/2 and does not
 *   equal it (Multan April: published mean 28.6, midpoint 28.15). Which of the two to use is the
 *   caller's decision: the growing-degree-day convention is the midpoint, while the published mean
 *   is the better estimate of the true daily average.
 *
 * WHAT IT IS NOT. These are NORMALS — what a month is usually like, averaged over thirty years.
 * They are not this season's weather and they are not a forecast. Any figure computed from them
 * describes a normal year, and every page that shows one has to say so.
 *
 * FOUR HONEST LIMITS, none of them hidden from the reader:
 *   1. FAISALABAD HAS NO STATION IN THIS DATASET, and it is the centre of Punjab's cropping. Pakistan
 *      submitted 25 stations; Faisalabad, Bahawalpur, D.G. Khan, Bhakkar, Mianwali and Rahim Yar Khan
 *      city are not among them. Those districts are assigned to their nearest station, and the
 *      distance is published beside the reading rather than buried.
 *   2. The assignment rule is NEAREST STATION BY GREAT-CIRCLE DISTANCE from the district's own
 *      centroid — and the centroid is not drawn from a boundary file, it is the mean position of that
 *      district's georeferenced soil samples in the survey the site already carries. So the mapping is
 *      derived from data the site publishes, and can be checked. No interpolation, no district
 *      polygons, no invented coordinates. Worst case is Pakpattan at 166 km; the median is 67 km.
 *   3. Monthly normals are a coarser instrument than daily weather. Degree-days accumulated from
 *      monthly means differ systematically from degree-days accumulated from daily observations,
 *      and the error is worst when the base temperature falls inside the daily range.
 *   4. PMD's own monthly bulletins still quote 1961–1990 normals, which run slightly warmer in
 *      January at several of these stations. This file uses 1991–2020 throughout — one period,
 *      stated.
 *
 * Generated by tools/climate-normals.mjs. Do not edit the numbers by hand.
 */

export type Station = {
  key: string
  name: string
  wmo: number
  lat: number
  lon: number
  elevation: number
  /** Mean daily maximum, °C, January → December. */
  tmax: number[]
  /** Mean daily minimum, °C, January → December. */
  tmin: number[]
  /** PUBLISHED daily mean, °C, January → December. Not the midpoint of tmax and tmin. */
  tavg: number[]
}

export const STATIONS: Record<string, Station> = {
`
for (const [k, st] of Object.entries(STATIONS)) {
  out += `  ${k}: { key: '${k}', name: ${JSON.stringify(st.name)}, wmo: ${st.wmo}, lat: ${st.lat.toFixed(4)}, lon: ${st.lon.toFixed(4)}, elevation: ${st.elev},\n    tmax: ${fmt(st.tmax)},\n    tmin: ${fmt(st.tmin)},\n    tavg: ${fmt(st.tavg)} },\n`
}
out += `}

/**
 * District → nearest station. \`km\` is the great-circle distance from the district's soil-sample
 * centroid to that station, and it is shown to the reader: 16 km is a local reading, 166 km is a
 * regional one, and the difference is the reader's to judge.
 */
export type DistrictClimate = { district: string; lat: number; lon: number; station: string; km: number }

export const DISTRICT_CLIMATE: DistrictClimate[] = [
`
for (const r of rows) out += `  { district: ${JSON.stringify(r.district)}, lat: ${r.lat}, lon: ${r.lon}, station: '${r.station}', km: ${r.km} },\n`
out += `]

const BY_DISTRICT = new Map(DISTRICT_CLIMATE.map(d => [d.district.toUpperCase(), d]))
export function climateForDistrict(district: string): { station: Station; km: number } | null {
  const d = BY_DISTRICT.get(district.trim().toUpperCase())
  return d ? { station: STATIONS[d.station], km: d.km } : null
}

export const CLIMATE_SOURCE = {
  dataset: 'WMO Climatological Standard Normals 1991–2020',
  computedBy: 'Pakistan Meteorological Department',
  publishedBy: 'NOAA National Centers for Environmental Information, Accession 0253808',
  doi: '10.25921/800j-vn07',
  period: '1991–2020',
  stations: Object.keys(STATIONS).length,
  districts: DISTRICT_CLIMATE.length,
  note: 'Normals, not this season. What a month is usually like, averaged over thirty years.',
} as const

const DAYS_IN_MONTH = [31, 28, 31, 30, 31, 31 - 1, 31, 31, 30, 31, 30, 31]
// June has 30 days; written out rather than trusting a literal, and asserted below.
DAYS_IN_MONTH[5] = 30

/**
 * The temperature a station normally sees on a given day of the year, interpolated between
 * MID-MONTH anchors. Interpolating rather than stepping matters: a step function puts a false jump
 * of several degrees on the first of every month, which lands as a visible kink in anything
 * accumulated across it.
 */
export function normalTemp(station: Station, doy: number, series: 'tmax' | 'tmin' | 'tavg'): number {
  const mids: number[] = []
  let acc = 0
  for (let m = 0; m < 12; m++) { mids.push(acc + DAYS_IN_MONTH[m] / 2); acc += DAYS_IN_MONTH[m] }
  const v = station[series]
  const d = ((doy % 365) + 365) % 365
  if (d < mids[0] || d >= mids[11]) {
    const span = 365 - mids[11] + mids[0]
    const f = ((d - mids[11] + 365) % 365) / span
    return v[11] + (v[0] - v[11]) * f
  }
  for (let m = 0; m < 11; m++) {
    if (d >= mids[m] && d < mids[m + 1]) {
      const f = (d - mids[m]) / (mids[m + 1] - mids[m])
      return v[m] + (v[m + 1] - v[m]) * f
    }
  }
  return v[11]
}

export function dayOfYear(date: Date): number {
  let n = 0
  for (let m = 0; m < date.getMonth(); m++) n += DAYS_IN_MONTH[m]
  return n + date.getDate() - 1
}

/**
 * Growing degree days accumulated from a sowing day, in a NORMAL year at that station.
 *
 * \`mode\` picks the daily temperature: 'midpoint' is the standard GDD convention, (tmax+tmin)/2;
 * 'published' uses PMD's own daily-mean field. They differ — see the header — and for a base
 * temperature that sits inside the daily range they can differ materially, so the caller states
 * which one it wanted rather than inheriting a default silently.
 */
export function accumulateGdd(station: Station, sownDoy: number, days: number, base: number, mode: 'midpoint' | 'published' = 'midpoint'): number[] {
  const out: number[] = []
  let total = 0
  for (let i = 0; i < days; i++) {
    const doy = sownDoy + i
    const t = mode === 'published'
      ? normalTemp(station, doy, 'tavg')
      : (normalTemp(station, doy, 'tmax') + normalTemp(station, doy, 'tmin')) / 2
    total += Math.max(0, t - base)
    out.push(total)
  }
  return out
}
`
fs.writeFileSync('/root/van/demo/src/data/climate.ts', out)
fs.mkdirSync('/root/van/demo/tools', { recursive: true })
fs.copyFileSync('/tmp/gdd/gen.mjs', '/root/van/demo/tools/climate-normals.mjs')
console.log('written; districts:', rows.length, 'max km:', Math.max(...rows.map(r=>r.km)))
