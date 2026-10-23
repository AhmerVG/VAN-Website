import { useEffect, useMemo, useRef, useState } from 'react'
import { GRID, thousands, districtByKey } from '@/lib/soil'
import { READING_UR, KHATA_UR, phWord, GPS_UR, type KhataKey } from '@/data/soilUrdu'
import { SOIL_BAND_LABEL, bandOf } from '@/lib/soilSeverity'
import { wa } from '@/data/site'
import { TEHSILS, DISTRICT_UR } from '@/data/soilTehsils'
import { Khata, MiniMap } from './TeesraKhata'
import {
  cardAt, cardNear, cardLink, cardText, districtPoints, inPakistan, inPunjab, kmToPunjab, latticePos, isChakLabel, loadIndex, loadUcs, parsePin, searchKey, searchUcs, tehsilUcs, ucById,
  MAX_KM, type GpsCard as Card, type GpsSearchUc,
} from '@/lib/gpsCard'

/**
 * THE GPS GRID CARD ON THE SOIL ATLAS, D-278, 20 Oct 2026 (Tahir's rulings 1 to 12 of 19 Oct 2026, M1 to M5 and G1 to
 * G8 of 20 Oct 2026; design page "GPS Grid Card Design").
 *
 * A card for the area near the farmer's land, at the lowest level the survey allows: never his soil report, never a
 * single sample. His location stays on his phone or computer: it is read by the browser, the nearest ready-made card is
 * found here (lib/gpsCard.ts), and nothing about his card leaves the device until he presses a WhatsApp button (the wheat
 * plan link carries the card after '#', D-279).
 *
 *   ask      D-280 to D-282 (Tahir, 20 Oct 2026): this screen now opens only after he has picked his district and tehsil
 *            (the Teesra Khata screens above it), and goes from the larger unit to the smaller: search the Union Council or
 *            chak (line 7, only the Union Councils of his tehsil), click the place on the map (line 4, the squares of his
 *            tehsil), paste a Google Maps pin (line 5), then "Are you at your land now?" (line 15) and his location (line 3).
 *            Was: his location first, and district and tehsil as the last way. A card whose Union Council names another
 *            tehsil than the one he picked says so (line 17), and still shows the card for the place he gave.
 *   confirm  a computer (or any device) whose own accuracy is wider than about 1 km: line 14, move the pin, confirm.
 *   card     names its Union Council, tehsil and district (line 16); the radius and the count (line 8); the slider
 *            between the ready radii (line 9); the soil card's readings and band words (line 10); the survey square too
 *            (ruling 4); the bottom line (line 11); send to VAN (line 12); the wheat plan by this card (line 13).
 * Second review, 20 Oct 2026: a place over the border gets no card (lib/gpsCard.ts, cardNear); the Latin and number
 * parts of line 16 are isolated left to right, so 160/P no longer reads P/160; a place in Pakistan outside Punjab gets
 * an honest card that names the nearest Punjab survey area and how far it is, with line 16 hidden (Tahir's ruling G9);
 * the boundary is credited under the map (G10).
 * Third review, 20 Oct 2026: on an outside-Punjab card the distance is to Punjab's line itself, from the card point
 * (Tahir's ruling G11), and the sentence says "Punjab is N km away" so the distance is never put on the survey area; the
 * search says "not found" only once the name part, without CHAK, NO and UC, has 2 or more characters (G12).
 * Final fixes, 20 Oct 2026: the distance to Punjab's line is measured from his own point, which stays on his device
 * (G11's edge case: his point outside Punjab, the card point given by the neighbour step inside it, said "Punjab is
 * 1 km away"); the search says "not found" only for a search the downloaded list has answered, never while the list is
 * still coming (G12); and Tahir's own sentence, "Your land is near the border or outside Punjab." (G13).
 * English sits beside every Urdu line, as on the rest of the Teesra Khata screens. Lines with no Urdu from Tahir yet
 * are English only; they are listed in the build's report (Urdu gaps). A data file that cannot be downloaded says so in
 * English with a "Try again" button, and never as "not found" (review finding 2, 20 Oct 2026).
 */

type Screen = 'ask' | 'locating' | 'confirm' | 'map' | 'mapfine' | 'search' | 'paste' | 'card' | 'thin'
/** Said when a data file could not be downloaded; the button beside it tries the same step again (finding 2). */
const NET_MSG = 'The soil card could not be downloaded. Check your internet connection and try again.'
const OUTSIDE_MSG = 'Your location is outside Punjab, so the Punjab survey has no card for it. If your land is in Punjab, find it another way above.'
type Pt = { lat: number; lon: number }
const SAVE_KEY = 'vanGpsCard'
// Review (20 Oct 2026): the card saved in the page's history entry is brought back once, when the page itself is reached by Back.
// Without this, any later mount of the card (another tehsil picked) read the same key and opened a card he never asked for.
let restoreTried = false
function clearSaved() {
  try {
    const st = history.state
    if (st && typeof st === 'object' && SAVE_KEY in st) { const { [SAVE_KEY]: _gone, ...rest } = st as Record<string, unknown>; history.replaceState(rest, '') }
  } catch { /* fine */ }
}
type Saved = { gi: number; gj: number; ri: number; uc: string | null; pin: Pt | null; sc?: string }   // sc: the district|tehsil he had picked (second review)

const VAL_KEYS: KhataKey[] = ['p', 'k', 'zn', 'om', 'b', 'ph', 'ec']
/** G3 (Tahir, 20 Oct 2026): line 16 names the district and tehsil in the Urdu already live on the Teesra Khata screens
 *  (soilTehsils.ts, still drafts until his check), and the Union Council in English. A name with no Urdu stays English. */
const districtUr = (key: string) => DISTRICT_UR[key] ?? districtName(key)
const tehsilUr = (district: string, en: string | null) => (en ? TEHSILS.find(t => t.district === district && t.en === en)?.ur ?? en : '')
/** Second review, 20 Oct 2026: a Union Council name or chak number inside an Urdu line is isolated left to right
 *  (U+2066 ... U+2069), so the chak 160/P reads 160/P and not P/160 (the review counted 480 of the 2,623 Union
 *  Councils; gpstest.mjs, reading Chromium's own layout, finds 521 read wrong without it and 0 with it). Urdu text is
 *  left as it is; Tahir's words do not change. */
const ltr = (t: string) => (/[A-Za-z0-9]/.test(t) ? '\u2066' + t + '\u2069' : t)
const fmtKm = (r: number) => (Number.isInteger(r) ? String(r) : r.toFixed(1))
/** Acres in a 0.05 degree survey square at this latitude (about 6,350 in the north of Punjab to 6,750 in the south). */
const squareAcres = (lat: number) => { const kmDeg = 111.32 * 0.05; return kmDeg * kmDeg * Math.cos(lat * Math.PI / 180) * 247.105 }

/** The map he clicks on: the card lattice of a district (points about 1 km apart), a window of the ground around a centre. */
function FineMap({ points, center, halfKm, pin, circleKm, accKm, square, labels, onPick, label }: {
  points: { gi: number; gj: number }[]; center: Pt; halfKm: number; pin: Pt | null; circleKm?: number | null; accKm?: number | null
  square?: boolean; labels?: { name: string; lat: number; lon: number }[]; onPick?: (p: Pt) => void; label: string
}) {
  const ref = useRef<HTMLCanvasElement>(null)
  const [w, setW] = useState(360)
  const kx = 111.32 * Math.cos((center.lat * Math.PI) / 180), ky = 110.57
  useEffect(() => {
    const cv = ref.current
    if (!cv) return
    const width = Math.min(520, cv.parentElement?.clientWidth || 360)
    setW(width)
    const dpr = window.devicePixelRatio || 1
    cv.width = width * dpr; cv.height = width * dpr; cv.style.width = width + 'px'; cv.style.height = width + 'px'
    const g = cv.getContext('2d')
    if (!g) return
    g.setTransform(dpr, 0, 0, dpr, 0, 0)
    const s = width / (2 * halfKm)
    const X = (lon: number) => width / 2 + (lon - center.lon) * kx * s
    const Y = (lat: number) => width / 2 - (lat - center.lat) * ky * s
    g.fillStyle = '#F3EEE2'; g.fillRect(0, 0, width, width)
    const cell = Math.max(2, Math.min(28, 0.9 * s))
    g.fillStyle = '#C9A77C'
    for (const p of points) {
      const { lat, lon } = latticePos(p.gi, p.gj)
      const x = X(lon), y = Y(lat)
      if (x < -cell || y < -cell || x > width + cell || y > width + cell) continue
      g.fillRect(x - cell / 2, y - cell / 2, cell, cell)
    }
    if (square && pin) {
      const d = GRID.deg, sx = Math.floor(pin.lon / d) * d, sy = Math.floor(pin.lat / d) * d
      g.strokeStyle = '#14231A'; g.lineWidth = 2; g.setLineDash([6, 4])
      g.strokeRect(X(sx), Y(sy + d), (X(sx + d) - X(sx)), (Y(sy) - Y(sy + d)))
      g.setLineDash([])
    }
    if (pin && accKm) {
      g.fillStyle = 'rgba(200,50,60,.10)'; g.strokeStyle = '#C8323C'; g.lineWidth = 2
      g.beginPath(); g.arc(X(pin.lon), Y(pin.lat), accKm * s, 0, Math.PI * 2); g.fill(); g.stroke()
    }
    if (pin && circleKm) {
      g.fillStyle = 'rgba(0,89,148,.12)'; g.strokeStyle = '#005994'; g.lineWidth = 2.5
      g.beginPath(); g.arc(X(pin.lon), Y(pin.lat), circleKm * s, 0, Math.PI * 2); g.fill(); g.stroke()
    }
    if (labels) {
      // Each name whole inside the map, none on top of another (the first drawn keeps its place), on a light halo.
      g.font = '600 11px "Public Sans", sans-serif'; g.textAlign = 'center'; g.lineJoin = 'round'
      const placed: [number, number, number, number][] = []
      for (const l of labels) {
        const x = X(l.lon), y = Y(l.lat) - 10, hw = g.measureText(l.name).width / 2 + 3   // above its point, clear of the pin
        const box: [number, number, number, number] = [x - hw, y - 12, x + hw, y + 3]
        if (box[0] < 2 || box[1] < 2 || box[2] > width - 2 || box[3] > width - 2) continue
        if (placed.some(b => box[0] < b[2] && box[2] > b[0] && box[1] < b[3] && box[3] > b[1])) continue
        placed.push(box)
        g.strokeStyle = 'rgba(243,238,226,.9)'; g.lineWidth = 3; g.strokeText(l.name, x, y)
        g.fillStyle = '#14231A'; g.fillText(l.name, x, y)
      }
    }
    if (pin) {
      g.fillStyle = '#C8323C'; g.strokeStyle = '#fff'; g.lineWidth = 2.5
      g.beginPath(); g.arc(X(pin.lon), Y(pin.lat), 7, 0, Math.PI * 2); g.fill(); g.stroke()
    }
  }, [points, center, halfKm, pin, circleKm, accKm, square, labels, kx])
  const click = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!onPick) return
    const r = e.currentTarget.getBoundingClientRect()
    const s = w / (2 * halfKm)
    const x = (e.clientX - r.left) * (w / r.width), y = (e.clientY - r.top) * (w / r.height)
    onPick({ lat: center.lat - (y - w / 2) / (ky * s), lon: center.lon + (x - w / 2) / (kx * s) })
  }
  return <canvas ref={ref} className={`tk-map gps-map ${onPick ? 'gps-map-pick' : ''}`} role="img" aria-label={label} onClick={click} />
}

/** Union Council names around a point, for the map (from the search list, in search only). */
function useUcLabels(center: Pt | null, halfKm: number) {
  const [labels, setLabels] = useState<{ name: string; lat: number; lon: number }[]>([])
  useEffect(() => {
    let live = true
    if (!center) return
    loadUcs().then(doc => {
      if (!live) return
      const out: { name: string; lat: number; lon: number }[] = []
      for (const u of doc.ucs) {
        const p = latticePos(u[5], u[6])
        if (Math.abs(p.lat - center.lat) * 110.57 > halfKm || Math.abs(p.lon - center.lon) * 95 > halfKm) continue
        out.push({ name: u[2], lat: p.lat, lon: p.lon })
      }
      setLabels(out.slice(0, 60))
    }).catch(() => undefined)
    return () => { live = false }
  }, [center, halfKm])
  return labels
}

/** The district and tehsil he picked above this card, and the survey squares whose main tehsil it is (D-280). */
export type GpsScope = { district: string; tehsil: string; cells: number[] }
export function GpsCard({ onActive, onDistrictTehsil, scope, autoLocate = false, onAutoLocate }: { onActive: (on: boolean) => void; onDistrictTehsil: () => void; scope: GpsScope | null; autoLocate?: boolean; onAutoLocate?: () => void }) {
  const [screen, setScreenRaw] = useState<Screen>('ask')
  const setScreen = (s: Screen) => { if (!alive.current) return; setScreenRaw(s); onActive(s !== 'ask') }
  // D-280: if this card goes away (Back, or the band folds), the screens above it must not stay hidden.
  // Review (20 Oct 2026): an answer that arrives after he went back, or changed his tehsil, must not draw a card, change the
  // screen or hide the lists above. Every step that waits (location, card file) checks that it is still the latest.
  const alive = useRef(true)
  const reqSeq = useRef(0)
  const scopeKey = scope ? `${scope.district}|${scope.tehsil}` : ''
  const restoring = useRef(false)
  useEffect(() => { alive.current = true; return () => { alive.current = false; onActive(false); clearSaved() } }, [])   // eslint-disable-line react-hooks/exhaustive-deps
  const [pin, setPin] = useState<Pt | null>(null)          // his land, on this device only
  const [acc, setAcc] = useState<number | null>(null)      // the browser's own accuracy, metres
  const [card, setCard] = useState<Card | null>(null)
  const [ri, setRi] = useState(0)
  const [fixedUc, setFixedUc] = useState<GpsSearchUc | null>(null)
  // G9 (Tahir, 20 Oct 2026): his land is in Pakistan but outside Punjab; the card is the nearest Punjab survey area's.
  const [outside, setOutside] = useState(false)
  // G11 (Tahir, 20 Oct 2026): km from his own point to Punjab's line, for an outside card only.
  const [lineKm, setLineKm] = useState<number | null>(null)
  const [msg, setMsg] = useState<string | null>(null)
  // Finding 2: the step to run again when a data file could not be downloaded ("Try again").
  const [retry, setRetry] = useState<(() => void) | null>(null)
  const [points, setPoints] = useState<{ gi: number; gj: number }[]>([])
  const [center, setCenter] = useState<Pt | null>(null)
  const [half, setHalf] = useState(6)
  const [q, setQ] = useState('')
  const [hits, setHits] = useState<GpsSearchUc[]>([])
  const [searchFailed, setSearchFailed] = useState(false)
  // G12, final fix (20 Oct 2026): the text the downloaded list last answered. Until the list (uc.json) has come, no
  // search has been answered, so "not found" cannot show; a later answer never overwrites a newer one.
  const [answered, setAnswered] = useState<string | null>(null)
  // D-309: his tehsil's whole list, shown until his typing narrows it (null while it comes or when it could not come).
  const [allUcs, setAllUcs] = useState<GpsSearchUc[] | null>(null)
  const searchSeq = useRef(0)
  const [paste, setPaste] = useState('')
  const [showSquare, setShowSquare] = useState(false)
  const top = useRef<HTMLDivElement>(null)
  const go = (s: Screen) => { reqSeq.current++; setScreen(s); setMsg(null); setRetry(null); requestAnimationFrame(() => top.current?.scrollIntoView({ block: 'start', behavior: 'smooth' })) }
  /** A download failed: back to the question (or stay, for the maps), say so plainly, offer to try the same step again. */
  const failed = (again: () => void, stay = false) => {
    if (!stay) setScreen('ask')
    setMsg(NET_MSG); setRetry(() => again)
  }

  // The card file and the map points of the districts around a place: only district files, never his position. Near a
  // district's edge the 0.05 degree square names 2 to 4 district files; all of them are read, so the map is whole.
  const loadAround = async (p: Pt) => {
    const idx = await loadIndex()
    const sq = `${Math.floor(p.lon / idx.deg)},${Math.floor(p.lat / idx.deg)}`
    const ds = idx.sq[sq] ?? []
    const all: { gi: number; gj: number }[] = []
    for (const d of ds) all.push(...(await districtPoints(d)))
    setPoints(all)
  }

  const openCard = async (p: Pt, uc: GpsSearchUc | null = null, startRi = 0) => {
    const my = ++reqSeq.current
    const stale = () => my !== reqSeq.current || !alive.current
    setPin(p); setFixedUc(uc); setShowSquare(false)
    try {
      // cardNear gives no card for a place outside Pakistan, not even a neighbouring card point's (second review).
      const c = uc ? await cardAt(uc.gi, uc.gj) : await cardNear(p.lat, p.lon)
      if (stale()) return
      if (!c) {
        // G8: no card. Inside Punjab (and Pakistan) it is the survey that is too thin (fewer than 20 samples within
        // 50 km); outside Punjab, or over the border, it is outside the survey.
        setCard(null)
        const inside = (await inPakistan(p.lat, p.lon)) && (await inPunjab(p.lat, p.lon))
        if (stale()) return
        if (inside) go('thin')
        else { setScreen('ask'); setMsg(OUTSIDE_MSG); setRetry(null) }
        return
      }
      // G9: his own point (never a searched Union Council's) outside Punjab's line.
      const out = !uc && !(await inPunjab(p.lat, p.lon))
      if (stale()) return
      setOutside(out)
      // G11: how far Punjab's line is from his own point, worked out here on his device (his point never leaves it).
      // Was from the card point: where his point is outside Punjab and the neighbour step gives a card point inside it
      // (28.2154, 69.5310; 30.2647, 70.0759), that said "Punjab is 1 km away" for a card point, not his land.
      const lk = out ? await kmToPunjab(p.lat, p.lon) : null
      if (stale()) return
      setLineKm(lk)
      setCard(c); setRi(Math.min(startRi, c.radii.length - 1))
      await loadAround(p).catch(() => setPoints([]))   // the map's dots only; the card stands without them
      if (stale()) return
      go('card')
    } catch {
      if (!stale()) failed(() => void openCard(p, uc, startRi))
    }
  }

  // D-265 for the card: Back from the wheat calculator brings the card back. The place lives in this page's own history
  // entry, on his device, never in the address. A card opened from the search comes back under the Union Council
  // searched (finding 3: KALLAH came back as KHAN PUR, the name of the lattice point's own nearest sample).
  useEffect(() => {
    if (restoreTried) return
    restoreTried = true
    try {
      const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined
      const st = history.state as Record<string, unknown> | null
      const s = (st && typeof st === 'object' ? st[SAVE_KEY] : null) as Saved | null
      // A saved card is brought back only under the district and tehsil it was made under: a key left by an earlier visit (a reload
      // does not clear it) must not open a card under another tehsil.
      if (s && s.sc !== scopeKey) clearSaved()
      else if (nav?.type === 'back_forward' && s && Number.isInteger(s.gi) && Number.isInteger(s.gj)) {
        const p = s.pin ?? latticePos(s.gi, s.gj)
        restoring.current = true
        void (async () => {
          let uc: GpsSearchUc | null = null
          if (s.uc) { try { uc = await ucById(s.uc) } catch { uc = null } }
          try { await openCard(p, uc, s.ri | 0) } finally { restoring.current = false }
        })()
      }
    } catch { /* starts at the question, as before */ }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  useEffect(() => {
    if (screen !== 'card' || !card) return
    try {
      const st = history.state && typeof history.state === 'object' ? history.state : {}
      history.replaceState({ ...st, [SAVE_KEY]: { gi: card.gi, gj: card.gj, ri, uc: fixedUc?.id ?? null, pin, sc: scopeKey } as Saved }, '')
    } catch { /* fine */ }
  }, [screen, card, ri, fixedUc, pin, scopeKey])
  // He left the card (Back to the question): the saved place goes too, so Back from the wheat plan opens nothing he abandoned.
  useEffect(() => { if (screen !== 'card' && !restoring.current) clearSaved() }, [screen])

  const locate = () => {
    if (!('geolocation' in navigator)) { setMsg('This browser cannot give a location. Find your land another way above.'); setRetry(null); return }
    go('locating')
    const my = ++reqSeq.current
    const stale = () => my !== reqSeq.current || !alive.current
    navigator.geolocation.getCurrentPosition(async g => {
      if (stale()) return
      const p = { lat: g.coords.latitude, lon: g.coords.longitude }
      if (!(p.lat >= 27 && p.lat <= 35 && p.lon >= 68 && p.lon <= 76)) { setScreen('ask'); setMsg(OUTSIDE_MSG); setRetry(null); return }
      setAcc(g.coords.accuracy)
      if (g.coords.accuracy > 1000) {
        // Ruling 5: a computer's location can be off by hundreds of metres to kilometres. Ask him to confirm or move the pin.
        setPin(p); setCenter(p); setHalf(Math.min(25, Math.max(4, Math.ceil(g.coords.accuracy / 1000) * 1.6)))
        try { await loadAround(p) } catch { if (!stale()) failed(() => locate()); return }
        if (stale()) return
        go('confirm')
      } else void openCard(p)
    }, err => {
      if (stale()) return
      setScreen('ask'); setRetry(null)
      setMsg(err.code === err.PERMISSION_DENIED ? 'Your location was not shared. Find your land another way above.' : 'Your location could not be read. Find your land another way above.')
    }, { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 })
  }

  // 21 Oct 2026 (Tahir): "I am at my land" at the top of the band. He picks his district and tehsil first; when this card then opens,
  // his location is read at once, as if he had pressed the location button.
  useEffect(() => { if (autoLocate) { onAutoLocate?.(); locate() } }, [])   // eslint-disable-line react-hooks/exhaustive-deps

  // Finding 2: a list that did not load is never reported as "no Union Council by that name".
  // G12, final fix: "not found" only for the text the list has answered, so never while uc.json is still coming.
  const search = async (v: string) => {
    setQ(v)
    const n = ++searchSeq.current
    try {
      const h = await searchUcs(v, 30, scope ? { district: scope.district, tehsil: scope.tehsil } : undefined)
      if (n !== searchSeq.current) return
      setHits(h); setSearchFailed(false); setAnswered(v)
    } catch {
      if (n !== searchSeq.current) return
      setHits([]); setSearchFailed(true); setAnswered(null)
    }
  }
  const pickUc = async (u: GpsSearchUc) => {
    const p = latticePos(u.gi, u.gj)
    if (u.pin) {
      // B11: this Union Council's samples are spread over more than 15 km, so the card is built from his own pin.
      setFixedUc(null); setPin(null); setCenter(p); setHalf(12)
      const my = ++reqSeq.current
      try { await loadAround(p) } catch { if (my === reqSeq.current && alive.current) failed(() => void pickUc(u), true); return }
      if (my !== reqSeq.current || !alive.current) return   // he went Back while the map points came
      setScreen('mapfine'); setRetry(null)
      setMsg(`The samples of ${u.label} are spread over more than 15 km, so its card is built from your own pin: tap your land on the map.`)
      return
    }
    void openCard(p, u)
  }
  const pickSquare = async (i: number) => {
    const c = GRID.cells[i]
    const p = { lat: (c.y + 0.5) * GRID.deg, lon: (c.x + 0.5) * GRID.deg }
    setPin(null); setCenter(p); setHalf(6)
    const my = ++reqSeq.current
    try { await loadAround(p) } catch { if (my === reqSeq.current && alive.current) failed(() => void pickSquare(i), true); return }
    if (my !== reqSeq.current || !alive.current) return   // he went Back while the map points came
    go('mapfine')
  }
  const allCells = useMemo(() => GRID.cells.map((_, i) => i), [])
  // D-280: the map he taps first holds only the squares of his tehsil (every tehsil has 3 or more); a search list is only his tehsil's.
  const mapCells = useMemo(() => (scope && scope.cells.length ? scope.cells : allCells), [scope, allCells])
  useEffect(() => { searchSeq.current++; setQ(''); setHits([]); setSearchFailed(false); setAnswered(null); setAllUcs(null) }, [scope?.district, scope?.tehsil])
  // D-309: on the search screen, his tehsil's Union Councils come first, before he types.
  useEffect(() => {
    if (!scope || allUcs || (searchFailed && screen !== 'search')) return
    let live = true
    tehsilUcs({ district: scope.district, tehsil: scope.tehsil }).then(l => { if (live) { setAllUcs(l); setSearchFailed(false) } }).catch(() => { if (live && screen === 'search') setSearchFailed(true) })
    return () => { live = false }
  }, [screen, scope?.district, scope?.tehsil, allUcs, searchFailed])   // eslint-disable-line react-hooks/exhaustive-deps
  // D-309: chak numbers are named only where his tehsil has them (63 of 136 tehsils, by isChakLabel); examples come from his own tehsil.
  const hasChak = !!allUcs && allUcs.some(u => isChakLabel(u.label))
  const chakFree = !!scope && !!allUcs && !hasChak   // his tehsil is known to have no chak numbers
  const typedNumber = /\d/.test(q)
  // A number typed where there are no chaks gets the no-chak line, unless it names one of his tehsil's own (e.g. URBAN 2).
  const noChakHere = chakFree && typedNumber && (searchKey(q).length < 2 || (answered === q && !hits.length))
  const typing = searchKey(q).length >= 2 && !noChakHere
  // D-309: a name not found still leaves his tehsil's list under the message, so he can pick from it.
  const shown = typing && (hits.length || answered !== q) ? hits : (allUcs ?? [])
  const examples = allUcs && allUcs.length ? (() => {
    const bySamples = [...allUcs].sort((a, b) => b.samples - a.samples)
    const named = bySamples.filter(u => !isChakLabel(u.label)).map(u => u.label)
    const chaks = bySamples.filter(u => isChakLabel(u.label)).map(u => u.label)
    const pair = hasChak ? [named[0] ?? chaks[1], chaks[0]] : [named[0], named[1]]
    return [...new Set(pair.filter(Boolean))].join(' or ')
  })() : null
  const labels = useUcLabels(screen === 'mapfine' || screen === 'confirm' ? center : null, half)

  // Review (20 Oct 2026): once a way is open the lists above are hidden, so each screen says which tehsil it is for.
  const scopeLine = scope ? <p className="tk-en gps-scope" data-gps="scope">Your tehsil: {scope.tehsil}, {districtName(scope.district)}</p> : null
  const radius = card?.radii[ri] ?? null
  const ucName = fixedUc ?? card?.uc ?? null
  const square = pin ? GRID.byKey.get(`${Math.floor(pin.lon / GRID.deg)},${Math.floor(pin.lat / GRID.deg)}`) : undefined
  // D-281 (Tahir, 20 Oct 2026): the point he gave is used, and if the card is for another district than the one he picked, he is told.
  // Tahir's ruling after the reviews (21 Oct 2026): district only. The survey has no tehsil boundary lines, so a tehsil warning
  // judged by the survey squares or by the nearest sample's Union Council was wrong for farmers inside their own tehsil (8% of all
  // card points, up to half in Lahore's tehsils), and a district is the one thing the card is always certain about: the wheat plan by
  // the card opens for the card's district. Not for a Union Council he searched (the search is his tehsil's), and not outside
  // Punjab (G9 and G13 already say it).
  const outTehsil = !!scope && !fixedUc && !outside && !!ucName && ucName.district !== scope.district
  // Low finding: the phone variant of line 14 has no Urdu from Tahir, so on a phone (a coarse pointer) the Urdu line,
  // which says "computer", is not shown and the English names the phone. Tahir's words are not changed.
  const coarse = typeof window !== 'undefined' && !!window.matchMedia && window.matchMedia('(pointer: coarse)').matches
  const accKm = fmtKm(Math.max(1, Math.round((acc ?? 1000) / 1000)))

  // G11 (Tahir, 20 Oct 2026; was G9's distance to the nearest survey sample of the Union Council named): how far Punjab
  // is, the whole km from his own point to Punjab's line itself, "less than 1" below 1 km (final fix: was from the card
  // point). 1,408 of the 5,685 card points outside Punjab are named for a survey sample that itself lies outside Punjab's
  // line (Islamabad, Azad Kashmir, Khyber Pakhtunkhwa), so the km is said of Punjab, never of the survey area.
  const outsideKm = lineKm == null ? '' : lineKm < 1 ? 'less than 1' : String(Math.round(lineKm))
  const vanText = (() => {
    if (!card || !radius || !ucName) return ''
    const row = (k: KhataKey) => {
      const v = radius.vals[k] ?? null
      const b = k === 'ec' || v == null ? undefined : bandOf(k, v)
      const word = k === 'ph' ? phWord(v)?.en : k === 'ec' ? undefined : b ? SOIL_BAND_LABEL[b] : undefined
      return `${READING_UR[k].en}: ${cardText(k, v)}${v != null && READING_UR[k].unit ? ' ' + READING_UR[k].unit : ''}${v != null && word ? ` (${word})` : ''}`
    }
    return [
      // G7 (Tahir, 20 Oct 2026): was "Hello VAN. My soil card from the Soil Atlas, for the area near my land:"
      'Hello VAN. The soil card for my area from the Soil Atlas:',
      // G9: outside Punjab, the message says so and gives the distance; the Union Council is the nearest survey area.
      // G11: the distance is to Punjab's line, so it is said of Punjab (was "The nearest Punjab survey area is N km away: ...").
      // G13 (Tahir's own words, 20 Oct 2026): was "My land is outside Punjab."
      outside
        ? `My land is near the border or outside Punjab. Punjab is ${outsideKm} km away. The nearest Punjab survey area is Union Council ${ucName.label}, tehsil ${ucName.tehsil ?? 'not known'}, district ${districtName(ucName.district)}`
        : `Union Council: ${ucName.label}, tehsil ${ucName.tehsil ?? 'not known'}, district ${districtName(ucName.district)}`,
      // G1 (Tahir, 20 Oct 2026): the card point, about 1 km from his land, never his exact location.
      `Card point: ${card.lat.toFixed(3)} N, ${card.lon.toFixed(3)} E (the card point nearest my land, about 1 km)`,
      `Survey readings within ${fmtKm(radius.r)} km: ${thousands(radius.n)} samples`,
      ...VAL_KEYS.map(row),
      `${READING_UR.s.en}: not tested in this survey`,
      'These are area readings of the Punjab government soil survey, about 2016 to 2018, not a test of my field. Please advise.',
    ].join('\n')
  })()
  const friendText = `${GPS_UR.heading}: https://www.van.com.pk/soil.html?from=gps-wa`
  const toDistrictTehsil = () => { setPin(null); setCard(null); go('ask'); onDistrictTehsil() }

  return (
    <div className="gps" ref={top} id="gps-card">
      {screen !== 'ask' && <button className="tk-link" onClick={() => { setPin(null); setCard(null); go('ask') }}>← Back to the question</button>}

      {screen === 'ask' && (
        <div className="tk-screen gps-ask">
          <h2 className="tk-h urdu">{GPS_UR.heading}</h2>
          <p className="tk-en">The soil record of the land near you.</p>
          {/* 21 Oct 2026 review: the refusal / outside Punjab message sat under the last button, hidden behind the phone's bottom bar. It is first now. */}
          {msg && <p className="tk-en gps-msg" role="status" data-gps="askmsg">{msg}</p>}
          {msg && retry && <button className="chip chip-xs" onClick={() => { const r = retry; setMsg(null); setRetry(null); r() }} data-gps="retry">Try again</button>}
          <p className="urdu tk-sub gps-note">{GPS_UR.note}</p>
          <p className="tk-en">The card is the reading of the area near your land. Your location is not checked, and it stays on your phone or computer.</p>
          <p className="tk-en gps-or">{scope ? `Now find your land in ${scope.tehsil} tehsil. Each way is more exact than the one above it.` : 'Find your land. Each way is more exact than the one above it.'}</p>
          <div className="gps-ways">
            <button className="btn tk-btn gps-alt" onClick={() => go('search')} data-gps="search"><span className="urdu">{chakFree ? GPS_UR.searchUcNoChak : GPS_UR.searchUc}</span><span className="tk-btn-en">{chakFree ? 'Search the Union Council' : 'Search the Union Council or chak number'}</span></button>
            <button className="btn tk-btn gps-alt" onClick={() => go('map')} data-gps="map"><span className="urdu">{GPS_UR.clickMap}</span><span className="tk-btn-en">Click the place on the map</span></button>
            <button className="btn tk-btn gps-alt" onClick={() => go('paste')} data-gps="paste"><span className="urdu">{GPS_UR.pastePin}</span><span className="tk-btn-en">Paste a Google Maps pin</span></button>
          </div>
          <p className="urdu tk-sub tk-strong">{GPS_UR.atYourLand}</p>
          <p className="tk-en">Are you at your land right now?</p>
          <button className="btn btn-navy tk-btn" onClick={locate} data-gps="locate"><span className="urdu">{GPS_UR.useLocation}</span><span className="tk-btn-en">Yes: see the record from my location</span></button>
        </div>
      )}

      {screen === 'locating' && (
        <div className="tk-screen"><p className="tk-en" role="status">Reading your location on this device. Your browser may ask your permission first.</p></div>
      )}

      {screen === 'confirm' && pin && center && (
        <div className="tk-screen">
          {!coarse && <p className="urdu tk-sub tk-strong">{GPS_UR.computerNote(accKm)}</p>}
          <p className="tk-en" data-gps="acc">Your {coarse ? 'phone' : 'computer'} placed you within about {accKm} km. Tap your fields on the map to move the pin there.</p>
          <FineMap points={points} center={center} halfKm={half} pin={pin} accKm={(acc ?? 0) / 1000} labels={labels} onPick={setPin} label="Map around your location: tap your land to move the pin" />
          <button className="btn btn-navy tk-btn" onClick={() => void openCard(pin)} data-gps="confirm"><span className="urdu">{GPS_UR.thisIsMyLand}</span><span className="tk-btn-en">This is my land</span></button>
        </div>
      )}

      {screen === 'map' && (
        <div className="tk-screen">
          <p className="urdu tk-sub tk-strong">{GPS_UR.clickMap}</p>
          {scopeLine}
          <p className="tk-en">Tap the square nearest your land. The next map shows that ground about 1 km at a time.</p>
          {msg && <p className="tk-en gps-msg" role="status">{msg}</p>}
          {msg && retry && <button className="chip chip-xs" onClick={() => { const r = retry; setMsg(null); setRetry(null); r() }} data-gps="retry">Try again</button>}
          <div className="tk-mapwrap"><MiniMap idx={mapCells} sel={null} colourBy="neutral" label={scope ? `Map of the soil squares of ${scope.tehsil} tehsil: tap near your land` : "Map of Punjab's soil squares: tap near your land"} onPick={i => void pickSquare(i)} /></div>
        </div>
      )}

      {screen === 'mapfine' && center && (
        <div className="tk-screen">
          <p className="urdu tk-sub tk-strong">{GPS_UR.clickMap}</p>
          {msg ? <p className="tk-en gps-msg">{msg}</p> : <p className="tk-en">Tap your land. Each small square is a card point, about 1 km apart; names are Union Councils.</p>}
          <FineMap points={points} center={center} halfKm={half} pin={pin} labels={labels} onPick={p => setPin(p)} label="Map of the card points around the place you chose: tap your land" />
          <div className="gps-zoom">
            <button className="chip chip-xs" onClick={() => setHalf(h => Math.max(3, h / 2))}>Closer</button>
            <button className="chip chip-xs" onClick={() => setHalf(h => Math.min(48, h * 2))}>Wider</button>
          </div>
          {pin && <button className="btn btn-navy tk-btn" onClick={() => void openCard(pin)} data-gps="mapcard"><span className="tk-btn-en" style={{ fontSize: 15, fontWeight: 700 }}>See the card for this place</span></button>}
        </div>
      )}

      {screen === 'search' && (
        <div className="tk-screen">
          <p className="urdu tk-sub tk-strong">{chakFree ? GPS_UR.searchUcNoChak : GPS_UR.searchUc}</p>
          {scopeLine}
          {/* D-309 (Tahir, 22 Oct 2026): the list of his tehsil first; chak numbers named only where the tehsil has them. */}
          {scope && allUcs
            ? <p className="tk-en" data-gps="searchhelp">{scope.tehsil} has {allUcs.length} Union Council{allUcs.length === 1 ? '' : 's'} in the survey. Tap yours below, or type {hasChak ? 'its name or chak number' : 'its name'} in English letters to narrow the list{examples ? `, for example ${examples}` : ''}.</p>
            : <p className="tk-en">Type your Union Council's name in English letters.</p>}
          <input className="input tk-search" value={q} onChange={e => void search(e.target.value)} placeholder={chakFree ? 'Union Council' : 'Union Council or chak'} aria-label={chakFree ? 'Search the Union Council' : 'Search the Union Council or chak number'} data-gps="q" />
          {noChakHere && <p className="tk-en gps-msg" role="status" data-gps="nochak">{scope!.tehsil} has no chak numbers in the survey. Pick your Union Council from the list.</p>}
          {msg && <p className="tk-en gps-msg" role="status">{msg}</p>}
          {msg && retry && <button className="chip chip-xs" onClick={() => { const r = retry; setMsg(null); setRetry(null); r() }} data-gps="retry">Try again</button>}
          {searchFailed && (
            <>
              <p className="tk-en gps-msg" role="status" data-gps="searchfail">The list of Union Councils could not be downloaded. Check your internet connection and try again.</p>
              <button className="chip chip-xs" onClick={() => void search(q)} data-gps="retry">Try again</button>
            </>
          )}
          {/* G12 (Tahir, 20 Oct 2026): not while he is still typing. "chak", "Chak No", "chak 4" and "UC 7" have fewer than 2
              characters left once CHAK, NO and UC are dropped, so they are not a search yet and nothing is said. */}
          {/* G12, final fix (20 Oct 2026): and only once the list has answered this very text, so never while uc.json
              is still coming. */}
          {!searchFailed && !noChakHere && answered === q && searchKey(q).length >= 2 && !hits.length && <p className="tk-en" data-gps="notfound">No Union Council{chakFree ? '' : ' or chak'} by that name {scope ? `in ${scope.tehsil} tehsil` : 'in the survey'}. Try another spelling, or click the place on the map.{scope ? ` Only Union Councils of ${scope.tehsil} tehsil are searched; if your land is in another tehsil, go back and pick that tehsil.` : ''}</p>}
          <div className="tk-list">
            {shown.map(u => (
              <button key={u.id} className="tk-row" onClick={() => void pickUc(u)} data-uc={u.id}>
                <span><span className="tk-en-name">{u.label}</span> <span className="cap">{u.tehsil}, {districtName(u.district)} · <span className="num">{thousands(u.samples)}</span> samples</span></span>
              </button>
            ))}
          </div>
        </div>
      )}

      {screen === 'paste' && (
        <div className="tk-screen">
          <p className="urdu tk-sub tk-strong">{GPS_UR.pastePin}</p>
          {scopeLine}
          <p className="tk-en">In Google Maps on your phone, press and hold on your land, copy the numbers that appear (for example 31.651, 74.020) or share the place and copy the link, then paste it here. A short link (maps.app.goo.gl) has no numbers in it: open it in Google Maps and copy the numbers instead.</p>
          <textarea className="input gps-paste" rows={3} value={paste} onChange={e => setPaste(e.target.value)} aria-label="Paste a Google Maps pin or coordinates" data-gps="pastebox" />
          {paste.trim() && !parsePin(paste) && <p className="tk-en gps-msg">No Punjab coordinates found in that. Paste the 2 numbers, for example 31.651, 74.020.</p>}
          <button className="btn btn-navy tk-btn" disabled={!parsePin(paste)} onClick={() => { const p = parsePin(paste); if (p) void openCard(p) }} data-gps="pastego"><span className="tk-btn-en" style={{ fontSize: 15, fontWeight: 700 }}>See the card for this pin</span></button>
        </div>
      )}

      {screen === 'thin' && (
        <div className="tk-screen">
          <p className="tk-en gps-msg" data-gps="thin">The survey has fewer than 20 samples within {MAX_KM} km of this place, so there is no card here. The district card, or a test of your own field, can help instead.</p>
          <button className="btn tk-btn gps-alt" onClick={toDistrictTehsil}><span className="urdu">{GPS_UR.pickDistrictTehsil}</span><span className="tk-btn-en">Pick district and tehsil</span></button>
          {/* Low finding: "VAN Lab" was printed 3 times here (the message, the English link text and the live Urdu line);
              now only the live Urdu line names it. */}
          <a className="tk-link" href="#/lab"><span className="urdu" dir="rtl">{KHATA_UR.ownTest}</span></a>
        </div>
      )}

      {screen === 'card' && card && radius && ucName && (
        <div className="tk-screen" data-gps-card={card.gi + ',' + card.gj}>
          {outside ? (
            // G9 (Tahir, 20 Oct 2026): his land is outside Punjab. Line 16 would call this card his land's, and no Urdu for
            // this case exists (no new Urdu), so it is not shown; the English says so plainly.
            <>
              {/* G11 (Tahir, 20 Oct 2026): N is the distance to Punjab's line. Was "This is the nearest Punjab survey area, N km
                  away.", which would put the survey area itself at N km: not true where its sample lies outside the line
                  (1,408 card points) and not known anywhere (a survey area is known only by its samples). */}
              {/* G13 (Tahir's own words, 20 Oct 2026): was "Your land is outside Punjab." */}
              <p className="tk-en gps-outside" data-gps="outside">Your land is near the border or outside Punjab. Punjab is {outsideKm} km away. This is the nearest Punjab survey area.</p>
              <p className="tk-en">Nearest Punjab survey area: Union Council {ucName.label}, tehsil {ucName.tehsil}, district {districtName(ucName.district)}.</p>
            </>
          ) : (
            <>
              {outTehsil && scope && (
                <div className="gps-warn" data-gps="outtehsil" role="status">
                  <p className="urdu tk-sub tk-strong">{GPS_UR.outsideTehsil}</p>
                  <p className="tk-en">{`The survey area nearest to this place is in ${districtName(ucName.district)} district, not ${districtName(scope.district)}, the district you picked.`} The card is for that area. If it is not your land, go back and find it another way.</p>
                </div>
              )}
              <p className="urdu tk-sub tk-strong gps-for">{GPS_UR.cardFor(ltr(ucName.label), ltr(tehsilUr(ucName.district, ucName.tehsil)), ltr(districtUr(ucName.district)))}</p>
              <p className="tk-en">This card is for the land at: Union Council {ucName.label}, tehsil {ucName.tehsil}, district {districtName(ucName.district)}. If that is not your land, go back and find it another way.</p>
              {!fixedUc && card.far > 5 && <p className="tk-en" data-gps="far">The nearest survey samples are about {card.far} km from this place, in Union Council {card.uc.label}.</p>}
            </>
          )}
          {/* G5 (Tahir, 20 Oct 2026): the farmer sees the radius plainly. */}
          <p className="gps-radius" data-gps="circle">Circle: {fmtKm(radius.r)} km around your land</p>
          {pin && <FineMap points={points} center={pin} halfKm={Math.max(3, radius.r * 1.25)} pin={pin} circleKm={radius.r} square label={`Your land with a circle of ${fmtKm(radius.r)} km around it and the survey square it falls in`} />}
          {/* G10 (Tahir, 20 Oct 2026): the boundary that decides Punjab and Pakistan is credited (licence CC BY-IGO). */}
          {pin && <p className="gps-credit" data-gps="credit">Boundary: OCHA COD-AB Pakistan (WFP)</p>}
          <p className="urdu tk-sub tk-strong" data-gps="count">{GPS_UR.samplesWithin(fmtKm(radius.r), thousands(radius.n))}</p>
          {/* D-298, 22 Oct 2026: the samples are counted around the card point nearest his land, not his exact pin; the English says so. */}
          <p className="tk-en">{thousands(radius.n)} samples within {fmtKm(radius.r)} km of the card point nearest your land{card.radii[0].r > 2 ? `: the survey is thin close to your land, so the card starts at ${fmtKm(card.radii[0].r)} km` : ''}. Card points are about 1 km apart.{radius.r > 10 ? ` This card covers a wide area, a circle ${fmtKm(radius.r * 2)} km across, so it can differ a lot from your own field.` : ''}</p>
          {card.radii.length > 1 && (
            <div className="gps-slider">
              <input type="range" min={0} max={card.radii.length - 1} step={1} value={ri} onChange={e => setRi(Number(e.target.value))} aria-label="Radius of the circle" data-gps="radius" />
              <div className="gps-ticks">{card.radii.map((r, i) => <span key={r.r} className={i === ri ? 'on' : ''}>{fmtKm(r.r)} km</span>)}</div>
              <p className="urdu tk-sub">{GPS_UR.dragRadius}</p>
              <p className="tk-en">Drag to widen or narrow the circle. Each step is worked out in advance from 20 or more samples.</p>
            </div>
          )}
          <Khata vals={Object.fromEntries(VAL_KEYS.map(k => [k, radius.vals[k] ?? null]))} fmt={cardText} />
          {VAL_KEYS.some(k => radius.vals[k] == null) && <p className="tk-en">A row with no reading has fewer than 20 valid survey values inside the circle{card.district === 'JHELUM' ? ' (the survey has no valid zinc reading in Jhelum)' : ''}.</p>}
          {/* D-307, Tahir 22 Oct 2026: the band words are VAN's table, while the Atlas quotes Punjab's lines; a reading can be "Average" here and still be low on Punjab's line. English only; Urdu to come from Tahir. */}
          <p className="tk-en">The words are VAN’s soil-test bands. Punjab’s survey calls boron low below 0.5 ppm, zinc below 1.0 and potash below 180.</p>
          {square && (
            <div className="gps-square">
              <p className="tk-en">The survey square your land falls in, about {thousands(Math.round(squareAcres(pin?.lat ?? card.lat) / 100) * 100)} acres (the dashed square on the map): {thousands(square.n)} samples.</p>
              <button className="chip chip-xs" onClick={() => setShowSquare(s => !s)} aria-expanded={showSquare}>{showSquare ? 'Hide the square’s readings' : 'Show the square’s readings'}</button>
              {showSquare && <Khata vals={{ p: square.p, k: square.k, zn: square.zn, om: square.om, b: square.b, ph: square.ph, ec: square.ec }} />}
            </div>
          )}
          {/* D-302, 22 Oct 2026: "VAN Lab" kept on one line (it broke as "VAN" / "Lab" on a phone); the words are unchanged. */}
          <p className="urdu tk-survey">{(() => { const t = GPS_UR.areaNotField; const i = t.indexOf('VAN Lab'); return i < 0 ? t : <>{t.slice(0, i)}<span style={{ whiteSpace: 'nowrap' }}>VAN Lab</span>{t.slice(i + 7)}</> })()}</p>
          <p className="tk-en">An area reading from the Punjab government survey, about 2016 to 2018, mapped by VAN. Not a test of your field. Your own test: VAN Lab.</p>
          <a className="btn tk-btn tk-wa tk-wa-van" href={wa(vanText)} target="_blank" rel="noopener" data-gps="van"><span className="urdu" dir="rtl">{GPS_UR.sendToVan}</span><span className="tk-btn-en">Send this card to VAN to discuss your soil</span></a>
          {/* D-295, Tahir 22 Oct 2026: the English says what his Urdu says; the privacy line moves under the button. */}
          <p className="tk-en">Your card leaves your device only when you send it.</p>
          {/* Low finding: the wheat plan picks the district of the Union Council the card names (a searched Union Council's
              own district), not the district file the lattice point sits in (Nankana, Sargodha and Sialkot cases). */}
          <a className="btn btn-navy tk-btn" href={cardLink(ucName.district, radius)} data-gps="wheat"><span className="urdu">{GPS_UR.wheatPlan}</span><span className="tk-btn-en">Make the wheat plan by this soil card</span></a>
          <a className="btn tk-btn tk-wa" href={'https://wa.me/?text=' + encodeURIComponent(friendText)} target="_blank" rel="noopener" data-gps="friend"><span className="urdu">{KHATA_UR.share}</span><span className="tk-btn-en">Share with a friend (the link only, not your place)</span></a>
        </div>
      )}
    </div>
  )
}

/** The district's name as the Atlas prints it (Rahim Yar Khan for RYK). */
const districtName = (key: string) => districtByKey(key)?.name ?? key
