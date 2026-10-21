/** GRADE SEARCH CHECK, 21 Oct 2026 (D-287). `node searchtest.mjs`: typing a grade with hyphens, dots or colons finds the same products. */
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path'; import { fileURLToPath } from 'node:url'; import { chromium } from 'playwright'
const ROOT = path.dirname(fileURLToPath(import.meta.url)), OUT = process.env.OUT || path.join(ROOT, 'out')
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp', '.woff2': 'font/woff2', '.json': 'application/json', '.ico': 'image/x-icon' }
let passed = 0, failed = 0
const check = (l, ok, d = '') => { ok ? passed++ : failed++; console.log(`${ok ? '  ok  ' : '  FAIL'} ${l}${!ok && d ? '\n         ' + d : ''}`) }
const server = http.createServer((q, r) => { const u = decodeURIComponent(q.url.split('?')[0]); const f = path.join(OUT, u === '/' ? 'index.html' : u); if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) { r.writeHead(404); r.end(); return } r.writeHead(200, { 'content-type': MIME[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(r) })
await new Promise(r => server.listen(0, r))
const browser = await chromium.launch({ executablePath: process.env.CHROME || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' })
const page = await browser.newPage({ viewport: { width: 1366, height: 900 } })
await page.goto(`http://127.0.0.1:${server.address().port}/brands/index.html`, { waitUntil: 'networkidle' })
const box = page.locator('input[aria-label="Search products"]')
const rows = async () => (await page.locator('main a[href*="/brands/"]').evaluateAll(a => [...new Set(a.map(x => x.getAttribute('href')))].filter(h => !/\/brands\/(index)?(\.html)?$/.test(h)).sort().join('|')))
const results = {}
for (const t of ['10:44:0', '10-44-0', '10.44.0']) { await box.fill(t); await page.waitForTimeout(400); results[t] = await rows() }
check('10:44:0 finds V-Phosphate', /phosphate/i.test(results['10:44:0']), results['10:44:0'])
check('10-44-0 finds the same products as 10:44:0', results['10-44-0'] === results['10:44:0'] && results['10:44:0'] !== '', results['10-44-0'])
check('10.44.0 finds the same products as 10:44:0', results['10.44.0'] === results['10:44:0'])
await browser.close(); server.close()
console.log(`\n${passed} passed, ${failed} failed`); process.exit(failed ? 1 : 0)
