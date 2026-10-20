/**
 * LAHORE CITY AND OLD BUNDLES CHECK, 20 Oct 2026 (D-274 to D-276). Run after the build, like sweep.mjs: `node lahoretest.mjs`.
 * Run from source/ in the repo, it also reads the repo root (the folder above); elsewhere set REPO to the repo root.
 * `node lahoretest.mjs --repo-only` runs only the repo root check (no browser needed).
 *
 * Serves out/ over http and checks, in a real browser and on the files:
 *   1  Lahore on the Soil Atlas lists 5 tehsils: Lahore City (9,294 samples, لاہور سٹی), Model Town, Shalimar, Raiwind,
 *      Cantt. No tehsil called "Lahore" is left, and the old line "8,603 samples carry no tehsil" is gone.
 *   2  Lahore City's khata shows the medians taken from its 9,294 samples (pH 8.6, OM 0.55, P 5.7, K 120, Zn 0.40,
 *      B 0.47, EC 2.3), each as the screen rounds it.
 *   3  Lahore City's square screen names the tehsil, and the soil card's VAN message says "Tehsil: Lahore City".
 *   4  the data in the bundle: 136 tehsils, their samples plus 90 with no tehsil add to 770,160.
 *   5  the old bundles demo.0b4e1379.js, demo.b99516a2.js and demo.2c3bcc2a.css are not in out/, and every
 *      demo.<hash>.js / .css that a page names is in out/.
 *   6  the repo root: demo.0b4e1379.js, demo.b99516a2.js, demo.2c3bcc2a.css and demo.56bd9206.js are gone, no file the
 *      site serves names any of them, and every demo.<hash>.js / .css a served file names is there
 *   7  D-276: a place saved by the old page under the history key "vanTeesraKhata" is ignored on Back: the farmer starts
 *      afresh and the tehsil list has nothing preselected (and, as a control, the same place saved under the new key
 *      "vanTeesraKhata2" is restored, so the test does reach the restore path)
 *   and no console error or failed request on soil.html at 412x860 and 1366x900 while Lahore City is open
 *   (favicon-32x32.png is left out: it lives only in the repo root, not in out/, as sweep.mjs reports).
 * Prints "N passed, M failed". Exit code 1 on any failure.
 */
import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.dirname(fileURLToPath(import.meta.url))
const OUT = process.env.OUT || path.join(ROOT, 'out')
const REPO = process.env.REPO || path.resolve(ROOT, '..')
const REMOVED = ['demo.0b4e1379.js', 'demo.b99516a2.js', 'demo.2c3bcc2a.css', 'demo.56bd9206.js']

let passed = 0, failed = 0
const check = (label, ok, detail = '') => { if (ok) passed++; else failed++; console.log(`${ok ? '  ok  ' : '  FAIL'} ${label}${!ok && detail ? '\n         ' + detail : ''}`) }

// ── 6: the repo root itself ────────────────────────────────────────────────────────────────────────────────────
console.log(`\n6 · the repo root (${REPO})`)
{
  const isRepo = fs.existsSync(path.join(REPO, '.htaccess')) && fs.existsSync(path.join(REPO, 'soil.html')) && fs.existsSync(path.join(REPO, 'source'))
  check('REPO is the repo root (.htaccess, soil.html and source/ are there)', isRepo, 'run from source/ in the repo, or set REPO')
  if (isRepo) {
    check('demo.0b4e1379.js, demo.b99516a2.js, demo.2c3bcc2a.css and demo.56bd9206.js are not in the repo root', REMOVED.every(f => !fs.existsSync(path.join(REPO, f))), REMOVED.filter(f => fs.existsSync(path.join(REPO, f))).join(', '))
    const served = []
    const walk = d => { for (const e of fs.readdirSync(d, { withFileTypes: true })) { if (['.git', 'source', 'node_modules'].includes(e.name)) continue; const p = path.join(d, e.name); if (e.isDirectory()) walk(p); else if (/\.(html?|js|css|xml|txt|php|json)$/.test(e.name) || e.name === '.htaccess') served.push(p) } }
    walk(REPO)
    const named = new Set(), naming = []
    for (const p of served) {
      const s = fs.readFileSync(p, 'utf8')
      for (const m of s.matchAll(/demo\.[0-9a-f]{8}\.(?:js|css)/g)) named.add(m[0])
      if (REMOVED.some(f => s.includes(f))) naming.push(path.relative(REPO, p))
    }
    check(`no file the site serves names a removed bundle (${served.length} text files read)`, naming.length === 0, naming.join(', '))
    const missing = [...named].filter(f => !fs.existsSync(path.join(REPO, f)))
    check(`every bundle a served file names is in the repo root (${[...named].join(', ')})`, named.size === 2 && missing.length === 0, missing.join(', '))
  }
}
if (process.argv.includes('--repo-only')) { console.log(`\n${passed} passed, ${failed} failed`); process.exit(failed ? 1 : 0) }

const { chromium } = await import('playwright')
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
const waText = href => { try { return new URL(href).searchParams.get('text') ?? '' } catch { return '' } }

async function newPage(vp = { width: 412, height: 860 }) {
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

/** Opens Lahore's tehsil step on soil.html and returns the rows as the screen shows them. */
async function lahoreTehsils(page) {
  await page.goto(`${BASE}/soil.html?district=LAHORE&from=mitti`, { waitUntil: 'networkidle' })
  await page.waitForSelector('#teesra-khata')
  await page.click('button.tk-btn:has-text("Pick your tehsil")')
  await page.waitForSelector('#teesra-khata .tk-list .tk-row')
  return page.evaluate(() => [...document.querySelectorAll('#teesra-khata .tk-list .tk-row')].map(b => ({
    en: b.querySelector('.tk-en-name')?.textContent.trim() ?? '',
    n: b.querySelector('.cap.num')?.textContent.trim() ?? '',
    ur: b.querySelector('.tk-ur-name')?.textContent.trim() ?? '',
  })))
}

// ── 1 and 2: Lahore's tehsil list and Lahore City's khata ─────────────────────────────────────────────────────────
console.log('\n1, 2 · Lahore lists Lahore City once, with 9,294 samples and its own medians')
{
  const { ctx, page, errors } = await newPage()
  const rows = await lahoreTehsils(page)
  const names = rows.map(r => r.en)
  check('Lahore lists 5 tehsils: Lahore City, Model Town, Shalimar, Raiwind, Cantt', JSON.stringify(names) === JSON.stringify(['Lahore City', 'Model Town', 'Shalimar', 'Raiwind', 'Cantt']), JSON.stringify(names))
  check('no tehsil called "Lahore" is left', !names.includes('Lahore') && !rows.some(r => r.ur === 'لاہور'), JSON.stringify(rows))
  const city = rows.find(r => r.en === 'Lahore City')
  check('Lahore City: 9,294 samples, Urdu لاہور سٹی', !!city && city.n === '9,294 samples' && city.ur === 'لاہور سٹی', JSON.stringify(city))
  const counts = Object.fromEntries(rows.map(r => [r.en, r.n]))
  check('the other 4 keep their counts (Model Town 1,101, Shalimar 1,088, Raiwind 1,043, Cantt 804)', counts['Model Town'] === '1,101 samples' && counts['Shalimar'] === '1,088 samples' && counts['Raiwind'] === '1,043 samples' && counts['Cantt'] === '804 samples', JSON.stringify(counts))
  const intro = await page.evaluate(() => [...document.querySelectorAll('#teesra-khata .tk-en')].map(e => e.textContent).join(' | '))
  check('the screen says Lahore has 5 tehsils in the survey', /Lahore has 5 tehsils in the survey/.test(intro), intro)
  await page.click('#teesra-khata .tk-list .tk-row:has(.tk-en-name:text-is("Lahore City"))')
  await page.waitForSelector('#teesra-khata .tk-khata')
  const line = await page.evaluate(() => [...document.querySelectorAll('#teesra-khata .tk-en')].map(e => e.textContent).find(t => /samples · the tehsil median/.test(t)) ?? '')
  check('Lahore City line: "Lahore City · 9,294 samples · the tehsil median, with the district’s beside it"', line === 'Lahore City · 9,294 samples · the tehsil median, with the district’s beside it', line)
  const all = await page.evaluate(() => document.getElementById('teesra-khata')?.textContent ?? '')
  check('the old note "8,603 samples carry no tehsil" is gone', !/8,603/.test(all) && !/carry no tehsil/.test(all))
  // The khata rows: P, K, Zn, OM, B, then pH, then EC. The first text of each value cell is the tehsil's own figure.
  const shown = await page.evaluate(() => [...document.querySelectorAll('#teesra-khata .tk-khata .tk-kr .tk-v')].slice(0, 7).map(el => [...el.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent).join('').trim()))
  const want = [['P', 5.7], ['K', 120], ['Zn', 0.40], ['OM', 0.55], ['B', 0.47], ['pH', 8.6], ['EC', 2.3]]
  const off = want.filter(([, v], i) => {
    const m = /^(-?\d+(?:\.(\d+))?)/.exec(shown[i] ?? '')
    if (!m) return true
    const dec = m[2] ? m[2].length : 0
    return Math.abs(Number(m[1]) - v) > 0.5 * 10 ** -dec + 1e-9
  })
  check('Lahore City khata shows P 5.7, K 120, Zn 0.40, OM 0.55, B 0.47, pH 8.6, EC 2.3 (as the screen rounds them)', shown.length === 7 && off.length === 0, `shown ${JSON.stringify(shown)}; off ${JSON.stringify(off)}`)

  // ── 3: the square screen and the VAN message ────────────────────────────────────────────────────────────────
  await page.click('button.tk-btn:has-text("See your area")')
  await page.waitForSelector('#teesra-khata .tk-khata')
  const sq = await page.evaluate(() => [...document.querySelectorAll('#teesra-khata .tk-en')].map(e => e.textContent).find(t => /^Square in /.test(t)) ?? '')
  check('Lahore City square screen: "Square in Lahore City tehsil"', /^Square in Lahore City tehsil/.test(sq), sq)
  await page.click('button.tk-btn:has-text("Make my soil card")')
  await page.waitForSelector('img.tk-card[src^="data:image/png"]')
  const van = await page.evaluate(() => [...document.querySelectorAll('#teesra-khata a[href^="https://wa.me/923005003041"]')].map(a => a.href)[0] ?? '')
  const vt = waText(van)
  check('the soil card’s VAN message says "District: Lahore" and "Tehsil: Lahore City"', vt.includes('District: Lahore') && vt.includes('Tehsil: Lahore City') && !/Tehsil: Lahore\n/.test(vt), vt)
  check('no console error or failed request on the Lahore City path', errors.length === 0, errors.join(' | '))
  await ctx.close()
}

// ── 4: the data in the bundle ──────────────────────────────────────────────────────────────────────────────────
console.log('\n4 · the tehsil data in the bundle')
{
  const { ctx, page } = await newPage()
  // Sum the sample counts over every district's tehsil list as the screen shows it.
  await page.goto(`${BASE}/soil.html`, { waitUntil: 'networkidle' })
  await page.waitForSelector('#teesra-khata .tk-row')
  const dists = await page.evaluate(() => [...document.querySelectorAll('#teesra-khata .tk-list .tk-row .tk-en-name')].map(e => e.textContent.trim()))
  let tehsils = 0, samples = 0
  for (const d of dists) {
    await page.goto(`${BASE}/soil.html?district=${encodeURIComponent(d)}&from=mitti`, { waitUntil: 'networkidle' })
    await page.waitForSelector('#teesra-khata')
    await page.click('button.tk-btn:has-text("Pick your tehsil")')
    await page.waitForSelector('#teesra-khata .tk-list .tk-row')
    const ns = await page.evaluate(() => [...document.querySelectorAll('#teesra-khata .tk-list .tk-row .cap.num')].map(e => Number(e.textContent.replace(/[^\d]/g, ''))))
    tehsils += ns.length; samples += ns.reduce((a, b) => a + b, 0)
  }
  check(`36 districts on the Soil Atlas (${dists.length})`, dists.length === 36)
  check(`136 tehsils across them (${tehsils})`, tehsils === 136)
  check(`their samples plus 90 with no tehsil add to 770,160 (${samples} + 90)`, samples + 90 === 770160)
  await ctx.close()
}

// ── 5: the old bundles ─────────────────────────────────────────────────────────────────────────────────────────
console.log('\n5 · the old bundles are gone, and every bundle a page names is there')
{
  const OLD = ['demo.0b4e1379.js', 'demo.b99516a2.js', 'demo.2c3bcc2a.css']
  check('demo.0b4e1379.js, demo.b99516a2.js and demo.2c3bcc2a.css are not in out/', OLD.every(f => !fs.existsSync(path.join(OUT, f))))
  const pages = []
  const walk = d => { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); if (e.isDirectory()) walk(p); else if (e.name.endsWith('.html')) pages.push(p) } }
  walk(OUT)
  const named = new Set(), oldNamed = []
  for (const p of pages) {
    const s = fs.readFileSync(p, 'utf8')
    for (const m of s.matchAll(/demo\.[0-9a-f]{8}\.(?:js|css)/g)) named.add(m[0])
    if (OLD.some(f => s.includes(f))) oldNamed.push(path.relative(OUT, p))
  }
  check(`no page names an old bundle (${pages.length} pages read)`, oldNamed.length === 0, oldNamed.join(', '))
  const missing = [...named].filter(f => !fs.existsSync(path.join(OUT, f)))
  check(`every bundle the pages name is in out/ (${[...named].join(', ')})`, named.size === 2 && missing.length === 0, missing.join(', '))
}

// ── 7: a place saved under the old key is ignored ──────────────────────────────────────────────────────────────
console.log('\n7 · D-276: a place saved by the old page ("vanTeesraKhata") is ignored on Back')
{
  // Lahore, tehsil step, tehsil 62: the old page's index of the old "Lahore" tehsil, now Lahore City.
  const place = { folded: false, step: 'tehsil', d: 'LAHORE', t: 62, c: null, mapKey: 'zn' }
  async function backWith(key) {
    const { ctx, page, errors } = await newPage()
    await page.goto(`${BASE}/soil.html?district=LAHORE&from=mitti`, { waitUntil: 'networkidle' })
    await page.waitForSelector('#teesra-khata')
    await page.evaluate(([k, v]) => history.replaceState({ [k]: v }, ''), [key, place])   // only this key, as a page saved it
    await page.goto(`${BASE}/index.html`, { waitUntil: 'networkidle' })
    await page.goBack({ waitUntil: 'networkidle' })
    await page.waitForSelector('#teesra-khata')
    await page.waitForTimeout(300)
    const nav = await page.evaluate(() => performance.getEntriesByType('navigation')[0]?.type ?? '')
    const st = await page.evaluate(() => ({ list: document.querySelectorAll('#teesra-khata .tk-list .tk-row').length, on: [...document.querySelectorAll('#teesra-khata .tk-list .tk-row.on .tk-en-name')].map(e => e.textContent.trim()), khata: !!document.querySelector('#teesra-khata .tk-khata'), en: [...document.querySelectorAll('#teesra-khata .tk-en')].map(e => e.textContent).join(' | ') }))
    return { ctx, page, errors, nav, st }
  }
  {
    const { ctx, nav, st } = await backWith('vanTeesraKhata2')
    check('control: the same place under the new key "vanTeesraKhata2" is restored on Back (Lahore City picked on the tehsil list)', nav === 'back_forward' && st.on.length === 1 && st.on[0] === 'Lahore City', JSON.stringify({ nav, st }))
    await ctx.close()
  }
  {
    const { ctx, page, errors, nav, st } = await backWith('vanTeesraKhata')
    check('old key "vanTeesraKhata": ignored on Back, the page starts afresh on Lahore\'s khata (the link\'s district), no tehsil list, no tehsil picked', nav === 'back_forward' && st.list === 0 && st.on.length === 0 && /Lahore ·/.test(st.en), JSON.stringify({ nav, st }))
    await page.click('button.tk-btn:has-text("Pick your tehsil")')
    await page.waitForSelector('#teesra-khata .tk-list .tk-row')
    const after = await page.evaluate(() => ({ rows: document.querySelectorAll('#teesra-khata .tk-list .tk-row').length, on: document.querySelectorAll('#teesra-khata .tk-list .tk-row.on').length, khata: !!document.querySelector('#teesra-khata .tk-khata'), hint: [...document.querySelectorAll('#teesra-khata .tk-en')].some(e => e.textContent === 'Pick your tehsil to see its readings.') }))
    check('…and the tehsil list then shows Lahore\'s 5 tehsils with nothing preselected ("Pick your tehsil to see its readings.")', after.rows === 5 && after.on === 0 && !after.khata && after.hint, JSON.stringify(after))
    check('no console error or failed request on that path', errors.length === 0, errors.join(' | '))
    await ctx.close()
  }
}

// ── console errors and failed requests ─────────────────────────────────────────────────────────────────────────
console.log('\nconsole errors and failed requests, Lahore City open')
for (const vp of [{ width: 412, height: 860, n: 'phone 412x860' }, { width: 1366, height: 900, n: 'desktop 1366x900' }]) {
  const { ctx, page, errors } = await newPage(vp)
  await lahoreTehsils(page)
  await page.click('#teesra-khata .tk-list .tk-row:has(.tk-en-name:text-is("Lahore City"))')
  await page.waitForSelector('#teesra-khata .tk-khata')
  await page.waitForTimeout(500)
  const over = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)
  check(`/soil.html ${vp.n}: no console error, no failed request, no sideways scroll`, errors.length === 0 && !over, errors.join(' | ') + (over ? ' overflow' : ''))
  await ctx.close()
}

await browser.close()
server.close()
console.log(`\n${passed} passed, ${failed} failed`)
process.exit(failed ? 1 : 0)
