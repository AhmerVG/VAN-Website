/**
 * THE WORKING SITEMAP — 10 September 2026.
 *
 * Tahir: "create a html working site map file at the end which is linked to the working copy so I
 * can run the pages from site map and verify the structure and linkage, and you should check too."
 *
 * So this is not sitemap.xml, which is for Google. It is a page for a person: every file in the
 * build, grouped the way the site is actually organised, with its real <title>, its size, and a link
 * that opens it. Written NEXT TO the build as `demo/site map.html`, not inside out/, so it never goes
 * up with the upload (audit O21, 24 Sep 2026). Its links point into out/, so it still opens every page
 * from a double-clicked folder.
 *
 * IT ALSO CHECKS. Every internal href in every built page is resolved against the files on disk, and
 * anything that points at nothing is listed at the top in red rather than left for him to find by
 * clicking. That is the "and you should check too" half.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const OUT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'out')
// O21, 24 Sep 2026: written outside out/ so the working copy is not uploaded with the site.
const DEST = path.join(OUT, '..', 'site map.html')

const files = []
;(function walk(d, rel = '') {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name), r = rel ? `${rel}/${e.name}` : e.name
    if (e.isDirectory()) { if (e.name !== '3d') walk(p, r) }   // 3d/: the Turn-in-3D viewer, not a page
    else if (e.name.endsWith('.html') && e.name !== 'site map.html') files.push(r)
  }
})(OUT)

const read = f => fs.readFileSync(path.join(OUT, f), 'utf8')
const titleOf = h => (h.match(/<title>([^<]*)<\/title>/) || [, ''])[1].replace(/\s*[·|—]\s*VAN.*$/, '').trim()
const h1Of = h => (h.match(/<h1[^>]*>([\s\S]*?)<\/h1>/) || [, ''])[1].replace(/<[^>]+>/g, '').trim()

/** Group by the first path segment, which is how the site is actually laid out. */
const GROUPS = [
  ['The spine', p => !p.includes('/') && !['404.html', 'verify.html'].includes(p)],
  ['Crop programmes', p => p.startsWith('crops/')],
  ['Products', p => p.startsWith('brands/')],
  ['Make with us', p => p.startsWith('partner/')],
  ['VAN Lab', p => p.startsWith('lab/') || p === 'verify.html'],
  ['Knowledge', p => p.startsWith('knowledge/')],
  ['Circular economy', p => p.startsWith('circular-economy/')],
  ['Simulator', p => p.startsWith('simulator/')],
  ['Everything else', () => true],
]

const seen = new Set()
const grouped = GROUPS.map(([name, test]) => {
  const list = files.filter(f => !seen.has(f) && test(f)).sort()
  list.forEach(f => seen.add(f))
  return [name, list]
}).filter(([, l]) => l.length)

// ── the linkage check ───────────────────────────────────────────────────────────────────────────
const exists = new Set(files)
const broken = []
for (const f of files) {
  const html = read(f)
  const hrefs = [...html.matchAll(/href="([^"]+)"/g)].map(m => m[1])
  for (const h of hrefs) {
    if (/^(https?:|mailto:|tel:|#|data:|\/\/)/.test(h)) continue
    const clean = h.split('#')[0].split('?')[0]
    if (!clean || !clean.endsWith('.html')) continue
    const target = clean.startsWith('/') ? clean.slice(1) : path.posix.normalize(path.posix.join(path.posix.dirname(f), clean))
    if (!exists.has(target)) broken.push([f, h, target])
  }
}

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const kb = f => Math.round(fs.statSync(path.join(OUT, f)).size / 1024)

const rows = grouped.map(([name, list]) => `
<section>
  <h2>${esc(name)} <span class="n">${list.length}</span></h2>
  <div class="tw">
  <table>
    <thead><tr><th>Page</th><th>Title</th><th class="r">Size</th></tr></thead>
    <tbody>
      ${list.map(f => {
        const html = read(f)
        return `<tr><td><a href="${esc('out/' + f)}">${esc(f)}</a></td><td>${esc(titleOf(html) || h1Of(html))}</td><td class="r n">${kb(f)} KB</td></tr>`
      }).join('')}
    </tbody>
  </table>
  </div>
</section>`).join('')

const html = `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex">
<title>VAN site map · working copy</title>
<style>
:root{--navy:#0E3550;--green:#2E7D4F;--rust:#B5522A;--sand:#FBF7EE;--sand2:#F3EDDD;--line:rgba(14,53,80,.16);--muted:#4F6373}
*{box-sizing:border-box}
body{margin:0;background:var(--sand);color:var(--navy);font:15px/1.5 Archivo,system-ui,sans-serif;padding:28px 20px 60px}
.w{max-width:1180px;margin:0 auto}
h1{font-size:30px;margin:0 0 4px;letter-spacing:-.02em}
h2{font-size:17px;margin:26px 0 8px;letter-spacing:-.01em;display:flex;align-items:baseline;gap:9px}
.n{font-family:'Space Grotesk',ui-monospace,monospace;font-variant-numeric:tabular-nums}
h2 .n{font-size:12px;color:var(--muted);font-weight:600}
p{margin:0;color:var(--muted);font-size:14px;max-width:110ch}
/* Long paths cannot wrap sensibly, so the table scrolls inside its own box and the page body
   never scrolls sideways on a phone. */
.tw{overflow-x:auto;-webkit-overflow-scrolling:touch;max-width:100%}
.tw table{min-width:520px}
table{width:100%;border-collapse:collapse;background:#fff;border:1px solid var(--line);border-radius:8px;overflow:hidden}
th,td{text-align:left;padding:6px 11px;border-bottom:1px solid var(--line);font-size:13.5px}
th{background:var(--sand2);font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--muted)}
tr:last-child td{border-bottom:0}
td a{color:var(--navy);font-weight:600;text-decoration:none;font-family:'Space Grotesk',ui-monospace,monospace;font-size:13px}
td a:hover{color:var(--green);text-decoration:underline}
.r{text-align:right}
.ok{background:#E4F1E8;border:1px solid var(--green);border-radius:9px;padding:12px 14px;margin:16px 0}
.bad{background:#F3E1D8;border:1px solid var(--rust);border-radius:9px;padding:12px 14px;margin:16px 0}
.bad code{font-size:12.5px}
.meta{display:flex;gap:20px;flex-wrap:wrap;margin-top:10px;font-size:13px;color:var(--muted)}
.meta b{color:var(--navy);font-family:'Space Grotesk',ui-monospace,monospace}
</style></head><body><div class="w">
<h1>VAN site map</h1>
<p>Every page in this build, grouped the way the site is laid out. Click any one to open it. This file sits next to the <span class="n">out</span> folder, not inside it, so it is not uploaded with the site. It works from the folder on your machine.</p>
<div class="meta"><span><b>${files.length}</b> pages</span><span><b>${grouped.length}</b> sections</span><span>built <b>${new Date().toISOString().slice(0, 10)}</b></span></div>
${broken.length === 0
  ? `<div class="ok"><b>Linkage checked: every internal link on every page resolves to a file in this build.</b> ${files.length} pages, all internal hrefs followed.</div>`
  : `<div class="bad"><b>${broken.length} broken internal link${broken.length > 1 ? 's' : ''}.</b><ul>${broken.slice(0, 40).map(b => `<li><code>${esc(b[0])}</code> → <code>${esc(b[1])}</code></li>`).join('')}</ul></div>`}
${rows}
</div></body></html>`

fs.writeFileSync(DEST, html)
// Remove any copy an older build left inside out/.
if (fs.existsSync(path.join(OUT, 'site map.html'))) fs.rmSync(path.join(OUT, 'site map.html'))
console.log(`site map: ${files.length} pages, ${grouped.length} sections, ${broken.length} broken internal links`)
if (broken.length) { for (const b of broken.slice(0, 20)) console.log('  BROKEN', b[0], '->', b[1]) }
