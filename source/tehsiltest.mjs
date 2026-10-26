/**
 * TEHSIL IN THE LINK CHECK, 21 Oct 2026 (D-283). Run after the build: `node tehsiltest.mjs`.
 * Serves out/ over http and checks, in a real phone-size browser, that soil.html?district=D&tehsil=T&from=mitti opens
 * the Soil Atlas farmer screens at that tehsil, that a wrong or unmatched tehsil is ignored, and that the WhatsApp link
 * the card shares carries the tehsil and opens at the same tehsil again.
 */
import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'
const ROOT = path.dirname(fileURLToPath(import.meta.url))
const OUT = process.env.OUT || path.join(ROOT, 'out')
const CHROME = process.env.CHROME || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.woff2': 'font/woff2', '.json': 'application/json', '.pdf': 'application/pdf', '.ico': 'image/x-icon' }
let passed = 0, failed = 0
const check = (label, ok, detail = '') => { if (ok) passed++; else failed++; console.log(`${ok ? '  ok  ' : '  FAIL'} ${label}${!ok && detail ? '\n         ' + detail : ''}`) }
const server = http.createServer((req, res) => {
  const u = decodeURIComponent(req.url.split('?')[0])
  const f = path.join(OUT, u === '/' ? 'index.html' : u)
  if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); res.end('not found'); return }
  res.writeHead(200, { 'content-type': MIME[path.extname(f)] || 'application/octet-stream' })
  fs.createReadStream(f).pipe(res)
})
await new Promise(r => server.listen(0, r))
const BASE = process.env.BASE_URL || `http://127.0.0.1:${server.address().port}`
const browser = await chromium.launch({ executablePath: CHROME })
async function open(search, vp = { width: 390, height: 844 }) {
  const ctx = await browser.newContext({ viewport: vp, isMobile: true, hasTouch: true, reducedMotion: 'reduce', locale: 'ur-PK' })
  const page = await ctx.newPage(); page.setDefaultTimeout(20000)
  const errors = []
  page.on('pageerror', e => errors.push('pageerror ' + e.message))
  page.on('console', m => { if (m.type() === 'error' && !/favicon-32x32/.test(m.location()?.url || '') && !/favicon-32x32/.test(m.text())) errors.push(m.text()) })
  await page.goto(`${BASE}/soil.html${search}`, { waitUntil: 'networkidle' })
  await page.waitForSelector('#teesra-khata .tk-screen')
  await page.waitForTimeout(500)
  return { ctx, page, errors }
}
/** What the farmer screen shows: the picked tehsil's row (if any), whether the district's tehsil list is on screen, whether the district list is. */
const state = page => page.evaluate(() => {
  const on = [...document.querySelectorAll('#teesra-khata .tk-row.on')].map(b => (b.querySelector('.tk-en-name')?.textContent || '').trim() + '|' + (b.querySelector('.cap.num')?.textContent || '').trim())
  const rows = [...document.querySelectorAll('#teesra-khata .tk-row')].length
  const seeArea = [...document.querySelectorAll('#teesra-khata button')].some(b => /See your area/.test(b.textContent || ''))
  const districtList = [...document.querySelectorAll('#teesra-khata .tk-row')].some(b => /Attock/.test(b.textContent || ''))
  const gps = !!document.querySelector('#gps-card')
  return { on, rows, seeArea, districtList, gps }
})

console.log('\n1 · a link with district and tehsil opens at that tehsil')
{
  const { ctx, page, errors } = await open('?district=SHEIKHUPURA&tehsil=Muridke&from=mitti')
  const s = await state(page)
  check('Muridke is the picked row (4,316 samples)', s.on.length === 1 && s.on[0] === 'Muridke|4,316 samples', JSON.stringify(s))
  check('the GPS card section for the tehsil is on screen', s.gps, JSON.stringify(s))
  check('no console error', errors.length === 0, errors.join(' | '))
  await ctx.close()
}
console.log('\n2 · matching: case, spaces, dots; names that repeat across districts')
{
  for (const [q, want] of [
    ['?district=SHEIKHUPURA&tehsil=muridke&from=mitti', 'Muridke|4,316 samples'],
    ['?district=SHEIKHUPURA&tehsil=MURIDKE&from=mitti', 'Muridke|4,316 samples'],
    ['?district=JHELUM&tehsil=Pind%20Dadan%20Khan&from=mitti', 'Pind Dadan Khan|3,450 samples'],
    ['?district=JHELUM&tehsil=pind-dadan-khan&from=mitti', 'Pind Dadan Khan|3,450 samples'],
    ['?district=SARGODHA&tehsil=Sahiwal&from=mitti', 'Sahiwal|5,495 samples'],
    ['?district=SAHIWAL&tehsil=Sahiwal&from=mitti', 'Sahiwal|11,552 samples'],
    ['?district=LAHORE&tehsil=Lahore%20City&from=mitti', 'Lahore City|9,294 samples'],
    ['?district=D.G.KHAN&tehsil=Dera%20Ghazi%20Khan&from=mitti', 'Dera Ghazi Khan|9,675 samples'],
  ]) {
    const { ctx, page } = await open(q)
    const s = await state(page)
    check(`${q} -> ${want}`, s.on.length === 1 && s.on[0] === want, JSON.stringify(s))
    await ctx.close()
  }
}
console.log('\n3 · an unmatched or wrong tehsil is ignored; the district screen opens as before')
{
  for (const q of [
    '?district=SHEIKHUPURA&tehsil=Daska&from=mitti',
    '?district=SHEIKHUPURA&tehsil=&from=mitti',
    '?district=SHEIKHUPURA&tehsil=Nowhere&from=mitti',
    '?district=SHEIKHUPURA&tehsil=%3Cscript%3Ealert(1)%3C%2Fscript%3E&from=mitti',
    '?district=LAHORE&tehsil=Lahore&from=mitti',
  ]) {
    const { ctx, page, errors } = await open(q)
    const s = await state(page)
    check(`${q}: no tehsil picked, the district's tehsil list shows`, s.on.length === 0 && s.rows >= 4 && !s.districtList, JSON.stringify(s))
    check('  no console error', errors.length === 0, errors.join(' | '))
    await ctx.close()
  }
  const a = await open('?tehsil=Muridke&from=mitti')
  const sa = await state(a.page)
  check('a tehsil with no district is ignored: the district list shows', sa.on.length === 0 && sa.districtList, JSON.stringify(sa))
  await a.ctx.close()
  const b = await open('?district=SHEIKHUPURA&from=mitti')
  const sb = await state(b.page)
  check('a link without a tehsil behaves as before: the tehsil list, none picked', sb.on.length === 0 && sb.rows >= 4 && !sb.districtList, JSON.stringify(sb))
  await b.ctx.close()
}
console.log('\n4 · the shared WhatsApp link carries the tehsil, and opens at it again')
{
  const { ctx, page } = await open('?district=SHEIKHUPURA&tehsil=Muridke&from=mitti')
  await page.locator('#teesra-khata button:has-text("See your area")').first().tap()
  await page.waitForTimeout(600)
  await page.locator('#teesra-khata button:has-text("Make my soil card")').first().tap()
  await page.waitForSelector('#teesra-khata img.tk-card')
  const popup = ctx.waitForEvent('page')
  await page.locator('#teesra-khata button.tk-wa').first().tap()
  const wa = await popup
  const url = new URL(wa.url())
  const text = url.searchParams.get('text') || ''
  const link = (text.match(/https:\/\/www\.van\.com\.pk\/soil\.html\?[^\s]+/) || [''])[0]
  check('the message holds the link with district, tehsil and from=mitti-wa', link === 'https://www.van.com.pk/soil.html?district=SHEIKHUPURA&tehsil=Muridke&from=mitti-wa', link)
  check('the message still names the tehsil in Urdu', /مریدکے/.test(text), text)
  await wa.close()
  const { ctx: c2, page: p2 } = await open(link.replace('https://www.van.com.pk/soil.html', ''))
  const s = await state(p2)
  check('opening that link lands on Muridke again', s.on.length === 1 && s.on[0] === 'Muridke|4,316 samples', JSON.stringify(s))
  await c2.close(); await ctx.close()
}
console.log('\n5 · taps from the link to the WhatsApp button (a phone)')
{
  const { ctx, page } = await open('?district=SHEIKHUPURA&tehsil=Muridke&from=mitti')
  let taps = 0
  const tap = async sel => { await page.locator(sel).first().tap(); taps++; await page.waitForTimeout(700) }
  await tap('#teesra-khata button:has-text("See your area")')
  await tap('#teesra-khata button:has-text("Make my soil card")')
  await page.waitForSelector('#teesra-khata a.tk-wa-van')
  await tap('#teesra-khata a.tk-wa-van')
  check('3 taps from the link to "Send my soil card to VAN" (it was 4)', taps === 3, String(taps))
  await ctx.close()
}
console.log('\n6 · C1: the wheat bundle screen says the calculator can differ (D-284), once, beside the bundle')
{
  // D-313 (Tahir, 24 to 25 Oct 2026): the bundle is the minimum; the calculator's plan is VAN's recommended plan
  const LINE = 'The bundle is VAN’s minimum for this season. The calculator below uses VAN’s recommended wheat plan, so its Green Phosphate is a different figure.'
  for (const [q, label] of [['?district=SHEIKHUPURA&tehsil=Muridke&from=mitti', 'Sheikhupura (phosphorus short)'], ['?district=KASUR&tehsil=Kasur&from=mitti', 'Kasur (phosphorus not short)'], ['?district=SHEIKHUPURA&from=mitti&tehsil=Muridke', 'parameters in another order']]) {
    const { ctx, page, errors } = await open(q)
    await page.locator('#teesra-khata button:has-text("See your area")').first().tap(); await page.waitForTimeout(500)
    await page.locator('#teesra-khata button:has-text("Make my soil card")').first().tap(); await page.waitForTimeout(500)
    await page.locator('#teesra-khata button:has-text("See the wheat plan by your soil")').first().tap(); await page.waitForSelector('#teesra-khata .tk-bundle')
    const r = await page.evaluate(() => {
      const b = document.querySelector('#teesra-khata .tk-bundle')
      const m = [...document.querySelectorAll('#teesra-khata [data-bundle-vs-calc]')]
      const calc = document.querySelector('#teesra-khata .tk-calc')
      const order = m[0] && b && calc ? !!(b.compareDocumentPosition(m[0]) & Node.DOCUMENT_POSITION_CONTAINED_BY) && !!(m[0].compareDocumentPosition(calc) & Node.DOCUMENT_POSITION_FOLLOWING) : false
      return { n: m.length, text: m[0]?.textContent?.trim() ?? '', order, bundleText: b?.textContent ?? '', px: m[0] ? Math.round(m[0].getBoundingClientRect().width) : 0, vw: window.innerWidth, sw: document.documentElement.scrollWidth }
    })
    check(`${label}: the line is there once, with Tahir's wording B`, r.n === 1 && r.text === LINE, JSON.stringify(r))
    check(`${label}: it sits inside the bundle box, before the calculator box`, r.order, JSON.stringify(r))
    check(`${label}: the bundle's own 35, 25 and 10 kg rows are unchanged`, /Green Phosphate35 kg/.test(r.bundleText) && /Vital Urea25 kg/.test(r.bundleText) && /Vital Potash10 kg/.test(r.bundleText), r.bundleText)
    check(`${label}: no sideways scroll on a phone`, r.sw <= r.vw, JSON.stringify(r))
    check(`${label}: no console error`, errors.length === 0, errors.join(' | '))
    await ctx.close()
  }
  const { ctx, page } = await open('?district=SHEIKHUPURA&tehsil=Muridke&from=mitti')
  await page.locator('#teesra-khata button:has-text("See your area")').first().tap(); await page.waitForTimeout(500)
  await page.locator('#teesra-khata button:has-text("Make my soil card")').first().tap(); await page.waitForTimeout(500)
  await page.locator('#teesra-khata button:has-text("See the wheat plan by your soil")').first().tap(); await page.waitForSelector('#teesra-khata .tk-bundle')
  const t = await page.locator('#teesra-khata .tk-bundle').innerText()
  check('Sheikhupura still shows the 50 kg (1 bag) phosphorus line, unchanged', /goes up to 50 kg \(1 bag\)/.test(t), t)
  await ctx.close()
}
console.log('\n7 · Back and Forward keep the place, and the link\'s tehsil does not override it (D-265 with D-283)')
{
  const { ctx, page } = await open('?district=SHEIKHUPURA&tehsil=Muridke&from=mitti')
  await page.locator('#teesra-khata button:has-text("See your area")').first().tap(); await page.waitForTimeout(600)
  const onSquare = await page.locator('#teesra-khata canvas.tk-map').count()
  await page.goto(`${BASE}/crops/wheat.html`, { waitUntil: 'networkidle' })
  await page.goBack({ waitUntil: 'networkidle' })
  await page.waitForSelector('#teesra-khata .tk-screen'); await page.waitForTimeout(800)
  const after = await page.evaluate(() => ({ map: document.querySelectorAll('#teesra-khata canvas.tk-map').length, make: [...document.querySelectorAll('#teesra-khata button')].some(b => /Make my soil card/.test(b.textContent || '')) }))
  check('on the square step before leaving', onSquare === 1)
  check('Back from the wheat page returns to the square step of the same place (not the link\'s first screen)', after.map === 1 && after.make, JSON.stringify(after))
  await page.locator('#teesra-khata button:has-text("Make my soil card")').first().tap(); await page.waitForTimeout(600)
  const wa = await page.evaluate(() => [...document.querySelectorAll('#teesra-khata a')].map(a => a.href).find(h => /wa\.me/.test(h)) || '')
  const vtext = decodeURIComponent((wa.split('text=')[1] || ''))
  check('the card made after Back is still for Muridke in Sheikhupura', /District: Sheikhupura/.test(vtext) && /Tehsil: Muridke/.test(vtext), vtext.slice(0, 200))
  await ctx.close()
}
await browser.close(); server.close()
console.log(`\n${passed} passed, ${failed} failed`)
process.exit(failed ? 1 : 0)
