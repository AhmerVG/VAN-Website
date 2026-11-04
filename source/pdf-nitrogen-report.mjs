import { chromium } from 'playwright'
import http from 'http'; import fs from 'fs'; import path from 'path'
const root = 'out'
const srv = http.createServer((q, r) => { let p = decodeURIComponent(q.url.split('?')[0]); if (p.endsWith('/')) p += 'index.html'; const f = path.join(root, p); if (!fs.existsSync(f)) { r.statusCode = 404; return r.end('nf') } const ext = path.extname(f); r.setHeader('content-type', { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.woff2': 'font/woff2', '.png': 'image/png', '.svg': 'image/svg+xml' }[ext] || 'application/octet-stream'); fs.createReadStream(f).pipe(r) }).listen(8766)
const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1000, height: 1400 } })
await pg.emulateMedia({ reducedMotion: 'reduce' })
await pg.goto('http://localhost:8766/knowledge/real-price-of-nitrogen.html', { waitUntil: 'networkidle' }); await pg.waitForTimeout(1500)
await pg.addStyleTag({ content: `
  header.hdr, footer.ft, .ft, [class*="view-bar"], [class*="dock"], [class*="wa-float"], .chip, a.btn, .btn, [class*="viewbar"], [class*="simple"] { display:none !important }
  body { background:#fff !important } section { background:#fff !important; padding-top:14px !important; padding-bottom:14px !important }
  .chart, .panel, table, tr, h2, h3, h4 { break-inside: avoid; page-break-inside: avoid }
  h2, h3, .eyebrow, .mb-6, .mb-5 { break-after: avoid; page-break-after: avoid } .mb-6 + div > p:first-child { break-before: avoid } .wrap { max-width: 100% !important }
  .tbl-scroll { overflow: visible !important }
  section.sec { break-before: page; page-break-before: always }
  a { color: inherit !important; text-decoration: none !important }
` })
// also hide the floating "View / Simple view" bar and any fixed elements
await pg.evaluate(() => { document.querySelectorAll('*').forEach(e => { const s = getComputedStyle(e); if (s.position === 'fixed' || s.position === 'sticky') e.style.display = 'none' }) })
await pg.waitForTimeout(500)
await pg.pdf({ path: 'site-root/downloads/The-Real-Price-of-Nitrogen-VAN.pdf', format: 'A4', printBackground: true, margin: { top: '14mm', bottom: '16mm', left: '12mm', right: '12mm' },
  displayHeaderFooter: true, headerTemplate: '<div></div>',
  footerTemplate: '<div style="font-size:8px;width:100%;padding:0 12mm;color:#5B6A5E;display:flex;justify-content:space-between"><span>Vital Agri Nutrients · The real price of nitrogen · November 2026 · van.com.pk</span><span><span class="pageNumber"></span> / <span class="totalPages"></span></span></div>' })
await b.close(); srv.close(); console.log('pdf ok')
