/**
 * The water panel is behaviour — nothing computes until a district is chosen. This drives it, and
 * checks the physics against values computed here, independently of the app.
 */
import { chromium } from 'playwright'
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path'; import { fileURLToPath } from 'node:url'
const OUT = path.join(path.dirname(fileURLToPath(import.meta.url)),'out')
const MIME={'.html':'text/html','.js':'text/javascript','.css':'text/css','.png':'image/png','.svg':'image/svg+xml','.ico':'image/x-icon','.woff2':'font/woff2'}
const srv=http.createServer((q,r)=>{const u=decodeURIComponent(q.url.split('?')[0]);const f=path.join(OUT,u==='/'?'index.html':u);if(!fs.existsSync(f)||fs.statSync(f).isDirectory()){r.writeHead(404);r.end();return}r.writeHead(200,{'content-type':MIME[path.extname(f)]||'application/octet-stream'});fs.createReadStream(f).pipe(r)})
await new Promise(r=>srv.listen(0,r)); const port=srv.address().port
const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'})
const ctx=await b.newContext({viewport:{width:1280,height:900},reducedMotion:'reduce'})
await ctx.route('**/*', r=> r.request().url().startsWith(`http://localhost:${port}`)||r.request().url().startsWith('data:')?r.continue():r.abort())
const pg=await ctx.newPage(); const errs=[]
pg.on('pageerror',e=>errs.push(String(e)))
let fails=0
const ok=(l,p,x='')=>{console.log(`  ${p?'ok  ':'FAIL'} ${l}${x?' — '+x:''}`);if(!p)fails++}

/* ── The physics, recomputed here from FAO-56 rather than trusted from the app ────────────── */
const GSC=0.0820, MJMM=0.408
const ra=(latDeg,doy)=>{const phi=Math.PI/180*latDeg,J=((doy%365)+365)%365+1
  const dr=1+0.033*Math.cos(2*Math.PI*J/365), de=0.409*Math.sin(2*Math.PI*J/365-1.39)
  const ws=Math.acos(Math.max(-1,Math.min(1,-Math.tan(phi)*Math.tan(de))))
  return (24*60/Math.PI)*GSC*dr*(ws*Math.sin(phi)*Math.sin(de)+Math.cos(phi)*Math.cos(de)*Math.sin(ws))}
// Ra sanity, independent of the app: at the equator Ra peaks near the equinoxes around 36-37 MJ.
ok('Ra at the equator on the March equinox is ~36 MJ', Math.abs(ra(0,79)-36.6)<1.5, ra(0,79).toFixed(1))
ok('Ra at 31.55N is higher in June than December', ra(31.55,171) > ra(31.55,355)*2, `${ra(31.55,171).toFixed(1)} vs ${ra(31.55,355).toFixed(1)}`)
ok('Ra never goes negative in Punjab', [...Array(365).keys()].every(d=>ra(31.55,d)>0))

console.log('\n1 · cotton in Multan — a full FAO model, and Pakistan is named in the source row')
await pg.goto(`http://localhost:${port}/crops/cotton.html`,{waitUntil:'networkidle'})
ok('nothing computes before a district is chosen', (await pg.locator('#water').innerText()).includes('Pick your district'))
await pg.locator('#water select').selectOption({label:'Multan'}); await pg.waitForTimeout(300)
const t = await pg.locator('#water').innerText()
const mm = [...t.matchAll(/(\d[\d,]*) mm/g)].map(m=>Number(m[1].replace(/,/g,'')))
ok('a season figure appears', mm.length>=3, t.split('\n').slice(0,10).join(' / '))
// A 195-day cotton season in Multan: ETc should land in the high hundreds to ~1200 mm.
ok('the crop requirement is in a believable range (600–1400 mm)', mm[0]>600 && mm[0]<1400, `${mm[0]} mm`)
ok('rain is far below it in Multan (annual normal 231 mm)', mm[1] < mm[0]/2, `${mm[1]} mm rain`)
ok('irrigation = need − rain', Math.abs((mm[0]-mm[1]) - mm[2]) <= 2, `${mm[0]} - ${mm[1]} vs ${mm[2]}`)
ok('the four FAO stages are listed', (await pg.locator('#water table tbody tr').count())===4)
ok('the FAO row is quoted, Pakistan named', /Egypt; Pakistan; California/.test(t))
ok('the station and its distance are given', /Multan.*km away|km away/.test(t))

console.log('\n2 · the three caveats travel with the number')
ok('Hargreaves is named, not hidden', /Hargreaves/.test(t))
ok('it says the figure is probably low for Punjab', /closer to a floor than a ceiling/i.test(t))
ok('it says this is not irrigation requirement', /not what you have to pump/i.test(t))
ok('rainfall is called total, not effective', /all\s*\n?\s*the rain/i.test(t))

console.log('\n3 · wheat — the refusal, with the reason and what FAO does print')
await pg.goto(`http://localhost:${port}/crops/wheat.html`,{waitUntil:'networkidle'})
await pg.locator('#water select').selectOption({label:'Faisalabad'}); await pg.waitForTimeout(300)
const w = await pg.locator('#water').innerText()
ok('no season total is claimed', !/has to be irrigated/i.test(w))
ok('reference ET and rain are still given', /reference evapotranspiration/i.test(w))
ok('it says which piece FAO leaves out', /leaves the initial crop coefficient as a dash/i.test(w))
ok('and gives the coefficient FAO does print', /1\.15 times/.test(w))
ok('Faisalabad is honest about having no station', /99 km away/.test(w), w.match(/[A-Za-z ]+, \d+ km away/)?.[0])

console.log('\n4 · the sowing date from block 01 drives it')
await pg.goto(`http://localhost:${port}/crops/cotton.html`,{waitUntil:'networkidle'})
await pg.locator('#water select').selectOption({label:'Multan'}); await pg.waitForTimeout(250)
const before = (await pg.locator('#water').innerText()).match(/(\d+) mm/)[1]
await pg.locator('input[type="date"]').fill('2026-05-20'); await pg.waitForTimeout(350)
const after = (await pg.locator('#water').innerText())
ok('the panel says it is using the farmer\'s own date', /Counting from your own sowing date/.test(after))
ok('and the figure moves with the date', after.match(/(\d+) mm/)[1] !== before, `${before} -> ${after.match(/(\d+) mm/)[1]}`)

console.log('\n5 · every district in the select reaches a station (D-151), on cotton and wheat')
for (const slug of ['cotton','wheat']) {
  await pg.goto(`http://localhost:${port}/crops/${slug}.html`,{waitUntil:'networkidle'})
  const opts = await pg.locator('#water select option').evaluateAll(os=>os.map(o=>({v:o.value,l:o.textContent})).filter(o=>o.v))
  const miss = []
  for (const o of opts) {
    await pg.locator('#water select').selectOption(o.v); await pg.waitForTimeout(40)
    const tx = await pg.locator('#water').innerText()
    if (!/km away/.test(tx) || /No weather station is mapped/.test(tx) || !/\d+ mm/.test(tx)) miss.push(o.l)
  }
  ok(`${slug}: all ${opts.length} districts give a station and figures`, opts.length===36 && miss.length===0, miss.join(', '))
}

console.log('\npage errors:', errs.length)
console.log(fails===0 && errs.length===0 ? '\nALL CHECKS PASSED' : `\n${fails} FAILURES`)
await b.close(); srv.close()
process.exit(fails===0 && errs.length===0?0:1)
