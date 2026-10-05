/**
 * THE CLIMATE LAYER, CHECKED — and the wheat GDD finding, kept reproducible.
 *
 * Run: npx tsc -p tsconfig.enginetest.json && node run-enginetest.cjs __climatecheck
 *
 * Two jobs. First, the ordinary invariants on data/climate.ts. Second — the reason this file
 * exists — it re-runs the comparison that stopped the thermal-time work on 9 Sep 2026: VAN's
 * published wheat stage table gives GDD ranges AND days-after-sowing AND calendar dates, and read
 * against Pakistan Meteorological Department normals at the base temperature the table itself
 * states, those columns do not describe the same crop. The arithmetic is printed rather than
 * asserted, so anyone can check it, and it re-runs every time the harness runs so the finding
 * cannot quietly go stale.
 */
import { STATIONS, DISTRICT_CLIMATE, accumulateGdd, dayOfYear, normalTemp, climateForDistrict, CLIMATE_SOURCE } from '@/data/climate'
import { WHEAT } from '@/data/site'
import { REGIONAL_PROFILES } from '@/data/regionalSoil'

let bad = 0
const check = (label: string, pass: boolean, detail = '') => {
  if (!pass) bad++
  console.log(`  ${pass ? 'ok  ' : 'FAIL'} ${label}${detail ? '. ' + detail : ''}`)
}

console.log('=== THE CLIMATE LAYER ===')
console.log(`  ${CLIMATE_SOURCE.dataset}, ${CLIMATE_SOURCE.computedBy}, ${CLIMATE_SOURCE.period}`)

for (const [k, st] of Object.entries(STATIONS)) {
  check(`${k.padEnd(10)} 12 months of each series`, st.tmax.length === 12 && st.tmin.length === 12 && st.tavg.length === 12)
  const badMonth = st.tmax.findIndex((v, i) => v <= st.tmin[i])
  check(`${k.padEnd(10)} max above min in every month`, badMonth < 0, badMonth < 0 ? '' : `month ${badMonth + 1}`)
  // The published mean is not the midpoint, and should not be forced to be — but it must sit
  // between the two, or one of the three numbers has been transcribed wrong.
  const outside = st.tavg.findIndex((v, i) => v < st.tmin[i] || v > st.tmax[i])
  check(`${k.padEnd(10)} published mean lies between min and max`, outside < 0, outside < 0 ? '' : `month ${outside + 1}`)
}

check(`all 36 survey districts are assigned`, DISTRICT_CLIMATE.length === 36, `${DISTRICT_CLIMATE.length}`)
check(`every assignment names a station that exists`, DISTRICT_CLIMATE.every(d => STATIONS[d.station] !== undefined))
// D-151: the water panel's district select offers REGIONAL_PROFILES; every one must reach a station,
// by its survey key (the select's value) and by its display name.
const unresolvedKey = REGIONAL_PROFILES.filter(p => !climateForDistrict(p.key)).map(p => p.key)
const unresolvedName = REGIONAL_PROFILES.filter(p => !climateForDistrict(p.name)).map(p => p.name)
check(`every soil-survey district resolves to a station by its key (${REGIONAL_PROFILES.length})`, REGIONAL_PROFILES.length === 36 && unresolvedKey.length === 0, unresolvedKey.join(', '))
check(`every soil-survey district resolves to a station by its name`, unresolvedName.length === 0, unresolvedName.join(', '))
const far = [...DISTRICT_CLIMATE].sort((a, b) => b.km - a.km)
console.log(`  farthest from its station: ${far.slice(0, 3).map(d => `${d.district} ${d.km} km`).join(', ')}`)
console.log(`  median distance: ${[...DISTRICT_CLIMATE].sort((a, b) => a.km - b.km)[18].km} km`)
check(`Faisalabad is assigned and its distance is honest`, (climateForDistrict('FAISALABAD')?.km ?? 0) > 50,
  `${climateForDistrict('FAISALABAD')?.station.name} at ${climateForDistrict('FAISALABAD')?.km} km, no station of its own in the dataset`)

// Interpolation must be continuous across the year end, which is where a naive month table breaks.
const jump = Math.abs(normalTemp(STATIONS.LAHORE, 364, 'tavg') - normalTemp(STATIONS.LAHORE, 0, 'tavg'))
check(`the year wraps without a step`, jump < 0.5, `${jump.toFixed(2)} °C across 31 Dec → 1 Jan`)

console.log('\n=== THE WHEAT GDD COLUMN. SETTLED 9 Sep 2026, comparison kept as the evidence ===')
console.log('  The table used to state BASE 0 °C. The arithmetic below is what showed that could not be')
console.log('  right, and Tahir ruled the LABEL was wrong: the column is now published as base 10 °C.')
console.log('  Kept running so the label and the figures can never drift apart again.')
console.log('  The table gives GDD ranges with days after sowing')
console.log('  and calendar dates for three sowing dates. Below: the day on which each published GDD')
console.log('  figure is actually reached, in a normal year, at three Punjab stations.\n')

const PUBLISHED = WHEAT.gdd
  .map(g => ({ stage: g.stage, gdd: parseInt((g.gdd.match(/(\d+)\+?$/) || [])[1] ?? '', 10), das: parseInt((g.das.match(/(\d+)$/) || [])[1] ?? '', 10) }))
  .filter(g => !isNaN(g.gdd) && !isNaN(g.das))

const SOWINGS: [string, number, number][] = [['20 Oct', 9, 20], ['1 Nov', 10, 1], ['20 Nov', 10, 20]]
for (const base of [0, 5, 10]) {
  console.log(`  --- accumulating at base ${base} °C ${base === 10 ? '(the base the table now states)' : ''} ---`)
  for (const [label, m, d] of SOWINGS) {
    const doy = dayOfYear(new Date(2025, m, d))
    for (const stn of ['LAHORE', 'MULTAN', 'SARGODHA']) {
      const acc = accumulateGdd(STATIONS[stn], doy, 220, base)
      const cells = PUBLISHED.map(p => {
        const i = acc.findIndex(v => v >= p.gdd)
        return `${p.gdd}→day ${(i < 0 ? '>220' : String(i)).padStart(4)}`
      })
      console.log(`    sown ${label}  ${stn.padEnd(9)} ${cells.join('  ')}`)
    }
    console.log(`    sown ${label}  ${'PUBLISHED'.padEnd(9)} ${PUBLISHED.map(p => `${p.gdd}→day ${String(p.das).padStart(4)}`).join('  ')}`)
  }
  console.log('')
}

const nov1 = dayOfYear(new Date(2025, 10, 1))
console.log('  A whole Punjab wheat season, sown 1 Nov and standing to 15 April (166 days):')
for (const stn of Object.keys(STATIONS)) {
  const a = accumulateGdd(STATIONS[stn], nov1, 166, 0)[165]
  const b = accumulateGdd(STATIONS[stn], nov1, 166, 5)[165]
  const c = accumulateGdd(STATIONS[stn], nov1, 166, 10)[165]
  console.log(`    ${stn.padEnd(10)} base 0: ${a.toFixed(0).padStart(5)}   base 5: ${b.toFixed(0).padStart(5)}   base 10: ${c.toFixed(0).padStart(5)}`)
}
console.log(`
  WHAT THIS SHOWED, AND WHAT WAS DONE. A Punjab wheat season accumulates about 3,000 degree-days at
  base 0, more than twice the table's own top figure of 1,400, and at base 0 the 1,400 mark is
  passed in early January, when the same table's calendar column puts the crop two months short of
  maturity. At base 10 the season total lands within about 1% of 1,400.

  RULED BY TAHIR, 9 Sep 2026: the figures were right and the LABEL was wrong. The wheat page now
  publishes the column as base 10 °C. The calendar column is unchanged and still comes from the
  days-after-sowing column, which is what it always came from.

  Still open, and only worth chasing if it ever matters: the intermediate boundaries (150 / 450 /
  900) do not line up with the day counts beside them at ANY single base, which says the two columns
  came from different sources rather than one being computed from the other. The season total agrees;
  the middle of the season does not. Nothing on the site reads the GDD column, so nothing depends on
  it, but do not build a stage model on those boundaries without checking them first.
`)
console.log(bad === 0 ? 'climate layer: all invariants pass' : `climate layer: ${bad} FAILURES`)
