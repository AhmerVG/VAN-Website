import { chromium } from 'playwright'
const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'})
const p = await b.newPage()
const errs=[]
p.on('pageerror', e=>errs.push(String(e).slice(0,200)))
await p.goto('file:///root/van/demo/review-copy.html', {waitUntil:'load'})
await p.waitForTimeout(2500)
for (const r of ['#/', '#/soil', '#/crops/wheat', '#/lab', '#/where-to-buy', '#/tools', '#/about', '#/knowledge/why-pakistan-must-shift', '#/simulator']) {
  await p.evaluate(h => { location.hash = h }, r)
  await p.waitForTimeout(900)
  const h1 = await p.evaluate(() => document.querySelector('h1')?.innerText?.slice(0,70) ?? 'NO H1')
  console.log(r.padEnd(38), '|', h1.replace(/\n/g,' '))
}
console.log('page errors:', errs.length, errs.slice(0,3))
await b.close()
