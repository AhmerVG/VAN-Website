/**
 * FULL-SITE SWEEP — run after every build, before shipping the zip.
 *
 * Kept in the repo from 9 Sep 2026 (D-48). Earlier sessions wrote this check ad hoc and threw it
 * away each time, which meant the same regressions had to be re-found by hand. It serves out/ over
 * http and, for every built page at two viewports, asserts:
 *   · no horizontal overflow (the page body must never scroll sideways)
 *   · no console errors
 *   · no failed requests (a 404 on an asset or a link target)
 *   · exactly one h1, and it is not empty
 *   · no broken images
 *   · the page is styled (a real background colour, not the browser default) — this is what caught
 *     the absolute-path bug that made the unzipped folder render as bare HTML
 *   · no rupee figure in the page SOURCE (Tahir's pricing ruling: a price may only appear after the
 *     farmer presses "What will this cost me?", so it must not exist in any built file)
 *
 * Usage: node sweep.mjs
 */
import { chromium } from 'playwright'
import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.dirname(fileURLToPath(import.meta.url))
const OUT = path.join(ROOT, 'out')
const CHROME = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.woff2': 'font/woff2', '.json': 'application/json', '.xml': 'application/xml', '.txt': 'text/plain', '.ico': 'image/x-icon' }

const files = []
;(function walk(d) {
  for (const f of fs.readdirSync(d)) {
    const full = path.join(d, f)
    if (fs.statSync(full).isDirectory()) { if (f !== '3d') walk(full) }   // 3d/: the Turn-in-3D viewer, opened only inside a product page
    else if (f.endsWith('.html')) files.push('/' + path.relative(OUT, full).split(path.sep).join('/'))
  }
})(OUT)
files.sort()

const server = http.createServer((req, res) => {
  const u = decodeURIComponent(req.url.split('?')[0])
  const f = path.join(OUT, u === '/' ? 'index.html' : u)
  if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); res.end('not found'); return }
  res.writeHead(200, { 'content-type': MIME[path.extname(f)] || 'application/octet-stream' })
  fs.createReadStream(f).pipe(res)
})
await new Promise(r => server.listen(0, r))
const port = server.address().port

const browser = await chromium.launch({ executablePath: CHROME })
const problems = []
const RUPEE = /(?:PKR|Rs\.?|₨|﷼)\s?[\d,]{3,}/

for (const rel of files) {
  const raw = fs.readFileSync(path.join(OUT, rel.slice(1)), 'utf8')
  const m = raw.match(RUPEE)
  if (m) problems.push(`${rel} · RUPEE FIGURE IN SOURCE: "${m[0]}"`)

  for (const vp of [{ width: 1280, height: 900, n: 'desktop' }, { width: 360, height: 740, n: 'mobile' }]) {
    const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, reducedMotion: 'reduce' })
    const page = await ctx.newPage()
    // Block anything that is not this local server. The pages are self-contained by design; letting
    // the browser reach out would turn a sandbox network refusal into a false "failed request".
    await ctx.route('**/*', route => {
      const u = route.request().url()
      return u.startsWith('http://localhost:') || u.startsWith('data:') ? route.continue() : route.abort()
    })
    const errs = [], failed = []
    page.on('console', e => { if (e.type() === 'error') errs.push(e.text()) })
    page.on('pageerror', e => errs.push(String(e)))
    page.on('response', r => { if (r.status() >= 400) failed.push(`${r.status()} ${r.url()}`) })
    await page.goto(`http://localhost:${port}${rel}`, { waitUntil: 'networkidle' })
    await page.waitForTimeout(120)
    const r = await page.evaluate(() => {
      const h1s = [...document.querySelectorAll('h1')]
      const imgs = [...document.querySelectorAll('img')].filter(i => i.complete && i.naturalWidth === 0)
      return {
        overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        h1: h1s.length, h1text: h1s[0] ? h1s[0].textContent.trim() : '',
        bg: getComputedStyle(document.body).backgroundColor,
        brokenImgs: imgs.map(i => i.getAttribute('src')).slice(0, 3),
        chars: document.body.innerText.length,
      }
    })
    const tag = `${rel} [${vp.n}]`
    if (r.overflow > 1) problems.push(`${tag} · horizontal overflow ${r.overflow}px`)
    if (r.h1 !== 1) problems.push(`${tag} · ${r.h1} h1 elements`)
    if (!r.h1text) problems.push(`${tag} · empty h1`)
    if (r.bg === 'rgba(0, 0, 0, 0)' || r.bg === 'transparent') problems.push(`${tag} · UNSTYLED (no body background)`)
    if (r.brokenImgs.length) problems.push(`${tag} · broken images: ${r.brokenImgs.join(', ')}`)
    if (r.chars < 400) problems.push(`${tag} · almost no text (${r.chars} chars)`)
    if (errs.length) problems.push(`${tag} · console errors: ${errs.slice(0, 2).join(' | ')}`)
    if (failed.length) problems.push(`${tag} · failed requests: ${failed.slice(0, 3).join(' | ')}`)
    await ctx.close()
  }
}

await browser.close(); server.close()
console.log(`swept ${files.length} pages × 2 viewports`)
if (problems.length) { console.log(`\nPROBLEMS (${problems.length}):`); for (const p of problems) console.log('  ✗ ' + p); process.exit(1) }
console.log('clean — no overflows, no console errors, no 404s, no h1 problems, no broken images, no unstyled pages, no rupee figure in source')
