/** Reproduce Tahir's own worked example from the Potato workbook, in the live UI. */
import { chromium } from 'playwright'
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path'; import { fileURLToPath } from 'node:url'
// The build writes beside this script; an absolute home path breaks the moment the repo is
// unpacked anywhere else, which is exactly what happened on 9 Sep 2026.
const OUT=path.join(path.dirname(fileURLToPath(import.meta.url)),'out')
const MIME={'.html':'text/html','.js':'text/javascript','.css':'text/css','.png':'image/png','.svg':'image/svg+xml','.ico':'image/x-icon','.woff2':'font/woff2'}
const srv=http.createServer((q,r)=>{const u=decodeURIComponent(q.url.split('?')[0]);const f=path.join(OUT,u==='/'?'index.html':u);if(!fs.existsSync(f)||fs.statSync(f).isDirectory()){r.writeHead(404);r.end();return}r.writeHead(200,{'content-type':MIME[path.extname(f)]||'application/octet-stream'});fs.createReadStream(f).pipe(r)})
await new Promise(r=>srv.listen(0,r)); const port=srv.address().port
const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'})
const ctx=await b.newContext({viewport:{width:1280,height:1000},reducedMotion:'reduce'})
await ctx.route('**/*', r=> r.request().url().startsWith(`http://localhost:${port}`)||r.request().url().startsWith('data:') ? r.continue():r.abort())
const pg=await ctx.newPage(); const errs=[]; pg.on('pageerror',e=>errs.push(String(e)))
await pg.goto(`http://localhost:${port}/simulator/potato.html`,{waitUntil:'networkidle'})

// The predicted-yield figure is the .num beside the "maunds/acre" caption in the header panel.
const yieldNow = async () => pg.evaluate(() => {
  const cap = [...document.querySelectorAll('.cap')].find(e => e.textContent.trim() === 'maunds/acre')
  return cap ? cap.previousElementSibling.textContent.trim() : 'NOT FOUND'
})
const setAll = async (lvl) => { for (const n of await pg.locator('button[aria-label$=": '+lvl+'"]').all()) await n.click() }

await setAll('Best'); await pg.waitForTimeout(120); console.log('all Best :', await yieldNow(), '(expect 300.0)')
await setAll('Bad');  await pg.waitForTimeout(120); console.log('all Bad  :', await yieldNow(), '(expect 0.0)')
await setAll('OK');   await pg.waitForTimeout(120); console.log('all OK   :', await yieldNow(), '(expect 150.0)')

// His worked example: seed Best, disease OK, irrigation Best, macro Best, insect OK,
// hilling Best, micronutrient Bad, seed rate Best, planting OK, harvest Bad.
// His sheet reaches 511.26 maunds on a base of 686.25 maunds per acre. That base was the fault, not
// the arithmetic: 686.25 maunds/acre is 67.8 t/ha, about two and a half times the best potato yields
// anywhere. The base is now 300 maunds/acre — HIS OWN RULING of 10 Sep 2026, replacing the derived
// 277.7 (30.5 t/ha less the measurement margin), which sat only 12% above the national average. The
// worked-example figure below therefore rises in the same proportion: 206.9 x 300 / 277.7 = 223.5.
// (his own 30.5 t read per hectare, as potato potential
// is normally published), so every figure in his worked example scales by the same 1/2.4710538 and
// the LEVER MODEL IS UNCHANGED. 511.26 / 2.4710538 = 206.9.
const EX = [['Seed Tuber','Best'],['Disease Management','OK'],['Irrigation','Best'],['Macronutrient','Best'],
            ['Insect-Pest','OK'],['Hilling','Best'],['Micronutrient','Bad'],['Seed Rate','Best'],
            ['Planting Time','OK'],['Harvest Timing','Bad']]
for (const [lever, lvl] of EX) {
  await pg.locator(`button[aria-label^="${lever}"][aria-label$=": ${lvl}"]`).first().click()
}
await pg.waitForTimeout(200)
console.log("Tahir's worked example :", await yieldNow(), '(his sheet says 511.26 on the old per-acre base; 223.5 on his 300-maund ceiling)')
const src = fs.readFileSync(path.join(OUT,'simulator/potato.html'),'utf8')
// The standing rule: the public simulator shows inputs and outcomes, never the scoring mechanism.
// Checked against real strings from the internal data, not a loose pattern — an earlier version of
// this test matched the CSS "font-weight" and cried wolf.
const LEAKS = ['Hannan', 'ResearchGate', 'Phytophthora', 'PMC10279688', 'ScienceDirect', 'solanine',
               'PVY', 'K2O/ha', 'Irish Potato', 'degeneration', 'Lindsay', 'Mueller et al']
const found = LEAKS.filter(t => src.includes(t))
console.log('mechanism leaked into the page source:', found.length ? 'YES — ' + found.join(', ') : 'no')
console.log('page errors:', errs.length)
await b.close(); srv.close()
