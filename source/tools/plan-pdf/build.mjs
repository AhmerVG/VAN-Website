/**
 * Crop plan PDFs (Tahir 10 Nov 2026: "Rebuild the 4 PDFs first"). No script built the 25 Oct PDFs, so this one
 * rebuilds them in the same 2-page A4 design: it opens each BUILT crop page (out/crops/<slug>.html), reads the rows of
 * its plan table exactly as the page prints them, and prints them stage by stage.
 *
 * The fixed texts are the site's own:
 *   - the 3 method boxes: METHOD_ROWS "what" texts (src/data/application.ts), shown only when a row uses one of the 3;
 *   - the rate note: the lead of the crop page's plan section;
 *   - the farm plan note: the crop page's "Farm-specific plans" panel;
 *   - the batch line: the dealer door on Home (FourDoors.tsx).
 * The logo and the Urdu line are images cut from the 25 Oct PDFs, unchanged.
 *
 * Usage (after a site build):  node tools/plan-pdf/build.mjs <outdir> wheat strawberry onion sugarcane-ratoon
 */
import { chromium } from 'playwright'
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path'; import { fileURLToPath } from 'node:url'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(HERE, '..', '..')
const OUT = path.join(ROOT, 'out')
const DEST = path.resolve(process.argv[2] || 'plan-pdfs')
const SLUGS = process.argv.slice(3)
const DATE = process.env.PLAN_DATE || '10 Nov 2026'
fs.mkdirSync(DEST, { recursive: true })

// The file name each crop page links to (catalogue.ts "pdf"), read from the source so the 2 never differ.
const cat = fs.readFileSync(path.join(ROOT, 'src/data/catalogue.ts'), 'utf8')
function pdfName(slug) {
  const page = fs.readFileSync(path.join(OUT, 'crops', `${slug}.html`), 'utf8')
  const m = page.match(/van\.com\.pk\/plans\/([A-Za-z0-9+-]+-Nutrition-Plan\.pdf)/)
  if (!m || !cat.includes(`plans/${m[1]}`)) throw new Error(`no PDF name for ${slug}`)
  return m[1]
}

const METHODS = (() => {
  const src = fs.readFileSync(path.join(ROOT, 'src/data/application.ts'), 'utf8')
  return [...src.matchAll(/\{ rank: '([^']+)', method: '([^']+)', what: '([^']+)'/g)].map(m => ({ rank: m[1], method: m[2], what: m[3] }))
})()
if (METHODS.length !== 3) throw new Error('METHOD_ROWS not found')

// L1 10 Nov 2026 (m1): the box titles use the method words of the HOW column. The lead above the boxes is the site's own
// sentence (site.ts, Broadcasting entry of the method glossary).
const ROW_WORD = { 'Drill at sowing': 'Drill at sowing', 'Side-dress': 'Side dressing', 'Broadcast': 'Broadcasting' }
const DRILL_RULE = (() => {
  const m = fs.readFileSync(path.join(ROOT, 'src/data/site.ts'), 'utf8').match(/Where a plan row says “Drill at sowing; broadcast if no drill”, drill the fertiliser, and broadcast it only if no drill is available\./)
  if (!m) throw new Error('drill rule sentence not found in site.ts'); return m[0]
})()
const STAGE_COLOUR = [
  [/land preparation/i, '#1F4B28'], [/germination|transplant|establish/i, '#2F6B3A'], [/early growth|vegetative|flush/i, '#4F8A3E'],
  [/flowering/i, '#6B5A1C'], [/grand growth|bulb/i, '#7A5230'], [/maturity|fruit|harvest/i, '#8A6414'],
]
const stageColour = (s, i) => (STAGE_COLOUR.find(([re]) => re.test(s)) || [null, ['#1F4B28', '#2F6B3A', '#4F8A3E', '#7A5230', '#8A6414', '#6B5A1C'][i % 6]])[1]

const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.json': 'application/json' }
const srv = http.createServer((q, r) => {
  const u = decodeURIComponent(q.url.split('?')[0])
  const f = u.startsWith('/__plan/') ? path.join(HERE, u.slice(8)) : path.join(OUT, u === '/' ? 'index.html' : u)
  if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) { r.writeHead(404); r.end(); return }
  r.writeHead(200, { 'content-type': MIME[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(r)
})
await new Promise(r => srv.listen(0, r)); const port = srv.address().port
const base = `http://localhost:${port}`
const css = fs.readdirSync(OUT).find(f => /^demo\.[0-9a-f]+\.css$/.test(f))
const font = pre => fs.readdirSync(OUT).filter(f => f.startsWith(pre) && f.endsWith('.woff2'))

const b = await chromium.launch({ executablePath: process.env.CHROME })
const ctx = await b.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: 'reduce' })
await ctx.route('**/*', r => r.request().url().startsWith(base) || r.request().url().startsWith('data:') ? r.continue() : r.abort())
const pg = await ctx.newPage()

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const report = []

for (const slug of SLUGS) {
  await pg.goto(`${base}/crops/${slug}.html`, { waitUntil: 'networkidle' })
  await pg.evaluate(() => document.querySelectorAll('details').forEach(d => (d.open = true)))
  await pg.waitForTimeout(150)
  const d = await pg.evaluate(() => {
    const T = n => (n?.textContent || '').replace(/\s+/g, ' ').trim()
    const hero = document.querySelector('main section') || document
    const tags = [...hero.querySelectorAll('.tag')].map(T).filter(t => /sowing|planting|season|transplant|main nutrients/i.test(t))
    const table = document.querySelector('table.tbl-plan')
    const stages = [...table.querySelectorAll('thead th')].slice(1).map(T)
    const rows = []
    table.querySelectorAll('tbody tr').forEach(tr => {
      const tds = [...tr.children]; const band = T(tds[0])
      tds.slice(1).forEach((td, si) => td.querySelectorAll('.plan-cell').forEach(cell => {
        const img = cell.querySelector('.plan-cell-shot img'); const svg = cell.querySelector('.plan-cell-shot svg')
        const caps = [...cell.querySelectorAll('.min-w-0 > .cap')]
        const name = T(cell.querySelector('.min-w-0 > a, .min-w-0 > span.font-semibold'))
        const rate = T(caps[0]?.querySelector('b'))
        const capText = T(caps[0])
        const analysis = capText.endsWith(rate) ? capText.slice(0, capText.length - rate.length).replace(/\s*·\s*$/, '') : capText
        rows.push({ stage: stages[si], band, name, analysis, rate, method: T(caps[1]), alt: caps[2] ? T(caps[2]) : '',
          grey: /55645A/i.test(cell.className), img: img ? img.getAttribute('src') : null, svg: !img && svg ? svg.outerHTML : null })
      }))
    })
    return { name: T(document.querySelector('main h1')), eyebrow: T(hero.querySelector('.eyebrow')), tags, stages, rows,
      lead: T(document.querySelector('#programme .lead') || document.querySelector('#programme p')) }
  })
  if (!d.rows.length) throw new Error(`no plan rows on ${slug}`)
  // The wheat page (Wheat.tsx) has its own hero: its h1 is a sentence, so the crop name is the part before the colon,
  // and the eyebrow is the one CropPage prints for every other crop.
  d.name = d.name.split(':')[0].trim()
  d.eyebrow = d.rows.some(r => /per plant/i.test(r.rate)) ? 'Crop plan · per plant and per acre' : 'Crop plan · per acre'
  // Stage order, then the page's own band order within the stage. A stage with no row (wheat's last) keeps its bar.
  const byStage = d.stages.map(s => ({ stage: s, rows: d.rows.filter(r => r.stage === s) }))
  const vanProducts = [...new Map(d.rows.filter(r => !r.grey).map(r => [r.name, r])).keys()]
  const commodity = [...new Map(d.rows.filter(r => r.grey).map(r => [r.name, r])).keys()]
  // L1 10 Nov 2026 (B1): the ranking of the 3 methods prints only where a row names drilling. On a plan whose rows say
  // "Broadcasting" (onion, strawberry), a "least preferred" box would contradict the plan. Was: any of the 3 methods.
  const usesMethods = d.rows.some(r => /drill/i.test(r.method))
  const pageHref = `van.com.pk/crops/${slug}.html`
  const rateNote = d.lead
  const cell = r => `<tr class="${r.grey ? 'grey' : ''}">
      <td class="shot">${r.img ? `<img src="${esc(r.img)}" alt="">` : (r.svg || '')}</td>
      <td class="prod"><b>${esc(r.name)}</b><span>${esc(r.analysis)}</span>${r.alt ? `<span class="alt">${esc(r.alt)}</span>` : ''}</td>
      <td class="rate">${esc(r.rate)}</td><td class="how">${esc(r.method)}</td><td class="grp">${esc(r.band)}</td></tr>`
  // L1 10 Nov 2026 (M1): 1 table per stage, with the stage bar as its header, so a stage that runs onto the next page
  // repeats its bar there. Was 1 table with a bar row per stage.
  const cols = '<colgroup><col style="width:11mm"><col><col style="width:33mm"><col style="width:44mm"><col style="width:27mm"></colgroup>'
  const body = byStage.map((g, i) => `<table class="st">${cols}<thead><tr class="bar"><th colspan="5" style="background:${stageColour(g.stage, i)}">${esc(g.stage)}</th></tr></thead><tbody>${g.rows.length ? g.rows.map(cell).join('') : '<tr><td></td><td colspan="4" class="none">No product is applied at this stage.</td></tr>'}</tbody></table>`).join('')
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>${esc(d.name)} crop plan</title>
<style>
${font('publicsans-latin').map(f => `@font-face{font-family:PS;src:url(${base}/${f}) format('woff2');font-weight:100 900}`).join('')}
${font('fraunces-latin').map(f => `@font-face{font-family:FR;src:url(${base}/${f}) format('woff2');font-weight:100 900}`).join('')}
@page{size:A4;margin:12mm 11mm 12mm 11mm}
*{box-sizing:border-box}
body{margin:0;font-family:PS,Arial,sans-serif;color:#1C2A21;font-size:8.6pt;line-height:1.32}
.head{display:flex;justify-content:space-between;align-items:flex-start;gap:4mm;margin-bottom:5mm}
.head > div{flex:1}
.eyebrow{font-size:7.4pt;letter-spacing:.14em;text-transform:uppercase;color:#2F6B3A;font-weight:700}
h1{font-family:FR,Georgia,serif;font-size:25pt;margin:1mm 0 2mm;line-height:1.05;color:#14231A}
.tags span{display:inline-block;border:1px solid #AAB1AD;border-radius:3px;padding:1px 7px;margin-right:4px;font-size:7.6pt}
.logo{width:40mm;flex:none}
table{width:100%;border-collapse:collapse;table-layout:fixed}
table.st{break-inside:auto}
thead th{font-size:6.8pt;letter-spacing:.08em;text-transform:uppercase;text-align:left;color:#55645A;padding:0 4px 3px;border-bottom:1px solid #C9CFCB}
tr{break-inside:avoid}
tr.bar th{color:#fff;text-align:left;font-size:9pt;padding:4px 6px;font-weight:700;letter-spacing:.01em;text-transform:none;border:0}
tr.bar{break-after:avoid}
td{padding:2.6px 4px;border-bottom:1px solid #E3E7E4;vertical-align:middle}
td.shot{width:11mm}
td.shot img,td.shot svg{width:8.6mm;height:8.6mm;object-fit:contain;display:block}
td.prod b{display:block;font-size:9pt}
td.prod span{display:block;font-size:7.4pt;color:#55645A}
td.prod span.alt{color:#22385C}
td.rate{width:33mm;font-weight:700}
td.how{width:44mm;font-size:8pt}
td.grp{width:27mm;font-size:7pt;letter-spacing:.06em;text-transform:uppercase;color:#3E4A43}
tr.grey td.prod b,tr.grey td.rate{color:#55645A}
td.none{color:#55645A;font-style:italic}
.after{margin-top:4mm}
.chips,.methods,.note,.foot{break-inside:avoid}
.chips b{font-size:7.6pt;margin-right:5px}
.chips i{font-style:normal;color:#55645A;font-size:7.4pt}
.chips span{display:inline-block;background:#DDEBDD;color:#1F4B28;font-weight:600;border-radius:3px;padding:2px 7px;margin:0 4px 4px 0;font-size:7.4pt}
.chips span.g{background:#ECEEEC;color:#55645A;font-weight:400}
.methods{display:grid;grid-template-columns:repeat(3,1fr);gap:3mm;margin-top:3mm}
.methods div{border:1px solid #C9CFCB;border-left:3px solid #2F6B3A;padding:2.5mm 3mm;font-size:7.8pt}
.methods div.m2{border-left-color:#22385C}.methods div.m3{border-left-color:#8A4B2A}
.methods b{display:block;font-size:8.4pt;margin-bottom:1mm}
.note{margin-top:3.5mm;font-size:7.8pt}
.small{margin-top:2mm;font-size:6.8pt;color:#55645A}
.foot{margin-top:4mm;background:#14231A;color:#fff;border-radius:3px;display:flex;justify-content:space-between;align-items:center;padding:3mm 4mm;font-size:7.4pt}
.foot img{height:9mm}
</style></head><body>
<div class="head"><div><div class="eyebrow">${esc(d.eyebrow)}</div><h1>${esc(d.name)}</h1>
<div class="tags">${d.tags.map(t => `<span>${esc(t)}</span>`).join('')}<span>${vanProducts.length + commodity.length} products · ${byStage.length} stages</span></div></div>
<img class="logo" src="${base}/__plan/logo.png" alt="VAN, Vital Agri Nutrients"></div>
<table>${cols}<thead><tr><th colspan="2">Product</th><th>Rate</th><th>How</th><th>Group</th></tr></thead></table>${body}
<div class="after">
<div class="chips"><b>Products in this plan:</b>${vanProducts.map(n => `<span>${esc(n)}</span>`).join('')}${commodity.map(n => `<span class="g">${esc(n)}</span>`).join('')}${commodity.length ? '<i>In grey: not made by VAN</i>' : ''}</div>
${usesMethods ? `<p class="note">${esc(DRILL_RULE)}</p><div class="methods">${METHODS.map((m, i) => `<div class="m${i + 1}"><b>${i + 1}. ${esc(ROW_WORD[m.method] || m.method)} (${esc(m.rank.replace(/^\d+ · /, ''))})</b>${esc(m.what)}</div>`).join('')}</div>` : ''}
<p class="note">${esc(rateNote)}</p>
<p class="note"><b>About this plan.</b> This crop plan is a general guide for a typical crop on a typical soil, and it does not replace a soil test. VAN can prepare a plan for your own farm from your soil analysis, your yield target and the other conditions of your field that affect how much fertiliser to apply. Ask for one on WhatsApp at +92 300 5003041 or at kisan@van.com.pk.</p>
<p class="note"><b>Lab report for each batch.</b> VAN tests every batch before it ships. At www.van.com.pk/verify.html, you can type the batch number printed on any VAN bag and open the lab report for that batch.</p>
<p class="small">This table is copied from the ${esc(d.name.toLowerCase())} plan at www.${pageHref} as it stood on ${DATE}.</p>
<div class="foot"><span>www.van.com.pk · kisan@van.com.pk · WhatsApp +92 300 5003041<br>Vital Agri Nutrients (Pvt) Ltd, Lahore</span><img src="${base}/__plan/urdu.png" alt=""></div>
</div></body></html>`
  const htmlPath = path.join(HERE, `.${slug}.html`)
  fs.writeFileSync(htmlPath, html)
  const p2 = await ctx.newPage()
  await p2.goto(`${base}/__plan/.${slug}.html`, { waitUntil: 'networkidle' })
  await p2.evaluate(() => document.fonts.ready)
  const file = path.join(DEST, pdfName(slug))
  await p2.pdf({ path: file, format: 'A4', printBackground: true, preferCSSPageSize: true })
  await p2.close(); fs.rmSync(htmlPath)
  report.push({ slug, file: path.basename(file), stages: byStage.map(g => `${g.stage} (${g.rows.length})`), rows: d.rows.length, tags: d.tags })
}
await b.close(); srv.close()
fs.writeFileSync(path.join(DEST, 'plan-pdfs.json'), JSON.stringify(report, null, 1))
console.log(JSON.stringify(report, null, 1))
