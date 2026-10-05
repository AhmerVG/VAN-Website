import { useMemo, useState } from 'react'
import { useUrduMode } from '@/lib/readingMode'
import { UR_SOIL } from '@/data/urdu'
import { SOIL_BAND_ORDER, SOIL_BAND_LABEL, SOIL_BAND_COLOR, SOIL_PARAMETER_LABEL, SOIL_PARAMETER_UNIT, soilParameterInline, bandForValue } from '@/data/soilThresholds'
import type { SoilBand, SoilParameter } from '@/data/soilThresholds'
import { REGIONAL_PROFILES, REGIONAL_SOURCE, regionalProfile } from '@/data/regionalSoil'
import { mappedParameters } from '@/lib/soilAdjustment'
import type { SoilInputs, SoilCrop } from '@/lib/soilAdjustment'

/** D-151: labels that fit a 5-column row on a 360px phone. */
const SOIL_BAND_SHORT: Record<string, string> = { critical: 'Crit', weak: 'Weak', average: 'Avg', moderate: 'Mod', healthy: 'Good' }

/** Where a band on screen came from: the farmer's own report, or their district's survey average. */
export type BandSource = Partial<Record<SoilParameter, 'farmer' | 'district'>>

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
export function SoilAdjustmentPanel({ crop, soilInputs, bandSource, district, onChange, onPickDistrict, onClear }: {
  crop: SoilCrop
  soilInputs: SoilInputs
  bandSource: BandSource
  district: string
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
      <p className="small muted mb-3">Type the number from your soil report, or pick its band, for any of these. The plan above adds product where your land is short. For phosphorus, potash and zinc it takes a quarter off where your reading is healthy, never on nitrogen. Leave a row blank if you have no reading for it. This adjustment is a pilot.</p>

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
        {profile && (
          <p className="cap mt-2" style={{ lineHeight: 1.5 }}>
            Filled in from the {REGIONAL_SOURCE.survey}, {REGIONAL_SOURCE.window}. {profile.n.toLocaleString()} samples in {profile.name}.
            {' '}{REGIONAL_SOURCE.caution}
            {profile.missing.length > 0 && <> The survey has no valid {profile.missing.map(m => soilParameterInline(m)).join(', ')} reading here, so {profile.missing.length > 1 ? 'those rows are' : 'that row is'} left blank.</>}
          </p>
        )}
      </div>

      <div className="grid gap-2.5">
        {parameters.map(param => {
          const fromDistrict = bandSource[param] === 'district'
          const districtValue = profile?.values[param]
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
                          ? { background: SOIL_BAND_COLOR[band], color: band === 'critical' || band === 'healthy' ? '#fff' : '#0C1710', border: fromDistrict ? '2px dashed #0C1710' : '1px solid transparent' }
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
