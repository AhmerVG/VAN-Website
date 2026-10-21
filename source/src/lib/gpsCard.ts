import { bandForValue, type SoilParameter } from '@/data/soilThresholds'

/**
 * GPS GRID CARD, the data side, D-277, 20 Oct 2026 (Tahir's rulings of 19 Oct 2026, 1 to 12; 20 Oct 2026, M1 to M5 and
 * G1 to G8).
 *
 * The card is a READY-MADE card for the area around the farmer's land, never his soil report. VAN works every card out
 * in advance from the Punjab soil survey (E: copy, Sheet1, ruled the master on 20 Oct, M1) and publishes only finished
 * cards: for lattice points about 1 km apart, the sample count and the median of each reading at a few fixed radii,
 * and only where 20 or more samples. No single sample value or point is ever published.
 *
 * His location never leaves his device: the page reads it from the browser, finds the nearest lattice point HERE, and
 * fetches the card files his 0.05 degree survey square names (about 5.5 km across). The files are whole districts, the
 * same for everyone, and no request carries his position. But the SET of files fetched can say more than "somewhere in
 * this district": in most of Punjab a square names 1 file, shared by every square of that district, so the requests
 * say only "somewhere in this district"; where 2 to 4 districts meet, a square names 2 to 4 files, and 38 squares
 * (each about 5.5 km across) ask for a set of files that no other square asks for, so a server log could place the
 * visit in that one square (corrected 20 Oct 2026, second review; D-278). punjab.json and pakistan.json are the same
 * for everyone. Nothing about his card goes anywhere unless he presses a WhatsApp button; the wheat plan link carries
 * the card after '#', which the browser never sends to the server (finding 1 of the 20 Oct review).
 *
 * Files (site-root/data/gps/, made by F:\VAN Web and App\Website\Soil Data\Scripts\gps_cards.py):
 *   index.json      0.05 degree square -> the district files that hold lattice points in it
 *   <DISTRICT>.json the cards of 1 district (v2; g0, h0: lattice offset; pts: [di, dj, uc, far, then per radius k, n,
 *                   10 values]; far = whole km from the point to the sample its Union Council is named from)
 *   uc.json         the Union Council and chak search: Union Councils in search only, point snapped to the lattice, and
 *                   always inside Punjab's line (third review: 2 spread-out Union Councils' points lay outside it)
 *   punjab.json     Punjab's boundary (OCHA COD-AB Pakistan, the full line, corners rounded to about 1 m; was simplified
 *                   to about 50 m until the second review): tells "the survey is too thin here" (inside Punjab) from
 *                   "outside Punjab" when a place has no card (G8), and an outside-Punjab card from a Punjab one (G9);
 *                   and how far Punjab is from his own point outside it (G11, kmToPunjab)
 *   pakistan.json   Pakistan's boundary (OCHA COD-AB, cut to the survey's box, corners rounded to about 1 m): a place
 *                   outside Pakistan gets no card, not even a neighbouring card point's (second review, G8 fallback)
 * Boundary credit (Tahir's ruling G10): "Boundary: OCHA COD-AB Pakistan (WFP)", licence CC BY-IGO, under the card's map.
 */

export const GPS_KEYS = ['p', 'k', 'zn', 'om', 'b', 'ph', 'ec', 'fe', 'cu', 'mn'] as const
export type GpsKey = (typeof GPS_KEYS)[number]
export type GpsVals = Partial<Record<GpsKey, number | null>>
export type GpsRadius = { r: number; n: number; vals: GpsVals }
export type GpsUc = { id: string; name: string; label: string; tehsil: string | null; district: string }
export type GpsCard = { gi: number; gj: number; lat: number; lon: number; district: string; uc: GpsUc; far: number; radii: GpsRadius[] }
export type GpsSearchUc = GpsUc & { gi: number; gj: number; samples: number; pin: boolean }

type DistrictDoc = { v: number; d: string; g0: number; h0: number; dlat: number; dlon: number; radii: number[]; keys: string[]; scale: number[]; minN: number; ucs: [string, string, string, string | null, string][]; pts: number[][] }
type IndexDoc = { v: number; deg: number; sq: Record<string, string[]> }
type UcDoc = { v: number; dlat: number; dlon: number; cols: string[]; ucs: [string, string, string, string, string | null, number, number, number, number][] }
type LineDoc = { v: number; polys: number[][][][] }

export const DLAT = 0.009, DLON = 0.0105
/** The widest ready radius (ruling 7 and G5): a place with fewer than 20 samples within 50 km has no card. */
export const MAX_KM = 50

/** The lattice point nearest a position (about 1 km apart). */
export const latticeOf = (lat: number, lon: number) => ({ gi: Math.round(lat / DLAT), gj: Math.round(lon / DLON) })
export const latticePos = (gi: number, gj: number) => ({ lat: gi * DLAT, lon: gj * DLON })

/** Great-circle distance in km. */
export function km(aLat: number, aLon: number, bLat: number, bLon: number) {
  const R = 6371.0088, r = Math.PI / 180
  const dLa = (bLat - aLat) * r, dLo = (bLon - aLon) * r
  const h = Math.sin(dLa / 2) ** 2 + Math.cos(aLat * r) * Math.cos(bLat * r) * Math.sin(dLo / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(h))
}

/** Resolved against the bundle's own URL, as the lens data is (Lens.tsx), so it works at any page depth. */
function dataUrl(file: string) {
  const script = [...document.querySelectorAll<HTMLScriptElement>('script[src]')].find(s => /\/(demo|v|index)\.[0-9a-f]+\.js$/.test(s.src))
    ?? document.querySelector<HTMLScriptElement>('script[type="module"][src]')
  const base = script ? script.src : location.origin + '/'
  return new URL('data/gps/' + file, base).href
}

/** A data file could not be downloaded (no connection, a weak one that gave up, or the server said no). */
export class GpsDownloadError extends Error {}
/**
 * How long a download may go with NO bytes arriving before the page says so and offers to try again (second review,
 * 20 Oct 2026: was a fixed 45 seconds for the whole file, which a slow but working line could not meet for the largest
 * district file). A slow line that keeps sending is never cut off; only a line that has gone quiet for 30 seconds is.
 */
export const IDLE_MS = 30000
const cache = new Map<string, Promise<unknown>>()
function getJson<T>(file: string): Promise<T> {
  let p = cache.get(file)
  if (!p) {
    const ctl = typeof AbortController !== 'undefined' ? new AbortController() : null
    let timer: ReturnType<typeof setTimeout> | null = null
    // Every time bytes arrive, the 30 seconds start again.
    const poke = () => { if (!ctl) return; if (timer) clearTimeout(timer); timer = setTimeout(() => ctl.abort(), IDLE_MS) }
    poke()
    p = fetch(dataUrl(file), ctl ? { signal: ctl.signal } : undefined)
      .then(async r => {
        if (!r.ok) throw new GpsDownloadError(file + ' ' + r.status)
        poke()
        const body = r.body
        // A browser that cannot read a download piece by piece: the same 30 seconds, counted from the start of the file.
        if (!body || typeof body.getReader !== 'function' || typeof TextDecoder === 'undefined') return r.json()
        const reader = body.getReader()
        const dec = new TextDecoder()
        let text = ''
        for (;;) {
          const { done, value } = await reader.read()
          if (done) break
          poke()
          text += dec.decode(value, { stream: true })
        }
        text += dec.decode()
        return JSON.parse(text)
      })
      .catch(e => { throw e instanceof GpsDownloadError ? e : new GpsDownloadError(file + ' ' + String(e)) })
      .finally(() => { if (timer) clearTimeout(timer) })
    // A failed download is forgotten (and the quiet one was stopped), so "Try again" asks for the file afresh.
    p.catch(() => cache.delete(file))
    cache.set(file, p)
  }
  return p as Promise<T>
}
export const loadIndex = () => getJson<IndexDoc>('index.json')
export const loadDistrict = (d: string) => getJson<DistrictDoc>(encodeURIComponent(d) + '.json')
export const loadUcs = () => getJson<UcDoc>('uc.json')
const loadPunjab = () => getJson<LineDoc>('punjab.json')
const loadPakistan = () => getJson<LineDoc>('pakistan.json')

const pointMaps = new WeakMap<DistrictDoc, Map<string, number[]>>()
function pointMap(doc: DistrictDoc) {
  let m = pointMaps.get(doc)
  if (!m) { m = new Map(); for (const p of doc.pts) m.set(`${p[0] + doc.g0},${p[1] + doc.h0}`, p); pointMaps.set(doc, m) }
  return m
}
const HEAD = 4   // di, dj, uc, far
function decode(doc: DistrictDoc, p: number[]): GpsCard {
  const gi = p[0] + doc.g0, gj = p[1] + doc.h0
  const u = doc.ucs[p[2]]
  const radii: GpsRadius[] = []
  const w = 2 + doc.keys.length
  for (let o = HEAD; o + w <= p.length; o += w) {
    const vals: GpsVals = {}
    doc.keys.forEach((k, i) => { const v = p[o + 2 + i]; vals[k as GpsKey] = v < 0 ? null : v / doc.scale[i] })
    radii.push({ r: doc.radii[p[o]], n: p[o + 1], vals })
  }
  return { gi, gj, ...latticePos(gi, gj), district: doc.d, uc: { id: u[0], name: u[1], label: u[2], tehsil: u[3], district: u[4] }, far: p[3], radii }
}

/** The ready-made card for a lattice point, or null where there is none (fewer than 20 samples within 50 km, outside
 *  Pakistan, or outside Punjab with no sample within 10 km). Throws GpsDownloadError when a file cannot be had. */
export async function cardAt(gi: number, gj: number): Promise<GpsCard | null> {
  const { lat, lon } = latticePos(gi, gj)
  const idx = await loadIndex()
  const sq = `${Math.floor(lon / idx.deg)},${Math.floor(lat / idx.deg)}`
  for (const d of idx.sq[sq] ?? []) {
    const doc = await loadDistrict(d)
    const p = pointMap(doc).get(`${gi},${gj}`)
    if (p) return decode(doc, p)
  }
  return null
}
/**
 * The card nearest a position: its own lattice point, or, where that point has no card (it falls just over the border,
 * G8), the nearest of the 8 around it that has one, if within 1.5 km. Only for a place inside Pakistan (pakistan.json):
 * a place over the border gets no card at all, not its own lattice point's and not a neighbour's (second review, 20 Oct
 * 2026: 31.57, 74.6054, 0.1 to 0.9 km inside India near Lahore, had the card of M/KALAN, Lahore City). Throws
 * GpsDownloadError.
 */
export async function cardNear(lat: number, lon: number): Promise<GpsCard | null> {
  if (!(await inPakistan(lat, lon))) return null
  const { gi, gj } = latticeOf(lat, lon)
  const own = await cardAt(gi, gj)
  if (own) return own
  const ring: { gi: number; gj: number; d: number }[] = []
  for (let a = -1; a <= 1; a++) for (let b = -1; b <= 1; b++) {
    if (!a && !b) continue
    const q = latticePos(gi + a, gj + b)
    ring.push({ gi: gi + a, gj: gj + b, d: km(lat, lon, q.lat, q.lon) })
  }
  for (const q of ring.sort((x, y) => x.d - y.d)) {
    if (q.d > 1.5) break
    const c = await cardAt(q.gi, q.gj)
    if (c) return c
  }
  return null
}

/** Inside a published boundary: even-odd ray casting on each polygon's outer ring, its holes taken out. The data
 *  script (gps_cards.py) puts every card point on the same side by the same rule. */
function inLine(doc: LineDoc, lat: number, lon: number) {
  const inRing = (ring: number[][]) => {
    let inside = false
    for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
      const [xi, yi] = ring[i], [xj, yj] = ring[j]
      if ((yi > lat) !== (yj > lat) && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) inside = !inside
    }
    return inside
  }
  return doc.polys.some(poly => inRing(poly[0]) && !poly.slice(1).some(inRing))
}
/** Inside Punjab's boundary (punjab.json, the same full line the cards were cut by). Throws GpsDownloadError. */
export async function inPunjab(lat: number, lon: number): Promise<boolean> {
  return inLine(await loadPunjab(), lat, lon)
}
/** Inside Pakistan's boundary (pakistan.json, the same line the card points were cut by, G8). Throws GpsDownloadError. */
export async function inPakistan(lat: number, lon: number): Promise<boolean> {
  return inLine(await loadPakistan(), lat, lon)
}

/**
 * G11 (Tahir, 20 Oct 2026, third review): how far Punjab is from a point outside it, in km: the distance to
 * Punjab's line itself (punjab.json, the full OCHA line the cards were cut by), not to a survey sample. Was the distance
 * to the nearest survey sample of the Union Council named, which said "less than 1 km" for a pin in Islamabad at 33.732,
 * 73.1745, where Punjab's line is 7.5 km away: that sample itself lies outside Punjab's line.
 * Final fix, 20 Oct 2026: the page asks it for the farmer's own point (on his device), no longer the card point, which
 * the neighbour step can put inside Punjab while his point is outside.
 * Each corner of the line is placed by the azimuthal equidistant projection about the point, which keeps every
 * distance from the point exact on the sphere; the nearest point of each straight piece between 2 corners is then
 * found on that flat drawing. Within 1 m of the exact OCHA line for all 5,685 card points outside Punjab
 * (gps_datatest.py). Throws GpsDownloadError.
 */
export async function kmToPunjab(lat: number, lon: number): Promise<number> {
  return kmToLine(await loadPunjab(), lat, lon)
}
function kmToLine(doc: LineDoc, lat: number, lon: number) {
  const R = 6371.0088, r = Math.PI / 180
  const s0 = Math.sin(lat * r), c0 = Math.cos(lat * r)
  const at = (p: number[]): [number, number] => {
    const la = p[1] * r, dl = (p[0] - lon) * r
    const sl = Math.sin(la), cl = Math.cos(la), cd = Math.cos(dl)
    const c = Math.acos(Math.min(1, Math.max(-1, s0 * sl + c0 * cl * cd)))
    const k = c > 1e-12 ? c / Math.sin(c) : 1
    return [R * k * cl * Math.sin(dl), R * k * (c0 * sl - s0 * cl * cd)]
  }
  let best = Infinity
  for (const poly of doc.polys) for (const ring of poly) {
    let [ax, ay] = at(ring[0])
    for (let i = 1; i < ring.length; i++) {
      const [bx, by] = at(ring[i])
      const dx = bx - ax, dy = by - ay, l = dx * dx + dy * dy
      const t = l > 0 ? Math.min(1, Math.max(0, -(ax * dx + ay * dy) / l)) : 0
      const px = ax + t * dx, py = ay + t * dy
      best = Math.min(best, Math.hypot(px, py))
      ax = bx; ay = by
    }
  }
  return best
}

/** All lattice points of a district, for the map the farmer clicks on. */
export async function districtPoints(d: string): Promise<{ gi: number; gj: number }[]> {
  const doc = await loadDistrict(d)
  return doc.pts.map(p => ({ gi: p[0] + doc.g0, gj: p[1] + doc.h0 }))
}

/** Search names: capitals, no punctuation or spaces, so "Chak No. 15-RB", "15/RB" and "chak 15 rb" meet. */
export function searchKey(s: string) {
  return s.toUpperCase().replace(/\bCHAK\b|\bNO\b|\bUC\b|\bU\/C\b/g, ' ').replace(/[^A-Z0-9]+/g, '')
}
let ucList: GpsSearchUc[] | null = null
async function ucs(): Promise<GpsSearchUc[]> {
  if (!ucList) {
    const doc = await loadUcs()
    ucList = doc.ucs.map(x => ({ id: x[0], name: x[1], label: x[2], district: x[3], tehsil: x[4], gi: x[5], gj: x[6], samples: x[7], pin: x[8] === 1 }))
  }
  return ucList
}
/** Throws GpsDownloadError when the list cannot be had, so the page never says "not found" for a list it does not have.
 *  A search whose name part (after CHAK, NO and UC are dropped) is under 2 characters finds nothing and is not a search
 *  yet: the page says nothing then (G12). */
export async function searchUcs(q: string, limit = 30, scope?: { district: string; tehsil: string }): Promise<GpsSearchUc[]> {
  const list = await ucs()
  const k = searchKey(q)
  if (k.length < 2) return []
  // The exact name first (CHAK 44 for "chak 44"), then names that start with it, then names that hold it.
  const exact: GpsSearchUc[] = [], starts: GpsSearchUc[] = [], within: GpsSearchUc[] = []
  for (const u of list) {
    // D-280 (Tahir, 20 Oct 2026): with a tehsil picked, only the Union Councils of that district and tehsil are listed.
    if (scope && (u.district !== scope.district || u.tehsil !== scope.tehsil)) continue
    const n = searchKey(u.name)
    if (n === k) exact.push(u)
    else if (n.startsWith(k)) starts.push(u)
    else if (n.includes(k)) within.push(u)
  }
  return [...exact, ...starts, ...within].slice(0, limit)
}
/** A Union Council in search, by its id (to restore a card opened from the search, after Back). */
export async function ucById(id: string): Promise<GpsSearchUc | null> {
  return (await ucs()).find(u => u.id === id) ?? null
}

/**
 * A pasted Google Maps pin or coordinates: "31.65, 74.02", "31.65 74.02", a link with q=, ll=, @lat,lon or !3d..!4d...
 * A short link (maps.app.goo.gl) carries no numbers, so it cannot be read here without asking Google, which would send
 * the place away; the page asks for the numbers instead.
 */
export function parsePin(text: string): { lat: number; lon: number } | null {
  const t = text.trim()
  const pairs: [string, string][] = []
  const m3 = t.match(/!3d(-?\d+(?:\.\d+)?)!4d(-?\d+(?:\.\d+)?)/); if (m3) pairs.push([m3[1], m3[2]])
  const mq = t.match(/[?&](?:q|query|ll|destination|center)=(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)/); if (mq) pairs.push([mq[1], mq[2]])
  const ma = t.match(/@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/); if (ma) pairs.push([ma[1], ma[2]])
  const mp = t.match(/^(-?\d{1,2}(?:\.\d+)?)\s*[, ]\s*(-?\d{2,3}(?:\.\d+)?)$/); if (mp) pairs.push([mp[1], mp[2]])
  for (const [a, b] of pairs) {
    const lat = Number(a), lon = Number(b)
    if (lat >= 27 && lat <= 35 && lon >= 68 && lon <= 76) return { lat, lon }
  }
  return null
}

/**
 * ONE ROUNDING for a card reading, everywhere it is shown: on the card, in VAN's WhatsApp message, and on the wheat
 * calculator's "Soil card" rows (low finding of the 20 Oct review: boron 0.605 printed 0.60 on the card and 0.61 in
 * the calculator). Decimals as the Soil Atlas prints them; half up on the decimal figure (0.605 is 0.61, not the
 * binary 0.60); and, as fmtSafe does on the Teesra Khata screens, never let the rounding carry a value into the next
 * band: then 1 more decimal is shown. The value the plan uses is not rounded.
 */
const CARD_DEC: Record<GpsKey, number> = { p: 1, k: 0, zn: 2, om: 2, b: 2, ph: 2, ec: 2, fe: 2, cu: 2, mn: 2 }
export const CARD_PARAM: Record<GpsKey, SoilParameter> = { p: 'P2O', k: 'K2O', zn: 'Zn', om: 'OM', b: 'B', ph: 'pH', ec: 'EC', fe: 'Fe', cu: 'Cu', mn: 'Mn' }
const roundHalfUp = (v: number, dec: number) => /e/i.test(String(v)) ? Math.round(v * 10 ** dec) / 10 ** dec : Number(Math.round(Number(`${v}e${dec}`)) + 'e-' + dec)
export function cardText(k: GpsKey, v: number | null | undefined): string {
  if (v == null) return '–'
  const dec = CARD_DEC[k]
  const r = roundHalfUp(v, dec)
  if (k !== 'ec' && bandForValue(CARD_PARAM[k], r) !== bandForValue(CARD_PARAM[k], v)) return roundHalfUp(v, Math.min(3, dec + 1)).toFixed(Math.min(3, dec + 1))
  return r.toFixed(dec)
}
/** The same rounding, by the calculator's own name for the reading. */
export function cardTextByParam(p: SoilParameter, v: number): string {
  const k = (Object.keys(CARD_PARAM) as GpsKey[]).find(x => CARD_PARAM[x] === p)
  return k ? cardText(k, v) : String(v)
}

/**
 * The link from the card to the wheat calculator's soil-numbers door. Everything about the card rides after '#'
 * (crops/wheat.html#card=d=SHEIKHUPURA;r=2;n=180;p=5.5;...), which the browser keeps on the device and never sends to
 * the server: the district, the radius, the count and the readings. No Union Council, no place (finding 1).
 */
export function cardLink(district: string, radius: GpsRadius) {
  const parts = [`d=${encodeURIComponent(district)}`, `r=${radius.r}`, `n=${radius.n}`]
  for (const k of GPS_KEYS) { const v = radius.vals[k]; if (v != null) parts.push(`${k}=${+v.toFixed(3)}`) }
  return `#/crops/wheat#card=${parts.join(';')}`
}

/**
 * THE WHEAT CALCULATOR'S SIDE, D-279, 20 Oct 2026 (Tahir's rulings 9 and 11 of 19 Oct 2026; G2 and G6 of 20 Oct 2026).
 * The card for the area near the farmer's land feeds the plan through the calculator's EXISTING soil-numbers door
 * (NutritionCreator.tsx): each reading is put through bandForValue, exactly as a number typed into "Your reading" is.
 * Only with 20 or more samples and a radius of at most 50 km; all rows come from the card, never mixed with the
 * district (a reading the card leaves blank stays blank, G2). Link: crops/wheat.html#card=d=KEY;r=2;n=48;p=5.1;...
 * The card rides after '#', so it never reaches the server (was `?district=KEY&card=...;uc=...`, finding 1 of the
 * 20 Oct review; the Union Council is no longer carried). Kept here, not in the component file, so that file exports
 * only components.
 *
 * CardInfo: the Soil Atlas card behind the calculator's rows: radius in km, sample count and its readings.
 */
export type CardInfo = { r: number; n: number; values: Partial<Record<SoilParameter, number>> }
export function parseCardParam(s: string | null | undefined): CardInfo | null {
  if (!s) return null
  const f: Record<string, string> = {}
  for (const part of s.split(';')) { const [k, v] = part.split('='); if (k && v !== undefined) f[k.trim()] = v.trim() }
  const r = Number(f.r), n = Number(f.n)
  if (!(r > 0 && r <= 50) || !(n >= 20)) return null
  const values: CardInfo['values'] = {}
  for (const [k, p] of Object.entries(CARD_PARAM)) {
    if (f[k] === undefined) continue
    const v = Number(f[k])
    if (Number.isFinite(v) && v >= 0) values[p] = v
  }
  return { r, n, values }
}
