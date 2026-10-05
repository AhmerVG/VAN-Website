import { SOIL } from '@/data/soil'
import { SOIL_READINGS } from '@/data/soilReadings'
import { analyteByKey, districtByKey, fmtVal as fmtRaw, medianStats, type AnalyteKey } from '@/lib/soil'

// '0.62%' not '0.62 %': a percent sign sits on the number.
const fmtVal = (a: AnalyteKey, v: number | null) => fmtRaw(a, v).replace(' %', '%')

/**
 * D-243: the panel beside the map now reads the reading that is on the map (the picker, the autoplay
 * cycle and the tiles below all drive it). Copy and sources: src/data/soilReadings.ts. Figures are
 * read from SOIL (shares, means) and SOIL_MEDIANS here, so they cannot drift from the map.
 */
export function SoilReadingPanel({ analyte, district }: { analyte: AnalyteKey; district: string | null }) {
  const r = SOIL_READINGS.find(x => x.key === analyte) ?? SOIL_READINGS[0]
  const A = analyteByKey(r.key)
  const P = SOIL.province
  const pm = medianStats(P, null) as unknown as Record<string, number | null>
  const medP = fmtVal(r.key, pm[r.key] ?? null)
  const share = r.share ? (P[r.share.field] as number | null) : null
  const headline = r.share && share != null ? `${share.toFixed(1)}% ${r.share.words}.` : r.medianHeadline ? r.medianHeadline(medP) : ''
  const d = districtByKey(district)
  const dm = d ? (medianStats(d.summary, d.key) as unknown as Record<string, number | null>)[r.key] ?? null : null
  const dShare = d && r.share ? (d.summary[r.share.field] as number | null) : null
  return (
    <div className="panel-soil p-5" aria-live="polite">
      <span className="eyebrow soil">Reading it · <span style={{ textTransform: /[a-z]H\b|pH/.test(r.name) ? 'none' : undefined }}>{r.name}</span></span>
      <h3>{headline}</h3>
      <dl className="rd-list mt-3">
        <dt>The colour</dt>
        <dd>{A.note.charAt(0).toUpperCase() + A.note.slice(1)}.{r.noMedianLine ? '' : ` Half of Punjab’s samples read below ${medP}, the median.`}{r.extra ? ` ${r.extra}` : ''}</dd>
        <dt>Why it matters for the crop</dt>
        <dd>{r.crop}</dd>
        <dt>{r.groundLabel}</dt>
        <dd>{r.ground}</dd>
        {d && (
          <>
            <dt>In {d.name}</dt>
            <dd>Median {fmtVal(r.key, dm)}{dShare != null && r.share ? `; ${dShare.toFixed(1)}% ${r.share.words}` : ''}. Punjab: {medP}{share != null && r.share ? `, ${share.toFixed(1)}%` : ''}.</dd>
          </>
        )}
      </dl>
      <p className="cap mt-3">Sulfur has no map, because it was never measured. See the analyte list below.</p>
    </div>
  )
}
