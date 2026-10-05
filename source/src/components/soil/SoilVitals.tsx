import { SOIL } from '@/data/soil'
import { districtByKey, medianStats, thousands } from '@/lib/soil'
import { SOIL_BAND_COLOR, SOIL_BAND_LABEL, bandOf, colByKey, fmt, readVal, type SoilColKey } from '@/lib/soilSeverity'

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

type Tile = { key: SoilColKey | 'sulfur'; title: string; shareField?: keyof typeof SOIL.province; shareLabel?: string }

const TILES: Tile[] = [
  { key: 'ph', title: 'pH', shareField: 'ph_gt75', shareLabel: 'above pH 7.5' },
  { key: 'om', title: 'Organic matter', shareField: 'om_lt086', shareLabel: 'below 0.86%' },
  { key: 'p', title: 'Phosphorus', shareField: 'p_lt15', shareLabel: 'below adequate, 15 ppm' },
  { key: 'k', title: 'Potash', shareField: 'k_lt180', shareLabel: 'below 180 ppm' },
  { key: 'zn', title: 'Zinc', shareField: 'zn_lt10', shareLabel: 'below 1.0 ppm' },
  { key: 'sulfur', title: 'Sulfur', shareLabel: 'samples tested, in any district file' },
]

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
          Reading <b style={{ color: 'var(--navy)' }}>{where}</b> · <span className="num">{thousands(s.n)}</span> samples
        </span>
        <span className="cap">▸ press one to draw the map on it</span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
        {TILES.map(t => {
          if (t.key === 'sulfur') {
            return (
              <div key="sulfur" className="vt" style={{ borderColor: 'var(--rust)', borderStyle: 'dashed', borderWidth: 2, cursor: 'default' }}>
                <span className="vt-h">{t.title}</span>
                <span className="vt-n num" style={{ color: 'var(--rust)' }}>0</span>
                <span className="vt-s">{t.shareLabel}</span>
                <span className="vt-b" style={{ background: 'transparent', color: 'var(--rust)', border: '1px solid var(--rust)' }}>never measured</span>
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
              <span className="vt-h">{t.title}</span>
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
                  {SOIL_BAND_LABEL[band]}
                </span>
              )}
              {meanHidesIt && <span className="vt-w">the median passes · most single samples do not</span>}
            </button>
          )
        })}
      </div>

      <p className="cap mt-2 max-w-[140ch]">
        The large figure is the share of samples past Punjab's own working threshold. The chip classifies the
        {d ? ' district' : ' province'} median, the typical field, against VAN's 5-band soil-test table, the same one printed on a
        VAN soil report. The mean is shown beside it; a few very high samples pull the mean up. 2 different questions,
        so the share and the chip can disagree, and where they do the tile says so.
      </p>
    </div>
  )
}
