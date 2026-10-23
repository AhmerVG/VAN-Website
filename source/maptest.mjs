/**
 * SOIL ATLAS MAPS CHECK, D-310 and R8 (Tahir, 23 Oct 2026; design "Soil Atlas Maps"). Run after the build, like
 * gpstest.mjs: `node maptest.mjs [shots folder]`. Serves out/ over http and checks in a real browser at phone (412 x 860)
 * and computer (1366 x 900) sizes:
 *   1  the Punjab map: district borders and names in English and Urdu (the names already live, DISTRICT_UR), the
 *      English legend; a tap darkens the district, shows its name and opens that district;
 *   2  a tehsil's map ("Click the place on the map"): its Union Council names, each a name in the tehsil's search list;
 *   3  the soil card's map: Union Council names, the scale bar (1 km on a 3 km card), the north mark, the circle's km,
 *      the legend; "Near your land": 4 Union Council centres (5 when the card's own is not among them), nearest first,
 *      whole km and a direction, each worked out here apart from the page, no pin-card Union Council, the card's own
 *      marked; from the search, the searched Union Council is not in its own list and the heading names it; none on an
 *      outside-Punjab card;
 *   4  R8: NANGAL SAHDAN (137 samples) and KILLIANWALA (742) are 1 entry each; UC2409 and UC0623 are gone; the Muridke
 *      list shows NANGAL SAHDAN once and no NANGAL SHADAN;
 *   and no console error or failed request. Prints "N passed, M failed". Exit code 1 on any failure.
 * Canvas text is read by wrapping fillText before the page loads (the page itself is not changed).
 */
import { chromium } from 'playwright'
import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.dirname(fileURLToPath(import.meta.url))
const OUT = path.join(ROOT, 'out')
const SHOTS = process.argv[2] || null
if (SHOTS) fs.mkdirSync(SHOTS, { recursive: true })
const CHROME = process.env.CHROME || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.woff2': 'font/woff2', '.json': 'application/json' }
const server = http.createServer((req, res) => {
  const u = decodeURIComponent(req.url.split('?')[0])
  const f = path.join(OUT, u === '/' ? 'index.html' : u)
  if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); res.end('not found'); return }
  res.writeHead(200, { 'content-type': MIME[path.extname(f)] || 'application/octet-stream' })
  fs.createReadStream(f).pipe(res)
})
await new Promise(r => server.listen(0, r))
const BASE = `http://localhost:${server.address().port}`
const browser = await chromium.launch({ executablePath: CHROME })
let passed = 0, failed = 0
const check = (label, ok, detail = '') => { if (ok) passed++; else failed++; console.log(`${ok ? '  ok  ' : '  FAIL'} ${label}${!ok && detail ? '\n         ' + String(detail).slice(0, 700) : ''}`) }

// ── the published data, read here apart from the page ─────────────────────────────────────────────────────────
const GPS = path.join(OUT, 'data', 'gps')
const UCS = JSON.parse(fs.readFileSync(path.join(GPS, 'uc.json'), 'utf8'))
const allUcs = UCS.ucs.map(x => ({ id: x[0], name: x[1], label: x[2], district: x[3], tehsil: x[4], gi: x[5], gj: x[6], n: x[7], pin: x[8] === 1 }))
const DLAT = 0.009, DLON = 0.0105
const kmT = (a, b, c, d) => { const R = 6371.0088, r = Math.PI / 180, h = Math.sin((c - a) * r / 2) ** 2 + Math.cos(a * r) * Math.cos(c * r) * Math.sin((d - b) * r / 2) ** 2; return 2 * R * Math.asin(Math.sqrt(h)) }
const tehsilSrc = fs.readFileSync(path.join(ROOT, 'src', 'data', 'soilTehsils.ts'), 'utf8')
const DISTRICT_UR = JSON.parse(/export const DISTRICT_UR[^=]*=\s*(\{.*\})\s*$/m.exec(tehsilSrc)[1])
const NAME = { RYK: 'Rahim Yar Khan', MUZAFFAR: 'Muzaffargarh', 'D.G.KHAN': 'Dera Ghazi Khan', BHAWALNAGAR: 'Bahawalnagar', BHAWALPUR: 'Bahawalpur', CHINNIOT: 'Chiniot', NANKANA: 'Nankana Sahib', 'MANDI BAHAUDDIN': 'Mandi Bahauddin', 'TOBA TEK SINGH': 'Toba Tek Singh' }
const dname = k => NAME[k] ?? k.charAt(0) + k.slice(1).toLowerCase()

async function newPage(vp, geo = null) {
  const ctx = await browser.newContext({ viewport: vp, reducedMotion: 'reduce', ...(geo ? { geolocation: geo, permissions: ['geolocation'] } : {}) })
  const page = await ctx.newPage()
  page.setDefaultTimeout(20000)
  const errors = []
  page.on('console', m => { if (m.type() === 'error' && !/favicon-32x32/.test(m.location()?.url || '') && !/favicon-32x32/.test(m.text())) errors.push(m.text()) })
  page.on('pageerror', e => errors.push('pageerror ' + e.message))
  page.on('requestfailed', r => { if (!/favicon-32x32/.test(r.url())) errors.push('failed ' + r.url()) })
  page.on('response', r => { if (r.status() >= 400 && !/favicon-32x32/.test(r.url())) errors.push(r.status() + ' ' + r.url()) })
  // every text drawn on a canvas, with the canvas's aria-label
  await page.addInitScript(() => {
    window.__drawn = []
    const f = CanvasRenderingContext2D.prototype.fillText
    CanvasRenderingContext2D.prototype.fillText = function (t, x, y) { window.__drawn.push({ t: String(t), c: this.canvas.getAttribute('aria-label') || '' }); return f.apply(this, arguments) }
  })
  return { ctx, page, errors }
}
const drawn = (page, re) => page.evaluate(src => { const r = new RegExp(src); return window.__drawn.filter(d => r.test(d.c)).map(d => d.t) }, re.source)
const clearDrawn = page => page.evaluate(() => { window.__drawn = [] })
const shot = async (page, sel, name) => { if (SHOTS) { const l = page.locator(sel).first(); await l.scrollIntoViewIfNeeded(); await l.screenshot({ path: path.join(SHOTS, name + '.png') }) } }
const openTehsil = async (page, district, tehsil) => {
  await page.goto(`${BASE}/soil.html?from=mitti`, { waitUntil: 'networkidle' })
  await page.click(`#tk-district .tk-row:has(.tk-en-name:text-is("${dname(district)}"))`)
  await page.waitForSelector('#tk-tehsil .tk-row')
  await page.click(`#tk-tehsil .tk-row:has(.tk-en-name:text-is("${tehsil}"))`)
  await page.waitForSelector('#gps-card .gps-ask')
}
const DIRS = ['north', 'north-east', 'east', 'south-east', 'south', 'south-west', 'west', 'north-west']
const bearing = (a, b, c, d) => { const r = Math.PI / 180, y = Math.sin((d - b) * r) * Math.cos(c * r), x = Math.cos(a * r) * Math.sin(c * r) - Math.sin(a * r) * Math.cos(c * r) * Math.cos((d - b) * r); return DIRS[Math.round(((Math.atan2(y, x) / r + 360) % 360) / 45) % 8] }
const fmtNear = k => (k < 1 ? 'less than 1 km' : `${Math.round(k)} km`)
/** The near list as this test works it out: the 4 nearest centres of Union Councils not on a pin card (the searched one
 *  left out), and the card's own added under them when it is not among them. */
const expectNear = (lat, lon, skipId, ownId) => {
  const all = allUcs.filter(u => !u.pin && u.id !== skipId).map(u => ({ ...u, km: kmT(lat, lon, u.gi * DLAT, u.gj * DLON), dir: bearing(lat, lon, u.gi * DLAT, u.gj * DLON) })).sort((a, b) => a.km - b.km)
  const top = all.slice(0, 4)
  const own = ownId && !top.some(u => u.id === ownId) ? all.find(u => u.id === ownId) : null
  return (own ? [...top, own] : top).map(u => `${u.label}${u.tehsil ? `, ${u.tehsil}` : ''}: ${fmtNear(u.km)} ${u.dir}${u.id === ownId ? ' (this card’s Union Council)' : ''}`)
}
const nearRows = page => page.$$eval('[data-gps="near"] li', els => els.map(e => e.textContent.trim()))

// ── 4 R8 in the data ─────────────────────────────────────────────────────────────────────────────────────────
{
  const by = id => allUcs.find(u => u.id === id)
  check('R8: UC2409 (NANGAL SHADAN) and UC0623 (UC KILLIANWALA) are gone from the search list', !by('UC2409') && !by('UC0623'))
  check('R8: NANGAL SAHDAN, Muridke, is 1 entry of 137 samples', by('UC2408')?.label === 'NANGAL SAHDAN' && by('UC2408')?.n === 137 && by('UC2408')?.tehsil === 'Muridke', JSON.stringify(by('UC2408')))
  check('R8: KILLIANWALA, Tandlianwala, is 1 entry of 742 samples', by('UC0613')?.label === 'KILLIANWALA' && by('UC0613')?.n === 742 && by('UC0613')?.tehsil === 'Tandlianwala', JSON.stringify(by('UC0613')))
  check('R8: 2,621 Union Councils in search', allUcs.length === 2621, allUcs.length)
  for (const d of ['SHEIKHUPURA', 'FAISALABAD']) {
    const D = JSON.parse(fs.readFileSync(path.join(GPS, d + '.json'), 'utf8'))
    check(`R8: ${d}.json names no card point for a retired id`, !D.ucs.some(u => u[0] === 'UC2409' || u[0] === 'UC0623'))
  }
  const { ctx, page, errors } = await newPage({ width: 412, height: 860 })
  await openTehsil(page, 'SHEIKHUPURA', 'Muridke')
  await page.click('[data-gps="search"]')
  await page.waitForSelector('#gps-card .tk-row[data-uc]')
  const rows = await page.$$eval('#gps-card .tk-row[data-uc]', els => els.map(e => e.textContent))
  check('R8: the Muridke list shows NANGAL SAHDAN once and no NANGAL SHADAN', rows.filter(t => t.includes('NANGAL SAHDAN')).length === 1 && !rows.some(t => t.includes('NANGAL SHADAN')), rows.filter(t => /NANGAL/.test(t)).join(' | '))
  await page.fill('[data-gps="q"]', 'nangal shadan')
  await page.waitForTimeout(600)
  const hits = await page.$$eval('#gps-card .tk-row[data-uc]', els => els.map(e => e.getAttribute('data-uc')))
  check('R8: typing the other spelling, "nangal shadan", does not find a retired entry', !hits.includes('UC2409'), hits.join(','))
  check('R8 page: no console error or failed request', errors.length === 0, errors.join(' | '))
  await ctx.close()
}

// ── 1 the Punjab map ─────────────────────────────────────────────────────────────────────────────────────────
for (const vp of [{ width: 412, height: 860 }, { width: 1366, height: 900 }]) {
  const tag = vp.width < 900 ? 'phone' : 'computer'
  const { ctx, page, errors } = await newPage(vp)
  await page.goto(`${BASE}/soil.html?from=mitti`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(800)
  const cv = page.locator('#tk-district .tk-mapwrap canvas')
  const label = await cv.getAttribute('aria-label')
  check(`${tag}: the Punjab map says it has district borders and names`, /district borders and names/.test(label), label)
  const t = await drawn(page, /^Map of Punjab's soil squares, with district/)
  const en = Object.keys(DISTRICT_UR).map(dname).filter(n => t.includes(n))
  const ur = Object.values(DISTRICT_UR).filter(n => t.includes(n))
  check(`${tag}: district names drawn in English (${en.length}) and the same districts in Urdu`, en.length >= (tag === 'phone' ? 16 : 26) && en.every(n => { const k = Object.keys(DISTRICT_UR).find(k => dname(k) === n); return t.includes(DISTRICT_UR[k]) }), `${en.length} English, ${ur.length} Urdu: ${en.join(', ')}`)
  check(`${tag}: no name on the Punjab map that is not a district's live name`, t.every(x => en.includes(x) || Object.values(DISTRICT_UR).includes(x)), t.filter(x => !en.includes(x) && !Object.values(DISTRICT_UR).includes(x)).join(', '))
  const lg = await page.textContent('[data-tk="maplegend"]')
  check(`${tag}: the legend under it`, lg.includes('survey squares, about 6,500 acres each') && lg.includes('district border, drawn from the squares'), lg)
  const box = await cv.boundingBox()
  check(`${tag}: the map keeps its shape inside its frame (no squeeze)`, Math.abs(box.width / box.height - (await cv.evaluate(c => c.width / c.height))) < 0.02, `${box.width} x ${box.height}`)
  if (tag === 'phone') await shot(page, '#tk-district .tk-mapwrap', 'punjab-phone')
  // tap Lahore: the square nearest Lahore's centre (74.38 E, 31.52 N), by the canvas's own geometry
  await cv.scrollIntoViewIfNeeded()
  const pt = await cv.evaluate(c => { const r = c.getBoundingClientRect(); return { r: { x: r.x, y: r.y, w: r.width, h: r.height } } })
  // the map's square extent, from the grid file the page uses, read here
  const soilSrc = fs.readFileSync(path.join(ROOT, 'src', 'data', 'soil.ts'), 'utf8')
  const CELLS = JSON.parse(/= (\{"cell_deg".*\});?\s*$/m.exec(soilSrc)[1]).cells
  const x0 = Math.min(...CELLS.map(c => c.x)), x1 = Math.max(...CELLS.map(c => c.x)), y0 = Math.min(...CELLS.map(c => c.y)), y1 = Math.max(...CELLS.map(c => c.y))
  const lahore = CELLS.filter(c => c.dist === 'LAHORE').sort((a, b) => b.n - a.n)[0]
  const fx = (lahore.x - x0 + 0.5) / (x1 - x0 + 1), fy = (y1 - lahore.y + 0.5) / (y1 - y0 + 1)
  await clearDrawn(page)
  await page.mouse.click(pt.r.x + fx * pt.r.w, pt.r.y + fy * pt.r.h)
  await page.waitForTimeout(150)
  const t2 = await drawn(page, /^Map of Punjab's soil squares, with district/)
  check(`${tag}: a tap on Lahore shows Lahore's name before it opens`, t2.includes('Lahore') && t2.includes(DISTRICT_UR.LAHORE), t2.join(', '))
  if (tag === 'phone') await shot(page, '#tk-district .tk-mapwrap', 'punjab-phone-tap')
  await page.waitForSelector('#tk-tehsil .tk-row', { timeout: 5000 })
  const head = await page.textContent('#tk-district h2, #tk-district .tk-h')
  check(`${tag}: then Lahore's khata opens`, head.includes(DISTRICT_UR.LAHORE), head)
  check(`${tag}: Punjab map: no console error or failed request`, errors.length === 0, errors.join(' | '))
  await ctx.close()
}

// ── 2 a tehsil's map ─────────────────────────────────────────────────────────────────────────────────────────
for (const [d, th] of [['D.G.KHAN', 'Taunsa'], ['SHEIKHUPURA', 'Muridke']]) {
  const { ctx, page, errors } = await newPage({ width: 412, height: 860 })
  await openTehsil(page, d, th)
  await page.waitForTimeout(800)
  await clearDrawn(page)
  await page.click('[data-gps="map"]')
  await page.waitForSelector('#gps-card canvas.tk-map')
  await page.waitForTimeout(900)
  const t = [...new Set(await drawn(page, new RegExp(`^Map of the soil squares of ${th} tehsil`)))]
  const own = allUcs.filter(u => u.district === d && u.tehsil === th).map(u => u.label)
  check(`${th}: its map carries Union Council names (${t.length} of ${own.length}), each one of its own`, t.length >= Math.min(6, own.length) && t.every(x => own.includes(x)), t.join(', '))
  await shot(page, '#gps-card .tk-mapwrap', `tehsil-${th}`)
  // a tap still picks a square and opens the finer map
  const b = await page.locator('#gps-card canvas.tk-map').boundingBox()
  let opened = false
  for (const [fx, fy] of [[0.5, 0.5], [0.4, 0.3], [0.6, 0.7], [0.3, 0.6], [0.5, 0.2]]) {
    await page.mouse.click(b.x + fx * b.width, b.y + fy * b.height)
    try { await page.waitForSelector('canvas.gps-map', { timeout: 3000 }); opened = true; break } catch { /* a gap between squares */ }
  }
  check(`${th}: a tap on the map still opens the finer map`, opened)
  check(`${th} map: no console error or failed request`, errors.length === 0, errors.join(' | '))
  await ctx.close()
}

// ── 3 the soil card's map and "Near your land" ───────────────────────────────────────────────────────────────
{
  const at = { latitude: 31.80, longitude: 74.26, accuracy: 15 }   // Muridke, between NANGAL SAHDAN and KOT NAZIR
  const { ctx, page, errors } = await newPage({ width: 412, height: 860 }, at)
  await openTehsil(page, 'SHEIKHUPURA', 'Muridke')
  await clearDrawn(page)
  await page.click('[data-gps="locate"]')
  await page.waitForSelector('[data-gps-card]')
  await page.waitForSelector('[data-gps="near"] li')
  await page.waitForTimeout(800)
  const cardUc = await page.textContent('[data-gps-card] .gps-for + .tk-en')
  const ownLabel = /Union Council (.*?), tehsil/.exec(cardUc)?.[1]
  const ownId = allUcs.find(u => u.label === ownLabel && u.district === 'SHEIKHUPURA')?.id ?? null
  const rows = await nearRows(page)
  const want = expectNear(at.latitude, at.longitude, null, ownId)
  check('card: "Near your land" lists the nearest Union Council centres, whole km and direction, the card\'s own marked', JSON.stringify(rows) === JSON.stringify(want), `page: ${rows.join(' | ')}\n         want: ${want.join(' | ')}`)
  check('card: the heading reads "Near your land"', (await page.textContent('.gps-near-h')) === 'Near your land')
  const t = await drawn(page, /^Your land with a circle of/)
  check('card map: 1 km scale bar, north mark and the circle\'s km on a 3 km card', t.includes('1 km') && t.includes('N') && t.includes('3 km'), t.join(', '))
  const names = t.filter(x => !['1 km', 'N', '3 km'].includes(x))
  check('card map: every name on it is a Union Council in search, none on a pin card', names.length >= 1 && names.every(n => allUcs.some(u => u.label === n && !u.pin)), names.join(', '))
  const lg = await page.textContent('[data-gps="legend"]')
  check('card: the legend', ['your land', 'the card’s circle (3 km)', 'card points, about 1 km apart', 'Union Council centre'].every(x => lg.includes(x)), lg)
  await shot(page, '[data-gps-card] canvas.gps-map', 'card-map')
  // the widest circle: the bar grows so it stays readable
  const r = page.locator('[data-gps="radius"]')
  if (await r.count()) {
    await clearDrawn(page)
    await r.fill(await r.getAttribute('max'))
    await page.waitForTimeout(600)
    const t2 = await drawn(page, /^Your land with a circle of/)
    check('card map, widest circle: a scale bar of whole km is drawn', t2.some(x => /^(1|2|5|10|20|50) km$/.test(x)), t2.join(', '))
  }
  check('card: no console error or failed request', errors.length === 0, errors.join(' | '))
  await ctx.close()
}
{
  // from the search: the searched Union Council is the place, so it is not in its own list
  const u = allUcs.find(x => x.label === 'KOT NAZIR' && x.district === 'SHEIKHUPURA')
  const { ctx, page, errors } = await newPage({ width: 412, height: 860 })
  await openTehsil(page, 'SHEIKHUPURA', 'Muridke')
  await page.click('[data-gps="search"]')
  await page.fill('[data-gps="q"]', 'kot nazir')
  await page.click(`#gps-card .tk-row[data-uc="${u.id}"]`)
  await page.waitForSelector('[data-gps="near"] li')
  const rows = await nearRows(page)
  const want = expectNear(u.gi * DLAT, u.gj * DLON, u.id, null)
  check('search card: the searched Union Council is not in its own list ("0 km north" before the review)', JSON.stringify(rows) === JSON.stringify(want) && !rows.some(x => x.startsWith('KOT NAZIR,')), `page: ${rows.join(' | ')}\n         want: ${want.join(' | ')}`)
  check('search card: the heading and the legend name the Union Council, not "your land"', (await page.textContent('.gps-near-h')) === 'Near KOT NAZIR' && (await page.textContent('[data-gps="legend"]')).includes('the centre of KOT NAZIR'))
  check('search card: no console error or failed request', errors.length === 0, errors.join(' | '))
  await ctx.close()
}
{
  // outside Punjab (Islamabad, G9): no near list (G11 puts no km on a survey area)
  const { ctx, page, errors } = await newPage({ width: 412, height: 860 }, { latitude: 33.70, longitude: 73.03, accuracy: 15 })
  await openTehsil(page, 'RAWALPINDI', 'Rawalpindi')
  await page.click('[data-gps="locate"]')
  await page.waitForSelector('[data-gps-card]')
  await page.waitForTimeout(1500)
  const outside = await page.$('[data-gps="outside"]')
  check('outside-Punjab card: no "Near your land" list', !!outside && !(await page.$('[data-gps="near"]')), outside ? 'list shown' : 'not an outside card')
  check('outside card: no console error or failed request', errors.length === 0, errors.join(' | '))
  await ctx.close()
}

await browser.close()
server.close()
console.log(`\n${passed} passed, ${failed} failed`)
process.exit(failed ? 1 : 0)
