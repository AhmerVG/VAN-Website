/**
 * STATIC SITE BUILDER — van.com.pk
 *
 * The site is a React SPA. A crawler loading a SPA sees an empty <div id="root">, and everything
 * after a "#" is not a URL at all — which is why the demo, uploaded as one hash-routed file, would
 * have replaced 84 indexed pages with one. This script fixes that without changing the app: it
 * renders every route in a real browser, writes the rendered HTML out as its own file AT THE PATH
 * THE LIVE SITE ALREADY USES, and gives each one its own title, description and canonical.
 *
 * The bundle is shared and external, so it is downloaded once and cached across the whole site.
 *
 * Output: out/  — upload its contents to the web root.
 */
import { chromium } from 'playwright'
import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { fileURLToPath } from 'node:url'

const ROOT = path.dirname(fileURLToPath(import.meta.url))
const DIST = path.join(ROOT, 'dist')
const OUT = path.join(ROOT, 'out')
const ORIGIN = 'https://www.van.com.pk'
const CHROME = process.env.CHROME || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'

/* ── route table ──────────────────────────────────────────────────────────────
 * hash route -> the URL the live site uses. Product pages live under /brands/ and
 * crop pages under /crops/ because that is where Google already has them.
 */
const catalogue = fs.readFileSync(path.join(ROOT, 'src/data/catalogue.ts'), 'utf8')
const productBlock = catalogue.slice(catalogue.indexOf('export const PRODUCTS'), catalogue.indexOf('export const CROPS'))
const PRODUCTS = [...productBlock.matchAll(/"slug": "([^"]+)",\n\s*"name": "([^"]+)"/g)].map(m => ({ slug: m[1], name: m[2] }))
const cropBlock = catalogue.slice(catalogue.indexOf('export const CROPS'), catalogue.indexOf('export const WHEAT_STAGES'))
const CROPS = [...cropBlock.matchAll(/"name": "([^"]+)",\n\s*"sowing": "[^"]*",\n\s*"programme": "[^"]*",\n\s*"page": "([^"]+)"/g)].map(m => ({ name: m[1], slug: m[2].replace(/\.html$/, '') }))

const STATIC_ROUTES = [
  { hash: '#/', out: 'index.html', title: 'VAN · Vital Agri Nutrients · custom crop nutrition, made in Pakistan' },
  // D-172: without its own description the About page took its lead, which opens "Trials have run on that ground" with nothing for "that" to refer to.
  { hash: '#/about', out: 'about.html', title: 'About VAN', description: 'VAN started with a research farm in 2009, a year before the company. It formulates, manufactures, registers and tests what it sells on one plant site in Lahore: 23 registered brands and a PNAC-accredited laboratory, LAB 336.' },
  // D-147: the company profile. Its PDF is site-root/downloads/VAN-Company-Profile-2026.pdf, copied to out/downloads/.
  { hash: '#/company-profile', out: 'company-profile.html', title: 'Company profile', description: 'The VAN company profile: a Lahore crop nutrition manufacturer since 2010, with 23 registered brands, 22 PSQCA licences, a PNAC-accredited laboratory and products made under partners\u2019 own brands. Read it on the page or download it as a PDF.' },
  { hash: '#/products', out: 'brands/index.html', title: 'Products' },
  // D-202, 27 Sep 2026: the composition chart, brands and library codes with their analysis.
  { hash: '#/composition', out: 'composition.html', title: 'Composition chart · every VAN brand and library code, with what is in it', description: '23 registered brands and 27 unbranded formulations, each with its declared analysis by nutrient, packs and documents. No prices.' },
  { hash: '#/crops', out: 'crops/index.html', title: 'Crop nutrition plans' },
  { hash: '#/soil', out: 'soil.html', title: 'Soil Atlas · 770,160 Punjab soil samples, read row by row' },
  { hash: '#/lab', out: 'lab/index.html', title: 'VAN Lab · tests, prices and the blind chain' },
  { hash: '#/verify', out: 'verify.html', title: 'Verify a bag' },
  { hash: '#/knowledge', out: 'knowledge/index.html', title: 'Knowledge' },
  { hash: '#/knowledge/why-pakistan-must-shift', out: 'knowledge/why-pakistan-must-shift.html', title: 'Why Pakistan must shift' },
  // D-186, 26 Sep 2026: the 17 nutrients and the Liebig barrel.
  { hash: '#/knowledge/nutrients', out: 'knowledge/nutrients.html', title: 'The 17 nutrients · what each one does, and why the shortest decides the harvest', description: 'A crop needs 17 nutrients. What each one does, what a crop looks like without it, which ones work as pairs, and a barrel you can put your own bags into to see where your season leaks. Liebig’s Law of the Minimum, for a Pakistani field.' },
  // D-245, 1 Oct 2026: Soil Poverty Series No. 1. Its PDF is site-root/downloads/Soil-Poverty-Punjab-Potash-Tahir-Abbas.pdf.
  { hash: '#/knowledge/soil-poverty-punjab-potash', out: 'knowledge/soil-poverty-punjab-potash.html', title: 'Soil Poverty: Punjab’s Potash · Soil Poverty Series No. 1', description: 'Punjab’s crops take about 940,000 tonnes of potash out of the soil a year; fertilizer puts back 36,000. Most of 20,000 model runs put the Punjab average below 100 ppm between 2027 and 2044, middle about 2036. A report by Tahir Abbas.' },
  // D-246, 2 Oct 2026: Knowledge > Data, the index of the interactive lenses.
  { hash: '#/knowledge/data', out: 'knowledge/data.html', title: 'Data · Pakistan’s nutrient data, to explore yourself', description: 'Interactive charts on how much fertilizer Pakistan uses per acre, what it consists of, what comes back in the harvest, and where Punjab’s soil potash is heading. FAO data via Our World in Data, and Tahir Abbas’s Punjab potash model.' },
  { hash: '#/knowledge/soil-and-sustainability', out: 'knowledge/soil-and-sustainability.html', title: 'Soil & sustainability · the state of Pakistani soil' },
  { hash: '#/knowledge/application-systems', out: 'knowledge/application-systems.html', title: 'Application systems' },
  { hash: '#/circular-economy', out: 'circular-economy/index.html', title: 'Circular economy' },
  { hash: '#/circular-economy/ash', out: 'circular-economy/ash.html', title: 'Fly ash to nutrient' },
  { hash: '#/circular-economy/soil', out: 'circular-economy/soil.html', title: 'Soil actions register' },
  { hash: '#/partner', out: 'partner/index.html', title: 'Your Brand: make it with VAN' },
  { hash: '#/partner/brief-to-bag', out: 'partner/brief-to-bag.html', title: 'From brief to bag' },
  { hash: '#/partner/engineering', out: 'partner/engineering.html', title: 'VAN Engineering' },
  { hash: '#/partner/manufacturing', out: 'partner/manufacturing.html', title: 'Manufacturing & quality' },
  { hash: '#/partner/pipeline', out: 'partner/pipeline.html', title: 'Pipeline & formulation library' },
  { hash: '#/become-a-dealer', out: 'become-a-dealer.html', title: 'Become a VAN dealer or distributor' },
  { hash: '#/partner/regulatory', out: 'partner/regulatory.html', title: 'Regulatory & registration services' },
  { hash: '#/simulator', out: 'simulator.html', title: 'Farm discipline simulator' },
  { hash: '#/tools', out: 'tools.html', title: 'Vitalytics · VAN’s tools, live and coming' },
  { hash: '#/where-to-buy', out: 'where-to-buy.html', title: 'Where to buy VAN products' },
  // The build's own 404 (added 9 Sep 2026, D-47). Two flags, both load-bearing:
  //   absolute — Apache serves this file at whatever URL was asked for, which can be at any
  //     depth (/crops/does-not-exist). Every other page writes assets and links relative to its
  //     own depth; from a deep URL those relative paths resolve to nothing and the 404 page
  //     would itself render unstyled with a dead bundle. This one is written absolute.
  //   noindex — kept out of sitemap.xml and marked noindex, because a 404 is not a page to index.
  { hash: '#/404', out: '404.html', title: 'Page not found', absolute: true, noindex: true },
]
const ROUTES = [
  ...STATIC_ROUTES,
  ...PRODUCTS.map(p => ({ hash: `#/products/${p.slug}`, out: `brands/${p.slug}.html`, title: p.name })),
  ...CROPS.map(c => ({ hash: `#/crops/${c.slug}`, out: `crops/${c.slug}.html`, title: `${c.name} nutrition plan` })),
  ...['wheat', 'potato'].map(c => ({ hash: `#/simulator/${c}`, out: `simulator/${c}.html`, title: `${c[0].toUpperCase() + c.slice(1)} farm discipline simulator` })),
]

/** hash route -> real path. Kept in one place because the runtime shim uses the same rules. */
// CANONICAL urls keep the live site's directory form ("/crops/"). LINK hrefs name the file
// ("crops/index.html") — identical on Apache, and the difference is what lets a page opened straight
// from an unzipped folder follow the link instead of showing a directory listing. The canonical tag
// on each page is what search engines index, so only one URL is ever advertised.
const HASH_TO_PATH = Object.fromEntries(ROUTES.map(r => [r.hash, '/' + r.out.replace(/index\.html$/, '')]))
HASH_TO_PATH['#'] = '/'   // the logo links to "#/", which normalises to "#"
const HASH_TO_FILE = Object.fromEntries(ROUTES.map(r => [r.hash, '/' + r.out]))
HASH_TO_FILE['#'] = '/index.html'


/* ── static file server over dist/ ─────────────────────────────────────────── */
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.woff2': 'font/woff2', '.json': 'application/json' }
function serve(dir) {
  return new Promise(resolve => {
    const s = http.createServer((req, res) => {
      const u = decodeURIComponent(req.url.split('?')[0])
      let f = path.join(dir, u === '/' ? 'index.html' : u)
      if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) f = path.join(dir, 'index.html')
      res.writeHead(200, { 'content-type': MIME[path.extname(f)] || 'application/octet-stream' })
      fs.createReadStream(f).pipe(res)
    })
    s.listen(0, () => resolve({ server: s, port: s.address().port }))
  })
}

const esc = t => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

;(async () => {
  const distIndex = fs.readFileSync(path.join(DIST, 'index.html'), 'utf8')
  // Parcel emits unquoted attributes, so match both quoted and bare forms.
  const scripts = [...distIndex.matchAll(/<script[^>]*\ssrc=["']?([^"'\s>]+)/g)].map(m => m[1])
  const styles = [...distIndex.matchAll(/<link[^>]*rel=["']?stylesheet["']?[^>]*\shref=["']?([^"'\s>]+)/g)].map(m => m[1])
  if (!scripts.length) throw new Error('no script found in dist/index.html')

  // D-246: the lens data (site-root/data/lenses.json) is fetched by the page, so the prerender
  // server must have it too; the copy into out/ happens with the other root assets below.
  const lensData = path.join(ROOT, 'site-root', 'data')
  if (!fs.existsSync(path.join(lensData, 'lenses.json'))) throw new Error('site-root/data/lenses.json missing: every lens would ship as "could not load"')
  fs.cpSync(lensData, path.join(DIST, 'data'), { recursive: true })
  const { server, port } = await serve(DIST)
  const browser = await chromium.launch({ executablePath: CHROME })
  // reducedMotion makes every animated counter render its FINAL value immediately instead of
  // easing up from zero. Without it the snapshot caught them mid-flight and the soil page shipped
  // "5.04 mean pH" as static HTML when the real figure is 8.22 — wrong numbers, permanently, to
  // every crawler and every reader with JavaScript off.
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: 'reduce' })
  const page = await context.newPage()

  fs.rmSync(OUT, { recursive: true, force: true })
  fs.mkdirSync(OUT, { recursive: true })

  // Pack shots and the logo are carried in the bundle as data: URIs. Left in the pre-rendered HTML
  // they would be re-downloaded on every page — the same image, dozens of times, on a connection
  // that can least afford it. They are written out once as real files and referenced by URL, which
  // also lets the browser cache them across the whole site.
  const imgDir = path.join(OUT, 'img')
  fs.mkdirSync(imgDir, { recursive: true })
  const imgSeen = new Map()
  const extractImages = html => html.replace(/(src|href)="data:image\/(png|jpeg|jpg|webp|gif|svg\+xml);base64,([^"]+)"/g, (m, attr, type, b64) => {
    const key = crypto.createHash('sha1').update(b64).digest('hex').slice(0, 12)
    if (!imgSeen.has(key)) {
      const ext = type === 'svg+xml' ? 'svg' : type === 'jpeg' ? 'jpg' : type
      fs.writeFileSync(path.join(imgDir, `${key}.${ext}`), Buffer.from(b64, 'base64'))
      imgSeen.set(key, `/img/${key}.${ext}`)
    }
    return `${attr}="${imgSeen.get(key)}"`
  })

  const written = []
  for (const r of ROUTES) {
    await page.goto(`http://localhost:${port}/index.html${r.hash}`, { waitUntil: 'networkidle' })
    // Counters and charts only start when scrolled into view, so anything below the fold would be
    // snapshotted at zero. Walk the whole page to trigger every observer, then return to the top.
    await page.evaluate(async () => {
      const step = Math.round(window.innerHeight * 0.8)
      for (let y = 0; y < document.body.scrollHeight; y += step) {
        window.scrollTo(0, y)
        await new Promise(res => setTimeout(res, 40))
      }
      window.scrollTo(0, 0)
      await new Promise(res => setTimeout(res, 120))
    })
    await page.waitForTimeout(350)
    const { html, desc, h1 } = await page.evaluate(() => {
      const root = document.getElementById('root')
      const lead = document.querySelector('main .lead, main p.lead, .lead')
      const h = document.querySelector('main h1, h1')
      return {
        html: root ? root.innerHTML : '',
        desc: lead ? lead.textContent.trim().replace(/\s+/g, ' ').slice(0, 300) : '',
        h1: h ? h.textContent.trim().replace(/\s+/g, ' ') : '',
      }
    })
    if (!html || html.length < 500) throw new Error('empty render for ' + r.hash)
    // D-246: a lens that failed to load must never be frozen into the static page.
    if (html.includes('lz-fail')) throw new Error('a lens failed to load on ' + r.hash)
    // Guard against the counter bug coming back: the soil page's own headline figures must be in
    // the static HTML, not a partial value on the way to them.
    if (r.hash === '#/soil') {
      for (const expect of ['8.22', '96.1', '0.61', '97.9']) {
        if (!html.includes(expect)) throw new Error(`soil page rendered without its real figure ${expect} — counters did not settle`)
      }
    }

    const canonical = ORIGIN + HASH_TO_PATH[r.hash]
    const title = r.hash === '#/' ? r.title : `${r.title} · VAN · Vital Agri Nutrients`
    const description = (r.description || desc || h1).slice(0, 300)   // D-147: a route may set its own

    // Links inside the pre-rendered markup are rewritten to real paths so a crawler follows real
    // URLs and so the page works before any JavaScript runs.
    const body = html.replace(/href="#(\/[^"]*)"/g, (m, hashPath) => {
      const [routePart, anchor] = hashPath.split('#')
      const [pathOnly, query] = routePart.split('?')
      const key = '#' + pathOnly.replace(/\/$/, '')
      const real = HASH_TO_FILE[key] || HASH_TO_FILE[key.replace(/\/$/, '')] || null
      if (!real) return m
      return `href="${real}${query ? '?' + query : ''}${anchor ? '#' + anchor : ''}"`  // made relative below
    })

    // Every asset and internal link is written RELATIVE to this page's own depth. On the server
    // "../brands/x.html" from /crops/wheat.html resolves to /brands/x.html — identical to the
    // absolute form. Opened straight from an unzipped folder, the absolute form pointed at the
    // drive root and the page rendered with no stylesheet; the relative form just works.
    const depth = r.out.split('/').length - 1
    // r.absolute: served from an unknown depth (the 404), so relative prefixes cannot be used.
    const P = r.absolute ? '/' : depth === 0 ? './' : '../'.repeat(depth)
    const rel = abs => (abs && abs.charAt(0) === '/' ? P + abs.slice(1) : abs)

    const bodyOut = extractImages(body).replace(/(src|href)="(\/[^"]*)"/g, (m, attr, url) =>
      /^\/\//.test(url) ? m : `${attr}="${rel(url)}"`)
    const out = `<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
${r.noindex ? '<meta name="robots" content="noindex">' : `<link rel="canonical" href="${canonical}">`}
<meta property="og:type" content="website">
<meta property="og:site_name" content="Vital Agri Nutrients">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${ORIGIN}/og-image.png">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="${P}favicon.ico" sizes="any">
<link rel="icon" type="image/png" sizes="32x32" href="${P}favicon-32x32.png">
<link rel="apple-touch-icon" href="${P}apple-touch-icon.png">
${styles.map(x => `<link rel="stylesheet" href="${rel(x)}">`).join('\n')}
<script>
// Tell the app which page this file is, before the bundle boots.
window.__ROUTE__ = ${JSON.stringify(r.hash)};
// Every page is a real URL. The app writes its links as "#/crops/wheat"; on a static site those
// have to be real paths, both so a crawler follows real URLs and so the address bar shows one
// address per page. The pre-rendered HTML ships with real hrefs already; React restores the hash
// form when it hydrates, so the same rewrite is reapplied to the live DOM.
var VAN_ROUTES = ${JSON.stringify(HASH_TO_FILE)};
var VAN_PREFIX = ${JSON.stringify(P)};
function vanReal(h) {
  if (!h || h.indexOf('#/') !== 0) return null;
  var rest = h.slice(1), anchor = '', q = '';
  var ai = rest.indexOf('#'); if (ai > -1) { anchor = rest.slice(ai); rest = rest.slice(0, ai); }
  var qi = rest.indexOf('?'); if (qi > -1) { q = rest.slice(qi); rest = rest.slice(0, qi); }
  var target = VAN_ROUTES['#' + rest.replace(/\\/$/, '')];
  return target ? VAN_PREFIX + target.slice(1) + q + anchor : null;
}
function vanFixLinks() {
  var as = document.querySelectorAll('a[href^="#/"]');
  for (var i = 0; i < as.length; i++) {
    var real = vanReal(as[i].getAttribute('href'));
    if (real) as[i].setAttribute('href', real);
  }
}
addEventListener('DOMContentLoaded', vanFixLinks);
addEventListener('load', vanFixLinks);
var vanQueued = false;
new MutationObserver(function () {
  if (vanQueued) return; vanQueued = true;
  requestAnimationFrame(function () { vanQueued = false; vanFixLinks(); });
}).observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ['href'] }); // D-237: React updates a link's href in place (the sowing ring's Open plan); that is an attribute change, not a child
// Backstop: anything that still changes the hash becomes a real navigation.
addEventListener('hashchange', function () {
  var real = vanReal(location.hash);
  if (real) location.replace(real);
});
</script>
</head>
<body>
<div id="root">${bodyOut}</div>
${scripts.map(x => `<script defer src="${rel(x)}"></script>`).join('\n')}
</body>
</html>`

    const dest = path.join(OUT, r.out)
    fs.mkdirSync(path.dirname(dest), { recursive: true })
    fs.writeFileSync(dest, out)
    written.push({ path: HASH_TO_PATH[r.hash], bytes: out.length, title, noindex: !!r.noindex })
  }

  // shared bundle + any emitted assets
  for (const f of fs.readdirSync(DIST)) {
    if (f === 'index.html') continue
    const src = path.join(DIST, f), dst = path.join(OUT, f)
    fs.cpSync(src, dst, { recursive: true })
  }

  // Root assets carried over from the live site (favicons + the social preview image). Every page
  // references them, so shipping without them means a 404 on every page load.
  const rootAssets = path.join(ROOT, 'site-root')
  if (fs.existsSync(rootAssets)) {
    // D-147: recursive, so site-root/downloads/ (the company profile PDF) lands in out/downloads/.
    for (const f of fs.readdirSync(rootAssets)) fs.cpSync(path.join(rootAssets, f), path.join(OUT, f), { recursive: true })
    console.log('root assets copied:', fs.readdirSync(rootAssets).join(', '))
  }

  // The packing note. It lives in the repo as deploy-readme.txt and is copied in here rather than
  // written into out/ by hand, because build-static.mjs deletes out/ on every run — which is exactly
  // how the first copy of it was lost.
  const readme = path.join(ROOT, 'deploy-readme.txt')
  if (fs.existsSync(readme)) fs.cpSync(readme, path.join(OUT, 'READ ME FIRST — how to upload this.txt'))

  // sitemap + robots. /foliark-precise.html is deliberately absent — it 404s on the live site.
  const today = new Date().toISOString().slice(0, 10)
  fs.writeFileSync(path.join(OUT, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    written.filter(w => !w.noindex).map(w => `  <url><loc>${ORIGIN}${w.path}</loc><lastmod>${today}</lastmod></url>`).join('\n') +
    `\n</urlset>\n`)
  fs.writeFileSync(path.join(OUT, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${ORIGIN}/sitemap.xml\n`)

  await context.close(); await browser.close(); server.close()
  const total = written.reduce((a, w) => a + w.bytes, 0)
  console.log(`pages written: ${written.length}`)
  console.log(`html total: ${(total / 1048576).toFixed(2)} MB (avg ${(total / written.length / 1024).toFixed(0)} KB)`)
  console.log('bundle files:', scripts.concat(styles).join(', '))
  console.log('images extracted:', imgSeen.size, '->', (fs.readdirSync(imgDir).reduce((a, f) => a + fs.statSync(path.join(imgDir, f)).size, 0) / 1048576).toFixed(2), 'MB total, downloaded once')

  // The working site map, generated last so it sees every file this build wrote. It is a page for a
  // person, not sitemap.xml for Google: Tahir asked to be able to walk the structure himself and
  // open any page from one list, and it checks every internal link while it is in there.
  const { execFileSync } = await import('node:child_process')
  execFileSync(process.execPath, [path.join(ROOT, 'tools', 'working-sitemap.mjs')], { stdio: 'inherit' })
})()
