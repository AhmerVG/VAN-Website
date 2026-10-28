/**
 * CALCULATOR RULINGS CHECK, 19 Oct 2026 (D-270 to D-273). Run after the build, like sweep.mjs: `node calctest.mjs`.
 *
 * Serves out/ over http and checks, in a real browser:
 *   1  D-270, band edges: on the wheat calculator, a reading typed exactly on every boundary of every analyte lands in
 *      the band VAN's soil table gives it (`Report, Color, VAC add, Order of Nutrition Plan.xlsx`, Sheet1 P3:U12, the
 *      inequality quoted beside each case), and a reading just past the edge lands in the next band. The Soil Atlas
 *      reads the same function: the matrix and the district khata put Attock and Dera Ghazi Khan pH 8.0, Khanewal and
 *      Vehari pH 8.5 and Nankana Sahib boron 1.0 in the sheet's band.
 *   2  D-271, iron and copper in Faisalabad, Jhang, Chiniot and Toba Tek Singh: the district fill leaves both rows
 *      blank, says why, and the plan equals the same district's other readings entered by hand (so iron and copper add
 *      nothing to VL-Micromix); wheat and basmati, and the published-plan list on guava (soybean until D-323,
 *      when soybean went live; citrus became mango the same day). Lahore still fills both.
 *   2b D-273, a district change: Lahore then Faisalabad equals Faisalabad picked first (wheat calculator, guava list);
 *      a farmer's own iron reading stays and the note then names copper only; the Soil Atlas iron/copper note wording.
 *   3  D-272, price panel: the note is there (calculator and guava published-plan list), and the wheat total at 1 acre
 *      is unchanged (PKR 46,300).
 *   and no console error or failed request on soil.html, crops/wheat.html, crops/rice-basmati.html, crops/potato.html
 *   at 412x860 and 1366x900 (favicon-32x32.png is left out: it lives only in the repo root, as sweep.mjs reports).
 * Prints "N passed, M failed". Exit code 1 on any failure.
 */
import { chromium } from 'playwright'
import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.dirname(fileURLToPath(import.meta.url))
const OUT = path.join(ROOT, 'out')
const CHROME = process.env.CHROME || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.woff2': 'font/woff2', '.json': 'application/json', '.xml': 'application/xml', '.txt': 'text/plain', '.ico': 'image/x-icon', '.pdf': 'application/pdf', '.glb': 'model/gltf-binary' }
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
const check = (label, ok, detail = '') => { if (ok) passed++; else failed++; console.log(`${ok ? '  ok  ' : '  FAIL'} ${label}${!ok && detail ? '\n         ' + detail : ''}`) }

async function newPage(vp = { width: 1366, height: 900 }) {
  const ctx = await browser.newContext({ viewport: vp, reducedMotion: 'reduce' })
  const page = await ctx.newPage()
  page.setDefaultTimeout(20000)
  const errors = []
  page.on('console', m => { if (m.type() === 'error' && !/favicon-32x32/.test(m.location()?.url || '') && !/favicon-32x32/.test(m.text())) errors.push(m.text()) })
  page.on('pageerror', e => errors.push('pageerror ' + e.message))
  page.on('requestfailed', r => { if (!/favicon-32x32/.test(r.url())) errors.push('failed ' + r.url()) })
  page.on('response', r => { if (r.status() >= 400 && !/favicon-32x32/.test(r.url())) errors.push(r.status() + ' ' + r.url()) })
  return { ctx, page, errors }
}

/** Each calculator row's product and on-screen quantity. */
const rows = (page, scope = '#creator') => page.evaluate(scope => [...document.querySelector(scope).querySelector('ul').querySelectorAll(':scope > li')].map(li => {
  const q = li.querySelector('.text-right .num')
  return (q ? q.textContent.trim() : '') + ' | ' + li.innerText.replace(/\s+/g, ' ').trim()
}), scope)
const pressed = (page, scope = '#creator') => page.$$eval(`${scope} button[aria-pressed="true"][aria-label*=": "]`, bs => bs.map(b => b.getAttribute('aria-label')))

// ── 1: band edges ─────────────────────────────────────────────────────────────────────────────────────────────────
// [panel label, value, expected band, the sheet's wording that places it]
const EDGES = [
  ['EC (salinity)', 2, 'Moderate', '4 > EC >= 2.0'], ['EC (salinity)', 4, 'Average', '8 >= EC >= 4'],
  ['EC (salinity)', 8, 'Average', '8 >= EC >= 4'], ['EC (salinity)', 12, 'Weak', '12 >= EC > 8'],
  ['pH', 7, 'Healthy', '7.5>= pH >=7'], ['pH', 7.5, 'Moderate', 'in both 7.5>= pH >=7 and 8>= pH >=7.5; ruled Moderate (7.5 cut-off, 19 Oct)'],
  ['pH', 8, 'Moderate', '8>= pH >=7.5'], ['pH', 8.5, 'Average', '8.5 >= pH > 8'], ['pH', 9, 'Weak', '9 >= pH > 8.5'],
  ['Organic matter', 0.5, 'Weak', '0.5 <= OM < 0.75'], ['Organic matter', 0.75, 'Average', '0.75 <= OM <1.0'],
  ['Organic matter', 1, 'Moderate', '1<= OM <= 1.25'], ['Organic matter', 1.25, 'Moderate', '1<= OM <= 1.25'],
  ['Phosphorus (P₂O₅)', 5, 'Weak', '5 <= P2O < 10'], ['Phosphorus (P₂O₅)', 10, 'Average', '10 <= P2O < 15'],
  ['Phosphorus (P₂O₅)', 15, 'Moderate', '15 <= P2O < 20'], ['Phosphorus (P₂O₅)', 20, 'Moderate', 'in no band on the sheet (P2O > 20); band below, Tahir 19 Oct 2026'],
  ['Potash (K₂O)', 50, 'Weak', '50<= K2O <100'], ['Potash (K₂O)', 100, 'Average', '100 <= K2O < 150'],
  ['Potash (K₂O)', 150, 'Moderate', '150 <= K2O < 200'], ['Potash (K₂O)', 200, 'Moderate', 'in no band on the sheet (K2O >200); band below, Tahir 19 Oct 2026'],
  ['Zinc', 0.6, 'Weak', '0.6 <= Zn < 0.7'], ['Zinc', 0.7, 'Average', '0.7 <= Zn < 0.8'], ['Zinc', 0.8, 'Moderate', '0.8<= Zn <= 1'], ['Zinc', 1, 'Moderate', '0.8<= Zn <= 1'],
  ['Copper', 0.1, 'Average', '0.1 <= Cu <= 0.2'], ['Copper', 0.2, 'Average', '0.1 <= Cu <= 0.2'],
  ['Iron', 2, 'Weak', '2<= Fe < 3'], ['Iron', 3, 'Average', '3 <= Fe < 4'], ['Iron', 4, 'Moderate', '4 <= Fe <= 5'], ['Iron', 5, 'Moderate', '4 <= Fe <= 5'],
  ['Manganese', 0.5, 'Average', '0.5<= Mn <= 1'], ['Manganese', 1, 'Average', '0.5<= Mn <= 1'],
  ['Boron', 0.2, 'Weak', '0.2<= B < 0.4'], ['Boron', 0.4, 'Average', '0.4 <= B < 0.6'], ['Boron', 0.6, 'Moderate', '0.6 <= B <= 1'], ['Boron', 1, 'Moderate', '0.6 <= B <= 1'],
]
// Just past an edge: the other side of each boundary.
const PAST = [
  ['EC (salinity)', 1.99, 'Healthy'], ['EC (salinity)', 8.01, 'Weak'], ['EC (salinity)', 12.01, 'Critical'], ['EC (salinity)', 3.99, 'Moderate'],
  ['pH', 7.49, 'Healthy'], ['pH', 8.01, 'Average'], ['pH', 8.51, 'Weak'], ['pH', 9.01, 'Critical'], ['pH', 6.99, null],
  ['Organic matter', 0.49, 'Critical'], ['Organic matter', 0.99, 'Average'], ['Organic matter', 1.26, 'Healthy'],
  ['Phosphorus (P₂O₅)', 4.99, 'Critical'], ['Phosphorus (P₂O₅)', 19.99, 'Moderate'], ['Phosphorus (P₂O₅)', 20.01, 'Healthy'],
  ['Potash (K₂O)', 199.9, 'Moderate'], ['Potash (K₂O)', 200.1, 'Healthy'],
  ['Zinc', 0.59, 'Critical'], ['Zinc', 0.79, 'Average'], ['Zinc', 1.01, 'Healthy'],
  ['Copper', 0.09, 'Critical'], ['Copper', 0.21, 'Healthy'],
  ['Iron', 1.99, 'Critical'], ['Iron', 3.99, 'Average'], ['Iron', 5.01, 'Healthy'],
  ['Manganese', 0.49, 'Critical'], ['Manganese', 1.01, 'Healthy'],
  ['Boron', 0.19, 'Critical'], ['Boron', 0.59, 'Average'], ['Boron', 1.01, 'Healthy'],
]
console.log('\n1 · D-270 band edges on the wheat calculator (typed readings)')
{
  const { ctx, page } = await newPage()
  await page.goto(`${BASE}/crops/wheat.html`, { waitUntil: 'networkidle' })
  await page.waitForSelector('#creator ul li')
  const bandOf = async (label, v) => {
    const input = page.locator(`#creator input[aria-label^="${label} reading"]`)
    if (!(await input.count())) return 'no row'
    await input.fill('')
    await input.fill(String(v))
    const on = await page.$$eval(`#creator button[aria-pressed="true"][aria-label^="${label}: "]`, bs => bs.map(b => b.getAttribute('aria-label')))
    return on.length ? on[0].split(': ').pop() : null
  }
  for (const [label, v, want, sheet] of EDGES) {
    const got = await bandOf(label, v)
    check(`${label} ${v} → ${want}  (sheet: ${sheet})`, got === want, `got ${got}`)
  }
  for (const [label, v, want] of PAST) {
    const got = await bandOf(label, v)
    check(`${label} ${v} → ${want ?? 'no band (outside the table)'}`, got === want, `got ${got}`)
  }
  await ctx.close()
}

console.log('\n1 · D-270 the Soil Atlas reads the same edges (matrix and district khata)')
{
  const { ctx, page } = await newPage()
  await page.goto(`${BASE}/soil.html`, { waitUntil: 'networkidle' })
  await page.waitForSelector('tr.mx-row')
  const labels = await page.$$eval('tr.mx-row td button[aria-label]', bs => bs.map(b => b.getAttribute('aria-label')))
  const mx = (district, what) => { const l = labels.find(x => x.startsWith(`${district} · ${what} `)); return l ? (l.match(/Sets the colour: (\w+)/) || [])[1] ?? 'none' : 'missing' }
  for (const [d, what, want] of [['Attock', 'pH', 'Moderate'], ['Dera Ghazi Khan', 'pH', 'Moderate'], ['Khanewal', 'pH', 'Average'], ['Vehari', 'pH', 'Average'], ['Nankana Sahib', 'Boron', 'Moderate']]) {
    const got = mx(d, what)
    check(`Atlas matrix: ${d} ${what} median on the edge → ${want}`, got === want, `got ${got}`)
  }
  await ctx.close()
  for (const [key, row, want] of [['D.G.KHAN', 'pH', 'Moderate'], ['ATTOCK', 'pH', 'Moderate'], ['KHANEWAL', 'pH', 'Average'], ['VEHARI', 'pH', 'Average'], ['NANKANA', 'Boron', 'Moderate']]) {
    const { ctx: c2, page: p2 } = await newPage()
    await p2.goto(`${BASE}/soil.html?district=${encodeURIComponent(key)}&from=mitti`, { waitUntil: 'networkidle' })
    await p2.waitForSelector('#teesra-khata .tk-kr')
    const kr = await p2.$$eval('#teesra-khata .tk-kr', rs => rs.map(r => r.innerText.replace(/\s+/g, ' ').trim()))
    const line = kr.find(t => row === 'pH' ? / pH (Alkaline|Neutral|Acidic) · / .test(t) : t.includes(`${row} · `)) ?? ''
    check(`Atlas khata: ${key} ${row} → ${want}`, line.endsWith(`· ${want}`), line || JSON.stringify(kr))
    await c2.close()
  }
}

// ── 2: iron and copper in the 4 districts ────────────────────────────────────────────────────────────────────────
console.log('\n2 · D-271 iron and copper in Faisalabad, Jhang, Chiniot and Toba Tek Singh are not filled')
for (const crop of ['wheat', 'rice-basmati']) {
  for (const key of ['FAISALABAD', 'JHANG', 'CHINNIOT', 'TOBA TEK SINGH']) {
    const { ctx, page } = await newPage()
    await page.goto(`${BASE}/crops/${crop}.html`, { waitUntil: 'networkidle' })
    await page.waitForSelector('#creator ul li')
    await page.selectOption('#creator select[aria-label="Your district"]', key)
    await page.waitForTimeout(100)
    const on = await pressed(page)
    const filled = await rows(page)
    const note = await page.$eval('#creator select[aria-label="Your district"]', s => s.closest('.panel').querySelector('p.cap')?.innerText ?? '')
    check(`${crop} ${key}: iron and copper rows left blank`, !on.some(l => /^(Iron|Copper): /.test(l)), JSON.stringify(on))
    check(`${crop} ${key}: the panel says they are not comparable`, /Copper here reads far below every other district, and iron far below most, which points to a different laboratory method/.test(note) && /not comparable, so those rows are left blank\./.test(note), note)
    // The same district's other readings, entered by hand on a fresh page: the plan must be the same, row for row.
    await page.goto(`${BASE}/crops/${crop}.html`, { waitUntil: 'networkidle' })
    await page.waitForSelector('#creator ul li')
    for (const l of on.filter(l => !/^(Iron|Copper): /.test(l))) await page.click(`#creator button[aria-label="${l}"]`)
    const byHand = (await rows(page)).map(r => r.split(' | ')[0])
    const fromFill = filled.map(r => r.split(' | ')[0])
    const micro = filled.find(r => /VL-Micromix/.test(r))?.split(' | ')[0]
    check(`${crop} ${key}: every quantity equals the other readings entered by hand (VL-Micromix ${micro} L, nothing from iron or copper)`, JSON.stringify(byHand) === JSON.stringify(fromFill), `fill ${JSON.stringify(fromFill)} by hand ${JSON.stringify(byHand)}`)
    await ctx.close()
  }
}
{
  const { ctx, page } = await newPage()
  await page.goto(`${BASE}/crops/wheat.html`, { waitUntil: 'networkidle' })
  await page.waitForSelector('#creator ul li')
  await page.selectOption('#creator select[aria-label="Your district"]', 'LAHORE')
  await page.waitForTimeout(100)
  const on = await pressed(page)
  check('wheat LAHORE (not one of the 4): iron and copper still filled', on.includes('Iron: Critical') && on.some(l => /^Copper: /.test(l)), JSON.stringify(on))
  const note = await page.$eval('#creator select[aria-label="Your district"]', s => s.closest('.panel').querySelector('p.cap')?.innerText ?? '')
  check('wheat LAHORE: no "not comparable" note', !/not comparable/.test(note), note)
  await ctx.close()
}
{
  const { ctx, page } = await newPage()
  await page.goto(`${BASE}/crops/guava.html`, { waitUntil: 'networkidle' })
  await page.waitForSelector('#list ul li')
  await page.selectOption('#list select[aria-label="Your district"]', 'FAISALABAD')
  await page.waitForTimeout(100)
  const on = await pressed(page, '#list')
  const hasRows = (await page.locator('#list input[aria-label^="Iron reading"]').count()) === 1 && (await page.locator('#list input[aria-label^="Copper reading"]').count()) === 1
  check('guava published-plan list, FAISALABAD: the iron and copper rows are there, and left blank', hasRows && on.length > 0 && !on.some(l => /^(Iron|Copper): /.test(l)), JSON.stringify(on))
  await ctx.close()
}
{
  // Citrus shows no iron or copper row, so its district line must not talk about rows it does not show.
  const { ctx, page } = await newPage()
  await page.goto(`${BASE}/crops/mango.html`, { waitUntil: 'networkidle' })
  await page.waitForSelector('#list ul li')
  await page.selectOption('#list select[aria-label="Your district"]', 'FAISALABAD')
  await page.waitForTimeout(100)
  const note = await page.$eval('#list select[aria-label="Your district"]', s => s.closest('.panel').querySelector('p.cap')?.innerText ?? '')
  const rowsShown = await page.locator('#list input[aria-label^="Iron reading"], #list input[aria-label^="Copper reading"]').count()
  check('mango published-plan list, FAISALABAD: no iron or copper row, so no not comparable note', rowsShown === 0 && /51,556 samples in Faisalabad/.test(note) && !/not comparable/.test(note), `rows ${rowsShown}; ${note}`)
  await ctx.close()
}

// ── 2b: D-273, switching district clears what the new district leaves blank; the farmer's own rows stay ─────────
console.log('\n2b · D-273 a district change clears rows the new district leaves blank')
for (const [crop, scope, sel] of [['wheat', '#creator', '#creator ul li'], ['guava', '#list', '#list ul li']]) {
  const { ctx, page } = await newPage()
  await page.goto(`${BASE}/crops/${crop}.html`, { waitUntil: 'networkidle' })
  await page.waitForSelector(sel)
  await page.selectOption(`${scope} select[aria-label="Your district"]`, 'FAISALABAD')
  await page.waitForTimeout(100)
  const fresh = (await rows(page, scope)).map(r => r.split(' | ')[0])
  await page.goto(`${BASE}/crops/${crop}.html`, { waitUntil: 'networkidle' })
  await page.waitForSelector(sel)
  await page.selectOption(`${scope} select[aria-label="Your district"]`, 'LAHORE')
  await page.waitForTimeout(100)
  const lahoreOn = await pressed(page, scope)
  await page.selectOption(`${scope} select[aria-label="Your district"]`, 'FAISALABAD')
  await page.waitForTimeout(100)
  const on = await pressed(page, scope)
  const switched = (await rows(page, scope)).map(r => r.split(' | ')[0])
  const note = await page.$eval(`${scope} select[aria-label="Your district"]`, s => s.closest('.panel').querySelector('p.cap')?.innerText ?? '')
  check(`${crop} LAHORE then FAISALABAD: Lahore's iron and copper are cleared`, lahoreOn.some(l => /^(Iron|Copper): /.test(l)) && !on.some(l => /^(Iron|Copper): /.test(l)), `Lahore ${JSON.stringify(lahoreOn)} then ${JSON.stringify(on)}`)
  check(`${crop} LAHORE then FAISALABAD: the plan equals Faisalabad picked first`, JSON.stringify(switched) === JSON.stringify(fresh), `switched ${JSON.stringify(switched)} fresh ${JSON.stringify(fresh)}`)
  check(`${crop} LAHORE then FAISALABAD: the not comparable note shows`, /not comparable, so those rows are left blank\./.test(note), note)
  await ctx.close()
}
{
  // The farmer's own iron reading stays through a district change, and the note then names copper only.
  const { ctx, page } = await newPage()
  await page.goto(`${BASE}/crops/wheat.html`, { waitUntil: 'networkidle' })
  await page.waitForSelector('#creator ul li')
  const ironBtn = page.locator('#creator button[aria-label^="Iron: "]').first()
  const ironLabel = await ironBtn.getAttribute('aria-label')
  await ironBtn.click()
  await page.selectOption('#creator select[aria-label="Your district"]', 'LAHORE')
  await page.waitForTimeout(100)
  await page.selectOption('#creator select[aria-label="Your district"]', 'FAISALABAD')
  await page.waitForTimeout(100)
  const on = await pressed(page)
  const note = await page.$eval('#creator select[aria-label="Your district"]', s => s.closest('.panel').querySelector('p.cap')?.innerText ?? '')
  check(`wheat: the farmer's own ${ironLabel} stays after LAHORE then FAISALABAD; copper cleared`, on.includes(ironLabel) && !on.some(l => /^Copper: /.test(l)), JSON.stringify(on))
  check('wheat: the note then names copper only', /Copper here reads far below every other district, which points/.test(note) && /It is not comparable, so that row is left blank\./.test(note) && !/iron far below/i.test(note), note)
  await ctx.close()
}
{
  const { ctx, page } = await newPage()
  await page.goto(`${BASE}/soil.html`, { waitUntil: 'networkidle' })
  const txt = await page.evaluate(() => document.body.innerText)
  check('Soil Atlas note: copper far below every other district, iron far below most', /Copper in Faisalabad, Jhang, Chiniot and Toba Tek Singh reads far below every other district, and iron far below most,/.test(txt) && !/Iron and copper in Faisalabad, Jhang, Chiniot and Toba Tek Singh read far below every other district/.test(txt))
  await ctx.close()
}

// ── 3: the price note ──────────────────────────────────────────────────────────────────────────────────────────────
console.log('\n3 · D-272 the price panel note, and no price figure moved')
for (const crop of ['wheat', 'lentil']) {
  const { ctx, page } = await newPage()
  await page.goto(`${BASE}/crops/${crop}.html`, { waitUntil: 'networkidle' })
  await page.waitForSelector('#creator ul li')
  await page.click('#creator button:has-text("What will this cost me?")')
  const panel = await page.$eval('#creator .num[style*="font-size: 34px"]', el => el.closest('.panel').innerText)
  check(`${crop}: the note is in the price panel`, panel.includes('This cost is for the amount used on the field. Where the plan says half a bag, 1 bag covers 2 acres.'), panel)
  check(`${crop}: no em dash in the note`, !/—/.test(await page.$eval('#creator [data-price-note]', el => el.textContent).catch(() => '—')))
  const total = (panel.match(/PKR ([\d,]+)/) || [])[1]
  const want = { wheat: '46,300', lentil: '38,215' }[crop]
  check(`${crop}: 1 acre total unchanged, PKR ${want} (audit 19 Oct)`, total === want, `got ${total}`)
  await ctx.close()
}
{
  // D-272 extended, Tahir 19 Oct 2026: the same note on the published-plan list's price panel.
  const { ctx, page } = await newPage()
  await page.goto(`${BASE}/crops/guava.html`, { waitUntil: 'networkidle' })
  await page.waitForSelector('#list ul li')
  await page.click('#list button:has-text("What will this cost me?")')
  const note = await page.$eval('#list [data-price-note]', el => el.textContent).catch(() => '')
  check('guava published-plan list: the price note is there, no em dash', note === 'This cost is for the amount used on the field. Where the plan says half a bag, 1 bag covers 2 acres.', note)
  await ctx.close()
}

// ── console errors and failed requests ─────────────────────────────────────────────────────────────────────────
console.log('\nconsole errors and failed requests')
for (const p of ['soil.html', 'crops/wheat.html', 'crops/rice-basmati.html', 'crops/potato.html']) {
  for (const vp of [{ width: 412, height: 860, n: '412x860' }, { width: 1366, height: 900, n: '1366x900' }]) {
    const { ctx, page, errors } = await newPage({ width: vp.width, height: vp.height })
    await page.goto(`${BASE}/${p}`, { waitUntil: 'networkidle' })
    await page.waitForTimeout(500)
    check(`${p} ${vp.n}: no console error, no failed request`, errors.length === 0, errors.join(' | '))
    await ctx.close()
  }
}

console.log(`\n${passed} passed, ${failed} failed`)
await browser.close(); server.close()
process.exit(failed ? 1 : 0)
