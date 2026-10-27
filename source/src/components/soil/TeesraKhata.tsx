import { useEffect, useMemo, useRef, useState } from 'react'
import { GRID, DISTRICTS, districtByKey, thousands } from '@/lib/soil'
import { SOIL_MEDIANS } from '@/data/soilMedians'
import { SOIL_GRID } from '@/data/soil'
import { DISTRICT_PROFILES } from '@/data/districtSoil'
import { bandOf, colByKey, SOIL_BAND_COLOR, SOIL_BAND_LABEL, type SoilBand } from '@/lib/soilSeverity'
import { TEHSILS, CELL_TEHSIL, DISTRICT_UR } from '@/data/soilTehsils'
import { BAND_UR, phWord, READING_UR, KHATA_UR, GPS_UR, type KhataKey } from '@/data/soilUrdu'
import { horseSvg } from '@/data/vanHorse'
import { regionalProfile } from '@/data/regionalSoil'
import { COST_PLANS } from '@/data/costPlans'
import { calcPlan } from '@/lib/planCalc'
import { computeSoilBumps, type SoilInputs } from '@/lib/soilAdjustment'
import type { SoilParameter } from '@/data/soilThresholds'
import { wa } from '@/data/site'
import { usePublishShared } from '@/lib/shareState'
import { GpsCard } from './GpsCard'
import { MAP_LATIN, MAP_URDU, boxFree, haloText, useMapFonts, type MapBox as Box, type MapName } from '@/lib/mapText'

/**
 * TEESRA KHATA ON THE SOIL ATLAS — the farmer screens, 18 Oct 2026.
 *
 * Tahir's campaign "Teesra Khata" (the third ledger): every Punjab field keeps the fard for the land and the
 * khata for the crop; the third, the soil's record kept by the Punjab government, is open to every farmer for
 * his area. A farmer who comes in from the Facebook post meets the full-screen door (soil-door.inline.html),
 * then these screens, Urdu first:
 *   district → its khata → tehsil (136, each with its sample count; Lahore and Lahore City joined, D-274) → his square (about 6,500 acres)
 *   D-280 (20 Oct 2026): district, its khata, the tehsil list and the tehsil's khata share 1 screen; once a tehsil is picked the GPS grid
 *   card's ways open under it (Union Council or chak, the map, a pasted pin, his location), beside the old path to the square.
 *   → the soil card for WhatsApp (no product, no price) → the wheat bundle and the calculator.
 * Plan: F:\Story and Marketing\Mitti Ka hissab\Soil Atlas Plan 18 Oct 2026.md (items 2, 3, 4, 6, 7, 8).
 *
 * The figures are the page's own: district medians from soilMedians.ts, square medians from GRID, and the
 * tehsil medians from soilTehsils.ts, read from the same 36 workbooks. Bands are VAN's 5-band table
 * (soilThresholds.ts), so a square's colour on the small map is the same band its word says (Tahir, 18 Oct).
 * The band folds away to the full Atlas, which is unchanged below it.
 */

type Step = 'district' | 'khata' | 'tehsil' | 'square' | 'card' | 'plan'
const STEPS: Step[] = ['district', 'khata', 'tehsil', 'square', 'card', 'plan']
const ROWS: KhataKey[] = ['p', 'k', 'zn', 'om', 'b']
type Vals = Partial<Record<KhataKey, number | null>>

const BAND_TINT: Record<SoilBand, [string, string]> = {
  critical: ['#F3D3D7', '#8E1F30'], weak: ['#F8DED3', '#7E3E20'], average: ['#FBF0CC', '#6E5208'], moderate: ['#E1EFDD', '#2F6B2D'], healthy: ['#D3E6D2', '#1F4B28'],
}

/** A reading's band, VAN's table. EC is shown as a number only (Tahir's ruling), so it is never banded here. */
const band = (k: KhataKey, v: number | null | undefined): SoilBand | undefined => (k === 'ec' || v == null ? undefined : bandOf(k, v))

/** Round for reading, but never let the rounding carry a value into the next band (Faisalabad zinc 0.697 is Weak, and must not print as 0.70). */
export function fmtSafe(k: KhataKey, v: number | null | undefined): string {
  if (v == null) return '–'
  const dec = colByKey(k).dec
  const r = Number(v.toFixed(dec))
  if (k !== 'ec' && band(k, r) !== band(k, v)) return v.toFixed(dec + 1 > 3 ? 3 : dec + 1)
  return r.toFixed(dec)
}

/**
 * The district's khata reads districtSoil.ts, the same district medians the wheat calculator fills its soil rows from,
 * kept at the raw record's 3 decimals. soilMedians.ts carries the same medians rounded to 2, which reads Faisalabad and
 * Toba Tek Singh zinc (0.697) as 0.70, Average, one band above the calculator's Weak. Reading the calculator's own
 * figures keeps the khata and the plan it opens on the same band. (Flagged to Tahir, 18 Oct 2026; soilMedians.ts is
 * not changed here.)
 */
const districtVals = (key: string): Vals => {
  const m = (DISTRICT_PROFILES.find(x => x.key === key)?.median ?? SOIL_MEDIANS.districts[key] ?? {}) as Partial<Record<string, number | null>>
  return { p: m.p ?? null, k: m.k ?? null, zn: m.zn ?? null, om: m.om ?? null, b: m.b ?? null, ph: m.ph ?? null, ec: m.ec ?? null }
}
const cellVals = (i: number): Vals => { const c = GRID.cells[i]; return { p: c.p, k: c.k, zn: c.zn, om: c.om, b: c.b, ph: c.ph, ec: c.ec } }
const urName = (key: string) => DISTRICT_UR[key] ?? districtByKey(key)?.name ?? key

/** `fmt` (D-278, 20 Oct 2026): the GPS grid card prints its readings with its own one rounding (cardText in lib/gpsCard.ts),
 *  the same as on the wheat calculator; every other screen keeps fmtSafe. */
export function Khata({ vals, cmp, fmt = fmtSafe }: { vals: Vals; cmp?: Vals; fmt?: (k: KhataKey, v: number | null | undefined) => string }) {
  const ph = vals.ph ?? null, pw = phWord(ph), phb = band('ph', ph)
  return (
    <div className="tk-khata" dir="ltr">
      {ROWS.map(k => {
        const v = vals[k] ?? null, b = band(k, v)
        return (
          <div className="tk-kr" key={k}>
            <span className="tk-chip urdu" style={b ? { background: BAND_TINT[b][0], color: BAND_TINT[b][1] } : undefined}>{b ? BAND_UR[b] : '–'}</span>
            <span className="tk-v num">{fmt(k, v)}{v != null && READING_UR[k].unit ? ' ' + READING_UR[k].unit : ''}{cmp && <small>ضلع {fmtSafe(k, cmp[k])}</small>}</span>
            <span className="tk-nm"><span className="urdu">{READING_UR[k].ur}</span><small>{READING_UR[k].en}{b ? ` · ${SOIL_BAND_LABEL[b]}` : ''}</small></span>
          </div>
        )
      })}
      <div className="tk-kr">
        <span className="tk-chip urdu" style={phb ? { background: BAND_TINT[phb][0], color: BAND_TINT[phb][1] } : undefined}>{pw ? pw.ur : '–'}</span>
        <span className="tk-v num">{fmt('ph', ph)}{cmp && <small>ضلع {fmtSafe('ph', cmp.ph)}</small>}</span>
        <span className="tk-nm"><span>pH</span><small>{pw ? pw.en : ''}{phb ? ` · ${SOIL_BAND_LABEL[phb]}` : ''}</small></span>
      </div>
      <div className="tk-kr">
        <span className="tk-chip tk-none" />
        <span className="tk-v num">{fmt('ec', vals.ec)} dS/m{cmp && <small>ضلع {fmtSafe('ec', cmp.ec)}</small>}</span>
        <span className="tk-nm"><span className="urdu tk-small">{READING_UR.ec.ur}</span><small>{READING_UR.ec.en}</small></span>
      </div>
      <div className="tk-kr">
        <span className="tk-chip tk-none urdu tk-small">{KHATA_UR.notTested}</span>
        <span className="tk-v" />
        <span className="tk-nm"><span className="urdu">{READING_UR.s.ur}</span><small>{READING_UR.s.en}</small></span>
      </div>
    </div>
  )
}

/** D-310: the Punjab map's district names, at the centre of each district's samples, the districts with most samples first. */
const DISTRICT_NAMES: MapName[] = [...DISTRICTS].sort((a, b) => b.summary.n - a.summary.n).flatMap(d => {
  const c = SOIL_GRID.centroids[d.key]
  return c ? [{ en: d.name, ur: DISTRICT_UR[d.key], lat: c[1], lon: c[0], key: d.key }] : []
})

/**
 * The small map. key 'neutral' paints by district; otherwise by VAN band of that reading.
 * D-310 (Tahir, 23 Oct 2026, design "Soil Atlas Maps"): borders draws a line where 2 districts meet and, on a tap, darkens
 * the district and shows its name before it opens; names puts names on the map, whole and never on top of one another
 * (the first in the list keeps its place): district names in English and Urdu with borders (his "Both English and
 * Urdu"), Union Council names with a dot at each centre on a tehsil's map.
 */
export function MiniMap({ idx, sel, colourBy, onPick, label, names, borders }: {
  idx: number[]; sel: number | null; colourBy: KhataKey | 'neutral'; onPick: (i: number) => void; label: string; names?: MapName[]; borders?: boolean
}) {
  const ref = useRef<HTMLCanvasElement>(null)
  const pad = names && !borders ? 1 : 0   // a tehsil's map gets 1 square of margin, so the names at its edge fit
  const geo = useMemo(() => {
    let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity
    for (const i of idx) { const c = GRID.cells[i]; if (c.x < x0) x0 = c.x; if (c.x > x1) x1 = c.x; if (c.y < y0) y0 = c.y; if (c.y > y1) y1 = c.y }
    x0 -= pad; x1 += pad; y0 -= pad; y1 += pad
    return { x0, x1, y0, y1, cols: x1 - x0 + 1, rows: y1 - y0 + 1 }
  }, [idx, pad])
  const [cell, setCell] = useState(8)
  const [hi, setHi] = useState<string | null>(null)   // borders: the district just tapped
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current) }, [])
  const fonts = useMapFonts(!!names)
  useEffect(() => {
    const cv = ref.current
    if (!cv) return
    // the width inside the map's frame (its padding taken off, review 23 Oct 2026: the whole clientWidth was used)
    const host = cv.parentElement
    const cs = host ? getComputedStyle(host) : null
    const w = host ? host.clientWidth - (parseFloat(cs?.paddingLeft || '0') + parseFloat(cs?.paddingRight || '0')) : 440
    const c = Math.max(3, Math.min(26, Math.floor(w / geo.cols)))
    setCell(c)
    const W = geo.cols * c, H = geo.rows * c
    const dpr = window.devicePixelRatio || 1
    cv.width = W * dpr; cv.height = H * dpr
    // height auto: where the frame is narrower than the map (a 360 px phone), the map shrinks evenly instead of only sideways
    cv.style.width = W + 'px'; cv.style.height = 'auto'
    const g = cv.getContext('2d')
    if (!g) return
    g.setTransform(dpr, 0, 0, dpr, 0, 0)
    g.clearRect(0, 0, W, H)
    const gap = c > 5 ? 1 : 0
    const tones = ['#C9A77C', '#B8926A', '#D6B88E']
    for (const i of idx) {
      const cc = GRID.cells[i]
      let col: string
      if (borders && hi && cc.dist === hi) col = '#7A5A34'
      else if (colourBy === 'neutral') col = tones[DISTRICTS.findIndex(d => d.key === cc.dist) % 3]
      else { const v = (cc as unknown as Record<string, number | null>)[colourBy]; const b = band(colourBy, v); col = b ? SOIL_BAND_COLOR[b] : '#CFCFCF' }
      g.fillStyle = col
      g.fillRect((cc.x - geo.x0) * c, (geo.y1 - cc.y) * c, c - gap, c - gap)
    }
    if (borders) {
      // A line on every edge where a square meets a square of another district.
      const dist = new Map(idx.map(i => [GRID.cells[i].x + ',' + GRID.cells[i].y, GRID.cells[i].dist]))
      g.strokeStyle = '#14231A'; g.lineWidth = 1.1; g.beginPath()
      for (const i of idx) {
        const cc = GRID.cells[i], px = (cc.x - geo.x0) * c, py = (geo.y1 - cc.y) * c
        const r = dist.get((cc.x + 1) + ',' + cc.y), u = dist.get(cc.x + ',' + (cc.y + 1))
        if (r !== undefined && r !== cc.dist) { g.moveTo(px + c, py); g.lineTo(px + c, py + c) }
        if (u !== undefined && u !== cc.dist) { g.moveTo(px, py); g.lineTo(px + c, py) }
      }
      g.stroke()
    }
    if (sel != null) {
      const cc = GRID.cells[sel]
      g.lineWidth = 2.5; g.strokeStyle = '#14231A'
      g.strokeRect((cc.x - geo.x0) * c + 1, (geo.y1 - cc.y) * c + 1, c - 3, c - 3)
    }
    if (names && names.length) {
      // The map can be shown narrower than it is drawn (max-width: 100%); the letters are drawn larger by as much, so
      // they read at 11 px (Urdu 13 px) on the phone.
      const shown = Math.min(1, (w || W) / W), k = 1 / shown
      const latin = MAP_LATIN(11 * k), urdu = MAP_URDU(13 * k)
      const placed: Box[] = []
      // A tapped district's name that found no room is drawn last, on top, at its centre; the other names keep their
      // places (review, 23 Oct 2026: putting it first made them jump).
      let hiShown = false
      const later: (() => void)[] = []
      for (const n of names) {
        const x = (n.lon / GRID.deg - geo.x0) * c, y = (geo.y1 + 1 - n.lat / GRID.deg) * c
        if (borders) {
          // line heights leave room for Nastaliq's tall letters under the English (review, 23 Oct 2026: 15 and 18 let them cut in; 25 left a gap)
          const lines: [string, string, boolean, number][] = [[n.en, latin, false, 14 * k]]
          if (n.ur) lines.push([n.ur, urdu, true, 21 * k])
          let wmax = 0
          for (const [t, f] of lines) { g.font = f; wmax = Math.max(wmax, g.measureText(t).width) }
          const hh = lines.reduce((a, l) => a + l[3], 0)
          const draw = (cx: number, cy: number) => {
            let yy = cy - hh / 2
            for (const [t, f, rtl, lh] of lines) { yy += lh; haloText(g, t, cx, yy - 4 * k, f, rtl) }
          }
          // At the district's centre or, where that is taken, a little above, below or to a side of it; kept inside the
          // map. A district whose name finds no room still shows it when tapped.
          let at: [number, number] | null = null
          for (const [dx, dy] of [[0, 0], [0, -0.55 * hh], [0, 0.55 * hh], [-0.45 * wmax, 0], [0.45 * wmax, 0], [-0.4 * wmax, -0.45 * hh], [0.4 * wmax, -0.45 * hh], [-0.4 * wmax, 0.45 * hh], [0.4 * wmax, 0.45 * hh]]) {
            const cx = Math.max(wmax / 2 + 3, Math.min(W - wmax / 2 - 3, x + dx)), cy = Math.max(hh / 2 + 3, Math.min(H - hh / 2 - 3, y + dy))
            const b: Box = [cx - wmax / 2 - 2, cy - hh / 2 - 2, cx + wmax / 2 + 2, cy + hh / 2 + 2]
            if (boxFree(placed, b)) { at = [cx, cy]; placed.push(b); break }
          }
          if (at) { draw(at[0], at[1]); if (n.key === hi) hiShown = true }
          else if (n.key === hi) {
            const cx = Math.max(wmax / 2 + 3, Math.min(W - wmax / 2 - 3, x)), cy = Math.max(hh / 2 + 3, Math.min(H - hh / 2 - 3, y))
            later.push(() => draw(cx, cy))
          }
        } else {
          // A Union Council: a dot at its centre, its name above the dot, or under it if above is taken.
          if (x < 0 || y < 0 || x > W || y > H) continue   // a centre that lies off this tehsil's map
          g.fillStyle = '#14231A'; g.beginPath(); g.arc(x, y, 2.6 * k, 0, Math.PI * 2); g.fill()
          g.font = latin
          const tw = g.measureText(n.en).width
          const left = Math.max(2, Math.min(W - 2 - tw - 6 * k, x - tw / 2 - 3 * k))
          let b: Box = [left, y - 19 * k, left + tw + 6 * k, y - 5 * k]
          if (!boxFree(placed, b) || b[1] < 0) {
            b = [left, y + 5 * k, left + tw + 6 * k, y + 19 * k]
            if (!boxFree(placed, b) || b[3] > H) continue
          }
          if (b[0] < 0) continue
          placed.push(b)
          haloText(g, n.en, (b[0] + b[2]) / 2, b[3] - 3 * k, latin)
        }
      }
      if (!hiShown) for (const f of later) f()
    }
  }, [idx, sel, colourBy, geo, names, borders, hi, fonts])
  const pick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    const sx = (e.clientX - r.left) * (geo.cols * cell / r.width), sy = (e.clientY - r.top) * (geo.rows * cell / r.height)
    const gx = geo.x0 + Math.floor(sx / cell), gy = geo.y1 - Math.floor(sy / cell)
    let best = -1, bd = Infinity
    for (const i of idx) { const c = GRID.cells[i]; const d = (c.x - gx) ** 2 + (c.y - gy) ** 2; if (d < bd) { bd = d; best = i } }
    if (!(best >= 0 && bd <= 4)) return
    if (!borders) { onPick(best); return }
    // The district he tapped darkens and its name shows, then it opens.
    setHi(GRID.cells[best].dist)
    if (timer.current) clearTimeout(timer.current)
    const i = best
    timer.current = setTimeout(() => onPick(i), 450)
  }
  return <canvas ref={ref} className="tk-map" role="img" aria-label={label} onClick={pick} />
}

/** The soil card: a 1080 px square image in Urdu, no product and no price, the horse unchanged in the corner. */
async function drawCard(name: { d: string; t?: string }, vals: Vals, n: number | null): Promise<string> {
  try { await Promise.all([document.fonts.load('700 40px "Noto Nastaliq Urdu"'), document.fonts.load('700 40px "Public Sans"')]) } catch { /* fonts fall back */ }
  const W = 1080, H = 1080
  const cv = document.createElement('canvas'); cv.width = W; cv.height = H
  const g = cv.getContext('2d')!
  g.fillStyle = '#FBF9F3'; g.fillRect(0, 0, W, H)
  g.fillStyle = '#14231A'; g.fillRect(0, H - 150, W, 150)
  // D-264, 19 Oct 2026: every row now prints its value in the left column, as the khata screens do, and pH and EC have
  // their own rows (pH with its pH word, EC a number with its label and no band word, as ruled). The card was band words
  // only, with the value column blank and no pH or EC. To fit 8 rows the ledger runs 250 to 810 in rows of 70 (was 300
  // to 800 in rows of 80, 6 rows), and the title, the line under it and the type sizes move up and down a little.
  // No new words: the row names, band words, pH words and the EC label are the ruled ones from soilUrdu.ts.
  const TOP = 250, ROW = 70, CARD_ROWS: (KhataKey | 's')[] = [...ROWS, 'ph', 'ec', 's'], BOTTOM = TOP + ROW * CARD_ROWS.length
  g.fillStyle = '#FFFDF6'; g.fillRect(70, TOP, W - 140, BOTTOM - TOP)
  g.strokeStyle = '#D9CFB8'; g.lineWidth = 2
  for (let y = TOP + ROW; y < BOTTOM; y += ROW) { g.beginPath(); g.moveTo(70, y); g.lineTo(W - 70, y); g.stroke() }
  g.strokeStyle = '#C9564A'; g.lineWidth = 3; g.beginPath(); g.moveTo(W - 330, TOP); g.lineTo(W - 330, BOTTOM); g.stroke()
  g.direction = 'rtl'; g.textAlign = 'right'; g.fillStyle = '#14231A'
  g.font = '700 60px "Noto Nastaliq Urdu", serif'; g.fillText(KHATA_UR.myKhata, W - 80, 125)
  g.font = '500 36px "Noto Nastaliq Urdu", serif'; g.fillStyle = '#5B6A5E'
  g.fillText(`ضلع ${name.d}${name.t ? ' · تحصیل ' + name.t : ''}`, W - 80, 208)
  CARD_ROWS.forEach((k, i) => {
    const top = TOP + i * ROW, base = top + 46
    // The reading's name, right, in Urdu (pH stays pH).
    g.direction = 'rtl'; g.textAlign = 'right'; g.fillStyle = '#14231A'; g.font = `500 ${k === 'ec' ? 24 : 32}px "Noto Nastaliq Urdu", serif`
    g.fillText(READING_UR[k].ur, W - 100, base)
    if (k === 's') {
      g.fillStyle = '#5B6A5E'; g.font = '500 27px "Noto Nastaliq Urdu", serif'; g.fillText(KHATA_UR.notTested, W - 380, base)
      return
    }
    const v = vals[k] ?? null
    // The middle column: the band word (pH: its pH word, in its band's colour). EC has none.
    const b = band(k, v), word = k === 'ph' ? phWord(v)?.ur : b ? BAND_UR[b] : undefined
    if (word && k !== 'ec') {
      if (b) { g.fillStyle = BAND_TINT[b][0]; g.fillRect(W - 600, top + 8, 220, ROW - 16) }
      g.fillStyle = b ? BAND_TINT[b][1] : '#14231A'; g.textAlign = 'center'; g.font = '500 30px "Noto Nastaliq Urdu", serif'
      g.fillText(word, W - 490, base)
    }
    // The left column: the value, with its unit, as on the khata screens.
    g.direction = 'ltr'; g.textAlign = 'left'; g.fillStyle = '#14231A'; g.font = '600 34px "Public Sans", sans-serif'
    g.fillText(`${fmtSafe(k, v)}${v != null && READING_UR[k].unit ? ' ' + READING_UR[k].unit : ''}`, 110, base - 4)
  })
  // The caveat in Urdu first (independent review: an Urdu reader must see it), then the English source line.
  g.direction = 'rtl'; g.textAlign = 'right'; g.fillStyle = '#14231A'; g.font = '500 28px "Noto Nastaliq Urdu", serif'
  g.fillText(GPS_UR.areaNotField, W - 80, BOTTOM + 48)   // D-313: the same line as the card's, without 'اپنا ٹیسٹ: VAN Lab' (Tahir 24 to 25 Oct 2026)
  g.direction = 'ltr'; g.textAlign = 'left'; g.fillStyle = '#5B6A5E'; g.font = '400 21px "Public Sans", sans-serif'
  g.fillText('Punjab government soil record, about 2016 to 2018, mapped by VAN.', 80, BOTTOM + 84)
  g.fillText(n != null ? `Square of about 6,500 acres, ${thousands(n)} samples. An area reading, not your field’s test.` : 'An area reading, not your field’s test.', 80, BOTTOM + 110)
  g.fillStyle = '#FBF9F3'; g.font = '700 40px "Public Sans", sans-serif'; g.fillText('van.com.pk/soil.html', 80, H - 60)
  await new Promise<void>(res => {
    const img = new Image()
    img.onload = () => { g.drawImage(img, W - 300, H - 150, 180, 150); res() }
    img.onerror = () => res()
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(horseSvg('#FFFFFF', 'card'))
  })
  return cv.toDataURL('image/png')
}

/**
 * D-265, 19 Oct 2026: BACK AND FORWARD KEEP THE FARMER'S PLACE. Pressing Back from the wheat calculator reloaded this page
 * at "آپ کا ضلع؟", and the district, tehsil, square and card took about 7 taps to redo. The screens now write their
 * place (step, district, tehsil, square, the map's reading, folded or open) into this page's own history entry
 * (history.state, the URL is not touched, so the router's anchors work as before), and read it back only when the
 * page is reached by Back or Forward. A fresh visit or a reload starts as before. The soil door already skips on Back and
 * Forward (soil-door.inline.html), unchanged. Revert: the 2 effects and readSaved below, and the useState lines back to
 * their plain starting values.
 */
const SAVE_KEY = 'vanTeesraKhata2'
type Saved = { folded: boolean; step: Step; d: string | null; t: number | null; c: number | null; mapKey: KhataKey }
function readSaved(): Saved | null {
  try {
    const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined
    if (!nav || nav.type !== 'back_forward') return null
    const st = history.state as Record<string, unknown> | null
    const s = (st && typeof st === 'object' ? st[SAVE_KEY] : null) as Saved | null
    if (!s || !STEPS.includes(s.step)) return null
    // Every saved value is checked against the data before it is used; anything that does not fit is dropped.
    const d = s.d && districtByKey(s.d) ? s.d : null
    const t = d && typeof s.t === 'number' && TEHSILS[s.t]?.district === d ? s.t : null
    const c = d && typeof s.c === 'number' && GRID.cells[s.c]?.dist === d ? s.c : null
    const mapKey = (['zn', 'p', 'k', 'ph'] as KhataKey[]).includes(s.mapKey) ? s.mapKey : 'zn'
    // D-280: the tehsil step now means a tehsil is picked; a place saved at the tehsil list with none picked is the district's screen.
    const step: Step = !d ? 'district' : s.step === 'tehsil' && t == null ? 'khata' : s.step
    return { folded: !!s.folded, step, d, t, c, mapKey }
  } catch { return null }
}
function writeSaved(s: Saved) {
  try {
    const st = history.state && typeof history.state === 'object' ? history.state : {}
    history.replaceState({ ...st, [SAVE_KEY]: s }, '')
  } catch { /* a browser that refuses history writes keeps today's behaviour */ }
}

/** D-283: the tehsil named in a link, matched inside the linked district only (tehsil names repeat across districts, e.g. Sahiwal), ignoring case, spaces, dots and hyphens. Returns its index in TEHSILS, or null. */
function linkedTehsil(districtKey: string | null, raw: string | null | undefined): number | null {
  if (!districtKey || !raw) return null
  const sq = (s: string) => s.toUpperCase().replace(/[^A-Z0-9]/g, '')
  const want = sq(raw)
  if (!want) return null
  const i = TEHSILS.findIndex(x => x.district === districtKey && (sq(x.en) === want || sq(x.key) === want))
  return i >= 0 ? i : null
}

export function TeesraKhata({ district, tehsil = null, englishFirst, campaign = true }: { district: string | null; tehsil?: string | null; englishFirst: boolean; campaign?: boolean }) {
  const linked = districtByKey(district)
  const linkedT = linkedTehsil(linked ? linked.key : null, tehsil)
  const [saved] = useState(readSaved)
  // D-319 (Tahir, 27 Oct 2026: Teesra Khata is for campaign visitors): a visitor without a campaign link gets the band folded and the Soil Atlas first. Was: open for everyone but ?from=mitti-en.
  const [folded, setFolded] = useState(saved ? saved.folded : englishFirst || !campaign)
  const [step, setStep] = useState<Step>(saved ? saved.step : linked ? (linkedT != null ? 'tehsil' : 'khata') : 'district')
  const [d, setD] = useState<string | null>(saved ? saved.d : linked ? linked.key : null)
  const [t, setT] = useState<number | null>(saved ? saved.t : linkedT)
  const [c, setC] = useState<number | null>(saved ? saved.c : null)
  const [q, setQ] = useState('')
  const [mapKey, setMapKey] = useState<KhataKey>(saved ? saved.mapKey : 'zn')
  // D-278: the GPS grid card opens from the first screen; while it is open, the district list below steps aside.
  const [gpsOn, setGpsOn] = useState(false)
  // 21 Oct 2026 (Tahir): the "I am at my land" button at the top. He still picks district and tehsil first; the card then reads his location at once.
  const [atLand, setAtLand] = useState(false)
  // D-265: keep this history entry's copy current; an in-page jump (#soil-districts) makes a new entry, so it is
  // written there too.
  const snap = useRef<Saved | null>(null)
  useEffect(() => { snap.current = { folded, step, d, t, c, mapKey }; writeSaved(snap.current) }, [folded, step, d, t, c, mapKey])
  useEffect(() => {
    const again = () => { if (snap.current) writeSaved(snap.current) }
    window.addEventListener('hashchange', again); window.addEventListener('popstate', again)
    return () => { window.removeEventListener('hashchange', again); window.removeEventListener('popstate', again) }
  }, [])
  // D-266: the bottom bar's "My crop's plan" opens the wheat calculator with this district once one is picked.
  usePublishShared('soil:district', { district: d ?? undefined })
  const [card, setCard] = useState<string | null>(null)
  const top = useRef<HTMLDivElement>(null)
  const [pendingScroll, setPendingScroll] = useState<string | null>(null)
  useEffect(() => {
    if (!pendingScroll) return
    const id = requestAnimationFrame(() => {
      document.getElementById(pendingScroll)?.scrollIntoView({ block: 'start', behavior: 'instant' })
      if (pendingScroll === 'teesra-khata') (document.getElementById('tk-q') as HTMLInputElement | null)?.focus({ preventScroll: true })
      setPendingScroll(null)
    })
    return () => cancelAnimationFrame(id)
  }, [pendingScroll, folded, step])

  // The door's two buttons reach the band through these events (soil-door.inline.html).
  useEffect(() => {
    // The scroll is done by the effect below, after the band has opened or folded, so the page does not move after it.
    const open = () => { setFolded(false); setStep(s => (s === 'district' || !d ? 'district' : s)); setPendingScroll('teesra-khata') }
    const map = () => { setFolded(true); setPendingScroll('soil-map') }
    const w = window as unknown as { __vankhata?: string; __vankhataReady?: boolean }
    // The door may have been answered before this mounted (slow network): act on it now.
    if (w.__vankhata === 'map') map()
    if (w.__vankhata === 'open') open()
    w.__vankhata = undefined
    w.__vankhataReady = true
    window.addEventListener('vankhata:open', open); window.addEventListener('vankhata:map', map)
    return () => { w.__vankhataReady = false; window.removeEventListener('vankhata:open', open); window.removeEventListener('vankhata:map', map) }
  }, [d])

  const go = (s: Step) => { setStep(s); requestAnimationFrame(() => top.current?.scrollIntoView({ block: 'start', behavior: 'smooth' })) }
  const pickDistrict = (key: string, ti: number | null = null, ci: number | null = null) => { setD(key); setT(ti); setC(ci); go(ti != null ? 'tehsil' : 'khata') }

  const dist = districtByKey(d)
  const dVals = useMemo(() => (d ? districtVals(d) : {}), [d])
  const dCells = useMemo(() => (d ? GRID.cells.map((_, i) => i).filter(i => GRID.cells[i].dist === d) : []), [d])
  const tehsils = useMemo(() => TEHSILS.map((x, i) => ({ x, i })).filter(r => r.x.district === d).sort((a, b) => b.x.n - a.x.n), [d])
  const allCells = useMemo(() => GRID.cells.map((_, i) => i), [])
  // D-280: what the GPS card is told about the district and tehsil he picked: the squares whose main tehsil it is.
  const gpsScope = useMemo(() => (d && t != null && TEHSILS[t]?.district === d
    ? { district: d, tehsil: TEHSILS[t].en, cells: dCells.filter(i => CELL_TEHSIL[i][0] === t) } : null), [d, t, dCells])

  // The square step opens on the tehsil's best-sampled square if he has not tapped one.
  const square = useMemo(() => {
    if (!d) return null
    if (c != null && GRID.cells[c].dist === d) return c
    const pool = t != null ? dCells.filter(i => CELL_TEHSIL[i][0] === t) : dCells
    const from = pool.length ? pool : dCells
    return from.reduce((a, b) => (GRID.cells[b].n > GRID.cells[a].n ? b : a), from[0])
  }, [d, t, c, dCells])

  useEffect(() => { setCard(null) }, [d, t, c])
  useEffect(() => {
    if (step !== 'card' || !dist || square == null) return
    let live = true
    const tt = t != null ? TEHSILS[t] : null
    drawCard({ d: urName(dist.key), t: tt?.ur }, cellVals(square), GRID.cells[square].n).then(u => { if (live) setCard(u) })
    return () => { live = false }
  }, [step, dist, square, t])

  const shareText = dist ? `${KHATA_UR.myKhata}: ${urName(dist.key)}${t != null ? '، ' + TEHSILS[t].ur : ''}۔ ${KHATA_UR.ask}: https://www.van.com.pk/soil.html?district=${encodeURIComponent(dist.key)}&from=mitti-wa${t != null ? '#tehsil=' + encodeURIComponent(TEHSILS[t].en) : ''}` : ''   // D-316: tehsil after '#', so the server never gets it (was '&tehsil=' before &from)
  const share = async () => {
    try {
      if (card && navigator.canShare) {
        const blob = await (await fetch(card)).blob()
        const file = new File([blob], 'teesra-khata.png', { type: 'image/png' })
        if (navigator.canShare({ files: [file] })) { await navigator.share({ files: [file], text: shareText }); return }
      }
    } catch { /* fall through to the WhatsApp link */ }
    window.open('https://wa.me/?text=' + encodeURIComponent(shareText), '_blank', 'noopener')
  }

  // D-264: the same card, sent to VAN. The share button above goes to friends (no number) with district and tehsil only;
  // this one goes to VAN's WhatsApp with what the card shows: district, tehsil, the square and its readings. English,
  // since VAN reads it; no new Urdu (the button's Urdu waits for Tahir).
  const vanText = (() => {
    if (!dist || square == null) return ''
    const cell = GRID.cells[square], vals = cellVals(square)
    const tIdx = t != null ? t : CELL_TEHSIL[square][0] >= 0 ? CELL_TEHSIL[square][0] : null
    const lat = ((cell.y + 0.5) * GRID.deg).toFixed(2), lon = ((cell.x + 0.5) * GRID.deg).toFixed(2)
    const row = (k: KhataKey) => {
      const v = vals[k] ?? null, b = band(k, v)
      const word = k === 'ph' ? phWord(v)?.en : k === 'ec' ? undefined : b ? SOIL_BAND_LABEL[b] : undefined
      return `${READING_UR[k].en}: ${fmtSafe(k, v)}${v != null && READING_UR[k].unit ? ' ' + READING_UR[k].unit : ''}${v != null && word ? ` (${word})` : ''}`
    }
    return [
      'Hello VAN. My soil card from the Soil Atlas (Teesra Khata):',
      `District: ${dist.name}`,
      `Tehsil: ${tIdx != null ? TEHSILS[tIdx].en : 'not known'}`,
      `Area: a square of about 6,500 acres around ${lat} N, ${lon} E, ${thousands(cell.n)} samples`,
      ...[...ROWS, 'ph', 'ec'].map(k => row(k as KhataKey)),
      `${READING_UR.s.en}: not tested in this survey`,
      'These are the area readings of the Punjab government soil survey, about 2016 to 2018, not a test of my field. Please advise.',
    ].join('\n')
  })()

  const stepNo = STEPS.indexOf(step)
  // D-280: from the tehsil, Back goes to the district's screen with the tehsil list and nothing picked.
  const back = () => { if (step === 'tehsil') { setT(null); setC(null); go('khata') } else go(STEPS[Math.max(0, stepNo - 1)]) }

  if (folded) {
    return (
      <section className="tk-fold" id="teesra-khata">
        <div className="wrap tk-fold-in">
          <span className="tk-name urdu">{KHATA_UR.name}</span>
          <span className="cap">Teesra Khata · your area’s soil account, in Urdu</span>
          <button className="btn btn-gold btn-sm ml-auto" onClick={() => { setFolded(false); go(step) }}><span className="urdu">{KHATA_UR.open}</span></button>
        </div>
      </section>
    )
  }

  const tObj = t != null ? TEHSILS[t] : null
  const sq = square != null ? GRID.cells[square] : null
  const sqT = square != null ? CELL_TEHSIL[square] : null

  return (
    <section className="tk" id="teesra-khata">
      <div className="tk-in" ref={top}>
        <div className="tk-head">
          <span className="tk-name urdu">{KHATA_UR.name}</span>
          <span className="cap">Teesra Khata · the third ledger</span>
          <button className="tk-link ml-auto" onClick={() => { setFolded(true); requestAnimationFrame(() => document.getElementById('soil-map')?.scrollIntoView({ block: 'start' })) }}>
            <span className="urdu">{KHATA_UR.fold}</span> · see the whole Punjab Soil Atlas ↓
          </button>
        </div>
        <div className="tk-steps" aria-hidden="true">{STEPS.map((s, i) => <i key={s} className={i <= stepNo ? 'on' : ''} />)}</div>
        {stepNo > 0 && !gpsOn && <button className="tk-link" onClick={back}>← <span className="urdu">{KHATA_UR.back}</span></button>}

        {step === 'district' && (
          <div className="tk-screen" id="tk-district">
            <button type="button" className={`btn tk-btn ${atLand ? 'btn-navy' : 'btn-ghost'}`} data-tk="atland" aria-pressed={atLand} onClick={() => setAtLand(v => !v)}>
              <span className="urdu" dir="rtl">{GPS_UR.atMyLandNow}</span><span className="tk-btn-en">I am at my land now</span>{/* D-316: dir added (review note, 22 Oct). No lang="ur": no other Urdu line on these screens carries it, and modecheck counts lang="ur" as the switched-off Urdu layer (O-2). */}
            </button>
            {atLand && <p className="tk-en" data-tk="atland-hint" role="status">First pick your district and tehsil below. Then your location is read.</p>}
            <h2 className="tk-h urdu">{KHATA_UR.yourDistrict}</h2>
            <p className="tk-en">Your district? Search in Urdu or English, or pick your area on the map.</p>
            <input id="tk-q" className="input tk-search" placeholder="ضلع کا نام · district name" value={q} onChange={e => setQ(e.target.value)} aria-label="Search your district" />
            <div className="tk-list">
              {[...DISTRICTS].sort((a, b) => a.name.localeCompare(b.name)).filter(x => { const s = q.trim().toLowerCase(); return !s || x.name.toLowerCase().includes(s) || (DISTRICT_UR[x.key] ?? '').includes(q.trim()) })
                .map(x => (
                  <button key={x.key} className="tk-row" onClick={() => pickDistrict(x.key)}>
                    <span><span className="tk-en-name">{x.name}</span> <span className="cap num">{thousands(x.summary.n)} samples</span></span>
                    <span className="urdu tk-ur-name">{DISTRICT_UR[x.key]}</span>
                  </button>
                ))}
            </div>
            <p className="urdu tk-sub">{KHATA_UR.orTapMap}</p>
            <p className="tk-en">Or pick your area on the map: it sets your district, tehsil and square.</p>
            <div className="tk-mapwrap"><MiniMap idx={allCells} sel={null} colourBy="neutral" borders names={DISTRICT_NAMES} label="Map of Punjab's soil squares, with district borders and names" onPick={i => { const tt = CELL_TEHSIL[i][0]; setAtLand(false); pickDistrict(GRID.cells[i].dist, tt >= 0 ? tt : null, i) }} />
              {/* D-310: English only; the Urdu of these 2 lines is to come from Tahir. */}
              <div className="tk-legend" data-tk="maplegend"><span><i style={{ background: '#C9A77C' }} />survey squares, about 6,500 acres each</span><span><i style={{ background: '#14231A', height: 2 }} />district border, drawn from the squares</span></div>
            </div>
          </div>
        )}

        {/* D-280 (Tahir, 20 Oct 2026): district, tehsil and then the finer ways to find his land, from the largest unit to the
            smallest, on 1 screen: each part opens once the one above it is picked. */}
        {(step === 'khata' || step === 'tehsil') && dist && !gpsOn && (
          <div className="tk-screen" id="tk-district">
            <span className="cap">District · ضلع</span>
            <h2 className="tk-h urdu">{KHATA_UR.districtKhata(urName(dist.key))}</h2>
            <p className="tk-en">{dist.name} · {thousands(dist.summary.n)} samples · the district median</p>
            <Khata vals={dVals} />
            <p className="urdu tk-survey">{KHATA_UR.survey}</p>
            <p className="tk-en">This is the Punjab government’s survey, about 2016 to 2018. It is your area’s account, not your field’s.</p>
          </div>
        )}

        {(step === 'khata' || step === 'tehsil') && dist && !gpsOn && (
          <div className="tk-screen" id="tk-tehsil">
            <h2 className="tk-h urdu">{KHATA_UR.setTehsil}</h2>
            {atLand && <p className="tk-en" data-tk="atland-hint2" role="status">Pick your tehsil. Then your location is read.</p>}
            <p className="tk-en">{dist.name} has {tehsils.length} tehsils in the survey, each with its own sample count.</p>
            <div className="tk-list">
              {tehsils.map(({ x, i }) => (
                <button key={x.key} className={`tk-row ${i === t ? 'on' : ''}`} onClick={() => { setT(i); setC(null); setStep('tehsil'); setPendingScroll('gps-card') }} aria-pressed={i === t}>
                  <span><span className="tk-en-name">{x.en}</span> <span className="cap num">{thousands(x.n)} samples</span></span>
                  <span className="urdu tk-ur-name">{x.ur}</span>
                </button>
              ))}
            </div>
            {tObj ? (
              <>
                <h3 className="tk-h tk-h3 urdu">{KHATA_UR.tehsilKhata(tObj.ur)}</h3>
                <p className="tk-en">{tObj.en} · {thousands(tObj.n)} samples · the tehsil median, with the district’s beside it</p>
                <Khata vals={tObj.median} cmp={dVals} />
                <p className="urdu tk-survey">{KHATA_UR.survey}</p>
                <button className="btn btn-navy tk-btn" onClick={() => { setC(null); go('square') }}><span className="urdu">{KHATA_UR.seeArea}</span><span className="tk-btn-en">See your area, a square of about 6,500 acres</span></button>
              </>
            ) : <p className="tk-en">Pick your tehsil to see its readings.</p>}
          </div>
        )}

        {/* The finer ways open once his tehsil is picked; the old path (the square) stays above them. */}
        {step === 'tehsil' && dist && tObj && gpsScope && (
          <GpsCard key={`${d}|${t}`} scope={gpsScope} autoLocate={atLand} onAutoLocate={() => setAtLand(false)} onActive={setGpsOn} onDistrictTehsil={() => { setGpsOn(false); setT(null); setC(null); go('district') }} />
        )}

        {step === 'square' && dist && sq && square != null && (
          <div className="tk-screen">
            <h2 className="tk-h urdu">{KHATA_UR.yourArea}</h2>
            <p className="tk-en">Pick the square nearest your fields. Each square is about 6,500 acres, the median of the samples inside it.</p>
            <div className="tk-seg" role="tablist">
              {(['zn', 'p', 'k', 'ph'] as KhataKey[]).map(k => <button key={k} role="tab" aria-selected={k === mapKey} className={`chip chip-xs ${k === mapKey ? 'on' : ''}`} onClick={() => setMapKey(k)}>{READING_UR[k].en} · <span className="urdu">{READING_UR[k].ur}</span></button>)}
            </div>
            <div className="tk-mapwrap">
              <MiniMap idx={dCells} sel={square} colourBy={mapKey} label={`Soil squares of ${dist.name}, coloured by ${READING_UR[mapKey].en}`} onPick={i => { setC(i); const tt = CELL_TEHSIL[i][0]; setT(tt >= 0 ? tt : null) }} />
              <div className="tk-legend">
                {(['critical', 'weak', 'average', 'moderate', 'healthy'] as SoilBand[]).map(b => <span key={b}><i style={{ background: SOIL_BAND_COLOR[b] }} /><span className="urdu">{BAND_UR[b]}</span> {SOIL_BAND_LABEL[b]}</span>)}
                <span><i style={{ background: '#CFCFCF' }} /><span className="urdu">{KHATA_UR.noReading}</span> no reading</span>
                <span><i style={{ background: 'transparent', outline: '2px solid #14231A' }} />your square</span>
              </div>
            </div>
            <p className="tk-en">
              {sqT && sqT[0] >= 0 ? `Square in ${TEHSILS[sqT[0]].en} tehsil${sqT[1] < 60 ? ', and partly in a neighbouring tehsil' : ''}` : `Square in ${dist.name}`} · {thousands(sq.n)} samples
            </p>
            {sqT && sqT[0] < 0 && <p className="urdu tk-note">{KHATA_UR.border}</p>}
            {sq.n < 10 && <p className="urdu tk-note">{KHATA_UR.fewSamples(sq.n)} <span className="tk-en" dir="ltr">Few samples in this square ({sq.n}), so read it with care.</span></p>}
            <Khata vals={cellVals(square)} cmp={dVals} />
            {(() => {
              const vs = dCells.map(i => (GRID.cells[i] as unknown as Record<string, number | null>)[mapKey]).filter((v): v is number => v != null)
              if (!vs.length) return null
              const lo = Math.min(...vs), hi = Math.max(...vs)
              return (
                <div className="tk-compare">
                  <p className="urdu">{KHATA_UR.rangeLine(urName(dist.key), READING_UR[mapKey].ur, fmtSafe(mapKey, lo), fmtSafe(mapKey, hi))}</p>
                  <p className="tk-en">Across {dCells.length} squares in {dist.name}, {READING_UR[mapKey].en.toLowerCase()} runs from {fmtSafe(mapKey, lo)} to {fmtSafe(mapKey, hi)}{READING_UR[mapKey].unit ? ' ' + READING_UR[mapKey].unit : ''}.</p>
                </div>
              )
            })()}
            <p className="urdu tk-strong">{KHATA_UR.averageNotField}</p>
            <button className="btn btn-navy tk-btn" onClick={() => go('card')}><span className="urdu">{KHATA_UR.makeCard}</span><span className="tk-btn-en">Make my soil card</span></button>
          </div>
        )}

        {step === 'card' && dist && (
          <div className="tk-screen">
            <h2 className="tk-h urdu">{KHATA_UR.myKhata}</h2>
            <p className="tk-en">Your soil card, sized for WhatsApp. No product and no price.</p>
            {card ? <img className="tk-card" src={card} alt={`Soil card for ${dist.name}`} /> : <div className="tk-card tk-card-wait" />}
            <button className="btn tk-btn tk-wa" onClick={share}><span className="urdu">{KHATA_UR.share}</span><span className="tk-btn-en">Send on WhatsApp</span></button>
            {/* D-264: to VAN, with the readings. English only until Tahir gives the Urdu for this button. */}
            {vanText && <a className="btn tk-btn tk-wa tk-wa-van" href={wa(vanText)} target="_blank" rel="noopener"><span style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.9 }}>Send my soil card to VAN</span><span className="tk-btn-en">VAN’s WhatsApp, with your area and its readings</span></a>}
            {card && <a className="tk-link" href={card} download={`teesra-khata-${dist.key.toLowerCase().replace(/\s+/g, '-')}.png`}><span className="urdu">{KHATA_UR.saveImage}</span> · save the image</a>}
            <button className="btn btn-navy tk-btn" onClick={() => go('plan')}><span className="urdu">{KHATA_UR.planButton}</span><span className="tk-btn-en">See the wheat plan by your soil</span></button>
          </div>
        )}

        {step === 'plan' && dist && <Plan dist={dist.key} distName={dist.name} tehsilKey={t != null && TEHSILS[t]?.district === dist.key ? TEHSILS[t].key : null} />}
      </div>
    </section>
  )
}

/**
 * THE WHEAT BUNDLE SCREEN (item 6). Tahir's ruling, 18 Oct 2026: 1 base per acre for every farmer, Green Phosphate
 * 35 kg + Vital Urea 25 kg + Vital Potash 10 kg (half the 20 kg pack); where the soil is short of phosphorus Green
 * Phosphate rises to 50 kg (1 bag) at most. The bundle is the campaign's starting offer; the wheat calculator keeps
 * VAN's full published wheat plan and is NOT changed ("No, bundle only").
 *
 * So this screen shows 2 things and keeps them apart, because they are 2 different quantities:
 *   1. the bundle, as ruled;
 *   2. what the calculator will do with this district, computed by the calculator's OWN engine (calcPlan) on the SAME
 *      inputs the calculator fills from the link (regionalProfile of the district). Whatever products it raises,
 *      lowers or swaps, and any advisory, are named here exactly; the quantities are left to the calculator.
 * The square stays on the card: the calculator reads a district, not a square (independent review, 18 Oct 2026).
 * No price here: price shows only inside the calculator.
 */
const PARAM_UR: Partial<Record<SoilParameter, { ur: string; en: string }>> = {
  P2O: { ur: 'فاسفورس', en: 'phosphorus' }, K2O: { ur: 'پوٹاش', en: 'potash' }, Zn: { ur: 'زنک', en: 'zinc' }, B: { ur: 'بوران', en: 'boron' },
  OM: { ur: 'نامیاتی مادہ', en: 'organic matter' }, Fe: { ur: 'آئرن', en: 'iron' }, Cu: { ur: 'کاپر', en: 'copper' }, Mn: { ur: 'مینگنیز', en: 'manganese' }, pH: { ur: 'pH', en: 'pH' },
}
/** D-302 kept "VAN Lab" on 1 line on a phone; D-313 puts it inside a longer Urdu line, so it is kept whole there too. */
export function VanLabNowrap({ text }: { text: string }) {
  const i = text.indexOf('VAN Lab')
  return i < 0 ? <>{text}</> : <>{text.slice(0, i)}<span style={{ whiteSpace: 'nowrap' }}>VAN Lab</span>{text.slice(i + 7)}</>
}
/** Urdu text with Latin product names kept whole and left to right inside it. */
function UrLine({ text }: { text: string }) {
  const parts = text.split(/([A-Za-z][A-Za-z0-9-]*(?: [A-Z][A-Za-z0-9-]*)*)/)
  return <span className="urdu">{parts.map((x, i) => (i % 2 ? <bdi key={i} className="tk-prod">{x}</bdi> : x))}</span>
}

function Plan({ dist, distName, tehsilKey = null }: { dist: string; distName: string; tehsilKey?: string | null }) {
  const profile = regionalProfile(dist)
  const inputs = (profile?.bands ?? {}) as SoilInputs
  const totals = calcPlan(COST_PLANS.wheat, 1, inputs, 'wheat')
  const bumps = computeSoilBumps(inputs, Object.fromEntries(COST_PLANS.wheat.filter(r => r.slug).map(r => [r.slug as string, r.qtyPerAcre])), 'wheat')
  const pShort = !!profile && profile.bands.P2O !== undefined && profile.bands.P2O !== 'healthy'
  const lines: { ur: string; en: string }[] = []
  for (const l of totals.lines) {
    if (!l.slug || !bumps[l.slug]) continue
    // Name only the readings that push the line the way it actually moves: a rise names the short readings, a fall the
    // Healthy ones. The size is the calculator's (a fall can be less than a quarter when another reading adds back).
    const params = bumps[l.slug].parameters.filter((x, i, a) => a.indexOf(x) === i)
    const up = l.soilBumpQtyPerAcre > 0
    const named = params.filter(x => (inputs[x] === 'healthy') !== up)
    const ur = named.map(x => PARAM_UR[x]?.ur ?? x).join('، '), en = named.map(x => PARAM_UR[x]?.en ?? x).join(', ')
    if (up) lines.push({ ur: `${l.product} بڑھتا ہے: ${ur} کی ریڈنگ کی وجہ سے۔`, en: `${l.product} goes up, for the ${en} reading.` })
    else if (l.soilBumpQtyPerAcre < 0) lines.push({ ur: `${l.product} کم ہوتا ہے: ${ur} پوری ہے۔`, en: `${l.product} comes down: ${en} reads Healthy.` })
  }
  if (totals.swaps.length) lines.push({ ur: KHATA_UR.vitalUreaPh, en: 'In high-pH ground, Vital Urea (sulfur coated) is better.' })
  for (const a of totals.advisories) if (a.parameter === 'EC') lines.push({ ur: KHATA_UR.kallar, en: 'Salty ground (EC 4 or more): advice first, no extra bag.' })
  return (
    <div className="tk-screen">
      <h2 className="tk-h urdu">{KHATA_UR.planTitle}</h2>
      <p className="tk-en">{distName} district</p>
      <div className="tk-bundle">
        <p className="urdu tk-strong">{KHATA_UR.bundle}</p>
        <p className="urdu tk-survey">{KHATA_UR.bundleNote}</p>
        <p className="tk-en">VAN’s minimum wheat bundle, per acre; the soil reading adds to it</p>
        <table><tbody>
          <tr><td>Green Phosphate</td><td className="num">35 kg</td></tr>
          <tr><td>Vital Urea</td><td className="num">25 kg</td></tr>
          <tr><td>Vital Potash</td><td className="num">10 kg</td></tr>
        </tbody></table>
        {pShort && <p className="tk-bline"><UrLine text={KHATA_UR.pShort} /><span className="tk-en">Phosphorus is short in your ground: in the bundle, Green Phosphate goes up to 50 kg (1 bag).</span></p>}
        {/* D-284 (21 Oct 2026, Tahir's wording, from the reviewer's alternative): the bundle and the calculator below it are 2 different quantities; the farmer is told so beside the bundle's own number. English only until Tahir gives the Urdu. */}
        <p className="tk-en" data-bundle-vs-calc>The bundle is VAN’s minimum for this season. The calculator below uses VAN’s recommended wheat plan, so its Green Phosphate is a different figure.</p>
      </div>
      <div className="tk-calc">
      <p className="urdu tk-strong">{KHATA_UR.calcTitle}</p>
      <p className="urdu tk-strong">{KHATA_UR.planLine}</p>
      <p className="urdu tk-survey">{KHATA_UR.calcExplain}</p>
      <p className="tk-en">This is VAN’s recommended wheat plan. Your district’s soil makes these changes in it; the calculator gives the quantity.</p>
      {(totals.swaps.length > 0 || totals.lines.some(l => l.slug && bumps[l.slug] && l.soilBumpQtyPerAcre !== 0)) && <p className="tk-bline"><UrLine text={KHATA_UR.changesLead} /><span className="tk-en">The products change with the nutrients in the soil reading:</span></p>}
      <ul className="tk-adds">{lines.map(l => <li key={l.en}><UrLine text={l.ur} /><span className="tk-en">{l.en}</span></li>)}</ul>
      {!lines.length && <p className="tk-en">Your district’s figures change nothing in the calculator’s plan.</p>}
      <p className="urdu tk-survey">{KHATA_UR.calcDistrict}</p>
      <p className="tk-en">The calculator reads your district, not your own land.</p>
      </div>
      {/* D-316: the tehsil he picked rides along, so his WhatsApp message to VAN names it (linkPlace.ts). */}
      <a className="btn btn-gold tk-btn" href={`#/crops/wheat?district=${encodeURIComponent(dist)}${tehsilKey ? `#tehsil=${encodeURIComponent(tehsilKey)}` : ''}`}><span className="urdu">{KHATA_UR.planButton}</span><span className="tk-btn-en">Open the wheat calculator with your district filled in</span></a>
      <p className="tk-en">Price shows only inside the calculator. For your own field’s soil test, contact <a href="#/lab">VAN Lab</a> · <span className="urdu" dir="rtl"><VanLabNowrap text={KHATA_UR.ownTest} /></span></p>
    </div>
  )
}
