import { useMemo, useState } from 'react'
import { useUrduMode } from '@/lib/readingMode'
import { UR_SOIL } from '@/data/urdu'
import { SOIL_BAND_ORDER, SOIL_BAND_LABEL, SOIL_BAND_COLOR, SOIL_PARAMETER_LABEL, SOIL_PARAMETER_UNIT, soilParameterInline, bandForValue } from '@/data/soilThresholds'
import type { SoilBand, SoilParameter } from '@/data/soilThresholds'
import { REGIONAL_PROFILES, REGIONAL_SOURCE, regionalProfile } from '@/data/regionalSoil'
import { mappedParameters } from '@/lib/soilAdjustment'
import { cardTextByParam, type CardInfo } from '@/lib/gpsCard'
import type { SoilInputs, SoilCrop } from '@/lib/soilAdjustment'

/** D-151: labels that fit a 5-column row on a 360px phone. */
const SOIL_BAND_SHORT: Record<string, string> = { critical: 'Crit', weak: 'Weak', average: 'Avg', moderate: 'Mod', healthy: 'Good' }

/** Where a band on screen came from: the farmer's own report, their district's survey average, or (D-279) the Soil
 *  Atlas card for the area near his land. */
export type BandSource = Partial<Record<SoilParameter, 'farmer' | 'district' | 'card'>>
/** D-279: the Soil Atlas card behind the rows (the type lives in lib/gpsCard.ts, beside the link that carries it). */
export type { CardInfo } from '@/lib/gpsCard'

function fmtValue(parameter: SoilParameter, value: number) {
  const unit = SOIL_PARAMETER_UNIT[parameter]
  const rounded = value >= 100 ? Math.round(value) : Math.round(value * 100) / 100
  return unit ? `${rounded} ${unit}` : String(rounded)
}

/**
 * Soil-test band picker — feeds the soil-adjustment layer in planCalc.ts. Shows band NAMES and
 * VAN's own colour code (this is the farmer's actual soil-report reading, not internal rationale),
 * but never the underlying multiplier, band cutoffs or bump-sizing formula — those stay in
 * soilThresholds.ts / soilAdjustment.ts per the standing rule that the public UI shows inputs and
 * outcomes, never the scoring mechanism. Only shows the parameters WHEAT_SOIL_PRODUCT_MAP has a
 * product for.
 *
 * The district row above it is the regional layer (8 Sep 2026): a farmer with no soil report picks
 * their district and every row fills in from the Punjab survey's own average for that district. The
 * fill is a starting point and is labelled as one on every row it touches — the farmer overrides any
 * row by tapping a band, and that row then reads as theirs, not the district's.
 */
/* D-317 (26 Oct 2026): visible text cleaned of build notes and page narration, Tahir's instruction */
export function SoilAdjustmentPanel({ crop, soilInputs, bandSource, district, card = null, onChange, onPickDistrict, onClear }: {
  crop: SoilCrop
  soilInputs: SoilInputs
  bandSource: BandSource
  district: string
  card?: CardInfo | null
  onChange: (p: SoilParameter, band: SoilBand | undefined) => void
  onPickDistrict: (key: string) => void
  onClear: () => void
}) {
  const profile = useMemo(() => regionalProfile(district), [district])
  const parameters = useMemo(() => mappedParameters(crop), [crop])
  const anySet = Object.keys(soilInputs).length > 0
  // D-181, Tahir 26 Sep 2026: let the farmer type the number off his report. The number is read into
  // VAN's band for it with the same cutoffs the band buttons stand for; the buttons still work as before.
  const [typed, setTyped] = useState<Partial<Record<SoilParameter, string>>>({})

  return (
    <div className="panel-soft p-4">
      <div className="cap font-bold uppercase tracking-[.06em] mb-1">Have a soil test? Adjust the plan for it</div>
      <p className="small muted mb-3">Type the number from your soil report, or pick its band, for any of these. The plan above adds product where your land is short. For phosphorus, potash and zinc it cuts the rate by 1/4 where your reading is healthy. Nitrogen is not cut. Leave a row blank if you have no reading for it. This adjustment is a pilot.</p>

      <div className="panel p-3 mb-3" style={{ background: '#fff' }}>
        <div className="cap font-bold uppercase tracking-[.06em] mb-1">No soil test yet? Start from your district</div>
        <div className="flex flex-wrap items-center gap-2">
          <select
            className="input"
            style={{ flex: '1 1 200px', minWidth: 180 }}
            value={district}
            onChange={e => onPickDistrict(e.target.value)}
            aria-label="Your district"
          >
            <option value="">Choose your district…</option>
            {REGIONAL_PROFILES.map(p => <option key={p.key} value={p.key}>{p.name}</option>)}
          </select>
          {anySet && <button className="btn btn-sm" onClick={() => { setTyped({}); onClear() }}>Clear all</button>}
        </div>
        {/* D-279: the rows came from the Soil Atlas card, not from the district; the district stays picked as the default.
            Its last sentence (20 Oct 2026, low finding of the review): choosing the district already picked does nothing in a
            list, so it now says how; was "Pick your district again above to use the district instead." */}
        {profile && card && Object.values(bandSource).includes('card') && (
          <p className="cap mt-2" data-card-note style={{ lineHeight: 1.5 }}>
            Filled in from the Soil Atlas card for the area near your land: the {REGIONAL_SOURCE.survey}, {REGIONAL_SOURCE.window}, readings within {card.r} km, {card.n.toLocaleString('en-US')} samples. Not a test of your field. Rows the card has no reading for are left blank, not filled from the district. To use the district’s readings instead, press Clear all, then choose your district.
          </p>
        )}
        {profile && !(card && Object.values(bandSource).includes('card')) && (
          <p className="cap mt-2" style={{ lineHeight: 1.5 }}>
            Filled in from the {REGIONAL_SOURCE.survey}, {REGIONAL_SOURCE.window}. {profile.n.toLocaleString()} samples in {profile.name}.
            {' '}{REGIONAL_SOURCE.caution}
            {/* D-316: names only rows this crop shows that are actually blank, never a row the farmer filled himself (was every missing analyte). */}
            {(() => { const miss = profile.missing.filter(m => parameters.includes(m) && soilInputs[m] === undefined); return miss.length > 0 && <> The survey has no valid {miss.map(m => soilParameterInline(m)).join(', ')} reading here, so {miss.length > 1 ? 'those rows are' : 'that row is'} left blank.</> })()}
            {/* D-271: the Soil Atlas's own "not comparable" note (D-181), for the district fill, naming only rows this crop shows that are actually blank (a row kept from an earlier district or typed by the farmer is not named). */}
            {(() => {
              const nc = profile.notComparable.filter(m => parameters.includes(m) && soilInputs[m] === undefined)
              if (nc.length === 0) return null
              // D-271 wording, Tahir 19 Oct 2026: copper here is below every other district; iron is below most (Jhelum's iron is lower still).
              const hasFe = nc.includes('Fe'), hasCu = nc.includes('Cu')
              const lead = hasFe && hasCu ? 'Copper here reads far below every other district, and iron far below most,'
                : hasCu ? 'Copper here reads far below every other district,'
                : hasFe ? 'Iron here reads far below most districts,'
                : `${nc.map((m, i) => (i ? soilParameterInline(m) : SOIL_PARAMETER_LABEL[m])).join(' and ')} here ${nc.length > 1 ? 'read' : 'reads'} far below other districts,`
              return <> {lead} which points to a different laboratory method rather than different soil. {nc.length > 1 ? 'They are' : 'It is'} not comparable, so {nc.length > 1 ? 'those rows are' : 'that row is'} left blank.</>
            })()}
          </p>
        )}
      </div>

      <div className="grid gap-2.5">
        {parameters.map(param => {
          const fromDistrict = bandSource[param] === 'district'
          const fromCard = bandSource[param] === 'card'
          const districtValue = profile?.values[param]
          const cardValue = card?.values[param]
          return (
            <div key={param} className="grid gap-1">
              <span className="small font-bold">
                {SOIL_PARAMETER_LABEL[param]}
                <UrSoil param={param} />
                {/* 11 Sep 2026, Tahir's ruling (sheet item E1). A 1:2 soil-to-water EC reading and a
                    saturation-extract ECe differ by roughly 1.5 to 3 times, so a reading compared
                    against the wrong scale lands in the wrong band. VAN's lab reports the saturation
                    extract, and the panel now says so, the same way the micronutrient rows name their
                    extractant question rather than leaving it silent. */}
                {param === 'EC' && (
                  <span className="cap block" style={{ fontWeight: 400 }}>Read as saturation extract, ECe. A 1:2 soil-to-water reading is a different scale and is not comparable to these bands.</span>
                )}
                {fromDistrict && districtValue !== undefined && (
                  <span className="cap block" style={{ fontWeight: 400 }}>{profile?.name} typical · {fmtValue(param, districtValue)}</span>
                )}
                {fromCard && cardValue !== undefined && card && (
                  <span className="cap block" data-card-row={param} style={{ fontWeight: 400 }}>Soil card, {card.r} km around your land · {cardTextByParam(param, cardValue)}{SOIL_PARAMETER_UNIT[param] ? ` ${SOIL_PARAMETER_UNIT[param]}` : ''}</span>
                )}
              </span>
              <div className="flex flex-wrap items-center gap-2">
                <label className="flex items-center gap-2 cap">
                  Your reading
                  <input type="number" inputMode="decimal" step="any" min="0" className="input sb-num"
                    aria-label={`${SOIL_PARAMETER_LABEL[param]} reading${SOIL_PARAMETER_UNIT[param] ? `, ${SOIL_PARAMETER_UNIT[param]}` : ''}`}
                    value={typed[param] ?? ''}
                    onChange={e => {
                      const v = e.target.value
                      setTyped(t => ({ ...t, [param]: v }))
                      onChange(param, v === '' ? undefined : bandForValue(param, Number(v)))
                    }} />
                  {SOIL_PARAMETER_UNIT[param] && <span>{SOIL_PARAMETER_UNIT[param]}</span>}
                </label>
                {typed[param] && !bandForValue(param, Number(typed[param])) && (
                  <span className="cap" style={{ color: 'var(--rust)' }}>Outside VAN's table for this reading, so the plan does not change for it.</span>
                )}
              </div>
              <div className="grid gap-1" style={{ gridTemplateColumns: 'repeat(5, minmax(0, 1fr))' }}>
                {SOIL_BAND_ORDER.map(band => {
                  const active = soilInputs[param] === band
                  return (
                    <button
                      key={band}
                      onClick={() => { setTyped(t => ({ ...t, [param]: '' })); onChange(param, active ? undefined : band) }}
                      className="btn btn-sm sb-btn"
                      // D-151 (QA 4, 34): 40px tall; short labels under 420px (full word kept in aria-label);
                      // selected text white only on the 2 dark fills, a deep navy (#0C1710, >= 5.4:1) on the
                      // 3 light ones; a district fill is marked by a dashed border, not by 0.82 opacity.
                      // Was: padding '5px 2px', fontSize 11, white text except 'average', opacity 0.82.
                      style={{
                        padding: '4px 2px', fontSize: 11, minWidth: 0, minHeight: 40, lineHeight: 1.1,
                        ...(active
                          ? { background: SOIL_BAND_COLOR[band], color: band === 'critical' || band === 'healthy' ? '#fff' : '#0C1710', border: fromDistrict || fromCard ? '2px dashed #0C1710' : '1px solid transparent' }
                          : { background: '#fff', color: 'var(--navy)', border: '1px solid var(--line)' }),
                      }}
                      aria-pressed={active}
                      aria-label={`${SOIL_PARAMETER_LABEL[param]}: ${SOIL_BAND_LABEL[band]}`}
                    ><span className="sb-full">{SOIL_BAND_LABEL[band]}</span><span className="sb-short" aria-hidden="true">{SOIL_BAND_SHORT[band]}</span></button>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
      {Object.values(bandSource).includes('district') && (
        <p className="cap mt-3">Rows marked <em>typical</em> are the survey's middle reading for your area, not a reading from your land. Tap any band to replace it with your own.</p>
      )}
      {Object.values(bandSource).includes('card') && (
        <p className="cap mt-3">Rows marked <em>soil card</em> are the survey's middle reading for the area near your land, not a reading from your land. Tap any band to replace it with your own.</p>
      )}
    </div>
  )
}

/** The soil-report parameter in Urdu, under its English name. A soil report is exactly the document
 *  a grower is most likely to be reading in Urdu, so this is the highest-value place for it. */
function UrSoil({ param }: { param: SoilParameter }) {
  const [urdu] = useUrduMode()
  const t = urdu ? UR_SOIL[param] : undefined
  if (!t) return null
  return <span dir="rtl" lang="ur" className="block urdu cap">{t}</span>
}
