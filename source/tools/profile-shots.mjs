// D-147: screenshots of the company profile page at 390px and 1366px, cut into screen-height tiles,
// plus overflow / console / h1 / broken-link checks on the page itself. Usage: node tools/profile-shots.mjs [outdir]
import { chromium } from 'playwright'
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path'; import { fileURLToPath } from 'node:url'
const OUT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'out')
const DEST = process.argv[2] || '/tmp/profile-shots'
fs.mkdirSync(DEST, { recursive: true })
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.pdf': 'application/pdf', '.jpg': 'image/jpeg', '.webp': 'image/webp' }
const srv = http.createServer((q, r) => { const u = decodeURIComponent(q.url.split('?')[0]); const f = path.join(OUT, u === '/' ? 'index.html' : u); if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) { r.writeHead(404); r.end(); return } r.writeHead(200, { 'content-type': MIME[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(r) })
await new Promise(r => srv.listen(0, r)); const port = srv.address().port
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' })
let bad = 0
for (const w of [390, 1366]) {
  const ctx = await b.newContext({ viewport: { width: w, height: 900 }, reducedMotion: 'reduce' })
  await ctx.route('**/*', r => r.request().url().startsWith(`http://localhost:${port}`) || r.request().url().startsWith('data:') ? r.continue() : r.abort())
  const pg = await ctx.newPage(); const errs = []
  pg.on('console', e => { if (e.type() === 'error') errs.push(e.text()) }); pg.on('pageerror', e => errs.push(String(e)))
  await pg.goto(`http://localhost:${port}/company-profile.html`, { waitUntil: 'networkidle' }); await pg.waitForTimeout(400)
  const info = await pg.evaluate(() => ({ o: document.documentElement.scrollWidth - document.documentElement.clientWidth, h1: document.querySelectorAll('h1').length, h: document.body.scrollHeight,
    pdf: [...document.querySelectorAll('a[download]')].map(a => a.getAttribute('href')),
    wide: [...document.querySelectorAll('main *')].filter(el => { const r = el.getBoundingClientRect(); return r.right > document.documentElement.clientWidth + 1 && getComputedStyle(el).position !== 'fixed' && !el.closest('.tbl-scroll,.sc-wrap,.pnav') }).slice(0, 5).map(el => el.tagName + '.' + el.className) }))
  const pdf = await pg.evaluate(async (u) => (await fetch(u)).status, info.pdf[0])
  console.log(w, JSON.stringify(info), 'pdf status', pdf, errs.length ? 'ERRORS ' + errs.join(' | ') : 'no console errors')
  if (info.o > 1 || info.h1 !== 1 || errs.length || pdf !== 200 || info.wide.length) bad++
  const tile = w < 600 ? 1400 : 1000
  for (let y = 0, i = 0; y < info.h; y += tile, i++) {
    await pg.screenshot({ path: `${DEST}/p${w}-${String(i).padStart(2, '0')}.png`, clip: { x: 0, y, width: w, height: Math.min(tile, info.h - y) }, fullPage: true })
  }
  await ctx.close()
}
await b.close(); srv.close()
console.log(bad ? `${bad} PROBLEMS` : 'profile page clean at 390 and 1366')
process.exit(bad ? 1 : 0)
