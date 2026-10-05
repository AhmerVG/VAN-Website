/**
 * The nutrient balance is behaviour — the removal side does not exist until a yield is entered, so
 * the page sweep cannot see it. This drives it, and checks the arithmetic by hand against figures
 * computed independently of the app.
 */
import { chromium } from 'playwright'
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path'; import { fileURLToPath } from 'node:url'
const OUT = path.join(path.dirname(fileURLToPath(import.meta.url)), 'out')
const MIME = { '.html':'text/html','.js':'text/javascript','.css':'text/css','.png':'image/png','.svg':'image/svg+xml','.ico':'image/x-icon','.woff2':'font/woff2' }
const srv = http.createServer((q,r)=>{const u=decodeURIComponent(q.url.split('?')[0]);const f=path.join(OUT,u==='/'?'index.html':u);if(!fs.existsSync(f)||fs.statSync(f).isDirectory()){r.writeHead(404);r.end();return}r.writeHead(200,{'content-type':MIME[path.extname(f)]||'application/octet-stream'});fs.createReadStream(f).pipe(r)})
await new Promise(r=>srv.listen(0,r)); const port = srv.address().port
const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'})
const ctx = await b.newContext({viewport:{width:1280,height:900},reducedMotion:'reduce'})
await ctx.route('**/*', r => r.request().url().startsWith(`http://localhost:${port}`)||r.request().url().startsWith('data:') ? r.continue() : r.abort())
const pg = await ctx.newPage(); const errs=[]
pg.on('pageerror', e=>errs.push(String(e)))
let fails=0
const ok=(l,p,x='')=>{console.log(`  ${p?'ok  ':'FAIL'} ${l}${x?' — '+x:''}`); if(!p)fails++}
const cell = async (rowLabel, col) => {
  const row = pg.locator('#balance table tbody tr').filter({hasText:rowLabel}).first()
  return (await row.locator('td').nth(col).innerText()).trim()
}

console.log('\n1 · wheat — the supply side is VAN\'s own arithmetic')
await pg.goto(`http://localhost:${port}/crops/wheat.html`,{waitUntil:'networkidle'})
// Independently computed from the published wheat plan: see __balancecheck. N 55.4, P2O5 20.4, K2O 11.4.
ok('nitrogen on', (await cell('Nitrogen', 1)).includes('55.4') /* D-77: may print as a range */, await cell('Nitrogen',1))
ok('phosphate on', (await cell('Phosphate', 1)).includes('20.4') /* D-77: may print as a range */, await cell('Phosphate',1))
ok('potash on', (await cell('Potash', 1)).startsWith('11.4'), await cell('Potash',1))

console.log('\n2 · wheat at 60 maunds — grain only')
const yin = pg.locator('#balance input[inputmode="decimal"]')
await yin.fill('60'); await pg.waitForTimeout(200)
// 60 md = 2.4 t. IPNI winter wheat grain: N 19, P2O5 8.0, K2O 4.8 per t.
for (const [label, per, on] of [['Nitrogen',19,55.4],['Phosphate',8.0,20.4],['Potash',4.8,11.4]]) {
  const off = per*2.4, bal = on-off
  ok(`${label} off = ${off.toFixed(1)}`, (await cell(label,2)).startsWith(off.toFixed(1)), await cell(label,2))
  ok(`${label} balance = ${bal>0?'+':''}${bal.toFixed(1)}`, (await cell(label,3)).replace(/\+/g,'').includes(bal.toFixed(1).replace('+','')) /* D-77 range */, await cell(label,3))
}

console.log('\n3 · with the bhusa taken off — the potash story')
await pg.locator('#balance input[type=checkbox]').check(); await pg.waitForTimeout(200)
// straw per t of grain: K2O 20 -> total K2O off = (4.8+20)*2.4 = 59.52
ok('potash off rises to 59.5', (await cell('Potash',2)).startsWith('59.5'), await cell('Potash',2))
ok('potash balance goes negative', (await cell('Potash',3)).startsWith('-48.1'), await cell('Potash',3))
const txt = await pg.locator('#balance').innerText()
ok('the source is named on the page', /IPNI/i.test(txt))
ok('and it says it is not Pakistani', /no pakistani nutrient-removal table/i.test(txt))
ok('uncounted products are named', /not counted on the left/i.test(txt))

console.log('\n4 · cotton — the refusal, and the reason')
await pg.goto(`http://localhost:${port}/crops/cotton.html`,{waitUntil:'networkidle'})
const ct = await pg.locator('#balance').innerText()
ok('no removal table is offered', await pg.locator('#balance table').count()===0)
ok('the supply side still shows', /94\.7 kg/.test(ct), ct.slice(0,120).replace(/\n/g,' / '))
ok('and it explains the lint basis', /per tonne of lint/i.test(ct))
ok('naming phutti', /phutti/i.test(ct))

console.log('\n5 · date palm — one age band, not all of them summed')
await pg.goto(`http://localhost:${port}/crops/date-palm.html`,{waitUntil:'networkidle'})
const dp = await pg.locator('#balance').innerText()
ok('nitrogen is the mature band alone, not the sum of five', /111\.4 kg/.test(dp) && !/334/.test(dp), dp.slice(0,140).replace(/\n/g,' / '))

console.log('\n6 · mango — per-tree rows are named, not silently dropped')
await pg.goto(`http://localhost:${port}/crops/mango.html`,{waitUntil:'networkidle'})
ok('per-tree rows named', /published\s*\n?\s*per tree, not per acre/i.test(await pg.locator('#balance').innerText()))

console.log('\npage errors:', errs.length)
console.log(fails===0 && errs.length===0 ? '\nALL CHECKS PASSED' : `\n${fails} FAILURES`)
await b.close(); srv.close()
process.exit(fails===0 && errs.length===0 ? 0 : 1)
