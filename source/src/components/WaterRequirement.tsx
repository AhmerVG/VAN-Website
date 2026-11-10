import { useMemo, useState } from 'react'
import { REGIONAL_PROFILES } from '@/data/regionalSoil'
import { climateForDistrict, CLIMATE_SOURCE, STATIONS, dayOfYear } from '@/data/climate'
import { seasonWater, eto, normalRainfall, mmToAcreInches, mmToIrrigations, LITRES_PER_MM_PER_ACRE } from '@/lib/water'
import { waterModelFor, WATER_GAPS, KC_MID_ONLY, WATER_SOURCE } from '@/data/waterCrops'
import { useSowing, parseIso, prettyDate, wheatStageDays } from '@/lib/sowing'
import { cropBySlug, parseSowing, MONTHS_LONG, seasonWords } from '@/lib/season'
import { SectionHead } from './bits'

/**
 * WHAT THE CROP DRINKS — FAO-56 crop water requirement. Added 9 September 2026.
 *
 * Irrigation binds Pakistani yield more often than nutrition does, and this site — a crop nutrition
 * site — had nothing to say about it. This says the one thing it can say honestly: how much water a
 * season needs, how much rain normally falls into it, and what the difference means in waterings.
 *
 * Every equation is FAO's (Paper 56), every temperature and rainfall figure is the Pakistan
 * Meteorological Department's, and the three places where the answer is softer than it looks are
 * printed on the page rather than left in a comment:
 *   ETo is by Hargreaves, FAO's own temperature-only method, not Penman-Monteith;
 *   FAO's crop coefficients assume a sub-humid climate, so a Punjab figure is probably HIGHER;
 *   this is crop water requirement, not irrigation requirement — no conveyance loss, no leaching,
 *   and the rain shown is total rain, not what the field keeps.
 */
/* D-317 (26 Oct 2026): visible text cleaned of build notes and page narration, Tahir's instruction */
const SEASON_DAYS: Record<string, number> = { maize: 125, onion: 210, lentil: 170 }
// Tahir 10 Nov 2026 (CR-N15): guava's water figures use the window of the guava crop plan, September to
// February: from 1 September (month index 8) for 181 days, to 28 February. Was the generic fallback, mid-February
// (the start of "Feb–Mar sowing") for 120 days. The crop's own season window (crop.sowing) is unchanged elsewhere.
// A season start date the farmer enters still replaces the start day; the length stays 181 days.
// Tahir 10 Nov 2026 (R3-5): crop.sowing for guava is now "Sep sowing" too, so the season tag, box and date check agree.
const WATER_WINDOW: Record<string, { month: number; day: number; days: number }> = { guava: { month: 8, day: 1, days: 181 } }

export function WaterRequirement({ cropKey, cropName }: { cropKey: string; cropName: string }) {
  const [district, setDistrict] = useState('')
  const [sown] = useSowing(cropKey)
  const model = waterModelFor(cropKey)
  const gap = WATER_GAPS[cropKey]
  const kcMid = KC_MID_ONLY[cropKey]

  // D-151: look up by the survey key (the select's value), which is what DISTRICT_CLIMATE is keyed by.
  const climate = district ? climateForDistrict(district) : null

  // The sowing day: the farmer's own if he gave one, otherwise the first day of VAN's published
  // sowing window for this crop. Which of the two is in use is stated, never assumed silently.
  const crop = cropBySlug(cropKey)
  const windows = crop ? parseSowing(crop.sowing) : []
  const ww = WATER_WINDOW[cropKey]
  const fallbackDoy = ww ? dayOfYear(new Date(2025, ww.month, ww.day)) : windows.length ? dayOfYear(new Date(2025, windows[0].start, 15)) : null
  const sownIso = sown?.kind === 'date' ? sown.iso : null
  const sownDoy = sownIso ? dayOfYear(parseIso(sownIso)!) : fallbackDoy

  const result = useMemo(
    () => (model && climate && sownDoy !== null ? seasonWater(model, climate.station.key, sownDoy) : null),
    [model, climate, sownDoy],
  )

  // For a crop with no complete model: reference ET and rainfall over VAN's own published season
  // length, which is still entirely computed and still worth knowing.
  const partial = useMemo(() => {
    if (model || !climate || sownDoy === null) return null
    // D-181, Tahir 26 Sep 2026: "use the real season length". Was a flat 120 days for every crop, which cut
    // wheat off in February and missed March and April. Wheat now runs to maturity in degree days from the
    // sowing date (lib/sowing.ts, the same model as its stage tool); maize, onion and lentil use FAO's own
    // tabulated season (125, 210 and 170 days, the figures printed in WATER_GAPS); the rest keep 120.
    const sowIso = sownIso ?? (fallbackDoy !== null ? new Date(Date.UTC(2025, 0, fallbackDoy, 12)).toISOString().slice(0, 10) : null)
    const wheatDays = cropKey === 'wheat' && sowIso ? wheatStageDays(sowIso)?.[4] : undefined
    const days = wheatDays ?? ww?.days ?? SEASON_DAYS[cropKey] ?? 120
    let e = 0, r = 0
    for (let d = 0; d < days; d++) { e += eto(climate.station, sownDoy + d); r += normalRainfall(climate.station, sownDoy + d) }
    return { days, eto: e, rain: r }
  }, [model, climate, sownDoy, sownIso, fallbackDoy, cropKey])

  const picker = (
    <label className="grid gap-1">
      <span className="cap">Your district</span>
      <select className="input" value={district} onChange={e => setDistrict(e.target.value)} aria-label="Your district" style={{ minWidth: 220 }}>
        <option value="">Choose your district…</option>
        {REGIONAL_PROFILES.map(p => <option key={p.key} value={p.key}>{p.name}</option>)}
      </select>
    </label>
  )

  return (
    <div id="water">
      <SectionHead
        eyebrow="Water"
        title={`Water use of the ${cropName} crop in a normal season, and the part irrigation must supply.`}
        tone="navy"
        lead="A nutrition plan gives its full result only if the crop gets the water it needs. For your district, the figures below estimate the crop’s water use over the season, the normal rainfall over the same period, and the part of the crop’s water use that normal rainfall does not cover, which must come from irrigation. The water you pump will be more than the irrigation figure, because some water is lost from the watercourse and some drains below the roots; see the limits below."
      />

      <div className="panel p-5 lg:p-6">
        <div className="flex flex-wrap items-end gap-4">
          {picker}
          <p className="cap pb-2 max-w-[40ch]">
            {sownIso
              ? <>Counting from your own date, <b>{prettyDate(sownIso)}</b>.</>
              : ww
                ? <>{/* Tahir 10 Nov 2026 (CR-N15) */}You have not entered a {seasonWords(cropKey).date} at the top of the page, so the water figures are calculated from 1 September to the end of February, the months of VAN’s {cropName} crop plan. To calculate them from your own {seasonWords(cropKey).date}, enter it at the top of the page.</>
              : windows.length
                ? <>{/* D-317: was "counts from the middle of VAN’s published window (May)"; the count starts on the 15th of the window’s first month */}You have not entered a {seasonWords(cropKey).date} at the top of the page, so the water figures are calculated from mid-{MONTHS_LONG[windows[0].start]}, the start of VAN’s published {seasonWords(cropKey).window} for {cropName}. To calculate them from your own {seasonWords(cropKey).date}, enter it at the top of the page.</>
                : null}
          </p>
        </div>

        {!district && (
          <p className="small mt-4 max-w-[140ch]">
            Choose your district to see the figures. They are calculated from the normals (the average
            weather for each month over 30 years) of the nearest weather station that publishes them. The
            page names the station and its distance from your district.
          </p>
        )}

        {climate && (
          <p className="cap mt-4">
            Nearest station with published normals: <b>{climate.station.name}</b>, {climate.km} km away.{' '}
            {climate.km > 100 && <>At that distance the figures below are regional, not local.{' '}</>}
            {CLIMATE_SOURCE.dataset}, {CLIMATE_SOURCE.computedBy}.
          </p>
        )}

        {result && model && (
          <>
            <div className="grid sm:grid-cols-3 gap-4 mt-5">
              <Fig v={`${result.etcMm.toFixed(0)} mm`} l={`the crop needs over ${result.seasonDays} days`} tone="navy" />
              <Fig v={`${result.rainMm.toFixed(0)} mm`} l="normal rainfall in that window" tone="green" />
              <Fig v={`${result.irrigationMm.toFixed(0)} mm`} l="has to be irrigated" tone="rust" />
            </div>
            <p className="small mt-4 max-w-[140ch]">
              The irrigation need is <b>{mmToAcreInches(result.irrigationMm).toFixed(1)} acre-inches</b>, or{' '}
              <b>{(result.irrigationMm * LITRES_PER_MM_PER_ACRE / 1000).toFixed(0)} thousand litres</b> per acre. This
              equals about <b>{mmToIrrigations(result.irrigationMm, 3).toFixed(1)} waterings</b> if each watering
              applies 3 inches. The 3 inches is a common estimate for a flood irrigation, not a measurement of
              your own. If your waterings are larger or smaller, the number of waterings changes with them.
            </p>

            <div className="mt-5 overflow-x-auto tbl-scroll">
              <table className="tbl">
                <thead><tr><th>Stage</th><th className="r">Days</th><th className="r">Crop needs</th><th className="r">Normal rain</th><th className="r">To irrigate</th></tr></thead>
                <tbody>
                  {result.stages.map(s => (
                    <tr key={s.stage}>
                      <td className="font-bold">{s.stage}</td>
                      <td className="r num">{s.days}</td>
                      <td className="r num">{s.etc.toFixed(0)} mm</td>
                      <td className="r num">{s.rain.toFixed(0)} mm</td>
                      <td className="r num" style={{ fontWeight: 700 }}>{Math.max(0, s.etc - s.rain).toFixed(0)} mm</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="cap mt-3 max-w-[140ch]">
              Stage lengths and crop coefficients are FAO’s, for “{model.table11}” and
              “{model.table12}”. Region: <b>{model.region}</b>.
            </p>
          </>
        )}

        {partial && (
          <>
            <div className="grid sm:grid-cols-2 gap-4 mt-5">
              <Fig v={`${partial.eto.toFixed(0)} mm`} l={`reference evapotranspiration over ${partial.days} days`} tone="navy" />
              <Fig v={`${partial.rain.toFixed(0)} mm`} l="normal rainfall in that window" tone="green" />
            </div>
            {kcMid && (
              <p className="small mt-4 max-w-[140ch]">
                At its peak, FAO puts {cropName}’s water use at <b>{kcMid.toFixed(2)} times</b> the reference
                evapotranspiration, which is about <b>{(eto(climate!.station, sownDoy! + 60) * kcMid).toFixed(1)} mm a
                day</b> in mid-season in your district.
              </p>
            )}
            <p className="cap mt-3 max-w-[140ch]">
              <b>Why there is no season total for {cropName}.</b> {gap ?? 'FAO does not publish the stage lengths and crop coefficients this calculation needs for this crop.'}
            </p>
          </>
        )}

        {district && !climate && (
          <p className="small mt-4 max-w-[140ch]">No weather station is linked to this district yet.</p>
        )}

        {district && climate && !result && !partial && (
          <p className="small mt-4 max-w-[140ch]">
            {gap ?? `FAO Paper 56 does not publish the stage lengths and crop coefficients this calculation needs for ${cropName}.`}
          </p>
        )}
      </div>

      <div className="panel-soft p-5 mt-4">
        <span className="eyebrow">Limits of this estimate</span>
        <ol className="grid gap-2 mt-2 max-w-[140ch]">
          <li><b>The estimate does not use the standard equation of the Food and Agriculture Organization
            (FAO).</b> That equation needs humidity, wind and solar radiation, but the Pakistan
            Meteorological Department normals used here give only temperature and rainfall. The water use of a
            reference crop is therefore calculated with the <b>Hargreaves</b> method, which FAO gives for use
            when only temperature data are available.</li>
          <li><b>The estimate is probably low for Punjab.</b> FAO’s crop coefficients, the factors that turn
            the reference water use into a crop’s water use, are published for a sub-humid climate, which FAO
            describes as relative humidity of about 45% and light wind. Punjab in the dry season is drier and
            windier than that, and FAO’s own correction for arid climates would <i>raise</i> the coefficients.
            That correction cannot be applied without humidity and wind data, so the crop’s actual water use
            is probably higher than the estimate shown.</li>
          <li><b>The crop water use figure is the water the crop itself uses.</b> The water you have to pump
            will be more, because the figure makes no allowance for water lost from the watercourse on the way,
            for water that drains below the roots, or for the extra water needed to leach a salty soil.</li>
          <li><b>The rainfall figure counts <i>all</i> the rain that falls in a normal season, not only the part
            the crop can use.</b> Part of a heavy shower runs off or drains away, depending on the soil and slope,
            so the irrigation needed may be more than the irrigation figure shown.</li>
        </ol>
        <p className="cap mt-3">
          Method: {WATER_SOURCE.paper}, {WATER_SOURCE.tables}. Temperature and rainfall:{' '}
          {CLIMATE_SOURCE.dataset}, {CLIMATE_SOURCE.computedBy}. {CLIMATE_SOURCE.note}
        </p>
      </div>
    </div>
  )
}

function Fig({ v, l, tone }: { v: string; l: string; tone: 'navy' | 'green' | 'rust' }) {
  const colour = tone === 'green' ? 'var(--green)' : tone === 'rust' ? 'var(--rust)' : 'var(--navy)'
  return (
    <div className="panel-soft p-4">
      <div className="display text-[30px]" style={{ color: colour }}>{v}</div>
      <div className="cap mt-1">{l}</div>
    </div>
  )
}
export { STATIONS }
