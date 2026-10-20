/**
 * GPS GRID CARD, THE EXTREME CASES SIDE BY SIDE, 20 Oct 2026 (D-279; Tahir's ruling 11: he checks these himself before
 * anything goes live). Run after the build: `node gpsextremes.mjs <extremes.json> <out.md>`.
 * For each case, the wheat calculator at 1 acre twice, as the farmer would open it: by the soil card (line 13) and by
 * the district (the Teesra Khata plan button). Prints and writes a table: each product's quantity by card and by district.
 * 20 Oct 2026: the card opens the calculator as the site's own link now does, crops/wheat.html#card=d=KEY;r=...;n=...
 * (after '#', D-279); the cases include each district's widest card (G5, out to 50 km).
 */
import { chromium } from 'playwright'
import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
const ROOT = path.dirname(fileURLToPath(import.meta.url))
const OUT = path.join(ROOT, 'out')
const [CASES, MD] = process.argv.slice(2)
const CHROME = process.env.CHROME || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.woff2': 'font/woff2', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp' }
const server = http.createServer((req, res) => {
  const u = decodeURIComponent(req.url.split('?')[0]); const f = path.join(OUT, u === '/' ? 'index.html' : u)
  if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); res.end(); return }
  res.writeHead(200, { 'content-type': MIME[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(res)
})
await new Promise(r => server.listen(0, r))
const BASE = `http://localhost:${server.address().port}`
const browser = await chromium.launch({ executablePath: CHROME })
const page = await (await browser.newContext({ viewport: { width: 1366, height: 900 } })).newPage()
const plan = async (url) => {
  await page.goto(url, { waitUntil: 'networkidle' })
  await page.waitForSelector('#creator ul li')
  return page.evaluate(() => {
    const prods = Object.fromEntries([...document.querySelector('#creator ul').querySelectorAll(':scope > li')].map(li => {
      const q = li.querySelector('.text-right .num')?.textContent.trim() ?? ''
      const name = li.querySelector('.font-bold, b, strong')?.textContent.trim() ?? li.innerText.split('\n')[0]
      return [name, q]
    }))
    // The band each soil row landed in: the pressed band button, its aria-label is "<reading>: <band>".
    const bands = Object.fromEntries([...document.querySelectorAll('#creator button[aria-pressed="true"]')]
      .map(b => b.getAttribute('aria-label') || '').filter(l => l.includes(': ')).map(l => l.split(': ')))
    return { prods, bands }
  })
}
const NAMES = { SHEIKHUPURA: 'Sheikhupura', RYK: 'Rahim Yar Khan', FAISALABAD: 'Faisalabad', BHAWALPUR: 'Bahawalpur' }
const cases = JSON.parse(fs.readFileSync(CASES, 'utf8'))
const md = ['# GPS grid card: the extreme cases, card plan against district plan', '',
  'Wheat calculator, 1 acre, as the farmer opens it: by the soil card (line 13, the readings of the card for the area near his land, first ready radius) and by the district (the Teesra Khata plan button). Built 20 Oct 2026 from the E: survey (M1). For Tahir\'s own check before anything goes live (ruling 11). Quantities are packs per acre as the calculator prints them.', '']
for (const c of cases) {
  const parts = [`d=${encodeURIComponent(c.district)}`, `r=${c.r}`, `n=${c.n}`, ...Object.entries(c.vals).filter(([, v]) => v != null).map(([k, v]) => `${k}=${+v.toFixed(3)}`)]
  const C = await plan(`${BASE}/crops/wheat.html#card=${parts.join(';')}`)
  const D = await plan(`${BASE}/crops/wheat.html?district=${encodeURIComponent(c.district)}`)
  const byCard = C.prods, byDist = D.prods
  const rows = [...new Set([...Object.keys(D.bands), ...Object.keys(C.bands)])]
  const prods = [...new Set([...Object.keys(byDist), ...Object.keys(byCard)])]
  const v = c.vals
  md.push(`## ${NAMES[c.district] ?? c.district}: ${c.what}`, '',
    `Card point ${c.lat} N, ${c.lon} E, named for Union Council ${c.uc}, tehsil ${c.tehsil}${c.far > 5 ? ` (its nearest survey samples are about ${c.far} km away)` : ''}. Card: ${c.n} samples within ${c.r} km. P ${v.p} ppm, K ${v.k} ppm, Zn ${v.zn ?? 'blank'} ppm, OM ${v.om} %, B ${v.b} ppm, pH ${v.ph}, EC ${v.ec} dS/m, Fe ${v.fe ?? 'blank'}, Cu ${v.cu ?? 'blank'}, Mn ${v.mn ?? 'blank'} ppm.`, '',
    '| Product | By the soil card | By the district | Changes |', '|---|---|---|---|',
    ...prods.map(p => `| ${p} | ${byCard[p] ?? '0'} | ${byDist[p] ?? '0'} | ${(byCard[p] ?? '0') === (byDist[p] ?? '0') ? '' : 'yes'} |`), '',
    'The band each soil row landed in:', '', '| Soil row | By the soil card | By the district |', '|---|---|---|',
    ...rows.map(r => `| ${r} | ${C.bands[r] ?? 'blank'} | ${D.bands[r] ?? 'blank'} |`), '')
  console.log(c.district, c.what, JSON.stringify(C.bands), JSON.stringify(D.bands))
}
fs.writeFileSync(MD, md.join('\n'))
await browser.close(); server.close()
