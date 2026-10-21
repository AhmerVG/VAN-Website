/**
 * GPS GRID CARD CHECK, 20 Oct 2026 (D-277 to D-279). Run after the build, like sweep.mjs: `node gpstest.mjs [shots folder]`.
 *
 * Serves out/ over http and checks, in a real browser, at phone (412 x 860) and computer (1366 x 900) sizes:
 *   1  the first screen: Tahir's lines 1, 2, 15, 3, 4, 7, 5 and 6, word for word, each with its English;
 *   2  his location on a phone: the card for the nearest lattice point, read from the card file here in Node by a
 *      separate decoder, shows exactly its Union Council, with the district and tehsil in the live Urdu names (line 16,
 *      G3), the radius and count (line 8), the radius plainly (G5), and every reading in the one rounding; the slider;
 *   3  the 2 WhatsApp buttons: VAN's (line 12) opens "Hello VAN. The soil card for my area from the Soil Atlas:" (G7) and
 *      carries the card point (3 decimals, G1), the Union Council, the radius, the count and the readings; a friend's
 *      carries the link only;
 *   4  the wheat plan by the card (line 13): the card rides after '#' (crops/wheat.html#card=...), so the server log holds
 *      no reading, no Union Council code and no coordinate, from any request, the .html pages included (finding 1); the
 *      rows come through the soil-numbers door labelled "Soil card", in the same rounding as the card; the district stays
 *      picked and fills nothing (G2); the head and the bumps say "this soil card" (G6); the plan equals the same numbers
 *      typed by hand; "Clear all, then choose your district" works; Back brings the card back;
 *   5  a location 3 km wide: on a computer, line 14 with the number and the movable pin; on a phone, no "computer" line
 *      and the English says "phone";
 *   6  search: a Union Council whose lattice point is named for another one keeps its own name after the wheat plan and
 *      Back (finding 3), and its wheat plan picks its own district (low finding); a spread-out Union Council; a pasted
 *      pin; the map click;
 *   7  weak network: a district file that fails gives a plain message and Try again, which then works; a search list
 *      that fails never says "not found" (finding 2);
 *   8  the edges: a wide card (30 to 50 km) says so; a far naming sample says so; no card where fewer than 20 samples lie
 *      within 50 km, "VAN Lab" once, and "Pick district and tehsil" clears the message; points just over the border near
 *      Lahore and Kasur get the "outside Punjab" message (G8); Karachi; location refused; Jhelum's zinc blank; Faisalabad
 *      iron and copper not carried;
 *   9  second review, 20 Oct 2026: places 0.1 to 1 km inside India near Lahore, Kasur, Sialkot and Chunian get no card
 *      and the "outside Punjab" message (the fallback to a neighbouring card point only for a place inside Pakistan),
 *      while a place inside Pakistan whose own card point fell over the line still gets its neighbour's card; line 16
 *      with a chak Union Council (160/P, 105/DNB) reads in the right order on screen, and all 2,623 names do; the
 *      wheat head and list follow whether card rows are in use (after Clear all and a district they say "your soil");
 *      a slow line on the largest district file (Rahim Yar Khan) still gives the card after more than 45 seconds, and a
 *      line gone quiet gives the message after the 30 second idle cut-off, and Try again then works; a place in
 *      Islamabad or Khyber Pakhtunkhwa gets the honest outside-Punjab card (G9) with line 16 hidden and VAN's message
 *      saying so; the boundary credit under the map (G10); the calculator's message prints 11,571 with its comma;
 *  10  third review, 20 Oct 2026: on an outside-Punjab card, "Punjab is N km away" with N the whole km from the card point
 *      to Punjab's line (Tahir's ruling G11), at Islamabad (the review's pin 33.732, 73.1745, was "less than 1"),
 *      Khyber Pakhtunkhwa, Azad Kashmir and Sindh, on the screen and in VAN's message; the search says nothing while the
 *      name part is under 2 characters ("chak", "Chak No", "chak 4", "UC 7"), and still finds "chak 44" and says "not
 *      found" for a real miss (G12); no Union Council in search has its point outside Punjab's line, and the 2 that had
 *      (NOOR DOLAL, DHEER KOT) give a Punjab card from a tap in the middle of their map; the pin card check waits for the
 *      card itself (it used to stop at the map screen's own message and could fail on a correct build);
 *  11  final fixes, 20 Oct 2026: "Punjab is N km away" with N measured from his own point, not the card point (G11's edge
 *      case: 28.2154, 69.5310 and 30.2647, 70.0759, his point outside Punjab and the card point inside it, no longer say
 *      "Punjab is 1 km away"; the Islamabad pin still says 7); Tahir's own sentence "Your land is near the border or
 *      outside Punjab." on the screen and "My land is near the border or outside Punjab." in VAN's message (G13); with
 *      the search list (uc.json) held back 4 seconds, typing "kallah" never shows "not found", and KALLAH comes once the
 *      list arrives (G12);
 *   and no console error or failed request where nothing was made to fail. With a shots folder, screenshots of each screen.
 * Prints "N passed, M failed". Exit code 1 on any failure.
 */
import { chromium } from 'playwright'
import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'
import zlib from 'node:zlib'
import { fileURLToPath } from 'node:url'

const ROOT = path.dirname(fileURLToPath(import.meta.url))
const OUT = path.join(ROOT, 'out')
const SHOTS = process.argv[2] || null
if (SHOTS) fs.mkdirSync(SHOTS, { recursive: true })
const CHROME = process.env.CHROME || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.woff2': 'font/woff2', '.json': 'application/json', '.xml': 'application/xml', '.txt': 'text/plain', '.ico': 'image/x-icon', '.pdf': 'application/pdf', '.glb': 'model/gltf-binary' }
// The server's own log: exactly what a web server would see (the path and the query; never what follows '#').
const serverLog = []
// A slow or a stalled line for 1 file (second review): `slow` sends the file gzipped, as the live server does, a piece
// every second with one quiet spell shorter than the idle cut-off; `stall` sends a first piece, then nothing.
let throttle = null   // { file: 'RYK.json', mode: 'slow' | 'stall', closed: false }
const server = http.createServer((req, res) => {
  serverLog.push(req.url)
  const u = decodeURIComponent(req.url.split('?')[0])
  const f = path.join(OUT, u === '/' ? 'index.html' : u)
  if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); res.end('not found'); return }
  if (throttle && u.endsWith('/' + throttle.file)) {
    const t = throttle
    const gz = zlib.gzipSync(fs.readFileSync(f), { level: 9 })
    res.writeHead(200, { 'content-type': 'application/json', 'content-encoding': 'gzip', 'content-length': gz.length })
    const CH = t.chunk ?? 12000
    let o = 0, n = 0, timer = null
    res.on('close', () => { t.closed = !res.writableFinished; if (timer) clearTimeout(timer) })
    const step = () => {
      if (o >= gz.length) { res.end(); return }
      res.write(gz.subarray(o, o + CH)); o += CH; n++
      if (t.mode === 'stall') return
      timer = setTimeout(step, n === t.pauseAt ? t.pauseMs : 1000)
    }
    t.started = Date.now(); t.bytes = gz.length
    step()
    return
  }
  res.writeHead(200, { 'content-type': MIME[path.extname(f)] || 'application/octet-stream' })
  fs.createReadStream(f).pipe(res)
})
await new Promise(r => server.listen(0, r))
const BASE = `http://localhost:${server.address().port}`
const browser = await chromium.launch({ executablePath: CHROME })
let passed = 0, failed = 0
const check = (label, ok, detail = '') => { if (ok) passed++; else failed++; console.log(`${ok ? '  ok  ' : '  FAIL'} ${label}${!ok && detail ? '\n         ' + String(detail).slice(0, 700) : ''}`) }

// ── the published data, decoded here independently of src/lib/gpsCard.ts ─────────────────────────────────────────
const GPS = path.join(OUT, 'data', 'gps')
const IDX = JSON.parse(fs.readFileSync(path.join(GPS, 'index.json'), 'utf8'))
const UCS = JSON.parse(fs.readFileSync(path.join(GPS, 'uc.json'), 'utf8'))
const PUN = JSON.parse(fs.readFileSync(path.join(GPS, 'punjab.json'), 'utf8'))
const PAK = JSON.parse(fs.readFileSync(path.join(GPS, 'pakistan.json'), 'utf8'))
const docs = {}
const doc = d => (docs[d] ??= JSON.parse(fs.readFileSync(path.join(GPS, d + '.json'), 'utf8')))
const DLAT = 0.009, DLON = 0.0105
const decodePt = (d, D, p) => {
  const u = D.ucs[p[2]], w = 2 + D.keys.length, radii = []
  for (let o = 4; o < p.length; o += w) radii.push({ r: D.radii[p[o]], n: p[o + 1], vals: Object.fromEntries(D.keys.map((k, i) => [k, p[o + 2 + i] < 0 ? null : p[o + 2 + i] / D.scale[i]])) })
  return { gi: p[0] + D.g0, gj: p[1] + D.h0, district: d, far: p[3], uc: { id: u[0], name: u[1], label: u[2], tehsil: u[3], district: u[4] }, radii }
}
function card(gi, gj) {
  const sq = `${Math.floor(gj * DLON / IDX.deg)},${Math.floor(gi * DLAT / IDX.deg)}`
  for (const d of IDX.sq[sq] ?? []) {
    const D = doc(d)
    const p = D.pts.find(p => p[0] + D.g0 === gi && p[1] + D.h0 === gj)
    if (p) return decodePt(d, D, p)
  }
  return null
}
const allUcs = UCS.ucs.map(x => ({ id: x[0], name: x[1], label: x[2], district: x[3], tehsil: x[4], gi: x[5], gj: x[6], n: x[7], pin: x[8] === 1 }))
const ucBy = (pred) => allUcs.find(pred)
const NAME = { RYK: 'Rahim Yar Khan', MUZAFFAR: 'Muzaffargarh', 'D.G.KHAN': 'Dera Ghazi Khan', BHAWALNAGAR: 'Bahawalnagar', BHAWALPUR: 'Bahawalpur', CHINNIOT: 'Chiniot', NANKANA: 'Nankana Sahib', 'MANDI BAHAUDDIN': 'Mandi Bahauddin', 'TOBA TEK SINGH': 'Toba Tek Singh' }
const dname = k => NAME[k] ?? k.charAt(0) + k.slice(1).toLowerCase()
const th = n => n.toLocaleString('en-US')
const fmtKm = r => Number.isInteger(r) ? String(r) : r.toFixed(1)
// G3: the Urdu district and tehsil names already live (src/data/soilTehsils.ts), read here from the source text
const tehsilSrc = fs.readFileSync(path.join(ROOT, 'src', 'data', 'soilTehsils.ts'), 'utf8')
const DISTRICT_UR = JSON.parse(/export const DISTRICT_UR[^=]*=\s*(\{.*\})\s*$/m.exec(tehsilSrc)[1])
const TEHSILS = JSON.parse(/export const TEHSILS[^=]*=\s*(\[.*\])\s*$/m.exec(tehsilSrc)[1])
const dUr = k => DISTRICT_UR[k] ?? dname(k)
const soilSrc = fs.readFileSync(path.join(ROOT, 'src', 'data', 'soil.ts'), 'utf8')
const SOIL_CELLS = JSON.parse(/= (\{"cell_deg".*\});?\s*$/m.exec(soilSrc)[1]).cells
const CELL_TEHSIL = JSON.parse(/export const CELL_TEHSIL[^=]*=\s*(\[\[.*\]\]);?\s*$/m.exec(tehsilSrc)[1])
const cellIdxAt = (lat, lon) => SOIL_CELLS.findIndex(c => c.x === Math.floor(lon / 0.05) && c.y === Math.floor(lat / 0.05))
const cellCentre = i => ({ lat: (SOIL_CELLS[i].y + 0.5) * 0.05, lon: (SOIL_CELLS[i].x + 0.5) * 0.05 })
const tUr = (d, en) => TEHSILS.find(t => t.district === d && t.en === en)?.ur ?? en
// Point in a published boundary (ray casting), written here apart from the page's own
const inLine = (doc, lat, lon) => doc.polys.some(poly => {
  const inRing = ring => { let c = false; for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) { const [xi, yi] = ring[i], [xj, yj] = ring[j]; if ((yi > lat) !== (yj > lat) && lon < (xj - xi) * (lat - yi) / (yj - yi) + xi) c = !c } return c }
  return inRing(poly[0]) && !poly.slice(1).some(inRing)
})
const inPunjab = (lat, lon) => inLine(PUN, lat, lon)
const inPakistan = (lat, lon) => inLine(PAK, lat, lon)
const kmT = (a, b, c, d) => { const R = 6371.0088, r = Math.PI / 180, h = Math.sin((c - a) * r / 2) ** 2 + Math.cos(a * r) * Math.cos(c * r) * Math.sin((d - b) * r / 2) ** 2; return 2 * R * Math.asin(Math.sqrt(h)) }
/** The first build's rule (its own lattice point, else the nearest of the 8 around it within 1.5 km), to show that a
 *  border test place would have had a card before the second review's fix. */
const oldRule = (lat, lon) => {
  const gi = Math.round(lat / DLAT), gj = Math.round(lon / DLON)
  const own = card(gi, gj); if (own) return own
  const ring = []
  for (let a = -1; a <= 1; a++) for (let b = -1; b <= 1; b++) if (a || b) ring.push([kmT(lat, lon, (gi + a) * DLAT, (gj + b) * DLON), gi + a, gj + b])
  for (const [d, x, y] of ring.sort((p, q) => p[0] - q[0])) { if (d > 1.5) break; const c = card(x, y); if (c) return c }
  return null
}
const ISO = /[\u2066\u2069]/g
const OUT_TEHSIL_UR = 'یہ جگہ آپ کی چنی ہوئی تحصیل سے باہر ہے۔'   // Tahir's pick, option 1, 20 Oct 2026
const searchKeyOf = s => s.toUpperCase().replace(/\bCHAK\b|\bNO\b|\bUC\b|\bU\/C\b/g, ' ').replace(/[^A-Z0-9]+/g, '')

// Tahir's 16 lines, as approved (GPS Grid Card, rulings 19 Oct 2026.md and the design page)
const L = {
  1: 'آپ کی قریبی زمین کی مٹی کا ریکارڈ', 2: 'کارڈ آپ کی زمین کے قریبی علاقے کی ریڈنگ ہے۔ آپ کی لوکیشن چیک نہیں کی جاتی۔',
  3: 'اپنی لوکیشن سے ریکارڈ دیکھیں', 4: 'جگہ پر کلک کریں', 5: 'گوگل میپس کا پن پیسٹ کریں', 6: 'ضلع اور تحصیل چنیں',
  7: 'یونین کونسل یا چک نمبر تلاش کریں', 9: 'دائرہ بڑا یا چھوٹا کرنے کے لیے کھینچیں', 11: 'یہ علاقے کا حساب ہے، آپ کے کھیت کا ٹیسٹ نہیں۔ اپنا ٹیسٹ: VAN Lab',
  12: 'رہنمائی اور مٹی کے حساب سے کھاد کی ڈسکشن کے لیے یہ کارڈ VAN کو بھیجیں', 13: 'مٹی کے کارڈ کے حساب سے گندم کا پلان بنائیں',
  '14b': 'یہی میری زمین ہے', 15: 'کیا آپ اس وقت اپنی زمین پر موجود ہیں؟',
}
const line8 = (r, n) => `آپ کی زمین کے ${r} کلومیٹر کے اندر ${n} نمونے`
const line14 = k => `آپ کے کمپیوٹر نے جگہ تقریباً ${k} کلومیٹر کے اندر بتائی ہے۔ پن کو اپنے کھیت پر لے جائیں۔`
const line16 = (uc, t, d) => `یہ کارڈ اس زمین کا ہے: ${uc}، ${t}، ${d}`
const line16of = u => line16(u.label, tUr(u.district, u.tehsil), dUr(u.district))
// Second review: line 16's Latin and number parts sit inside U+2066 ... U+2069; Tahir's words are compared without them.
const same16 = (shown, u) => shown.replace(ISO, '').trim() === line16of(u) && shown.includes('\u2066' + u.label + '\u2069')
const NET_MSG = 'The soil card could not be downloaded. Check your internet connection and try again.'

async function newPage(vp, geo = null, grant = true, extra = {}) {
  const ctx = await browser.newContext({ viewport: vp, reducedMotion: 'reduce', ...(geo ? { geolocation: geo } : {}), permissions: grant && geo ? ['geolocation'] : [], ...extra })
  const page = await ctx.newPage()
  page.setDefaultTimeout(20000)
  const errors = [], urls = []
  page.on('console', m => { if (m.type() === 'error' && !/favicon-32x32/.test(m.location()?.url || '') && !/favicon-32x32/.test(m.text())) errors.push(m.text()) })
  page.on('pageerror', e => errors.push('pageerror ' + e.message))
  page.on('requestfailed', r => { if (!/favicon-32x32/.test(r.url())) errors.push('failed ' + r.url()) })
  page.on('request', r => urls.push(r.url()))
  page.on('response', r => { if (r.status() >= 400 && !/favicon-32x32/.test(r.url())) errors.push(r.status() + ' ' + r.url()) })
  return { ctx, page, errors, urls }
}
const shot = async (page, name) => { if (SHOTS) await page.screenshot({ path: path.join(SHOTS, name + '.png'), fullPage: false }) }
// D-280 (Tahir, 20 Oct 2026): the ways to find his land open only after his district and tehsil are picked, so every
// test first picks the district and tehsil of the Union Council it is about (u), the normal one by default.
const pickTehsil = async (page, tehsil) => {
  await page.click(`#tk-tehsil .tk-row:has(.tk-en-name:text-is("${tehsil}"))`)
  await page.waitForSelector('#gps-card .gps-ask')
}
const openAsk = async (page, u = NORMAL) => {
  // through the district list, as a farmer does: the page request stays plain '/soil.html?from=mitti' (finding 1)
  await page.goto(`${BASE}/soil.html?from=mitti`, { waitUntil: 'networkidle' })
  await page.click(`#tk-district .tk-row:has(.tk-en-name:text-is("${dname(u.district)}"))`)
  await page.waitForSelector('#tk-tehsil .tk-row')
  await pickTehsil(page, u.tehsil)
  await page.locator('#gps-card').scrollIntoViewIfNeeded()
}
const locateAt = async (vp, lat, lon, acc = 15, extra = {}) => {
  const P = await newPage(vp, { latitude: lat, longitude: lon, accuracy: acc }, true, extra)
  await openAsk(P.page)
  await P.page.click('[data-gps="locate"]')
  return P
}
const cardText = page => page.evaluate(() => {
  const c = document.querySelector('[data-gps-card]')
  return c ? { for: c.querySelector('.gps-for')?.textContent ?? '', count: c.querySelector('[data-gps="count"]')?.textContent ?? '',
    circle: c.querySelector('[data-gps="circle"]')?.textContent ?? '', far: c.querySelector('[data-gps="far"]')?.textContent ?? '',
    vals: [...c.querySelectorAll('.tk-khata')[0].querySelectorAll('.tk-kr .tk-v')].map(el => [...el.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent).join('').trim()),
    van: c.querySelector('[data-gps="van"]')?.getAttribute('href') ?? '', wheat: c.querySelector('[data-gps="wheat"]')?.getAttribute('href') ?? '',
    friend: c.querySelector('[data-gps="friend"]')?.getAttribute('href') ?? '', html: c.innerText } : null
})
// One rounding (D-279, low finding): half up on the decimal figure, decimals as the Atlas prints; 1 more decimal only
// where the rounding would cross a band edge (then both forms are accepted here; the band itself is checked elsewhere).
const DEC = { p: 1, k: 0, zn: 2, om: 2, b: 2, ph: 2, ec: 2, fe: 2, cu: 2, mn: 2 }
const halfUp = (v, d) => (Math.round(Number(`${v}e${d}`)) / 10 ** d).toFixed(d)
const okVal = (k, v, shown) => v == null ? shown === '–' : (shown === halfUp(v, DEC[k]) || shown === halfUp(v, Math.min(3, DEC[k] + 1)))
const ORDER = ['p', 'k', 'zn', 'om', 'b', 'ph', 'ec']
const UNIT = { p: ' ppm', k: ' ppm', zn: ' ppm', om: ' %', b: ' ppm', ph: '', ec: ' dS/m' }
const stripUnit = (k, s) => (UNIT[k] && s.endsWith(UNIT[k]) ? s.slice(0, -UNIT[k].length) : s)
const LBL = { p: 'Phosphorus (P₂O₅)', k: 'Potash (K₂O)', zn: 'Zinc', om: 'Organic matter', b: 'Boron', ph: 'pH', ec: 'EC (salinity)', fe: 'Iron', cu: 'Copper', mn: 'Manganese' }
const PARAM = { p: 'P2O', k: 'K2O', zn: 'Zn', om: 'OM', b: 'B', ph: 'pH', ec: 'EC', fe: 'Fe', cu: 'Cu', mn: 'Mn' }

/** Finding 1: nothing the server saw may carry a reading, a Union Council code, a card or a coordinate. */
function serverLeaks(fromIndex, lat, lon, c) {
  const seen = serverLog.slice(fromIndex)
  const coords = [lat, lon, c ? c.gi * DLAT : null, c ? c.gj * DLON : null].filter(x => x != null).flatMap(x => [x.toFixed(2), x.toFixed(3), x.toFixed(4)])
  const bad = seen.filter(u => /card|[?&;](uc|r|n|p|k|zn|om|b|ph|ec)=|UC\d{3,}/i.test(u) || coords.some(s => u.includes(s)) || (/\.html\?/.test(u) && !/\?from=mitti$/.test(u)))
  const data = seen.filter(u => u.includes('/data/') && !/^\/data\/gps\/(index|uc|punjab|pakistan|[A-Z .%0-9]+)\.json$/.test(u) && !/^\/data\/lenses\.json$/.test(u))
  return { seen, bad, data }
}

// A normal Union Council in Sheikhupura with plenty of samples, and its lattice point
const NORMAL = ucBy(u => u.district === 'SHEIKHUPURA' && !u.pin && u.n >= 200 && card(u.gi, u.gj)?.uc.id === u.id && card(u.gi, u.gj).radii[0].r === 2)
const NC = card(NORMAL.gi, NORMAL.gj)
const POS = { latitude: NORMAL.gi * DLAT, longitude: NORMAL.gj * DLON, accuracy: 15 }
// Finding 3: a Union Council whose own lattice point is named for another one (KALLAH, Ferozewala came back as KHAN PUR)
const KALLAH = ucBy(u => u.label === 'KALLAH' && u.district === 'SHEIKHUPURA') ?? ucBy(u => !u.pin && card(u.gi, u.gj) && card(u.gi, u.gj).uc.id !== u.id)
// Low finding: a searched Union Council whose lattice point sits in another district's file
const CROSS = allUcs.filter(u => !u.pin && card(u.gi, u.gj) && card(u.gi, u.gj).district !== u.district)
const CROSS1 = CROSS.find(u => ['NANKANA', 'SARGODHA', 'SIALKOT'].includes(u.district)) ?? CROSS[0]
// G5: a wide card (first circle 30 km or more) inside Punjab, and a card whose naming sample is far
let WIDE = null, FAR = null, THIN = null
for (const d of Object.keys(IDX.sq).length ? ['BHAWALPUR', 'RYK', 'BHAWALNAGAR', 'D.G.KHAN', 'RAJANPUR', 'BHAKKAR', 'KHUSHAB'] : []) {
  const D = doc(d)
  for (const p of D.pts) {
    if (!WIDE && D.radii[p[4]] >= 30) WIDE = decodePt(d, D, p)
    if (!FAR && p[3] >= 15 && D.radii[p[4]] <= 20) FAR = decodePt(d, D, p)
    if (WIDE && FAR) break
  }
}
// G5: a place inside Punjab with no card (fewer than 20 samples within 50 km)
outer: for (let gi = Math.floor(27.8 / DLAT); gi < Math.floor(29.5 / DLAT); gi += 7) {
  for (let gj = Math.floor(70.5 / DLON); gj < Math.floor(73.5 / DLON); gj += 7) {
    if (inPunjab(gi * DLAT, gj * DLON) && !card(gi, gj) && !card(gi + 1, gj) && !card(gi - 1, gj) && !card(gi, gj + 1) && !card(gi, gj - 1) && !card(gi + 1, gj + 1) && !card(gi - 1, gj - 1) && !card(gi + 1, gj - 1) && !card(gi - 1, gj + 1)) { THIN = { gi, gj }; break outer }
  }
}
// G8: lattice points just over the border, 2.6 to 3 km inside India, within 1.2 to 2.3 km of a survey sample (they had
// a card before the border was applied): found with the OCHA COD-AB Pakistan boundary in Soil Data\Scripts.
const BORDER = { 'near Lahore (Wagah side)': { latitude: 31.428, longitude: 74.655 }, 'near Kasur': { latitude: 31.095, longitude: 74.7075 } }
// Second review, 20 Oct 2026: places 0.1 to 1 km inside India (distance to the OCHA Pakistan line, worked out in Soil
// Data\Scripts with the exact line) that the first build's fallback gave a Pakistani card. The first 2 are the review's.
const NEAR_BORDER = [
  ['Lahore, 0.48 km inside India (the review: M/KALAN)', 31.57, 74.6054], ['Lahore, 0.16 km inside India', 31.3735, 74.5859], ['Lahore, 0.86 km inside India', 31.4032, 74.6131],
  ['Kasur, 0.16 km inside India', 30.9542, 74.4565], ['Kasur, 0.86 km inside India', 30.9598, 74.5103],
  ['Sialkot, 0.51 km inside India', 32.49, 74.8783], ['Sialkot, 0.86 km inside India', 32.4875, 74.7554],
  ['Chunian, 0.11 km inside India (the review: KOTHA GHANDI)', 30.659, 74.1872], ['Chunian, 0.16 km inside India', 30.6237, 74.1275],
]
// A place inside Pakistan, 0.48 km from the line near Lahore, whose own card point fell over the line: the fallback stays
const FALLBACK_IN = { latitude: 31.6157, longitude: 74.5766 }
// Chak Union Councils for line 16's order on screen
const CHAKS = ['160/P', '105/DNB'].map(l => ucBy(u => u.label === l && !u.pin)).filter(Boolean)
// G9: card points in Pakistan outside Punjab: Islamabad (around F-9) and Khyber Pakhtunkhwa (west of the Indus near Attock)
const outsidePts = d => { const D = doc(d); return D.pts.map(p => decodePt(d, D, p)).filter(c => !inPunjab(c.gi * DLAT, c.gj * DLON) && inPakistan(c.gi * DLAT, c.gj * DLON)) }
const ISB = outsidePts('RAWALPINDI').concat(outsidePts('ATTOCK')).filter(c => Math.abs(c.gi * DLAT - 33.70) < 0.03 && Math.abs(c.gj * DLON - 73.03) < 0.04).sort((a, b) => b.far - a.far)[0]
const KP = outsidePts('ATTOCK').filter(c => c.gj * DLON < 72.25 && c.gi * DLAT > 33.85).sort((a, b) => a.far - b.far)[0]
// a Union Council in search whose own point lies outside Punjab's line: a searched Union Council is never "outside"
const UC_OUT = allUcs.find(u => !u.pin && !inPunjab(u.gi * DLAT, u.gj * DLON) && card(u.gi, u.gj))
// G11 (Tahir, 20 Oct 2026): how far Punjab's line is from a card point, worked out here apart from the page: corners
// drawn flat, east-west scaled by the cosine of the card point's latitude (the page uses another projection). Within
// about 6 m of the exact OCHA line for every card point outside Punjab (Soil Data\Scripts), so the whole km agrees
// except within 6 m of a half km, where either whole km is accepted.
const kmToPun = (lat, lon) => {
  const K = 6371.0088 * Math.PI / 180, c = Math.cos(lat * Math.PI / 180)
  let best = Infinity
  for (const poly of PUN.polys) for (const ring of poly) for (let i = 1; i < ring.length; i++) {
    const ax = (ring[i - 1][0] - lon) * c * K, ay = (ring[i - 1][1] - lat) * K, bx = (ring[i][0] - lon) * c * K, by = (ring[i][1] - lat) * K
    const dx = bx - ax, dy = by - ay, l = dx * dx + dy * dy, t = l > 0 ? Math.min(1, Math.max(0, -(ax * dx + ay * dy) / l)) : 0
    best = Math.min(best, Math.hypot(ax + t * dx, ay + t * dy))
  }
  return best
}
const kmWord = d => (d < 1 ? 'less than 1' : String(Math.round(d)))
const kmWords = d => [...new Set([kmWord(d), kmWord(d - 0.006), kmWord(d + 0.006)])]
// G13 (Tahir's own words, 20 Oct 2026): was "Your land is outside Punjab."
const outsideLine = w => `Your land is near the border or outside Punjab. Punjab is ${w} km away. This is the nearest Punjab survey area.`
const vanOutside = (w, u) => `My land is near the border or outside Punjab. Punjab is ${w} km away. The nearest Punjab survey area is Union Council ${u.label}, tehsil ${u.tehsil}, district ${dname(u.district)}`
// G11 final fix (20 Oct 2026): his own point outside Punjab, the card point given by the neighbour step inside it. N is
// measured from his own point; measured from the card point these said "Punjab is 1 km away".
const G11_EDGE = [['Sindh near Rahim Yar Khan, card point inside Punjab', 28.2154, 69.5310], ['Balochistan near Dera Ghazi Khan, card point inside Punjab', 30.2647, 70.0759]]
// G11 test places (pins), each a card point outside Punjab, with the km to the exact OCHA Punjab line worked out in Soil
// Data\Scripts (g11 check, azimuthal equidistant about the point): the review's Islamabad pin first (G9 said "less than
// 1 km": its naming sample, GHORA GALI's, itself lies outside Punjab's line).
const G11_PTS = [
  ['Islamabad, the review\'s pin', 33.732, 73.1745, 7.4923],
  ['Khyber Pakhtunkhwa near Attock', 33.858, 72.219, 1.7017],
  ['Khyber Pakhtunkhwa near Dera Ghazi Khan', 31.221, 70.371, 3.2224],
  ['Azad Kashmir near Gujrat', 32.814, 74.4135, 3.3925],
  ['Azad Kashmir near Gujrat, naming sample outside Punjab\'s line', 32.886, 74.2665, 4.3278],
  ['Sindh near Rahim Yar Khan', 27.963, 69.9405, 3.2466],
]
// Third review: Union Councils in search whose point lay outside Punjab's line before (spread-out, B11)
const UC_MOVED = ['NOOR DOLAL', 'DHEER KOT'].map(n => ucBy(u => u.label === n && u.district === 'RAWALPINDI'))
/** Line 16 as drawn: each character of the Union Council's name, left to right on the screen, must read as the name. */
const shownOrder = (page, lbl) => page.evaluate(lbl => {
  const el = document.querySelector('[data-gps-card] .gps-for'); if (!el) return null
  const tn = [...el.childNodes].find(n => n.nodeType === 3 && n.textContent.includes(lbl)); if (!tn) return null
  const i0 = tn.textContent.indexOf(lbl)
  return [...lbl].map((ch, i) => { const r = document.createRange(); r.setStart(tn, i0 + i); r.setEnd(tn, i0 + i + 1); const b = r.getBoundingClientRect(); return [b.left + b.width / 2, ch] })
    .sort((a, b) => a[0] - b[0]).map(x => x[1]).join('')
}, lbl)

{
  const C44d = ucBy(u => u.name.replace(/\s+/g, ' ').toUpperCase() === 'CHAK 44') ?? ucBy(u => /^(CHAK )?44$/.test(u.label))
  const same = [NORMAL, KALLAH, C44d].filter(Boolean).every(u => u.district === NORMAL.district && u.tehsil === NORMAL.tehsil)
  check(`test data: the normal Union Council (${NORMAL.label}), ${KALLAH.label} and ${C44d?.label} share 1 district and tehsil (${dname(NORMAL.district)}, ${NORMAL.tehsil}), because the search lists only the picked tehsil (D-280)`, same, JSON.stringify([NORMAL, KALLAH, C44d].map(u => u && [u.district, u.tehsil])))
}
// a 2 letter start of names that the picked tehsil holds (at least 2) and other tehsils hold too, so the scope has work to do
const SCOPE_Q = (() => {
  const inT = allUcs.filter(u => u.district === NORMAL.district && u.tehsil === NORMAL.tehsil && !u.pin)
  const best = new Map()
  for (const u of inT) { const k = searchKeyOf(u.name).slice(0, 2); if (k.length === 2) best.set(k, (best.get(k) ?? 0) + 1) }
  const ok = [...best].filter(([k, n]) => n >= 2 && allUcs.some(u => (u.district !== NORMAL.district || u.tehsil !== NORMAL.tehsil) && searchKeyOf(u.name).startsWith(k))).sort((a, b) => b[1] - a[1])
  return (ok[0] ?? [searchKeyOf(NORMAL.name).slice(0, 2)])[0].toLowerCase()
})()
for (const [label, vp] of [['phone', { width: 412, height: 860 }], ['computer', { width: 1366, height: 900 }]]) {
  console.log(`\n${label} (${vp.width} x ${vp.height})`)
  // ── 1 the first screen
  {
    const logAt = serverLog.length
    const { ctx, page, errors } = await newPage(vp, POS)
    await openAsk(page)
    const t = await page.textContent('#gps-card .gps-ask')
    for (const n of [1, 2, 15, 3, 4, 7, 5]) check(`first screen: line ${n} word for word`, t.includes(L[n]), L[n])
    check('first screen: English beside the Urdu, and the way in named by his tehsil (D-280)', /Are you at your land right now\?/.test(t) && new RegExp(`Now find your land in ${NORMAL.tehsil} tehsil`).test(t) && !/Not at your land now\?/.test(t), t)
    await shot(page, `${label} 1 first screen`)
    // ── 2 his location
    await page.click('[data-gps="locate"]')
    await page.waitForSelector('[data-gps-card]')
    const c = await cardText(page)
    const r0 = NC.radii[0]
    check(`location: line 16 names the Union Council in English (isolated left to right) and the tehsil and district in the live Urdu (G3): ${NC.uc.label}, ${tUr(NC.uc.district, NC.uc.tehsil)}, ${dUr(NC.uc.district)}`, same16(c.for, NC.uc), c.for)
    check('G10: the boundary credit under the map, 1 line: "Boundary: OCHA COD-AB Pakistan (WFP)"', (await page.textContent('[data-gps="credit"]').catch(() => ''))?.trim() === 'Boundary: OCHA COD-AB Pakistan (WFP)')
    check('a place inside Punjab: no outside-Punjab line', !(await page.$('[data-gps="outside"]')))
    check(`location: line 8 with the card's radius and count (${r0.r} km, ${r0.n})`, c.count.trim() === line8(fmtKm(r0.r), th(r0.n)), c.count)
    check('location: the radius shown plainly (G5)', c.circle.trim() === `Circle: ${fmtKm(r0.r)} km around your land`, c.circle)
    const valsOk = ORDER.every((k, i) => okVal(k, r0.vals[k], stripUnit(k, c.vals[i] ?? '')))
    check('location: every reading is the card file\'s median, in the one rounding (half up)', valsOk, JSON.stringify(c.vals) + ' vs ' + JSON.stringify(ORDER.map(k => r0.vals[k])))
    check('location: lines 9, 11, 12, 13 on the card', [9, 11, 12, 13].every(n => c.html.includes(L[n])) || (NC.radii.length < 2 && [11, 12, 13].every(n => c.html.includes(L[n]))), c.html.slice(0, 300))
    check('location: the card says it is an area reading, not his field', /Not a test of your field/.test(c.html))
    await shot(page, `${label} 2 the card`)
    if (NC.radii.length > 1) {
      await page.locator('[data-gps="radius"]').fill('1')
      const c2 = await cardText(page)
      check(`slider: the next ready radius (${NC.radii[1].r} km, ${NC.radii[1].n} samples)`, c2.count.trim() === line8(fmtKm(NC.radii[1].r), th(NC.radii[1].n)) && c2.circle.includes(`${fmtKm(NC.radii[1].r)} km`), c2.count)
      await page.locator('[data-gps="radius"]').fill('0')
    }
    // ── 3 WhatsApp
    const van = decodeURIComponent(c.van)
    check('VAN WhatsApp (line 12) opens "Hello VAN. The soil card for my area from the Soil Atlas:" (G7)', van.includes('?text=Hello VAN. The soil card for my area from the Soil Atlas:\n'), van.slice(0, 120))
    check('VAN WhatsApp: VAN\'s number, the Union Council, the radius, the count and the readings', c.van.startsWith('https://wa.me/923005003041') && van.includes(`Union Council: ${NC.uc.label}, tehsil ${NC.uc.tehsil}, district ${dname(NC.uc.district)}`) && van.includes(`within ${fmtKm(r0.r)} km: ${th(r0.n)} samples`) && van.includes(`Phosphorus: ${halfUp(r0.vals.p, 1)} ppm`), van)
    check('VAN WhatsApp: the card point at 3 decimals, never his own position (G1)', van.includes(`Card point: ${(NC.gi * DLAT).toFixed(3)} N, ${(NC.gj * DLON).toFixed(3)} E`) && !van.includes(POS.latitude.toFixed(5)), van)
    check('friend WhatsApp: the link only, no place', c.friend.startsWith('https://wa.me/?text=') && !/\d{2}\.\d{3}/.test(decodeURIComponent(c.friend)), c.friend)
    // ── 4 the wheat plan by the card
    const wheatHref = c.wheat
    check('line 13: the link carries the card after "#", with no Union Council (finding 1)', /(crops\/wheat\.html|#\/crops\/wheat)#card=d=SHEIKHUPURA;r=/.test(wheatHref) && !/uc=|\?/.test(wheatHref), wheatHref)
    const wheatAt = serverLog.length
    await Promise.all([page.waitForURL(/crops\/wheat/), page.click('[data-gps="wheat"]')])
    await page.waitForSelector('#creator ul li')
    const wheatReq = serverLog.slice(wheatAt).filter(u => u.includes('wheat'))
    check('the server saw the wheat page as crops/wheat.html with no query (finding 1)', wheatReq.length >= 1 && wheatReq.every(u => u === '/crops/wheat.html'), wheatReq)
    const district = await page.$eval('#creator select[aria-label="Your district"]', s => s.value)
    check('wheat by the card: the district stays picked (SHEIKHUPURA)', district === 'SHEIKHUPURA', district)
    const labels = await page.$$eval('#creator [data-card-row]', ns => ns.map(n => [n.getAttribute('data-card-row'), n.textContent]))
    check('wheat by the card: the soil rows say "Soil card, N km around your land"', labels.length >= 5 && labels.every(([, l]) => l.includes(`Soil card, ${fmtKm(r0.r)} km around your land`)), labels)
    // the same reading, the same figure on the card and in the calculator (low finding)
    const rowsSame = labels.filter(([p]) => ORDER.some(k => PARAM[k] === p)).every(([p, l]) => {
      const k = ORDER.find(k => PARAM[k] === p), i = ORDER.indexOf(k)
      return l.includes(` · ${stripUnit(k, c.vals[i])}`)
    })
    check('wheat by the card: each "Soil card" row prints the reading exactly as the card does', rowsSame, JSON.stringify(labels) + ' | ' + JSON.stringify(c.vals))
    const distRows = await page.$$eval('#creator .cap', ns => ns.filter(n => /typical ·/.test(n.textContent)).length)
    check('wheat by the card: the district fills no row (G2)', distRows === 0, distRows)
    const note = await page.$eval('#creator [data-card-note]', n => n.textContent).catch(() => '')
    check('wheat by the card: the note names the radius and the count, that it is not his field, and how to use the district instead', note.includes(`within ${fmtKm(r0.r)} km`) && note.includes('Not a test of your field') && note.includes('press Clear all, then choose your district'), note)
    const head = await page.$eval('#creator', n => n.innerText)
    const bumps = await page.$$eval('#creator ul li .cap', ns => ns.map(n => n.textContent).filter(t => /^[+−]/.test(t) && /soil/.test(t)))
    check('wheat by the card: the head says "Adjust it for this soil card" and the bumps "for this soil card" (G6)', /Adjust it for this soil card/i.test(head) && !/enter your soil report/.test(head) && bumps.every(b => /for this soil card/.test(b)), JSON.stringify(bumps) + ' ' + head.slice(0, 200))
    const rowsCard = await page.evaluate(() => [...document.querySelector('#creator ul').querySelectorAll(':scope > li')].map(li => li.innerText.replace(/\s+/g, ' ').replace(/for this soil card( and your readings)?/g, 'for your soil').trim()))
    const msg = await page.$eval('#creator a[href^="https://wa.me/"]', a => decodeURIComponent(a.href))
    check('wheat by the card: the WhatsApp message says the rows are from the Soil Atlas card', msg.includes(`Soil Atlas card for the area near my land: survey readings within ${fmtKm(r0.r)} km, ${th(r0.n)} samples`), msg)
    await page.$eval('#creator [data-card-note]', n => n.scrollIntoView({ block: 'start' })).catch(() => {})
    await page.evaluate(() => window.scrollBy(0, -90))
    await shot(page, `${label} 3 wheat by the card`)
    // the same numbers typed by hand into the soil-numbers door give the same plan, and the normal wording
    {
      const { ctx: c2, page: p2 } = await newPage(vp)
      await p2.goto(`${BASE}/crops/wheat.html`, { waitUntil: 'networkidle' })
      await p2.waitForSelector('#creator ul li')
      for (const [k, v] of Object.entries(r0.vals)) {
        if (v == null) continue
        const inp = p2.locator(`#creator input[aria-label^="${LBL[k]} reading"]`)
        if (await inp.count()) await inp.fill(String(+v.toFixed(3)))
      }
      const rowsHand = await p2.evaluate(() => [...document.querySelector('#creator ul').querySelectorAll(':scope > li')].map(li => li.innerText.replace(/\s+/g, ' ').trim()))
      check('wheat by the card: the plan equals the same readings typed into "Your reading" by hand', JSON.stringify(rowsCard) === JSON.stringify(rowsHand), JSON.stringify(rowsCard).slice(0, 300) + ' | ' + JSON.stringify(rowsHand).slice(0, 300))
      const headHand = await p2.$eval('#creator', n => n.innerText)
      check('typed lab numbers keep the calculator\'s normal wording ("your soil")', /Adjust it for your soil/i.test(headHand) && !/this soil card/.test(headHand), headHand.slice(0, 200))
      await c2.close()
    }
    // "press Clear all, then choose your district" does what it says
    {
      const { ctx: c3, page: p3 } = await newPage(vp)
      await p3.goto(`${BASE}/crops/wheat.html${wheatHref.slice(wheatHref.indexOf('#card='))}`, { waitUntil: 'networkidle' })
      await p3.waitForSelector('#creator [data-card-row]')
      await p3.click('#creator button:has-text("Clear all")')
      await p3.selectOption('#creator select[aria-label="Your district"]', 'SHEIKHUPURA')
      const typical = await p3.$$eval('#creator .cap', ns => ns.filter(n => /Sheikhupura typical ·/.test(n.textContent)).length)
      const cardLeft = await p3.$$eval('#creator [data-card-row]', ns => ns.length)
      check('the card note\'s way to the district works: Clear all, then the district fills the rows', typical >= 5 && cardLeft === 0, `${typical} district rows, ${cardLeft} card rows`)
      // Second review (G6): the head and the list follow whether card rows are in use, not the link
      const after = await p3.$eval('#creator', n => n.innerText)
      check('second review: after Clear all and a district, the head says "Adjust it for your soil" and nothing says "this soil card"', /Adjust it for your soil/i.test(after) && !/this soil card/i.test(after) && /if you have a soil report/.test(after), after.slice(0, 400))
      await c3.close()
      const { ctx: c4, page: p4 } = await newPage(vp)
      await p4.goto(`${BASE}/crops/wheat.html${wheatHref.slice(wheatHref.indexOf('#card='))}`, { waitUntil: 'networkidle' })
      await p4.waitForSelector('#creator [data-card-row]')
      const before = await p4.$eval('#creator', n => n.innerText)
      check('second review: from the card, the head says "Adjust it for this soil card" and the list "it is the one to use with this soil card"', /Adjust it for this soil card/i.test(before) && /the one to use with this soil card/.test(before), before.slice(0, 400))
      await p4.click('#creator button:has-text("Clear all")')
      await p4.waitForFunction(() => !document.querySelector('#creator [data-card-row]'))
      const cleared = await p4.$eval('#creator', n => n.innerText)
      check('second review: after Clear all alone, the head says "Adjust it for your soil" and nothing says "this soil card"', /Adjust it for your soil/i.test(cleared) && !/this soil card/i.test(cleared), cleared.slice(0, 300))
      await c4.close()
      // the calculator's message prints the count with its comma, as the note does (formatting only)
      const { ctx: c5, page: p5 } = await newPage(vp)
      await p5.goto(`${BASE}/crops/wheat.html#card=d=RYK;r=50;n=11571;p=6.2;k=150;zn=0.8;om=0.5;b=0.6;ph=8.2;ec=1.4`, { waitUntil: 'networkidle' })
      await p5.waitForSelector('#creator [data-card-row]')
      const m5 = await p5.$eval('#creator a[href^="https://wa.me/"]', a => decodeURIComponent(a.href))
      const t5 = await p5.$eval('#creator', n => n.innerText)
      check('second review: 11571 samples print as "11,571" in the calculator\'s WhatsApp message and its note', m5.includes('within 50 km, 11,571 samples') && !m5.includes('11571') && t5.includes('11,571 samples') && !t5.includes('11571'), m5)
      await c5.close()
    }
    await page.goBack({ waitUntil: 'networkidle' })
    await page.waitForSelector('[data-gps-card]', { timeout: 10000 }).catch(() => null)
    check('Back from the wheat calculator brings the card back', !!(await page.$('[data-gps-card]')))
    const L1 = serverLeaks(logAt, POS.latitude, POS.longitude, NC)
    check('privacy (finding 1): no request the server saw, .html pages included, carries a reading, a Union Council code, a card or a coordinate', L1.bad.length === 0, L1.bad.slice(0, 6))
    check('privacy: the only data files fetched are index.json, uc.json, punjab.json and district files', L1.data.length === 0, L1.data.slice(0, 6))
    check('no console error or failed request (location, card, wheat, back)', errors.length === 0, errors.slice(0, 5))
    await ctx.close()
  }
  // ── 5 a location 3 km wide: a computer, and a phone
  {
    const { ctx, page, errors } = await newPage(vp, { ...POS, accuracy: 3000 })
    await openAsk(page)
    await page.click('[data-gps="locate"]')
    await page.waitForSelector('[data-gps="confirm"]')
    const t = await page.textContent('#gps-card')
    check('3 km wide location on a computer: line 14 with the number filled in (3), and its button', t.includes(line14('3')) && t.includes(L['14b']) && /Your computer placed you/.test(t), t.slice(0, 400))
    await shot(page, `${label} 4 confirm the pin`)
    const box = await page.locator('canvas.gps-map').boundingBox()
    await page.mouse.click(box.x + box.width * 0.6, box.y + box.height * 0.45)
    await page.click('[data-gps="confirm"]')
    await page.waitForSelector('[data-gps-card]')
    check('3 km wide location: the moved pin gives a card', !!(await page.$('[data-gps-card]')))
    check('no console error (confirm)', errors.length === 0, errors.slice(0, 5))
    await ctx.close()
    const ph = await newPage(vp, { ...POS, accuracy: 3000 }, true, { hasTouch: true, isMobile: label === 'phone' })
    await openAsk(ph.page)
    await ph.page.click('[data-gps="locate"]')
    await ph.page.waitForSelector('[data-gps="confirm"]')
    const tp = await ph.page.textContent('#gps-card')
    const coarse = await ph.page.evaluate(() => matchMedia('(pointer: coarse)').matches)
    check('3 km wide location on a touch phone: no Urdu line saying "computer"; the English says phone (low finding)', coarse && !tp.includes('آپ کے کمپیوٹر') && /Your phone placed you within about 3 km/.test(tp) && tp.includes(L['14b']), `coarse ${coarse}: ` + tp.slice(0, 300))
    await ph.ctx.close()
  }
  // ── 6 search, the name kept after Back, the district of the Union Council searched, pin card, paste, map
  {
    const { ctx, page, errors } = await newPage(vp)
    await openAsk(page)
    await page.click('[data-gps="search"]')
    await page.fill('[data-gps="q"]', NORMAL.name.toLowerCase())
    await page.waitForSelector(`[data-uc="${NORMAL.id}"]`)
    await shot(page, `${label} 5 search`)
    await page.click(`[data-uc="${NORMAL.id}"]`)
    await page.waitForSelector('[data-gps-card]')
    const c = await cardText(page)
    check(`search: the card names the Union Council searched (${NORMAL.label})`, same16(c.for, NORMAL), c.for)
    // finding 3: KALLAH
    const own = card(KALLAH.gi, KALLAH.gj)
    await page.click('#gps-card .tk-link')
    await page.click('[data-gps="search"]')
    await page.fill('[data-gps="q"]', KALLAH.name)
    await page.waitForSelector(`[data-uc="${KALLAH.id}"]`)
    await page.click(`[data-uc="${KALLAH.id}"]`)
    await page.waitForSelector('[data-gps-card]')
    const k1 = await cardText(page)
    await Promise.all([page.waitForURL(/crops\/wheat/), page.click('[data-gps="wheat"]')])
    await page.waitForSelector('#creator ul li')
    await page.goBack({ waitUntil: 'networkidle' })
    await page.waitForSelector('[data-gps-card]', { timeout: 10000 }).catch(() => null)
    const k2 = await cardText(page)
    check(`finding 3: ${KALLAH.label} (${KALLAH.tehsil}, ${dname(KALLAH.district)}; its lattice point is named for ${own?.uc.label}) keeps its name after the wheat plan and Back`, !!k2 && same16(k1.for, KALLAH) && same16(k2.for, KALLAH), `${k1?.for} | ${k2?.for}`)
    // the district of the Union Council searched
    if (CROSS1) {
      await openAsk(page, CROSS1)
      await page.click('[data-gps="search"]')
      await page.fill('[data-gps="q"]', CROSS1.name)
      await page.waitForSelector(`[data-uc="${CROSS1.id}"]`)
      await page.click(`[data-uc="${CROSS1.id}"]`)
      await page.waitForSelector('[data-gps-card]')
      const cc = await cardText(page)
      check(`the wheat plan picks the district of the Union Council searched: ${CROSS1.label} (${dname(CROSS1.district)}), whose lattice point is in the ${dname(card(CROSS1.gi, CROSS1.gj).district)} file`, cc.wheat.includes(`#card=d=${encodeURIComponent(CROSS1.district)};`), cc.wheat)
    }
    // a spread-out Union Council
    const PIN = ucBy(u => u.pin)
    await openAsk(page, PIN)
    await page.click('[data-gps="search"]')
    await page.fill('[data-gps="q"]', PIN.name)
    await page.waitForSelector(`[data-uc="${PIN.id}"]`)
    await page.click(`[data-uc="${PIN.id}"]`)
    await page.waitForSelector('canvas.gps-map')
    const tp = await page.textContent('#gps-card')
    check(`pin card (B11): ${PIN.label} asks him to tap his land on the map`, tp.includes('spread over more than 15 km'), tp.slice(0, 300))
    const b2 = await page.locator('canvas.gps-map').boundingBox()
    await page.mouse.click(b2.x + b2.width / 2, b2.y + b2.height / 2)
    await page.click('[data-gps="mapcard"]')
    // Third review: wait for the card itself. The map screen already shows a .gps-msg (the "spread over more than 15 km"
    // line), so waiting for '[data-gps-card], .gps-msg' returned at once and the check could run before the card came.
    await page.waitForSelector('[data-gps-card]', { timeout: 20000 }).catch(() => null)
    check('pin card: tapping the map gives a card', !!(await page.$('[data-gps-card]')))
    // paste
    await openAsk(page)
    await page.click('[data-gps="paste"]')
    await page.fill('[data-gps="pastebox"]', 'my land')
    check('paste: words with no numbers keep the button off and say why', await page.isDisabled('[data-gps="pastego"]') && (await page.textContent('#gps-card')).includes('No Punjab coordinates'))
    for (const s of [`${(POS.latitude).toFixed(5)}, ${(POS.longitude).toFixed(5)}`, `https://www.google.com/maps/@${POS.latitude.toFixed(5)},${POS.longitude.toFixed(5)},15z`, `https://maps.google.com/?q=${POS.latitude.toFixed(5)},${POS.longitude.toFixed(5)}`]) {
      await page.fill('[data-gps="pastebox"]', s)
      check(`paste: "${s.slice(0, 48)}" is read`, !(await page.isDisabled('[data-gps="pastego"]')))
    }
    await page.click('[data-gps="pastego"]')
    await page.waitForSelector('[data-gps-card]')
    const cp = await cardText(page)
    check('paste: the card for the pasted pin is the location card', cp.count === line8(fmtKm(NC.radii[0].r), th(NC.radii[0].n)), cp.count)
    // map click
    await page.click('#gps-card .tk-link')
    await page.click('[data-gps="map"]')
    await page.waitForSelector('#gps-card canvas.tk-map')
    await shot(page, `${label} 6 the map`)
    const mb = await page.locator('#gps-card canvas.tk-map').boundingBox()
    await page.mouse.click(mb.x + mb.width * 0.62, mb.y + mb.height * 0.38)
    await page.waitForSelector('canvas.gps-map', { timeout: 8000 }).catch(() => null)
    if (await page.$('canvas.gps-map')) {
      await shot(page, `${label} 7 the map closer`)
      const fb = await page.locator('canvas.gps-map').boundingBox()
      await page.mouse.click(fb.x + fb.width / 2, fb.y + fb.height / 2)
      await page.click('[data-gps="mapcard"]')
      await page.waitForSelector('[data-gps-card], [data-gps="thin"]', { timeout: 20000 }).catch(() => null)
      check('map: a square, then a tap on the closer map, gives a card or says the survey is too thin', !!(await page.$('[data-gps-card]')) || (await page.textContent('#gps-card')).includes('fewer than 20 samples within 50 km'))
    } else check('map: tapping a square opens the closer map', false, 'the tap did not land on a square')
    check('no console error (search, Back, pin, paste, map)', errors.length === 0, errors.slice(0, 5))
    await ctx.close()
  }
  // ── 7 weak network (finding 2)
  {
    const P = await newPage(vp, POS)
    let block = true
    await P.page.route(/\/data\/gps\/(?!index|uc|punjab)[^/]+\.json$/, r => (block ? r.abort('internetdisconnected') : r.continue()))
    await openAsk(P.page)
    await P.page.click('[data-gps="locate"]')
    await P.page.waitForSelector('[data-gps="retry"]', { timeout: 15000 }).catch(() => null)
    const t = await P.page.textContent('#gps-card')
    check('weak network: a district file that fails ends "Reading your location", says so plainly and offers Try again', t.includes(NET_MSG) && !t.includes('Reading your location on this device') && !!(await P.page.$('[data-gps="retry"]')), t.slice(0, 300))
    block = false
    await P.page.click('[data-gps="retry"]')
    await P.page.waitForSelector('[data-gps-card]', { timeout: 15000 }).catch(() => null)
    check('weak network: Try again, once the file comes, gives the card', !!(await P.page.$('[data-gps-card]')))
    await P.ctx.close()
    const S = await newPage(vp)
    let blockUc = true
    await S.page.route(/\/data\/gps\/uc\.json$/, r => (blockUc ? r.abort('internetdisconnected') : r.continue()))
    await openAsk(S.page)
    await S.page.click('[data-gps="search"]')
    await S.page.fill('[data-gps="q"]', NORMAL.name)
    await S.page.waitForSelector('[data-gps="searchfail"]', { timeout: 15000 }).catch(() => null)
    const ts = await S.page.textContent('#gps-card')
    check('weak network: a search list that fails says it could not be downloaded, never "No Union Council or chak by that name"', /could not be downloaded/.test(ts) && !/No Union Council or chak by that name/.test(ts), ts.slice(0, 300))
    blockUc = false
    await S.page.click('[data-gps="retry"]')
    await S.page.waitForSelector(`[data-uc="${NORMAL.id}"]`, { timeout: 15000 }).catch(() => null)
    check('weak network: Try again on the search, once the list comes, finds the Union Council', !!(await S.page.$(`[data-uc="${NORMAL.id}"]`)))
    await S.ctx.close()
  }
  // ── 8 edges
  {
    if (WIDE) {
      const W = await locateAt(vp, WIDE.gi * DLAT, WIDE.gj * DLON)
      await W.page.waitForSelector('[data-gps-card]')
      const w = await cardText(W.page)
      check(`G5: a wide card (${WIDE.uc.label}, ${dname(WIDE.district)}, first circle ${WIDE.radii[0].r} km, ${WIDE.radii[0].n} samples) shows its radius plainly and says it covers a wide area`, w.circle.trim() === `Circle: ${fmtKm(WIDE.radii[0].r)} km around your land` && w.count.trim() === line8(fmtKm(WIDE.radii[0].r), th(WIDE.radii[0].n)) && /covers a wide area/.test(w.html), w.circle + ' | ' + w.html.slice(0, 300))
      await shot(W.page, `${label} 8 a wide card`)
      await W.ctx.close()
    } else check('G5: a wide card exists in the data', false)
    if (FAR) {
      const F = await locateAt(vp, FAR.gi * DLAT, FAR.gj * DLON)
      await F.page.waitForSelector('[data-gps-card]')
      const f = await cardText(F.page)
      check(`a card whose naming sample is ${FAR.far} km away says so`, f.far.includes(`about ${FAR.far} km from this place, in Union Council ${FAR.uc.label}`), f.far || f.html.slice(0, 200))
      await F.ctx.close()
    }
    if (THIN) {
      const T = await locateAt(vp, THIN.gi * DLAT, THIN.gj * DLON)
      await T.page.waitForSelector('[data-gps="thin"]', { timeout: 15000 }).catch(() => null)
      const tt = await T.page.textContent('#gps-card')
      check(`G5: inside Punjab with fewer than 20 samples within 50 km (${(THIN.gi * DLAT).toFixed(3)}, ${(THIN.gj * DLON).toFixed(3)}): no card, and it says so`, tt.includes('fewer than 20 samples within 50 km'), tt.slice(0, 300))
      check('the thin screen names VAN Lab once (low finding)', (tt.match(/VAN Lab/g) || []).length === 1, tt)
      await shot(T.page, `${label} 9 too thin`)
      await T.page.click('#gps-card .tk-screen button.gps-alt')
      await T.page.waitForSelector('#tk-district .tk-list .tk-row', { timeout: 8000 }).catch(() => null)
      const rowsAfter = (await T.page.$$('#tk-district .tk-list .tk-row')).length
      check('"Pick district and tehsil" from the thin screen: the thin message and the card box go and the list of all 36 districts shows (review fix: it used to scroll to the same district\'s khata)', !(await T.page.$('#gps-card')) && !(await T.page.textContent('#teesra-khata')).includes('fewer than 20 samples') && rowsAfter === 36, String(rowsAfter))
      await T.ctx.close()
    } else check('a place inside Punjab with no card exists in the data', false)
    for (const [where, pos] of Object.entries(BORDER)) {
      const B = await locateAt(vp, pos.latitude, pos.longitude)
      await B.page.waitForSelector('#gps-card .gps-msg', { timeout: 15000 }).catch(() => null)
      const tb = await B.page.textContent('#gps-card')
      check(`G8: just over the border ${where} (${pos.latitude}, ${pos.longitude}): no card, the "outside Punjab" message`, tb.includes('outside Punjab') && !(await B.page.$('[data-gps-card]')), tb.slice(0, 300))
      check(`G8: ${where}: no card point in the data at or around it`, !card(Math.round(pos.latitude / DLAT), Math.round(pos.longitude / DLON)))
      await B.ctx.close()
    }
    const ref = await newPage(vp, POS, false)
    await openAsk(ref.page)
    await ref.page.click('[data-gps="locate"]')
    await ref.page.waitForSelector('#gps-card .gps-msg')
    const tr = await ref.page.textContent('#gps-card')
    check('location refused: the message is above the buttons, not under the last one (hidden by the phone bar)', await ref.page.evaluate(() => { const m = document.querySelector('[data-gps="askmsg"]'), b = document.querySelector('[data-gps="locate"]'); return !!m && !!b && m.getBoundingClientRect().top < b.getBoundingClientRect().top }))
    check('location refused: it says so, points to the ways above, and they stay open', /was not shared|could not be read/.test(tr) && /another way above/.test(tr) && !/another way below/.test(tr) && !!(await ref.page.$('[data-gps="search"]')), tr.slice(0, 300))
    await ref.ctx.close()
    const kar = await locateAt(vp, 24.86, 67.01)
    await kar.page.waitForSelector('#gps-card .gps-msg')
    check('outside Punjab (Karachi): no card, and it says why', (await kar.page.textContent('#gps-card')).includes('outside Punjab'))
    await kar.ctx.close()
    const JH = ucBy(u => u.district === 'JHELUM' && !u.pin && u.n >= 150 && card(u.gi, u.gj)?.uc.id === u.id)
    const jc = card(JH.gi, JH.gj)
    const jhe = await locateAt(vp, JH.gi * DLAT, JH.gj * DLON, 10)
    await jhe.page.waitForSelector('[data-gps-card]')
    const jt = await cardText(jhe.page)
    check(`Jhelum (${JH.label}): zinc blank (the survey has no valid zinc in Jhelum)`, jc.radii[0].vals.zn == null && jt.vals[2] === '–' && jt.html.includes('no valid zinc reading in Jhelum'), JSON.stringify(jt.vals))
    await jhe.ctx.close()
    const FA = ucBy(u => u.district === 'FAISALABAD' && u.tehsil === 'Faisalabad' && !u.pin && u.n >= 300)
    const fc = card(FA.gi, FA.gj)
    const fsb = await locateAt(vp, FA.gi * DLAT, FA.gj * DLON, 10)
    await fsb.page.waitForSelector('[data-gps-card]')
    const ft = await cardText(fsb.page)
    check(`Faisalabad (${FA.label}): iron and copper are not carried into the wheat link (D-271)`, !/;fe=|;cu=/.test(decodeURIComponent(ft.wheat)) && fc.radii[0].vals.fe == null && fc.radii[0].vals.cu == null, decodeURIComponent(ft.wheat))
    await fsb.ctx.close()
  }
  // ── 9 second review, 20 Oct 2026
  {
    for (const [where, lat, lon] of NEAR_BORDER) {
      const before = oldRule(lat, lon)
      const B = await locateAt(vp, lat, lon)
      await B.page.waitForSelector('#gps-card .gps-msg', { timeout: 15000 }).catch(() => null)
      const tb = await B.page.textContent('#gps-card')
      check(`second review: ${where} (${lat}, ${lon}), outside pakistan.json${before ? `, the first build gave the card of ${before.uc.label}` : ''}: no card, the "outside Punjab" message`, !inPakistan(lat, lon) && tb.includes('Your location is outside Punjab') && !(await B.page.$('[data-gps-card]')), tb.slice(0, 200))
      if (where.startsWith('Lahore, 0.48')) await shot(B.page, `${label} 11 a border point`)
      await B.ctx.close()
    }
    {
      const exp = oldRule(FALLBACK_IN.latitude, FALLBACK_IN.longitude)
      const own = card(Math.round(FALLBACK_IN.latitude / DLAT), Math.round(FALLBACK_IN.longitude / DLON))
      const F = await locateAt(vp, FALLBACK_IN.latitude, FALLBACK_IN.longitude)
      await F.page.waitForSelector('[data-gps-card]', { timeout: 15000 }).catch(() => null)
      const f = await cardText(F.page)
      check(`second review: inside Pakistan near Lahore (${FALLBACK_IN.latitude}, ${FALLBACK_IN.longitude}), own card point over the line: the neighbouring card point's card stays (${exp?.uc.label})`, inPakistan(FALLBACK_IN.latitude, FALLBACK_IN.longitude) && !own && !!exp && !!f && same16(f.for, exp.uc), f?.for)
      await F.ctx.close()
    }
    for (const U of CHAKS) {
      const { ctx, page } = await newPage(vp)
      await openAsk(page, U)
      await page.click('[data-gps="search"]')
      await page.fill('[data-gps="q"]', U.label)
      await page.waitForSelector(`[data-uc="${U.id}"]`)
      await page.click(`[data-uc="${U.id}"]`)
      await page.waitForSelector('[data-gps-card]')
      const c = await cardText(page)
      const order = await shownOrder(page, U.label)
      check(`second review: line 16 with the chak ${U.label} (${U.tehsil}, ${dname(U.district)}) reads ${U.label} on the screen, left to right (was ${U.label.split('/').reverse().join('/')})`, same16(c.for, U) && order === U.label, `${JSON.stringify(c.for)} shown as ${order}`)
      if (U.label === '160/P') { await page.locator('[data-gps-card] .gps-for').scrollIntoViewIfNeeded(); await shot(page, `${label} 10 a chak Union Council in Urdu`) }
      await ctx.close()
    }
    const g11 = [['Islamabad', ISB?.gi * DLAT, ISB?.gj * DLON, null, ISB], ['Khyber Pakhtunkhwa', KP?.gi * DLAT, KP?.gj * DLON, null, KP],
      ...G11_PTS.map(([n, la, lo, ex]) => [n, la, lo, ex, card(Math.round(la / DLAT), Math.round(lo / DLON))])]
    for (const [name, lat, lon, exact, C] of g11) {
      if (!C) { check(`G9: a card point in ${name} exists in the data`, false); continue }
      const cla = C.gi * DLAT, clo = C.gj * DLON
      // G11: the whole km to Punjab's line from his own point (final fix; here his point is the card point); for the
      // fixed places also the exact OCHA figure
      const here = kmToPun(lat, lon), words = kmWords(here)
      const exactOk = exact == null || (Math.abs(exact - here) < 0.006 && words.includes(kmWord(exact)))
      const O = await locateAt(vp, lat, lon)
      await O.page.waitForSelector('[data-gps-card]', { timeout: 15000 }).catch(() => null)
      const o = await cardText(O.page)
      const ol = (await O.page.textContent('[data-gps="outside"]').catch(() => '')) ?? ''
      const shownKm = /Punjab is (less than 1|\d+) km away/.exec(ol)?.[1]
      check(`G11: ${name} (${lat.toFixed(4)}, ${lon.toFixed(4)}; card point ${cla.toFixed(3)}, ${clo.toFixed(3)}, ${C.uc.label}${exact != null ? `, exact ${exact.toFixed(2)} km` : ''}; G9 said ${kmWord(C.far)} km): "${outsideLine(shownKm ?? '?')}", the whole km to Punjab's line (${here.toFixed(2)} km here)`, !!o && !!shownKm && words.includes(shownKm) && exactOk && ol.trim() === outsideLine(shownKm), ol || o?.html.slice(0, 200))
      check(`G9: ${name}: the survey area named as the nearest Punjab survey area (${C.uc.label}), no line 16 and no "This card is for the land at"`, !!o && o.html.includes(`Nearest Punjab survey area: Union Council ${C.uc.label}, tehsil ${C.uc.tehsil}, district ${dname(C.uc.district)}.`) && !(await O.page.$('[data-gps-card] .gps-for')) && !o.html.includes('This card is for the land at') && !o.html.includes('یہ کارڈ اس زمین کا ہے') && !(await O.page.$('[data-gps="far"]')), o?.html.slice(0, 300))
      const v = decodeURIComponent(o?.van ?? '')
      check(`G11: ${name}: VAN's WhatsApp message says the land is outside Punjab, how far Punjab is (the same km), and the nearest survey area`, v.includes(vanOutside(shownKm, C.uc)) && !v.includes('\nUnion Council: ') && !v.includes('survey area is ' + shownKm), v)
      check(`G9: ${name}: the boundary credit under the map`, (await O.page.textContent('[data-gps="credit"]').catch(() => ''))?.trim() === 'Boundary: OCHA COD-AB Pakistan (WFP)')
      if (name.startsWith('Islamabad, the review')) { await O.page.locator('[data-gps="outside"]').scrollIntoViewIfNeeded(); await shot(O.page, `${label} 12 an Islamabad card`) }
      await O.ctx.close()
    }
    // G11 final fix: his own point outside Punjab, the neighbour step's card point inside it; N from his own point
    for (const [name, lat, lon] of G11_EDGE) {
      const own = kmToPun(lat, lon), words = kmWords(own)
      const O = await locateAt(vp, lat, lon)
      await O.page.waitForSelector('[data-gps-card]', { timeout: 15000 }).catch(() => null)
      const at = await O.page.$eval('[data-gps-card]', el => el.getAttribute('data-gps-card')).catch(() => null)
      const [gi, gj] = (at ?? ',').split(',').map(Number)
      const C = at ? card(gi, gj) : null
      const fromCard = C ? kmToPun(gi * DLAT, gj * DLON) : null
      const o = await cardText(O.page)
      const ol = ((await O.page.textContent('[data-gps="outside"]').catch(() => '')) ?? '').trim()
      const shownKm = /Punjab is (less than 1|\d+) km away/.exec(ol)?.[1]
      check(`G11 final fix: ${name} (${lat}, ${lon}): his point outside Punjab, the card point (${C ? (gi * DLAT).toFixed(3) + ', ' + (gj * DLON).toFixed(3) + ', ' + C.uc.label : 'none'}) inside it; "${outsideLine(shownKm ?? '?')}" with N from his own point (${own.toFixed(2)} km; from the card point it was ${fromCard == null ? '?' : fromCard.toFixed(2)} km), never "Punjab is 1 km away"`,
        !inPunjab(lat, lon) && !!C && inPunjab(gi * DLAT, gj * DLON) && !!shownKm && words.includes(shownKm) && shownKm !== '1' && ol === outsideLine(shownKm), ol || o?.html.slice(0, 200))
      const v = decodeURIComponent(o?.van ?? '')
      check(`G13: ${name}: VAN's message says "My land is near the border or outside Punjab. Punjab is ${shownKm} km away." and the rest unchanged`, !!C && v.includes(vanOutside(shownKm, C.uc)) && !v.includes('My land is outside Punjab'), v)
      if (lat === 28.2154) { await O.page.locator('[data-gps="outside"]').scrollIntoViewIfNeeded(); await shot(O.page, `${label} 14 near the border`) }
      await O.ctx.close()
    }
    if (UC_OUT) {
      const { ctx, page } = await newPage(vp)
      await openAsk(page, UC_OUT)
      await page.click('[data-gps="search"]')
      await page.fill('[data-gps="q"]', UC_OUT.name)
      await page.waitForSelector(`[data-uc="${UC_OUT.id}"]`)
      await page.click(`[data-uc="${UC_OUT.id}"]`)
      await page.waitForSelector('[data-gps-card]')
      const c = await cardText(page)
      check(`G9: a Union Council searched by name (${UC_OUT.label}, ${dname(UC_OUT.district)}), whose point lies just outside Punjab's line, keeps line 16 and no outside line`, same16(c.for, UC_OUT) && !(await page.$('[data-gps="outside"]')), c.for)
      await ctx.close()
    }
    // Third review: no Union Council in search has its point outside Punjab's line; the 2 that had open a map centred
    // inside Punjab, and a tap in its middle gives a Punjab card (never "outside Punjab").
    const outUcs = allUcs.filter(u => !inPunjab(u.gi * DLAT, u.gj * DLON))
    check(`third review: no Union Council in search (${th(allUcs.length)}) has its point outside punjab.json's line (found ${outUcs.length})`, outUcs.length === 0 && !UC_OUT, outUcs.map(u => u.label).join(', '))
    for (const U of UC_MOVED) {
      if (!U) { check('third review: NOOR DOLAL and DHEER KOT are in search', false); continue }
      const { ctx, page } = await newPage(vp)
      await openAsk(page, U)
      await page.click('[data-gps="search"]')
      await page.fill('[data-gps="q"]', U.name)
      await page.waitForSelector(`[data-uc="${U.id}"]`)
      await page.click(`[data-uc="${U.id}"]`)
      await page.waitForSelector('canvas.gps-map')
      const b = await page.locator('canvas.gps-map').boundingBox()
      await page.mouse.click(b.x + b.width / 2, b.y + b.height / 2)
      await page.click('[data-gps="mapcard"]')
      await page.waitForSelector('[data-gps-card]', { timeout: 20000 }).catch(() => null)
      const c = await cardText(page)
      const t = await page.textContent('#gps-card')
      check(`third review: ${U.label} (${U.tehsil}, spread out): its map opens centred inside Punjab (${(U.gi * DLAT).toFixed(3)}, ${(U.gj * DLON).toFixed(3)}) and a tap in the middle gives a Punjab card, with line 16 and no "outside Punjab"`, U.pin && inPunjab(U.gi * DLAT, U.gj * DLON) && !!c && !!c.for && !(await page.$('[data-gps="outside"]')) && !t.includes('outside Punjab'), (c?.for ?? '') + ' | ' + t.slice(0, 200))
      await ctx.close()
    }
    // G12 (Tahir, 20 Oct 2026): no "not found" while he is still typing
    {
      const { ctx, page, errors } = await newPage(vp)
      await openAsk(page)
      await page.click('[data-gps="search"]')
      await page.fill('[data-gps="q"]', NORMAL.name)
      await page.waitForSelector(`[data-uc="${NORMAL.id}"]`)   // the list is in; every answer below is the page's own
      const quiet = async q => {
        await page.fill('[data-gps="q"]', q)
        await page.waitForFunction(() => !document.querySelector('#gps-card [data-uc]'), null, { timeout: 5000 }).catch(() => null)
        await page.waitForTimeout(400)
        const t = await page.textContent('#gps-card')
        return { t, nf: !!(await page.$('[data-gps="notfound"]')) }
      }
      for (const q of ['chak', 'Chak No', 'chak 4', 'UC 7', 'Chak No.', 'u/c 3']) {
        const r = await quiet(q)
        check(`G12: "${q}" while typing: no "No Union Council or chak by that name"`, !r.nf && !r.t.includes('No Union Council or chak by that name'), r.t.slice(0, 200))
        if (q === 'chak 4') await shot(page, `${label} 13 search mid-typing`)
      }
      const C44 = ucBy(u => u.name.replace(/\s+/g, ' ').toUpperCase() === 'CHAK 44') ?? ucBy(u => /^(CHAK )?44$/.test(u.label))
      await page.fill('[data-gps="q"]', 'chak 44')
      await page.waitForSelector('#gps-card [data-uc]', { timeout: 5000 }).catch(() => null)
      const first = await page.$eval('#gps-card [data-uc]', el => el.getAttribute('data-uc')).catch(() => null)
      check(`G12: "chak 44" still finds ${C44 ? C44.label + ' first' : 'a Union Council'}`, !!first && (!C44 || first === C44.id) && !(await page.$('[data-gps="notfound"]')), first)
      await page.fill('[data-gps="q"]', 'zzqxv')
      await page.waitForSelector('[data-gps="notfound"]', { timeout: 5000 }).catch(() => null)
      check('G12: a real miss ("zzqxv") still says "No Union Council or chak by that name"', !!(await page.$('[data-gps="notfound"]')))
      await page.fill('[data-gps="q"]', KALLAH.name.toLowerCase())
      await page.waitForSelector(`[data-uc="${KALLAH.id}"]`, { timeout: 5000 }).catch(() => null)
      check(`G12: a real name (${KALLAH.label}) is still found`, !!(await page.$(`[data-uc="${KALLAH.id}"]`)))
      check('no console error (G12 search)', errors.length === 0, errors.slice(0, 5))
      await ctx.close()
    }
    // G12 final fix (20 Oct 2026): the search list held back 4 seconds; "not found" must never show before it arrives
    {
      const { ctx, page, errors } = await newPage(vp)
      let asked = 0
      await page.route(/\/data\/gps\/uc\.json$/, async r => { asked++; await new Promise(res => setTimeout(res, 4000)); await r.continue() })
      await openAsk(page, KALLAH)
      await page.click('[data-gps="search"]')
      await page.evaluate(() => {
        window.__nf = []
        const host = document.querySelector('#gps-card')
        const look = () => { if (host.querySelector('[data-gps="notfound"]') || host.textContent.includes('No Union Council or chak by that name')) window.__nf.push(Date.now()) }
        new MutationObserver(look).observe(host, { childList: true, subtree: true, characterData: true })
      })
      const t0 = Date.now()
      await page.locator('[data-gps="q"]').pressSequentially('kallah', { delay: 80 })
      const typed = (Date.now() - t0) / 1000
      await page.waitForTimeout(1500)
      const mid = await page.textContent('#gps-card')
      const midHits = await page.$$eval('#gps-card [data-uc]', ns => ns.length)
      await page.waitForSelector(`[data-uc="${KALLAH.id}"]`, { timeout: 15000 }).catch(() => null)
      const came = (Date.now() - t0) / 1000
      const found = !!(await page.$(`[data-uc="${KALLAH.id}"]`))
      await page.waitForTimeout(500)
      const nf = await page.evaluate(() => window.__nf.length)
      check(`G12 final fix: uc.json held back 4 seconds, "kallah" typed in ${typed.toFixed(1)} seconds: while the list is coming nothing is said (no "not found", no "could not be downloaded", no list)`, nf === 0 && midHits === 0 && !mid.includes('No Union Council or chak by that name') && !mid.includes('could not be downloaded'), mid.slice(0, 200))
      check(`G12 final fix: ${KALLAH.label} shows once the list arrives (after ${came.toFixed(1)} seconds), and "not found" never showed at any moment`, found && came >= 3.5 && nf === 0 && asked === 1, `found ${found}, ${came}s, notfound seen ${nf} times, uc.json asked ${asked} times`)
      check('no console error (G12 search, list held back)', errors.length === 0, errors.slice(0, 5))
      await ctx.close()
    }
    // ── 11 D-280 to D-282 (Tahir, 20 Oct 2026): district, tehsil, then the finer ways, largest to smallest, on 1 screen
    {
      const { ctx, page, errors } = await newPage(vp, POS)
      await page.goto(`${BASE}/soil.html?from=mitti`, { waitUntil: 'networkidle' })
      await page.waitForSelector('#teesra-khata #tk-district .tk-list .tk-row')
      check('journey: first only the district list shows: no tehsil list and no way to find his land yet', !(await page.$('#tk-tehsil')) && !(await page.$('#gps-card')))
      await page.click(`#tk-district .tk-row:has(.tk-en-name:text-is("${dname(NORMAL.district)}"))`)
      await page.waitForSelector('#tk-tehsil .tk-row')
      check('journey: with the district picked, its khata and its tehsil list show on 1 screen, and the ways to find his land are not open yet', !!(await page.$('#tk-district .tk-khata')) && !(await page.$('#gps-card')))
      const rows = await page.$$eval('#tk-tehsil .tk-row .tk-en-name', ns => ns.map(n => n.textContent.trim()).sort())
      const expect = TEHSILS.filter(t => t.district === NORMAL.district).map(t => t.en).sort()
      check(`journey: the tehsil list is the district's own tehsils (${expect.length})`, JSON.stringify(rows) === JSON.stringify(expect), JSON.stringify(rows))
      await shot(page, `${label} 15 district and tehsil`)
      await pickTehsil(page, NORMAL.tehsil)
      await page.waitForTimeout(400)
      const gtop = await page.evaluate(() => { const r = document.getElementById('gps-card').getBoundingClientRect(); return { top: Math.round(r.top), vh: innerHeight } })
      check('journey: after the tehsil is picked the page takes him to the ways to find his land (the top of them is on the screen)', gtop.top >= -4 && gtop.top < gtop.vh * 0.6, JSON.stringify(gtop))
      const order = await page.evaluate(() => [...document.querySelectorAll('#tk-district, #tk-tehsil, [data-gps="search"], [data-gps="map"], [data-gps="paste"], [data-gps="locate"]')].map(el => el.id || el.getAttribute('data-gps')))
      check('journey: from the largest unit to the smallest: district, tehsil, Union Council or chak, map, pin, his location (D-280)', JSON.stringify(order) === JSON.stringify(['tk-district', 'tk-tehsil', 'search', 'map', 'paste', 'locate']), JSON.stringify(order))
      check('journey: the tehsil picked, its khata and the old path to the square show above the ways to find his land', !!(await page.$('#tk-tehsil .tk-khata')) && !!(await page.$('#tk-tehsil button.tk-btn:has-text("See your area")')))
      check('journey: "Pick district and tehsil" is no longer one of the ways (it is the steps above)', !(await page.$('[data-gps="district"]')))
      await shot(page, `${label} 16 the ways open under the tehsil`)
      // search is limited to his tehsil
      await page.click('[data-gps="search"]')
      await page.fill('[data-gps="q"]', SCOPE_Q)
      await page.waitForSelector('#gps-card [data-uc]')
      const ids = await page.$$eval('#gps-card [data-uc]', ns => ns.map(n => n.getAttribute('data-uc')))
      const inScope = ids.every(id => { const u = allUcs.find(x => x.id === id); return u && u.district === NORMAL.district && u.tehsil === NORMAL.tehsil })
      check(`search: "${SCOPE_Q}" lists ${ids.length} Union Councils, all of ${NORMAL.tehsil} tehsil, ${dname(NORMAL.district)}`, ids.length > 0 && inScope, ids.slice(0, 5))
      const OTHER_D = ucBy(u => u.district !== NORMAL.district && !u.pin && searchKeyOf(u.name).length >= 2)
      const OTHER_T = ucBy(u => u.district === NORMAL.district && u.tehsil !== NORMAL.tehsil && !u.pin && searchKeyOf(u.name).length >= 2)
      for (const [what, O] of [['another district', OTHER_D], ['another tehsil of the same district', OTHER_T]]) {
        if (!O) { check(`search: a Union Council of ${what} exists in the data`, false); continue }
        await page.fill('[data-gps="q"]', O.name)
        await page.waitForSelector('[data-gps="notfound"], #gps-card [data-uc]', { timeout: 8000 }).catch(() => null)
        await page.waitForTimeout(300)
        const hit = !!(await page.$(`[data-uc="${O.id}"]`))
        check(`search: ${O.label} (${O.tehsil}, ${dname(O.district)}), of ${what}, is not listed while ${NORMAL.tehsil} is picked`, !hit && !!(await page.$('[data-gps="notfound"]')), O.label)
      }
      // the map holds the squares of his tehsil
      await page.click('#gps-card .tk-link')
      await page.click('[data-gps="map"]')
      await page.waitForSelector('#gps-card canvas.tk-map')
      const aria = await page.getAttribute('#gps-card canvas.tk-map', 'aria-label')
      check(`map: the first map holds the soil squares of ${NORMAL.tehsil} tehsil`, (aria ?? '').includes(`${NORMAL.tehsil} tehsil`), aria)
      await shot(page, `${label} 17 the tehsil's map`)
      // a pin in another tehsil: the card for that place, and the warning (D-281)
      // Review fix: the warning needs two signals that agree: the survey square the pin is in (70% or more of its samples in one other tehsil) and the nearest sample's Union Council
      const OTi = SOIL_CELLS.findIndex((c, i) => c.dist === NORMAL.district && CELL_TEHSIL[i][1] === 100 && CELL_TEHSIL[i][0] >= 0 && TEHSILS[CELL_TEHSIL[i][0]].district === NORMAL.district && TEHSILS[CELL_TEHSIL[i][0]].en !== NORMAL.tehsil && card(Math.round(cellCentre(i).lat / DLAT), Math.round(cellCentre(i).lon / DLON))?.uc.tehsil === TEHSILS[CELL_TEHSIL[i][0]].en)
      const OT = { ...cellCentre(OTi), tehsil: TEHSILS[CELL_TEHSIL[OTi][0]].en }
      await page.click('#gps-card .tk-link')
      await page.click('[data-gps="paste"]')
      await page.fill('[data-gps="pastebox"]', `${OT.lat.toFixed(5)}, ${OT.lon.toFixed(5)}`)
      await page.click('[data-gps="pastego"]')
      await page.waitForSelector('[data-gps-card]')
      check(`no warning: a pasted pin in a square that is all ${OT.tehsil}, same district as the picked ${NORMAL.tehsil}: the card for that place is shown and no tehsil warning (Tahir, 21 Oct 2026: warn only for another district)`,
        !!(await page.$('[data-gps-card]')) && !(await page.$('[data-gps="outtehsil"]')))
      await shot(page, `${label} 18 the warning`)
      // a pin in his own tehsil: no warning
      await page.click('#gps-card .tk-link')
      await page.click('[data-gps="paste"]')
      await page.fill('[data-gps="pastebox"]', `${POS.latitude.toFixed(5)}, ${POS.longitude.toFixed(5)}`)
      await page.click('[data-gps="pastego"]')
      await page.waitForSelector('[data-gps-card]')
      check(`warning: a pin at ${NORMAL.label}, a Union Council of ${NORMAL.tehsil} whose square is 71% Muridke samples, gives no warning (the two signals disagree)`, !(await page.$('[data-gps="outtehsil"]')) && NC.uc.tehsil === NORMAL.tehsil)
      // the first screens say which tehsil they are for, since the lists above are hidden then
      await page.click('#gps-card .tk-link')
      await page.click('[data-gps="search"]')
      check('the search screen names the tehsil it searches', (await page.textContent('[data-gps="scope"]')).includes(`Your tehsil: ${NORMAL.tehsil}`))
      await page.click('#gps-card .tk-link'); await page.click('[data-gps="paste"]')
      check('the paste screen names the tehsil', !!(await page.$('[data-gps="scope"]')))
      await page.click('#gps-card .tk-link'); await page.click('[data-gps="map"]')
      check('the map screen names the tehsil', !!(await page.$('[data-gps="scope"]')))
      // changing the tehsil starts the search afresh
      await page.click('#gps-card .tk-link')
      await page.click('[data-gps="search"]')
      await page.fill('[data-gps="q"]', SCOPE_Q)
      await page.waitForSelector('#gps-card [data-uc]')
      await page.click('#gps-card .tk-link')
      await pickTehsil(page, OT.tehsil)
      await page.click('[data-gps="search"]')
      check('changing the tehsil: the search box is empty and the old list is gone', (await page.inputValue('[data-gps="q"]')) === '' && (await page.$$('#gps-card [data-uc]')).length === 0)
      // Back from the tehsil takes the ways away and shows the district's screen with nothing picked
      check('two Backs: while a way is open only "Back to the question" shows, the band\'s own Back is hidden', (await page.$$('#teesra-khata .tk-link:has-text("واپس")')).length === 0 && !!(await page.$('#gps-card .tk-link:has-text("Back to the question")')))
      await page.click('#gps-card .tk-link')
      await page.locator('#teesra-khata .tk-link:has-text("واپس")').first().click()   // the band's own Back, not the fold link
      await page.waitForSelector('#tk-tehsil .tk-row')
      const st = await page.evaluate(() => ({ gps: !!document.querySelector('#gps-card'), tehsil: !!document.querySelector('#tk-tehsil'), district: !!document.querySelector('#tk-district'), on: document.querySelectorAll('#tk-tehsil .tk-row.on').length }))
      check('Back from the tehsil (with a way open): the district and tehsil show again, no tehsil picked, the ways are closed', !st.gps && st.tehsil && st.district && st.on === 0, JSON.stringify(st))
      check('no console error (journey, search, map, warning, Back)', errors.length === 0, errors.slice(0, 5))
      await ctx.close()
      // a location in another tehsil gives the same warning; outside Punjab it gives the outside line and no tehsil warning
      const LO = await locateAt(vp, OT.lat, OT.lon)
      await LO.page.waitForSelector('[data-gps-card]')
      check('no warning: his location in another tehsil of the same district gives no warning', !(await LO.page.$('[data-gps="outtehsil"]')))
      await LO.ctx.close()
      // the old false warning: Rahim Yar Khan tehsil, a pin in a square that is all Rahim Yar Khan, whose nearest sample is a Sadiqabad Union Council
      {
        const RYKi = cellIdxAt(28.251, 70.2555)
        check('test data: 28.251, 70.2555 lies in a square that is all Rahim Yar Khan tehsil', RYKi >= 0 && CELL_TEHSIL[RYKi][1] === 100 && TEHSILS[CELL_TEHSIL[RYKi][0]].en === 'Rahim Yar Khan' && TEHSILS[CELL_TEHSIL[RYKi][0]].district === 'RYK')
        const R = await newPage(vp, POS)
        await openAsk(R.page, { district: 'RYK', tehsil: 'Rahim Yar Khan' })
        await R.page.click('[data-gps="paste"]')
        await R.page.fill('[data-gps="pastebox"]', '28.251, 70.2555')
        await R.page.click('[data-gps="pastego"]')
        await R.page.waitForSelector('[data-gps-card]')
        check('warning: that pin gets no warning with Rahim Yar Khan picked (it did, wrongly, when the nearest Union Council was judged)', !(await R.page.$('[data-gps="outtehsil"]')))
        await R.ctx.close()
      }
      // a card he left is not brought back by picking another tehsil
      {
        const S = await newPage(vp, POS)
        await openAsk(S.page)
        await S.page.click('[data-gps="search"]')
        await S.page.fill('[data-gps="q"]', NORMAL.name.toLowerCase())
        await S.page.waitForSelector(`[data-uc="${NORMAL.id}"]`)
        await S.page.click(`[data-uc="${NORMAL.id}"]`)
        await S.page.waitForSelector('[data-gps-card]')
        await Promise.all([S.page.waitForURL(/crops\/wheat/), S.page.click('[data-gps="wheat"]')])
        await S.page.waitForSelector('#creator ul li')
        await S.page.goBack({ waitUntil: 'networkidle' })
        await S.page.waitForSelector('[data-gps-card]', { timeout: 10000 })
        await S.page.click('#gps-card .tk-link:has-text("Back to the question")')
        const keyGone = await S.page.evaluate(() => !(history.state && 'vanGpsCard' in history.state))
        await S.page.locator('#teesra-khata .tk-link:has-text("واپس")').first().click()
        await S.page.waitForSelector('#tk-tehsil .tk-row')
        const other = TEHSILS.find(t => t.district === NORMAL.district && t.en !== NORMAL.tehsil).en
        await pickTehsil(S.page, other)
        await S.page.waitForTimeout(1500)
        check('stale card: after Back from the wheat plan, Back to the question, and another tehsil, no card opens by itself and the saved place is gone', keyGone && !(await S.page.$('[data-gps-card]')) && !!(await S.page.$('.gps-ask')), String(keyGone))
        await S.ctx.close()
      }
      // a pin in another district (second review): the warning says the district, whatever the square says
      {
        const D2 = await newPage(vp, POS)
        await openAsk(D2.page)
        await D2.page.click('[data-gps="paste"]')
        await D2.page.fill('[data-gps="pastebox"]', '31.7036, 71.0036')
        await D2.page.click('[data-gps="pastego"]')
        await D2.page.waitForSelector('[data-gps-card]')
        const w2 = await D2.page.textContent('[data-gps="outtehsil"]').catch(() => null)
        check('warning: a pin near Bhakkar with Ferozewala (Sheikhupura) picked: the card is for Bhakkar and the warning names Bhakkar district', !!w2 && w2.includes(OUT_TEHSIL_UR) && /nearest to this place is in Bhakkar district, not Sheikhupura/.test(w2), w2 ?? 'no warning')
        await D2.ctx.close()
      }
      // D-280 (21 Oct 2026): the "I am at my land" button at the top. District and tehsil are still asked first, then the location is read at once.
      {
        const T = await newPage(vp, { latitude: POS.latitude, longitude: POS.longitude, accuracy: 15 })
        await T.page.goto(`${BASE}/soil.html?from=mitti`, { waitUntil: 'networkidle' })
        const tb = await T.page.$('[data-tk="atland"]')
        check('top button: "I am at my land" shows at the very top of the district step, with the existing Urdu', !!tb && (await tb.textContent()).includes('کیا آپ اس وقت اپنی زمین پر موجود ہیں؟'))
        check('top button: nothing opens before the district and tehsil are picked', !(await T.page.$('#gps-card')))
        await T.page.click('[data-tk="atland"]')
        check('top button: pressing it asks him to pick the district and tehsil first', !!(await T.page.$('[data-tk="atland-hint"]')) && !(await T.page.$('#gps-card')))
        await T.page.click(`#tk-district .tk-row:has(.tk-en-name:text-is("${dname(NORMAL.district)}"))`)
        await T.page.waitForSelector('#tk-tehsil .tk-row')
        check('top button: after the district only, still no card, and a line under the tehsil list says the location is read after the tehsil', !(await T.page.$('#gps-card')) && !!(await T.page.$('[data-tk="atland-hint2"]')))
        await T.page.click(`#tk-tehsil .tk-row:has(.tk-en-name:text-is("${NORMAL.tehsil}"))`)
        await T.page.waitForSelector('[data-gps-card]')
        const tc = await cardText(T.page)
        check('top button: after the tehsil his location is read at once and the card opens (no second tap)', !!tc && tc.for.includes(NORMAL.label), tc?.for)
        check('top button: no warning for his own district', !(await T.page.$('[data-gps="outtehsil"]')))
        await T.page.click('#gps-card .tk-link')
        await T.page.waitForSelector('#tk-tehsil .tk-row')
        const other2 = TEHSILS.find(x => x.district === NORMAL.district && x.en !== NORMAL.tehsil).en
        await T.page.click(`#tk-tehsil .tk-row:has(.tk-en-name:text-is("${other2}"))`)
        await T.page.waitForSelector('#gps-card .gps-ask')
        await T.page.waitForTimeout(800)
        check('top button: it works once; another tehsil afterwards shows the ordinary first screen', !!(await T.page.$('#gps-card .gps-ask')) && !(await T.page.$('[data-gps-card]')))
        await T.ctx.close()
        // his location in another district: the card and the district warning
        const T2 = await newPage(vp, { latitude: 31.7036, longitude: 71.0036, accuracy: 15 })
        await openAsk(T2.page)
        await T2.page.click('[data-gps="locate"]')
        await T2.page.waitForSelector('[data-gps-card]')
        const w3 = await T2.page.textContent('[data-gps="outtehsil"]').catch(() => null)
        check('warning: his location near Bhakkar with another district picked names Bhakkar district (nearest survey area wording)', !!w3 && w3.includes(OUT_TEHSIL_UR) && /survey area nearest to this place is in Bhakkar district, not Sheikhupura/.test(w3), w3 ?? 'no warning')
        await T2.ctx.close()
      }
      // a card left in the page's history entry by an earlier visit (a reload keeps it) is not opened under another tehsil
      {
        const R2 = await newPage(vp, POS)
        await openAsk(R2.page)
        await R2.page.click('[data-gps="search"]')
        await R2.page.fill('[data-gps="q"]', NORMAL.name.toLowerCase())
        await R2.page.waitForSelector(`[data-uc="${NORMAL.id}"]`)
        await R2.page.click(`[data-uc="${NORMAL.id}"]`)
        await R2.page.waitForSelector('[data-gps-card]')
        await R2.page.reload({ waitUntil: 'networkidle' })
        await R2.page.goto(`${BASE}/index.html`, { waitUntil: 'networkidle' })
        await R2.page.goBack({ waitUntil: 'networkidle' })
        const T2 = TEHSILS.find(t => t.district !== NORMAL.district)
        await R2.page.waitForSelector('#teesra-khata')
        await R2.page.click(`#tk-district .tk-row:has(.tk-en-name:text-is("${dname(T2.district)}"))`)
        await R2.page.waitForSelector('#tk-tehsil .tk-row')
        await pickTehsil(R2.page, T2.en)
        await R2.page.waitForTimeout(1500)
        check('stale card: a card left by an earlier visit (reload, another page, Back) does not open under another district and tehsil', !(await R2.page.$('[data-gps-card]')) && !!(await R2.page.$('.gps-ask')))
        await R2.ctx.close()
      }
      // a map answer that comes late after Back changes nothing
      {
        const PU = allUcs.find(u => u.pin && searchKeyOf(u.name).length >= 2)
        const M = await newPage(vp, POS)
        await M.page.route(/\/data\/gps\/index\.json$/, async r => { await new Promise(res => setTimeout(res, 3000)); await r.continue() })
        await openAsk(M.page, PU)
        await M.page.click('[data-gps="search"]')
        await M.page.fill('[data-gps="q"]', PU.name.toLowerCase())
        await M.page.waitForSelector(`[data-uc="${PU.id}"]`)
        await M.page.click(`[data-uc="${PU.id}"]`)
        await M.page.click('#gps-card .tk-link:has-text("Back to the question")')
        await M.page.waitForTimeout(5000)
        check('late map: a spread-out Union Council tapped, then Back before its map points came: the question stays, the map does not open by itself', !!(await M.page.$('.gps-ask')) && !(await M.page.textContent('#gps-card')).includes('Tap your land'))
        await M.ctx.close()
      }
      // a location answer that comes late changes nothing
      {
        const slow = () => { const g = navigator.geolocation.getCurrentPosition.bind(navigator.geolocation); navigator.geolocation.getCurrentPosition = (ok, bad, o) => setTimeout(() => g(ok, bad, o), 3500) }
        const L1 = await newPage(vp, POS)
        await L1.page.addInitScript(slow)
        await openAsk(L1.page)
        await L1.page.click('[data-gps="locate"]')
        await L1.page.click('#gps-card .tk-link:has-text("Back to the question")')
        await L1.page.waitForTimeout(5500)
        const a = await L1.page.evaluate(() => ({ card: !!document.querySelector('[data-gps-card]'), ask: !!document.querySelector('.gps-ask'), rows: document.querySelectorAll('#tk-tehsil .tk-row').length, dist: !!document.querySelector('#tk-district') }))
        check('late location: he went Back before it came; when it arrives no card draws, the lists above stay, the question stays', !a.card && a.ask && a.rows > 0 && a.dist, JSON.stringify(a))
        await L1.ctx.close()
        const L2 = await newPage(vp, POS)
        await L2.page.addInitScript(slow)
        await openAsk(L2.page)
        await L2.page.click('[data-gps="locate"]')
        await L2.page.click('#gps-card .tk-link:has-text("Back to the question")')
        await L2.page.click('[data-gps="paste"]')
        await L2.page.fill('[data-gps="pastebox"]', `${OT.lat.toFixed(5)}, ${OT.lon.toFixed(5)}`)
        await L2.page.click('[data-gps="pastego"]')
        await L2.page.waitForSelector('[data-gps-card]')
        const before = (await cardText(L2.page)).for
        await L2.page.waitForTimeout(5500)
        const after = (await cardText(L2.page)).for
        check('late location: a pin card he made meanwhile is not replaced by the late location\'s card', before === after && before.length > 0, `${before} | ${after}`)
        await L2.ctx.close()
      }
      if (ISB) {
        const IO = await locateAt(vp, ISB.gi * DLAT, ISB.gj * DLON)
        await IO.page.waitForSelector('[data-gps-card]', { timeout: 15000 }).catch(() => null)
        check('warning: outside Punjab (Islamabad) says the outside-Punjab line and not the tehsil warning', !!(await IO.page.$('[data-gps="outside"]')) && !(await IO.page.$('[data-gps="outtehsil"]')))
        await IO.ctx.close()
      }
    }
  }
}

// ── 10 once: every Union Council name in line 16, and a slow line (second review, 20 Oct 2026)
{
  const P = await newPage({ width: 412, height: 860 })
  await openAsk(P.page)
  const r = await P.page.evaluate(labels => {
    const host = document.createElement('p'); host.className = 'urdu tk-sub tk-strong gps-for'; host.style.width = '3000px'; host.style.whiteSpace = 'nowrap'
    document.querySelector('#gps-card').appendChild(host)
    const pre = 'یہ کارڈ اس زمین کا ہے: ', post = '، فیروزوالا، شیخوپورہ'
    const bad = { wrapped: [], plain: [] }
    for (const lbl of labels) for (const mode of ['wrapped', 'plain']) {
      host.textContent = pre + (mode === 'wrapped' ? '\u2066' + lbl + '\u2069' : lbl) + post
      const tn = host.firstChild, i0 = tn.textContent.indexOf(lbl)
      const vis = [...lbl].map((ch, i) => { const rg = document.createRange(); rg.setStart(tn, i0 + i); rg.setEnd(tn, i0 + i + 1); const b = rg.getBoundingClientRect(); return [b.left + b.width / 2, ch] }).sort((a, b) => a[0] - b[0]).map(x => x[1]).join('')
      if (vis !== lbl) bad[mode].push(lbl)
    }
    host.remove()
    return { wrapped: bad.wrapped.length, plain: bad.plain.length, ex: bad.plain.slice(0, 4), exw: bad.wrapped.slice(0, 4) }
  }, allUcs.map(u => u.label))
  check(`second review: all ${th(allUcs.length)} Union Council names read in their own order inside line 16 as the page writes it (isolated); without it ${th(r.plain)} would read wrong (for example ${r.ex.join(', ')})`, r.wrapped === 0 && r.plain > 0, JSON.stringify(r))
  console.log(`  (line 16 order: ${r.plain} of ${allUcs.length} names read wrong without the isolation, ${r.wrapped} with it)`)
  await P.ctx.close()
}
{
  // a place whose survey square names only the Rahim Yar Khan file, the largest district file
  const D = doc('RYK')
  let RP = null
  for (const p of D.pts) {
    const gi = p[0] + D.g0, gj = p[1] + D.h0
    if ((IDX.sq[`${Math.floor(gj * DLON / IDX.deg)},${Math.floor(gi * DLAT / IDX.deg)}`] ?? []).join() === 'RYK' && inPunjab(gi * DLAT, gj * DLON)) { RP = { latitude: gi * DLAT, longitude: gj * DLON, accuracy: 15 }; break }
  }
  const vp = { width: 412, height: 860 }
  const watch = page => page.evaluate(msg => { window.__net = false; new MutationObserver(() => { if (document.body.textContent.includes(msg)) window.__net = true }).observe(document.body, { childList: true, subtree: true, characterData: true }) }, NET_MSG)
  // slow: the file gzipped, 12 KB a second, and 1 quiet spell of 20 seconds
  throttle = { file: 'RYK.json', mode: 'slow', chunk: 12000, pauseAt: 15, pauseMs: 20000 }
  const S = await newPage(vp, RP)
  await openAsk(S.page)
  await watch(S.page)
  const t0 = Date.now()
  await S.page.click('[data-gps="locate"]')
  await S.page.waitForSelector('[data-gps-card]', { timeout: 180000 }).catch(() => null)
  const took = (Date.now() - t0) / 1000
  const kb = Math.round(throttle.bytes / 1000)
  const sawNet = await S.page.evaluate(() => window.__net)
  check(`slow line: the largest district file (RYK.json, ${kb} KB gzipped) at 12 KB a second with a 20 second quiet spell: the card comes after ${took.toFixed(0)} seconds, never cut off (was a fixed 45 seconds)`, !!(await S.page.$('[data-gps-card]')) && took > 45 && !sawNet, `${took}s, net message seen ${sawNet}`)
  await S.ctx.close()
  // stalled: a first piece, then nothing
  throttle = { file: 'RYK.json', mode: 'stall', chunk: 30000 }
  const T = await newPage(vp, RP)
  await openAsk(T.page)
  const t1 = Date.now()
  await T.page.click('[data-gps="locate"]')
  await T.page.waitForSelector('[data-gps="retry"]', { timeout: 90000 }).catch(() => null)
  const gave = (Date.now() - t1) / 1000
  const tt = await T.page.textContent('#gps-card')
  check(`stalled line: no bytes for 30 seconds, then the plain message and Try again (after ${gave.toFixed(0)} seconds)`, tt.includes(NET_MSG) && gave >= 29 && gave <= 45 && !tt.includes('Reading your location on this device'), `${gave}s ` + tt.slice(0, 200))
  check('stalled line: the quiet download was stopped by the page (the server saw the connection closed)', throttle.closed === true, JSON.stringify(throttle))
  const asked = serverLog.filter(u => u.endsWith('/RYK.json')).length
  throttle = null
  await T.page.click('[data-gps="retry"]')
  await T.page.waitForSelector('[data-gps-card]', { timeout: 30000 }).catch(() => null)
  check('stalled line: Try again asks for the file afresh and gives the card', !!(await T.page.$('[data-gps-card]')) && serverLog.filter(u => u.endsWith('/RYK.json')).length === asked + 1, `${serverLog.filter(u => u.endsWith('/RYK.json')).length} vs ${asked}`)
  await T.ctx.close()
}
// The whole run: no request the server saw carried a card, a reading or a Union Council code
const all = serverLeaks(0, 999, 999, null)
check(`privacy, whole run (${th(serverLog.length)} requests): no request carries a card, a reading or a Union Council code`, all.bad.length === 0, all.bad.slice(0, 6))
await browser.close()
server.close()
console.log(`\n${passed} passed, ${failed} failed`)
process.exit(failed ? 1 : 0)
