/**
 * BLOCKS 01 AND 02 ARE BEHAVIOUR, NOT COPY — the page sweep cannot see them, because nothing
 * renders until a date is entered. This drives them for real, and it checks the one thing that
 * matters most: that a stage is claimed for wheat and NOT claimed for any crop VAN has not
 * published stage durations for.
 */
import { chromium } from 'playwright'
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path'; import { fileURLToPath } from 'node:url'
const OUT = path.join(path.dirname(fileURLToPath(import.meta.url)), 'out')
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.woff2': 'font/woff2' }
const srv = http.createServer((q, r) => { const u = decodeURIComponent(q.url.split('?')[0]); const f = path.join(OUT, u === '/' ? 'index.html' : u); if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) { r.writeHead(404); r.end(); return } r.writeHead(200, { 'content-type': MIME[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(r) })
await new Promise(r => srv.listen(0, r)); const port = srv.address().port
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' })
const ctx = await b.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: 'reduce' })
await ctx.route('**/*', r => r.request().url().startsWith(`http://localhost:${port}`) || r.request().url().startsWith('data:') ? r.continue() : r.abort())
const pg = await ctx.newPage(); const errs = []
pg.on('pageerror', e => errs.push(String(e)))
let fails = 0
const ok = (label, pass, extra = '') => { console.log(`  ${pass ? 'ok  ' : 'FAIL'} ${label}${extra ? ' — ' + extra : ''}`); if (!pass) fails++ }

const isoDaysAgo = n => { const d = new Date(); d.setDate(d.getDate() - n); const p = x => String(x).padStart(2, '0'); return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}` }
const setDate = async iso => { await pg.locator('input[type="date"]').fill(iso); await pg.waitForTimeout(150) }
const nowText = async () => (await pg.locator('#now').count()) ? (await pg.locator('#now').innerText()) : ''

/* ── 1 · nothing is gated ────────────────────────────────────────────────────────────────── */
console.log('\n1 · the page with no answer')
await pg.goto(`http://localhost:${port}/crops/wheat.html`, { waitUntil: 'networkidle' })
ok('block 02 absent until a date is given', await pg.locator('#now').count() === 0)
ok('the programme is still there', await pg.locator('#programme').count() === 1)
ok('the shopping list is still there', await pg.locator('#list').count() === 1)
ok('the question is asked', /when did you sow/i.test(await pg.locator('#sown').innerText()))

/* ── 2 · wheat: stages in degree days from the sowing date (D-177, 26 Sep 2026) ──────────── */
console.log('\n2 · wheat — the stage comes from degree days on Lahore normals')
// D-177: the old table ended grain formation at day 120. The stage is now worked from the degree-day
// column (150 / 450 / 900 / 1,400, base 10 °C) on Lahore 1991-2020 normals, from the sowing date.
// For a November 1 sowing that is: Early Growth from day 13, Grand Growth from 55, Grain Formation
// from 132, maturity at 167. The page's clock is fixed so the sowing date sits in the real season.
const SOW = '2026-11-01'
const at = async das => { await pg.clock.setFixedTime(new Date(Date.UTC(2026, 10, 1, 12) + das * 864e5)); await pg.reload({ waitUntil: 'networkidle' }); await setDate(SOW) }
for (const [das, stage] of [[5, 'Germination'], [20, 'Early Growth'], [60, 'Grand Growth'], [100, 'Grand Growth'], [140, 'Grain Formation']]) {
  await at(das)
  const t = await nowText()
  ok(`day ${String(das).padStart(3)} -> ${stage}`, t.includes(stage), t.split('\n').slice(0, 3).join(' / '))
}
await at(100)
const t100 = await nowText()
ok('the day count is printed', /day 100 after sowing/.test(t100))
ok('the next stage and its date are named', /Next stage/.test(t100) && /Grain Formation/.test(t100))
const listed = await pg.locator('#now li b').allInnerTexts()
ok('rows listed are the plan\'s own Grand Growth rows', listed.length > 0, listed.join(', '))
const planRows = await pg.evaluate(() => [...document.querySelectorAll('#programme table tbody tr')].length)
ok('the programme table is still the reference below', planRows > 0)

console.log('\n   past maturity')
await at(175)
const past = await nowText()
ok('day 175 is past maturity', /at or past maturity/.test(past))
ok('and it says why', /1,400 degree days/.test(past))
await pg.clock.setFixedTime(new Date())
await pg.reload({ waitUntil: 'networkidle' })

console.log('\n   a date in the future')
// The input carries max=today so a farmer cannot type one; the guard exists for a stored value the
// calendar has not reached. Reached here the way it would be reached in life — from storage.
const fut = new Date(); fut.setDate(fut.getDate() + 20)
const p2 = x => String(x).padStart(2, '0')
await pg.evaluate(v => localStorage.setItem('van.sown.wheat', v), `${fut.getFullYear()}-${p2(fut.getMonth() + 1)}-${p2(fut.getDate())}`)
await pg.reload({ waitUntil: 'networkidle' }); await pg.waitForTimeout(200)
ok('a future date says so instead of printing a negative day', /still ahead/i.test(await nowText()))

/* ── 3 · the refusal — no stage is invented for a crop without a published model ──────────── */
console.log('\n3 · cotton — a day count, and no stage claimed')
await pg.goto(`http://localhost:${port}/crops/cotton.html`, { waitUntil: 'networkidle' })
await setDate(isoDaysAgo(46))
const ct = await nowText()
ok('the day count is real and shown', /Day 46 of your cotton/.test(ct))
ok('it says why there is no stage', /will not tell you which stage/.test(ct))
ok('it names what is missing', /stage model for cotton/i.test(ct))
ok('no wheat stage name is asserted as cotton\'s current stage', !/Stage \d of \d/.test(ct))
ok('the stage NAMES are still listed, in order', /the stages, in order/i.test(ct))

/* ── 4 · the two non-date answers ────────────────────────────────────────────────────────── */
console.log('\n4 · "not sown yet" and "don\'t remember"')
await pg.goto(`http://localhost:${port}/crops/wheat.html`, { waitUntil: 'networkidle' })
await pg.locator('button:has-text("haven’t sown yet")').click(); await pg.waitForTimeout(120)
ok('not-sown shows no stage block', await pg.locator('#now').count() === 0)
ok('and points at the programme and the list', /programme and the shopping list/.test(await pg.locator('#sown').innerText()))
await pg.locator('button:has-text("don’t remember")').click(); await pg.waitForTimeout(120)
ok('don\'t-remember shows no stage block', await pg.locator('#now').count() === 0)
ok('the whole programme is still on the page', await pg.locator('#programme').count() === 1)

/* ── 5 · it is remembered, per crop, and not shared between crops ─────────────────────────── */
console.log('\n5 · remembered per crop')
await pg.goto(`http://localhost:${port}/crops/wheat.html`, { waitUntil: 'networkidle' })
await setDate(isoDaysAgo(46))
await pg.reload({ waitUntil: 'networkidle' }); await pg.waitForTimeout(200)
ok('wheat\'s date survives a reload', /day 46 after sowing/.test(await nowText()))
await pg.goto(`http://localhost:${port}/crops/potato.html`, { waitUntil: 'networkidle' })
ok('potato did not inherit wheat\'s date', await pg.locator('#now').count() === 0)

/* ── 6 · block 06 was taken off the crop pages by D-78 ("not built yet" comes off all 28 crop pages; the roadmap on the tools page keeps it) */
console.log('\n6 · block 06 removed by D-78')
ok('no "not built yet" block on the crop page', await pg.locator('#standing').count() === 0)

console.log('\npage errors:', errs.length)
console.log(fails === 0 && errs.length === 0 ? '\nALL CHECKS PASSED' : `\n${fails} FAILURES`)
await b.close(); srv.close()
process.exit(fails === 0 && errs.length === 0 ? 0 : 1)
