/**
 * WHATSAPP AND PATH CHECK, 19 Oct 2026 (D-261 to D-268). Run after the build, like sweep.mjs: `node watest.mjs`.
 *
 * Serves out/ over http and checks, in a real browser:
 *   1  the calculator's "Send this list on WhatsApp" carries exactly the rows shown on screen (wheat, 5 districts x 1 and
 *      3 acres; potato, 2 districts), names the district and says the soil rows are the district survey median
 *   2  the bottom bar sends the same text once the farmer has set something, and the plain enquiry with nothing set
 *      (wheat, and a crop with no calculator, where the bar sends the shopping list)
 *   3  the upper list on wheat says it is VAN's published plan and carries the district from the link
 *   4  the soil card draws a value on every reading row, pH and EC included (read from the card's own canvas calls),
 *      and a second button sends the card to VAN's number with district, tehsil, square and readings
 *   5  Back from the wheat calculator brings the soil screens back where the farmer left them, and the soil door stays
 *      skipped on Back (the door is let play on the first visit by hiding navigator.webdriver)
 *   6  the Soil Atlas bar's "My crop's plan" opens the wheat calculator with the district once one is picked
 *   8  ?district= in lower case, with spaces or dots, or as the district's name, is understood
 *   and no console error or failed request on soil.html, crops/wheat.html, crops/potato.html, index.html at 412x860 and
 *   1366x900 (favicon-32x32.png is left out: it lives only in the repo root, not in out/, as sweep.mjs reports).
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
const waText = href => { try { return new URL(href).searchParams.get('text') ?? '' } catch { return '' } }
const ENQUIRY = name => `Hello VAN. I’d like a nutrition plan for my ${name}. My district and acres:`
const NAMES = { SHEIKHUPURA: 'Sheikhupura', FAISALABAD: 'Faisalabad', RYK: 'Rahim Yar Khan', 'D.G.KHAN': 'Dera Ghazi Khan', 'TOBA TEK SINGH': 'Toba Tek Singh', KASUR: 'Kasur', MULTAN: 'Multan' }

async function newPage(vp = { width: 412, height: 860 }, init) {
  const ctx = await browser.newContext({ viewport: vp, reducedMotion: 'reduce' })
  if (init) await ctx.addInitScript(init)
  const page = await ctx.newPage()
  page.setDefaultTimeout(20000)
  const errors = []
  page.on('console', m => { if (m.type() === 'error' && !/favicon-32x32/.test(m.location()?.url || '') && !/favicon-32x32/.test(m.text())) errors.push(m.text()) })
  page.on('pageerror', e => errors.push('pageerror ' + e.message))
  page.on('requestfailed', r => { if (!/favicon-32x32/.test(r.url())) errors.push('failed ' + r.url()) })
  page.on('response', r => { if (r.status() >= 400 && !/favicon-32x32/.test(r.url())) errors.push(r.status() + ' ' + r.url()) })
  return { ctx, page, errors }
}

/** The creator's rows as the screen shows them, and its WhatsApp text. */
async function creator(page) {
  return page.evaluate(() => {
    const root = document.getElementById('creator')
    if (!root) return null
    const ul = root.querySelector('ul')
    const rows = [...ul.querySelectorAll(':scope > li')].map(li => {
      const disp = li.querySelector('.display')
      const product = [...disp.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent).join('').trim()
      const qty = li.querySelector('.text-right .num').textContent.trim()
      const pack = li.querySelector('.min-w-0 .cap').textContent.replace(/ pack$/, '').trim()
      return { product, qty, pack }
    })
    const btn = [...root.querySelectorAll('a[href*="wa.me"]')].find(a => /Send this list on WhatsApp/.test(a.textContent))
    return { rows, href: btn ? btn.href : '' }
  })
}
const dockHref = page => page.evaluate(() => document.querySelector('.dock-bottom a.gold')?.getAttribute('href') ?? '')

// ── 1 and 2: the calculator's message and the bottom bar, wheat ─────────────────────────────────────────────────
console.log('\n1, 2 · wheat calculator message equals the screen; the bottom bar sends it')
{
  const { ctx, page } = await newPage()
  await page.goto(`${BASE}/crops/wheat.html`, { waitUntil: 'networkidle' })
  await page.waitForSelector('#creator ul li')
  check('wheat, nothing set: bar sends the plain enquiry', waText(await dockHref(page)) === ENQUIRY('wheat'), waText(await dockHref(page)))
  await ctx.close()
}
for (const key of ['SHEIKHUPURA', 'FAISALABAD', 'RYK', 'D.G.KHAN', 'TOBA TEK SINGH']) {
  for (const acres of [1, 3]) {
    const { ctx, page } = await newPage()
    await page.goto(`${BASE}/crops/wheat.html?district=${encodeURIComponent(key)}`, { waitUntil: 'networkidle' })
    await page.waitForSelector('#creator ul li')
    if (acres !== 1) { await page.fill('#creator input[aria-label="Acres"]', String(acres)); await page.waitForTimeout(150) }
    const c = await creator(page)
    const text = waText(c.href)
    const lines = text.split('\n').filter(l => l.startsWith('• '))
    const want = c.rows.map(r => `• ${r.product}, ${r.qty} × ${r.pack}`)
    const same = want.length === lines.length && want.every((w, i) => w === lines[i])
    check(`wheat ${key} ${acres} acre: ${want.length} rows in the message equal the screen`, same, `screen ${JSON.stringify(want)}\n         message ${JSON.stringify(lines)}`)
    check(`wheat ${key} ${acres} acre: names the district and the survey median`, text.includes(`My district: ${NAMES[key]}.`) && /district survey median/.test(text) && text.startsWith(`Hello VAN. My wheat plan for ${acres} acre${acres > 1 ? 's' : ''}:`), text)
    const dock = waText(await dockHref(page))
    check(`wheat ${key} ${acres} acre: the bar sends the same text`, dock === text, dock)
    await ctx.close()
  }
}
console.log('\n1 · potato, the same creator')
for (const key of ['KASUR', 'MULTAN']) {
  const { ctx, page } = await newPage()
  await page.goto(`${BASE}/crops/potato.html?district=${encodeURIComponent(key)}`, { waitUntil: 'networkidle' })
  await page.waitForSelector('#creator ul li')
  await page.fill('#creator input[aria-label="Acres"]', '3'); await page.waitForTimeout(150)
  const c = await creator(page)
  const text = waText(c.href)
  const lines = text.split('\n').filter(l => l.startsWith('• '))
  const want = c.rows.map(r => `• ${r.product}, ${r.qty} × ${r.pack}`)
  check(`potato ${key} 3 acres: message rows equal the screen`, want.length === lines.length && want.every((w, i) => w === lines[i]), `screen ${JSON.stringify(want)}\n         message ${JSON.stringify(lines)}`)
  check(`potato ${key}: the bar sends the same text`, waText(await dockHref(page)) === text)
  await ctx.close()
}

console.log('\n2 · a crop with no calculator: the bar sends the shopping list once set')
{
  const noCalc = fs.readdirSync(path.join(OUT, 'crops')).filter(f => f.endsWith('.html') && f !== 'index.html').find(f => !fs.readFileSync(path.join(OUT, 'crops', f), 'utf8').includes('id="creator"'))
  if (!noCalc) check('found a crop page with no calculator', false)
  else {
    const slug = noCalc.replace(/\.html$/, '')
    const { ctx, page } = await newPage()
    await page.goto(`${BASE}/crops/${noCalc}`, { waitUntil: 'networkidle' })
    await page.waitForSelector('#list')
    const name = await page.evaluate(() => document.querySelector('.dock-bottom a.gold span')?.textContent ?? '')
    const before = waText(await dockHref(page))
    check(`${slug}, nothing set: the bar sends the plain enquiry`, /^Hello VAN\. I’d like a nutrition plan for my .*\. My district and acres:$/.test(before), before)
    await page.click('#list button[aria-label="More acres"]'); await page.waitForTimeout(150)
    const list = await page.evaluate(() => [...document.querySelectorAll('#list a[href*="wa.me"]')].find(a => /Send this list on WhatsApp/.test(a.textContent))?.href ?? '')
    const after = waText(await dockHref(page))
    check(`${slug}, 2 acres set: the bar (${name}) sends the list's own text`, after === waText(list) && /for 2 acres/.test(after), after)
    await ctx.close()
  }
}

// ── 3: the upper list on wheat ─────────────────────────────────────────────────────────────────────────────────
console.log('\n3 · wheat upper list: labelled as the published plan, district filled')
{
  const { ctx, page } = await newPage()
  await page.goto(`${BASE}/crops/wheat.html?district=SHEIKHUPURA`, { waitUntil: 'networkidle' })
  await page.waitForSelector('#creator ul li')
  const up = await page.evaluate(() => {
    const a = [...document.querySelectorAll('#list a[href*="wa.me"]')][0]
    return { href: a?.href ?? '', label: a?.textContent ?? '', note: a?.closest('div')?.parentElement?.textContent ?? '' }
  })
  const text = waText(up.href)
  check('upper list message names VAN’s published plan', /VAN's published wheat plan/.test(text) && /\(The published plan, not adjusted for my soil\.\)/.test(text), text)
  check('upper list message carries the district', /My district: Sheikhupura\.$/.test(text), text)
  check('upper list button and the line under it say published', /published plan/i.test(up.label) && /published wheat plan/.test(up.note), up.label)
  const lower = waText((await creator(page)).href)
  check('the 2 messages can no longer be confused (upper says published, lower does not)', !/published/.test(lower))
  await ctx.close()
}

// ── 4, 5, 6: the soil screens ──────────────────────────────────────────────────────────────────────────────────
console.log('\n4, 5, 6 · soil card, the VAN message, Back, the bar on the Soil Atlas')
{
  const hook = () => {
    // Let the soil door play on the first visit (it skips under automation), so its Back rule is tested too.
    try { Object.defineProperty(Navigator.prototype, 'webdriver', { get: () => false }) } catch { /* */ }
    window.__card = []
    const fill = CanvasRenderingContext2D.prototype.fillText
    CanvasRenderingContext2D.prototype.fillText = function (t, x, y, ...r) { if (this.canvas && this.canvas.width === 1080) window.__card.push({ t: String(t), x, y }); return fill.call(this, t, x, y, ...r) }
  }
  const { ctx, page, errors } = await newPage({ width: 412, height: 860 }, hook)
  await page.goto(`${BASE}/soil.html?from=mitti`, { waitUntil: 'networkidle' })   // D-319: the door and the open screens are for campaign links
  const doorFirst = await page.evaluate(() => document.documentElement.className)
  check('first visit from a campaign link: the soil door plays', /sd-locked/.test(doorFirst) && !/sd-skip/.test(doorFirst), doorFirst)
  await page.click('#sd-go')
  await page.waitForSelector('#teesra-khata .tk-row')
  check('Soil Atlas bar before a district: My crop’s plan opens the crop list', /crops\/(index\.html)?$/.test(await dockHref(page)), await dockHref(page))
  await page.click('#teesra-khata .tk-row:has(.tk-en-name:text-is("Sheikhupura"))')
  await page.waitForSelector('text=Pick your tehsil')
  check('Soil Atlas bar after picking Sheikhupura: opens the wheat calculator with it', /crops\/wheat\.html\?district=SHEIKHUPURA$/.test(await dockHref(page)), await dockHref(page))
  await page.click('#teesra-khata .tk-list .tk-row >> nth=0')
  const tehsil = (await page.textContent('#teesra-khata .tk-list .tk-row.on .tk-en-name')).trim()
  await page.click('button.tk-btn:has-text("See your area")')
  await page.waitForSelector('#teesra-khata .tk-khata')
  const shown = await page.evaluate(() => [...document.querySelectorAll('#teesra-khata .tk-khata .tk-kr .tk-v')].slice(0, 7).map(el => [...el.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent).join('').trim()))
  check('square screen shows 7 readings (P, K, Zn, OM, B, pH, EC)', shown.length === 7 && shown.every(v => /\d/.test(v)), JSON.stringify(shown))
  await page.evaluate(() => { window.__card = [] })
  await page.click('button.tk-btn:has-text("Make my soil card")')
  await page.waitForSelector('img.tk-card[src^="data:image/png"]')
  const drawn = await page.evaluate(() => window.__card.map(c => c.t))
  const missing = shown.filter(v => !drawn.includes(v))
  check('soil card draws every value shown on the square screen, pH and EC included', missing.length === 0, `missing on the card: ${JSON.stringify(missing)}; drawn: ${JSON.stringify(drawn)}`)
  check('soil card has the pH row and the EC label', drawn.includes('pH') && drawn.includes('حل پذیر نمکیات کی مقدار'), JSON.stringify(drawn))
  const friends = await page.$('button.tk-wa:has-text("Send on WhatsApp")')
  check('share-to-friends button kept', !!friends)
  const van = await page.evaluate(() => [...document.querySelectorAll('#teesra-khata a[href^="https://wa.me/923005003041"]')].map(a => a.href)[0] ?? '')
  const vt = waText(van)
  const want = ['District: Sheikhupura', `Tehsil: ${tehsil}`, 'Area: a square of about 6,500 acres', ...shown.map(v => `: ${v}`)]
  const lack = want.filter(w => !vt.includes(w))
  check('a button sends the card to VAN (wa.me/923005003041)', !!van, van)
  check('the VAN message carries district, tehsil, square and every reading', !!van && lack.length === 0, `lacking ${JSON.stringify(lack)} in ${JSON.stringify(vt)}`)
  await page.click('button.tk-btn:has-text("See the wheat plan")')
  await page.waitForSelector('a.tk-btn[href*="wheat.html?district=SHEIKHUPURA"]')
  await Promise.all([page.waitForURL(/crops\/wheat\.html\?district=SHEIKHUPURA/), page.click('a.tk-btn[href*="wheat.html?district=SHEIKHUPURA"]')])
  await page.waitForSelector('#creator ul li')
  // D-316: the tehsil travels after a second '#', so the server never sees it, and the farmer's own message names it.
  {
    const loc = await page.evaluate(() => ({ search: location.search, hash: location.hash }))
    check('wheat link: the tehsil is not in the address the server sees', !/tehsil/i.test(loc.search), JSON.stringify(loc))
    check('wheat link: the tehsil rides after #, on the phone', /^#tehsil=/.test(loc.hash), JSON.stringify(loc))
    const wt = waText((await creator(page)).href)
    check(`wheat calculator message names the tehsil: "My district: Sheikhupura, tehsil ${tehsil}."`, wt.includes(`My district: Sheikhupura, tehsil ${tehsil}.`), wt)
  }
  await page.goBack({ waitUntil: 'networkidle' })
  await page.waitForSelector('#teesra-khata')
  await page.waitForTimeout(300)
  const after = await page.evaluate(() => ({ h: document.querySelector('#teesra-khata .tk-h')?.textContent ?? '', en: [...document.querySelectorAll('#teesra-khata .tk-en')].map(e => e.textContent).join(' | '), cls: document.documentElement.className }))
  check('Back from wheat: the soil screens are back on the plan step for Sheikhupura', after.h === 'اپنی مٹی کے حساب سے گندم کا پلان' && /Sheikhupura district/.test(after.en), JSON.stringify(after))
  check('Back from wheat: the soil door stays skipped', /sd-skip/.test(after.cls) && !/sd-locked/.test(after.cls), after.cls)
  try {
    await page.click('#teesra-khata .tk-link:has-text("←")', { timeout: 5000 })   // back one step, to the card
    await page.waitForSelector('img.tk-card[src^="data:image/png"]', { timeout: 5000 })
    check('…and one step back the card is there again, for the same square', (await page.evaluate(() => window.__card.map(c => c.t))).filter(t => shown.includes(t)).length === shown.length)
  } catch (e) { check('…and one step back the card is there again, for the same square', false, String(e).split('\n')[0]) }
  check('no console error or failed request on the soil path', errors.length === 0, errors.join(' | '))
  await ctx.close()
}

// ── 7b: D-319, a visitor without a campaign link ───────────────────────────────────────────────────────────────
console.log('\n7b · D-319 the Soil Atlas for a visitor without a campaign link, and the door skip on a laptop')
{
  const hook = () => { try { Object.defineProperty(Navigator.prototype, 'webdriver', { get: () => false }) } catch { /* */ } }
  for (const vp of [{ width: 412, height: 860 }, { width: 1366, height: 800 }]) {
    const { ctx, page, errors } = await newPage(vp, hook)
    await page.goto(`${BASE}/soil.html`, { waitUntil: 'networkidle' })
    const st = await page.evaluate(() => ({ cls: document.documentElement.className, folded: !!document.querySelector('#teesra-khata.tk-fold'), list: !!document.querySelector('#teesra-khata .tk-row'), mapTop: Math.round(document.getElementById('soil-map')?.getBoundingClientRect().top ?? 9999) }))
    check(`${vp.width}px, plain soil.html: no door`, /sd-skip/.test(st.cls) && !/sd-locked/.test(st.cls), st.cls)
    check(`${vp.width}px, plain soil.html: Teesra Khata folded, no district list`, st.folded && !st.list, JSON.stringify(st))
    check(`${vp.width}px, plain soil.html: the Soil Atlas map starts on the first screen`, st.mapTop < vp.height / 2, JSON.stringify(st))
    await page.click('#teesra-khata.tk-fold button')
    await page.waitForSelector('#teesra-khata .tk-row')
    check(`${vp.width}px, plain soil.html: the band opens the district list`, true)
    await page.click('#teesra-khata .tk-head .tk-link')
    await page.waitForSelector('#teesra-khata.tk-fold')
    check(`${vp.width}px: the skip line folds it again`, true)
    await page.goto(`${BASE}/soil.html?from=mitti`, { waitUntil: 'networkidle' })
    await page.waitForTimeout(4500)
    const box = await page.evaluate(() => { const r = document.getElementById('sd-map').getBoundingClientRect(); return { top: Math.round(r.top), bottom: Math.round(r.bottom), h: innerHeight, cls: document.documentElement.className } })
    check(`${vp.width}x${vp.height}, campaign link: the door plays and its skip is on screen`, /sd-locked/.test(box.cls) && box.bottom <= box.h && box.top >= 0, JSON.stringify(box))
    await page.click('#sd-map')
    await page.waitForSelector('#teesra-khata.tk-fold')
    check(`${vp.width}px: the door skip folds Teesra Khata`, true)
    check(`${vp.width}px: no console error or failed request`, errors.length === 0, errors.join(' | '))
    await ctx.close()
  }
  for (const [u, door] of [['/soil.html#caveats', false], ['/soil.html?rel=ph-p', false], ['/soil.html?district=lahore', false], ['/soil.html?from=x&district=LAHORE', false], ['/soil.html?from=mitti-wa', true], ['/soil.html?from=gps-wa', true]]) {
    const { ctx, page } = await newPage({ width: 412, height: 860 }, hook)
    await page.goto(`${BASE}${u}`, { waitUntil: 'networkidle' })
    const s = await page.evaluate(() => ({ cls: document.documentElement.className, folded: !!document.querySelector('#teesra-khata.tk-fold') }))
    check(`${u}: ${door ? 'the door plays and the screens are open' : 'no door, Teesra Khata folded'}`, door ? /sd-locked/.test(s.cls) && !s.folded : /sd-skip/.test(s.cls) && s.folded, JSON.stringify(s))
    await ctx.close()
  }
}

// ── 7c: D-320, the antitrust page, the published trial removed, the 4 new calculators ─────────────────────────
console.log('\n7c · D-320 how VAN competes, the published maize trial removed, 4 new calculators')
{
  const { ctx, page, errors } = await newPage({ width: 412, height: 860 })
  await page.goto(`${BASE}/index.html`, { waitUntil: 'networkidle' })
  const foot = await page.evaluate(() => { const a = [...document.querySelectorAll('.ft-bottom a')].find(x => x.textContent.trim() === 'How VAN competes'); const m = [...document.querySelectorAll('.ft-bottom span')].find(x => /CropLife Pakistan since 2024/.test(x.textContent)); return { href: a?.getAttribute('href') ?? '', next: !!(a && m && m.nextElementSibling === a) } })
  check('footer: "How VAN competes" sits right after the CropLife line and links to the page', /how-van-competes\.html$/.test(foot.href) && foot.next, JSON.stringify(foot))
  await page.goto(`${BASE}/how-van-competes.html`, { waitUntil: 'networkidle' })
  const t = await page.evaluate(() => document.querySelector('#root').innerText)
  for (const s of ['VAN sets its own prices and runs its own business. It does not agree any of it with a competitor.', 'CropLife Pakistan Antitrust Guidelines (revised October 2023)', 'Bids and tenders', 'leaves the meeting and says why.', 'Questions about how VAN competes: partner@van.com.pk'])
    check(`how-van-competes.html carries: "${s.slice(0, 60)}"`, t.includes(s))
  check('how-van-competes.html quotes no line of the confidential guidelines ("RED FLAGS", "Confidential", "DO NOT")', !/RED FLAGS|Confidential|DO NOT/.test(t))
  for (const u of ['/knowledge/application-systems.html', '/brands/vital-urea.html', '/knowledge/why-pakistan-must-shift.html']) {
    await page.goto(`${BASE}${u}`, { waitUntil: 'networkidle' })
    const x = await page.evaluate(() => document.querySelector('#root').innerText)
    check(`${u}: the published 2024 maize trial is gone (Planta Animalia, DK-6321, "replicated trial at VAN")`, !/Planta Animalia|DK-6321|replicated (field )?trial at VAN|The replicated trial|2 programmes of our own/.test(x))
  }
  for (const c of ['sugarcane', 'rice-hybrid', 'tomato', 'strawberry']) {
    await page.goto(`${BASE}/crops/${c}.html`, { waitUntil: 'networkidle' })
    check(`crops/${c}.html has a live calculator`, await page.waitForSelector('#creator ul li', { timeout: 10000 }).then(() => true).catch(() => false))
  }
  // Tahir, 27 Oct 2026: "Keep today's figures" on the live crops; "No table for these 4".
  const gap = async c => { await page.goto(`${BASE}/crops/${c}.html`, { waitUntil: 'networkidle' }); await page.waitForSelector('#creator ul li', { timeout: 10000 }).catch(() => {}); return page.evaluate(() => [...document.querySelectorAll('table.nc-gap tbody tr')].map(r => r.innerText.replace(/\s+/g, ' ').trim())) }
  for (const [c, want] of [['sesame', ['General recommended dose 34 23 12']], ['sugarcane-ratoon', ['Recommended, less fertile soil 150 90 65', 'Recommended, average fertile soil 134 74 65', 'Recommended, very fertile soil 113 60 49']], ['chickpea', ['General recommended dose 13 34 12']]]) {
    const rows = (await gap(c)).filter(r => !/^This plan/.test(r))
    check(`crops/${c}.html: the recommended dose table is today's (${want.length} row${want.length > 1 ? 's' : ''})`, JSON.stringify(rows) === JSON.stringify(want), JSON.stringify(rows))
  }
  for (const c of ['sugarcane', 'rice-hybrid', 'tomato', 'strawberry']) check(`crops/${c}.html: no recommended dose table`, (await gap(c)).length === 0)
  // D-321, 27 Oct 2026: Tahir's rulings brought the published plans and the calculator to the same products on these crops.
  for (const c of ['sugarcane', 'rice-hybrid', 'tomato', 'strawberry', 'maize', 'rice-basmati']) {
    await page.goto(`${BASE}/crops/${c}.html`, { waitUntil: 'networkidle' }); await page.waitForSelector('#creator ul li', { timeout: 10000 }).catch(() => {})
    const t = await page.evaluate(() => ({ notes: [...document.querySelectorAll('#creator p.cap')].map(x => x.innerText).join(' | '), npk: [...document.querySelectorAll('#creator .panel-soft .num')].slice(0, 3).map(x => x.innerText) }))
    check(`crops/${c}.html: N, P₂O₅ and K₂O are single figures and the panel says the plan gives the same totals`, t.npk.length === 3 && t.npk.every(v => !/–/.test(v)) && /plan gives the same totals\./.test(t.notes) && !/range shows|product lists differ|V.Zinc|after each picking/.test(t.notes), JSON.stringify(t).slice(0, 240))
  }
  // D-322, 27 Oct 2026 (Tahir: "take sunflower, mung and mash, and watermelon live now"): a live calculator, the same
  // totals as the published plan, and no recommended dose table (as for the 4 crops of D-320).
  for (const c of ['sunflower', 'mungbean-mash', 'watermelon']) {
    await page.goto(`${BASE}/crops/${c}.html`, { waitUntil: 'networkidle' })
    const live = await page.waitForSelector('#creator ul li', { timeout: 10000 }).then(() => true).catch(() => false)
    const t = await page.evaluate(() => ({ notes: [...document.querySelectorAll('#creator p.cap')].map(x => x.innerText).join(' | '), npk: [...document.querySelectorAll('#creator .panel-soft .num')].slice(0, 3).map(x => x.innerText), gap: document.querySelectorAll('table.nc-gap tbody tr').length }))
    check(`crops/${c}.html: live calculator, single N, P₂O₅ and K₂O figures, "plan gives the same totals", no recommended dose table`, live && t.npk.length === 3 && t.npk.every(v => !/–/.test(v)) && /plan gives the same totals\./.test(t.notes) && t.gap === 0, JSON.stringify(t).slice(0, 240))
  }
  check('no console error or failed request on these pages', errors.length === 0, errors.join(' | '))
  await ctx.close()
}

// ── 8: districts written the way people write them ─────────────────────────────────────────────────────────────
console.log('\n8 · ?district= in any case, with spaces or dots, or by name')
for (const [q, name] of [['sheikhupura', 'Sheikhupura'], ['d.g.%20khan', 'Dera Ghazi Khan'], ['DG-Khan', 'Dera Ghazi Khan'], ['rahim%20yar%20khan', 'Rahim Yar Khan'], ['Toba%20Tek%20Singh', 'Toba Tek Singh']]) {
  const { ctx, page } = await newPage()
  await page.goto(`${BASE}/crops/wheat.html?district=${q}`, { waitUntil: 'networkidle' })
  await page.waitForSelector('#creator ul li')
  const t = waText((await creator(page)).href)
  check(`crops/wheat.html?district=${decodeURIComponent(q)} fills ${name}`, t.includes(`My district: ${name}.`), t)
  await ctx.close()
}
for (const [q, name] of [['sheikhupura', 'Sheikhupura'], ['ryk', 'Rahim Yar Khan']]) {
  const { ctx, page } = await newPage()
  await page.goto(`${BASE}/soil.html?district=${q}&from=mitti`, { waitUntil: 'networkidle' })
  await page.waitForSelector('#teesra-khata')
  const en = await page.evaluate(() => [...document.querySelectorAll('#teesra-khata .tk-en')].map(e => e.textContent).join(' | '))
  check(`soil.html?district=${q}&from=mitti opens the khata of ${name}`, en.includes(`${name} ·`), en)
  await ctx.close()
}

// ── console errors and failed requests ─────────────────────────────────────────────────────────────────────────
console.log('\nconsole errors and failed requests')
for (const p of ['/soil.html', '/crops/wheat.html', '/crops/potato.html', '/index.html']) {
  for (const vp of [{ width: 412, height: 860, n: 'phone 412x860' }, { width: 1366, height: 900, n: 'desktop 1366x900' }]) {
    const { ctx, page, errors } = await newPage(vp)
    await page.goto(BASE + p, { waitUntil: 'networkidle' })
    await page.waitForTimeout(500)
    check(`${p} ${vp.n}: no console error, no failed request`, errors.length === 0, errors.join(' | '))
    await ctx.close()
  }
}

await browser.close()
server.close()
console.log(`\n${passed} passed, ${failed} failed`)
process.exit(failed ? 1 : 0)
