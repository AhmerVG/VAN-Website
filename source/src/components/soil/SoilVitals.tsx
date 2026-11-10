import { SOIL } from '@/data/soil'
import { districtByKey, medianStats, thousands } from '@/lib/soil'
import { SOIL_BAND_COLOR, SOIL_BAND_LABEL, SOIL_BAND_ORDER, bandOf, colByKey, fmt, readVal, type SoilColKey } from '@/lib/soilSeverity'

/** D-151 (QA 9): band chip TEXT in a deep shade of each band hue (Average #EBC24A on cream was 1.4:1). */
const BAND_TEXT: Record<string, string> = { critical: '#9E2233', weak: '#7E3E20', average: '#6E5208', moderate: '#2F6B2D', healthy: '#2A5E33' }

/**
 * THE VITALS — 10 September 2026, rebuilt from the five static tiles.
 *
 * Tahir: "MAKE THE PANEL INTERACTIVE AND LINKED TO DATA... NO STATIC."
 *
 * WHAT WAS THERE. Five tiles that counted up once on scroll and then said the same five province
 * numbers forever, whatever the reader did with the rest of the page. A reader could pick Multan on
 * the map, watch every chart under it redraw, and the five biggest numbers on the page would carry
 * on describing Punjab.
 *
 * WHAT THEY DO NOW. They read the district in focus, with the province figure beside each one so
 * nothing is lost by selecting. They carry VAN's own band colour. And they are the page's controls:
 * pressing one sets the parameter that the map draws and the matrix highlights, so a reader who
 * wants to know about potash presses potash rather than hunting for it.
 *
 * TWO NUMBERS, AND THEY ARE NOT THE SAME KIND OF NUMBER. The big figure is the SHARE of samples past
 * Punjab's own working threshold — an urgency number, counted over individual samples. The band chip
 * classifies the MEDIAN against VAN's 5-band table (D-241, 1 Oct 2026; it classified the mean until then). They can disagree, and where they do that is
 * the finding, not an error: zinc's mean is healthy across Punjab while three-fifths of single
 * samples sit below the threshold. The tile says so in that case rather than letting the green chip
 * carry an impression the data does not support.
 */

type Tile = { key: SoilColKey | 'sulfur'; title: string; shareField?: keyof typeof SOIL.province; shareLabel?: string; line?: string }

const TILES: Tile[] = [
  { key: 'ph', title: 'pH', shareField: 'ph_gt75', shareLabel: 'above pH 7.5' },
  // Tahir 7 Nov 2026 (KN-8): `line` is the Punjab cut-off named in the tile's band note.
  { key: 'om', title: 'Organic matter', shareField: 'om_lt086', shareLabel: 'below 0.86%', line: '0.86%, which Punjab’s working thresholds rate as low' },
  { key: 'p', title: 'Phosphorus', shareField: 'p_lt15', shareLabel: 'below adequate, 15 ppm', line: '15 ppm, the lowest level that Punjab’s working thresholds rate as adequate' },
  { key: 'k', title: 'Potassium', shareField: 'k_lt180', shareLabel: 'below 180 ppm', line: '180 ppm, which Punjab’s working thresholds rate as low' },
  { key: 'zn', title: 'Zinc', shareField: 'zn_lt10', shareLabel: 'below 1.0 ppm', line: '1.0 ppm, which Punjab’s working thresholds rate as low' },
  { key: 'sulfur', title: 'Sulfur', shareLabel: 'samples tested for sulfur' },
]

/* D-317 (26 Oct 2026): visible text cleaned of build notes and page narration, Tahir's instruction */
export function SoilVitals({ district, param, onParam }: {
  district: string | null
  param: SoilColKey
  onParam: (k: SoilColKey) => void
}) {
  const d = districtByKey(district)
  const s = d ? d.summary : SOIL.province
  const sm = medianStats(s, d ? d.key : null)
  const P = SOIL.province
  const where = d ? d.name : 'Punjab, all 36 districts'

  return (
    <div>
      <div className="flex items-baseline justify-between gap-3 flex-wrap mb-2">
        <span className="cap">
          Showing <b style={{ color: 'var(--navy)' }}>{where}</b> · <span className="num">{thousands(s.n)}</span> samples
        </span>
        <span className="cap">▸ tap a soil test to show it on the map</span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
        {TILES.map(t => {
          if (t.key === 'sulfur') {
            return (
              <div key="sulfur" className="vt" style={{ borderColor: 'var(--rust)', borderStyle: 'dashed', borderWidth: 2, cursor: 'default' }}>
                <span className="vt-h">{t.title}</span>
                <span className="vt-n num" style={{ color: 'var(--rust)' }}>0</span>
                <span className="vt-s">{t.shareLabel}</span>
                <span className="vt-b" style={{ background: 'transparent', color: 'var(--rust)', border: '1px solid var(--rust)' }}>not tested</span>
              </div>
            )
          }
          const k = t.key
          const c = colByKey(k)
          const mean = readVal(s, k)
          const median = readVal(sm, k)
          const band = bandOf(k, median)
          const share = t.shareField ? (s[t.shareField] as number | null) : null
          const pShare = t.shareField ? (P[t.shareField] as number | null) : null
          const on = param === k
          // The one case worth naming out loud: the median passes and most single samples do not.
          const meanHidesIt = share != null && share >= 50 && (band === 'healthy' || band === 'moderate')
          return (
            <button key={k} onClick={() => onParam(k)} aria-pressed={on}
              className={`vt ${on ? 'on' : ''}`}
              style={band ? { borderTop: `4px solid ${SOIL_BAND_COLOR[band]}` } : undefined}
              title={`${c.label} · press to draw the map on it`}>
              <span className="vt-h" style={k === 'ph' ? { textTransform: 'none' } : undefined}>{t.title}</span>{/* D-301, 22 Oct 2026: "pH", never "PH" */}
              {/* The big figure is a SHARE and the band classifies the MEDIAN (D-241). Colouring the share with
                  the mean's colour put a green 59.0% on the zinc tile, which is two true numbers
                  arranged into a false impression. The share is ink; the band colours the tile's top
                  edge and its chip, where it belongs. */}
              <span className="vt-n num">{share == null ? 'n.d.' : `${share.toFixed(1)}%`}</span>
              <span className="vt-s">{t.shareLabel}</span>
              <span className="vt-m num">
                median {fmt(k, median)}{c.unit === '%' ? '%' : c.unit ? ` ${c.unit}` : ''} · mean {fmt(k, mean)}{c.unit === '%' ? '%' : c.unit ? ` ${c.unit}` : ''}
                {d && pShare != null && <span className="vt-p"> · Punjab {pShare.toFixed(1)}%</span>}
              </span>
              {band && (
                <span className="vt-b" style={{ background: `${SOIL_BAND_COLOR[band]}22`, color: BAND_TEXT[band], border: `1px solid ${SOIL_BAND_COLOR[band]}` }}>
                  {/* Tahir 7 Nov 2026 (CR-18): was "VAN band: Average"; now "VAN band 3 of 5: Average". */}
                  VAN band {SOIL_BAND_ORDER.indexOf(band) + 1} of 5: {SOIL_BAND_LABEL[band]}
                </span>
              )}
              {/* Tahir 7 Nov 2026 (KN-8): reviser's wording. Was: 'on VAN’s 5-band scale the median is in the ... band, but most samples are below Punjab’s threshold for low' */}
              {meanHidesIt && t.line && <span className="vt-w">The median, {fmt(k, median)}{c.unit === '%' ? '%' : c.unit ? ` ${c.unit}` : ''}, is in the {SOIL_BAND_LABEL[band!]} band of VAN’s 5-band scale but below {t.line}. The 2 scales draw their lines at different levels.</span>}
            </button>
          )
        })}
      </div>

      <p className="cap mt-2 max-w-[140ch]">
        {/* Tahir 7 Nov 2026 (KN-9): the term is defined here; the body is named as in his chosen option (Punjab soil laboratories). */}
        The large percentage is the share of samples below Punjab’s working threshold for that soil test (above it, for
        pH). Punjab’s working thresholds are the cut-offs used by Punjab’s soil laboratories to rate a result as low or adequate. The band underneath is the band in which the{d ? ' district' : ' province'} median
        falls on VAN’s 5-band soil-test scale, the scale used on a VAN soil report. The mean is shown beside the median; a few
        samples with very high values raise the mean. The percentage and the band can disagree for 2 reasons: the percentage counts
        individual samples while the band describes only the median, and VAN’s bands are set at different levels from Punjab’s thresholds.
        {/* Tahir 7 Nov 2026 (KN-9): was 'The percentage counts individual samples and the band describes the median, so the 2 can disagree.' */}
      </p>
    </div>
  )
}
