import { useMemo, useState } from 'react'
import { REGIONAL_PROFILES } from '@/data/regionalSoil'
import { climateForDistrict, CLIMATE_SOURCE, STATIONS, dayOfYear } from '@/data/climate'
import { seasonWater, eto, normalRainfall, mmToAcreInches, mmToIrrigations, LITRES_PER_MM_PER_ACRE } from '@/lib/water'
import { waterModelFor, WATER_GAPS, KC_MID_ONLY, WATER_SOURCE } from '@/data/waterCrops'
import { useSowing, parseIso, prettyDate, wheatStageDays } from '@/lib/sowing'
import { cropBySlug, parseSowing, MONTHS_LONG } from '@/lib/season'
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
const SEASON_DAYS: Record<string, number> = { maize: 125, onion: 210, lentil: 170 }

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
  const fallbackDoy = windows.length ? dayOfYear(new Date(2025, windows[0].start, 15)) : null
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
    const days = wheatDays ?? SEASON_DAYS[cropKey] ?? 120
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
        title={`How much water the ${cropName} season needs.`}
        tone="navy"
        lead="A nutrition plan only works if the crop gets its water. This panel shows what the season needs, what rain normally gives, and what must come from irrigation."
      />

      <div className="panel p-5 lg:p-6">
        <div className="flex flex-wrap items-end gap-4">
          {picker}
          <p className="cap pb-2 max-w-[40ch]">
            {sownIso
              ? <>Counting from your own sowing date, <b>{prettyDate(sownIso)}</b>.</>
              : windows.length
                ? <>No sowing date given, so this counts from the middle of VAN’s published window ({MONTHS_LONG[windows[0].start]}). Answer the question at the top of the page and it uses your date instead.</>
                : null}
          </p>
        </div>

        {!district && (
          <p className="small mt-4 max-w-[140ch]">
            Pick your district and the figures appear. They come from the nearest weather station with
            published normals, and the page tells you which one and how far away it is.
          </p>
        )}

        {climate && (
          <p className="cap mt-4">
            Nearest station with published normals: <b>{climate.station.name}</b>, {climate.km} km away.{' '}
            {climate.km > 100 && <>That is a long way, and the figures below are regional rather than local because of it.{' '}</>}
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
              That is <b>{mmToAcreInches(result.irrigationMm).toFixed(1)} acre-inches</b>. About{' '}
              <b>{mmToIrrigations(result.irrigationMm, 3).toFixed(1)} waterings</b> if a watering puts on
              three inches, and <b>{(result.irrigationMm * LITRES_PER_MM_PER_ACRE / 1000).toFixed(0)} thousand
              litres</b> an acre. The three inches is a common reckoning for a flood irrigation, not a
              measurement of yours. Count your own and the number of waterings moves with it.
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
                At its peak, FAO puts {cropName}’s water use at <b>{kcMid.toFixed(2)} times</b> that
                reference, so around <b>{(eto(climate!.station, sownDoy! + 60) * kcMid).toFixed(1)} mm a
                day</b> in mid-season here. What cannot be given is the season total, and the reason is
                below.
              </p>
            )}
            <p className="cap mt-3 max-w-[140ch]">
              <b>Why there is no season total for {cropName}.</b> {gap ?? 'FAO does not publish both of the two pieces this calculation needs for this crop, the stage lengths and the crop coefficients, so no season figure is given.'}
            </p>
          </>
        )}

        {district && !climate && (
          <p className="small mt-4 max-w-[140ch]">No weather station is mapped to this district yet, so no figure is given.</p>
        )}

        {district && climate && !result && !partial && (
          <p className="small mt-4 max-w-[140ch]">
            {gap ?? `FAO Paper 56 does not publish both pieces this calculation needs for ${cropName}, the stage lengths and the crop coefficients, so no figure is given rather than a guessed one.`}
          </p>
        )}
      </div>

      <div className="panel-soft p-5 mt-4">
        <span className="eyebrow">3 things this number is not</span>
        <ol className="grid gap-2 mt-2 max-w-[140ch]">
          <li><b>It is not measured with the full equation.</b> FAO’s standard method needs humidity,
            wind and solar radiation. The Pakistan Meteorological Department normals this site carries
            have temperature and rain and not those, so the reference figure uses <b>Hargreaves</b>, 
            the method FAO itself gives for exactly this case. It is an estimate.</li>
          <li><b>It is probably on the low side for Punjab.</b> FAO’s crop coefficients are published
            for a sub-humid climate. Its own caption says relative humidity around 45% and light wind.
            Punjab in the dry season is drier and windier than that, and FAO’s own correction for arid
            climates <i>raises</i> the coefficient. Applying that correction needs humidity and wind
            data this site does not have, so the figure above is closer to a floor than a ceiling.</li>
          <li><b>It is what the crop uses, not what you have to pump.</b> Nothing here allows for what
            a watercourse loses on the way, for water running past the roots, or for the extra needed
            to leach a salty soil. And the rain shown is <i>all</i> the rain. How much of a July
            downpour a field actually keeps depends on your soil and your slope, and there is no
            honest way to work that out from here.</li>
        </ol>
        <p className="cap mt-3">
          Method: {WATER_SOURCE.paper}, {WATER_SOURCE.tables}. Temperature and rainfall:{' '}
          {CLIMATE_SOURCE.dataset} ({CLIMATE_SOURCE.period}), {CLIMATE_SOURCE.computedBy}. {CLIMATE_SOURCE.note}
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
