/**
 * The enquiry form is behaviour, not copy — the sweep cannot see it. This drives it for real.
 *
 * Rewritten 10 September 2026 for the VanForm engine, which replaced EnquiryForm. What it checks is
 * unchanged: a Pakistani number typed any of five ways reaches VAN in one form, a bad number is
 * refused with an instruction rather than a shrug, and there is no Submit button that goes nowhere.
 * What changed is the wording it looks for and the fact that Submit now genuinely submits, so the
 * old "no Submit button" assertion became "Submit is present and the fallback routes are too".
 */
import { chromium } from 'playwright'
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path'; import { fileURLToPath } from 'node:url'
// The build writes beside this script; an absolute home path breaks the moment the repo is
// unpacked anywhere else, which is exactly what happened on 9 Sep 2026.
const OUT=path.join(path.dirname(fileURLToPath(import.meta.url)),'out')
const MIME={'.html':'text/html','.js':'text/javascript','.css':'text/css','.png':'image/png','.svg':'image/svg+xml','.ico':'image/x-icon','.woff2':'font/woff2'}
const srv=http.createServer((q,r)=>{const u=decodeURIComponent(q.url.split('?')[0]);const f=path.join(OUT,u==='/'?'index.html':u);if(!fs.existsSync(f)||fs.statSync(f).isDirectory()){r.writeHead(404);r.end();return}r.writeHead(200,{'content-type':MIME[path.extname(f)]||'application/octet-stream'});fs.createReadStream(f).pipe(r)})
await new Promise(r=>srv.listen(0,r)); const port=srv.address().port
const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'})
const ctx=await b.newContext({viewport:{width:1280,height:900},reducedMotion:'reduce'})
await ctx.route('**/*', r=> r.request().url().startsWith(`http://localhost:${port}`)||r.request().url().startsWith('data:') ? r.continue():r.abort())
// H3, 24 Sep 2026: record window.open instead of letting it navigate, so the test can see that the
// main button hands the ready-written message to WhatsApp while FORMS.enabled is false.
await ctx.addInitScript(() => { window.__opened = []; window.open = (u) => { window.__opened.push(String(u)); return null } })
let fails = 0
const check = (label, pass) => { console.log(`${label}: ${pass ? 'yes' : 'NO'}`); if (!pass) fails++ }
const pg=await ctx.newPage(); const errs=[]
pg.on('pageerror',e=>errs.push(String(e)))
await pg.goto(`http://localhost:${port}/become-a-dealer.html`,{waitUntil:'networkidle'})

// FAQ answers must be in the page SOURCE, not injected on click
const src = fs.readFileSync(path.join(OUT,'become-a-dealer.html'),'utf8')
check('FAQ answers in page source', /advance bookings against a cash discount/.test(src)) // D-210: the territory sentence came off; the probe is FAQ 4
console.log('<details> in source:', (src.match(/<details/g)||[]).length)

const phone = pg.locator('input[type="tel"]')
const email = pg.locator('input[type="email"]')
const waBtn = () => pg.locator('a,span').filter({hasText:/Send it on WhatsApp/}).first()

for (const [input, expect] of [['0300 1234567','+92 300 1234567'],['+92 300 1234567','+92 300 1234567'],
                               ['92 300 1234567','+92 300 1234567'],['300-1234567','+92 300 1234567'],
                               ['03001234567','+92 300 1234567'],['12345','REJECT']]) {
  await phone.fill(input); await phone.blur(); await pg.waitForTimeout(80)
  const txt = await pg.locator('text=/Will be sent as|Write it as 0300/').first().innerText()
  const got = txt.includes('Will be sent as') ? txt.replace('Will be sent as ','').trim() : 'REJECT'
  console.log(`  phone ${JSON.stringify(input).padEnd(18)} -> ${got.padEnd(16)} ${got===expect?'ok':'FAIL expected '+expect}`)
  if (got !== expect) fails++
}
await phone.fill('0300 1234567'); await phone.blur()
await email.fill('not-an-email'); await email.blur(); await pg.waitForTimeout(80)
check('bad email flagged', await pg.locator('text=does not look like an email').count() > 0)
await email.fill('sales@company.com'); await email.blur(); await pg.waitForTimeout(120)
// FORMS.enabled is false until the backend endpoint exists. H3, 24 Sep 2026: pressing the main button
// must then go straight to the ready-written WhatsApp message, offer email as the second route, and
// never say "not connected yet" or offer a "Try again" that cannot work. Checked on all three pages
// the audit named. The old assertion accepted the "not connected yet" notice as a pass; it is now a fail.
async function fillRequired() {
  for (const inp of await pg.$$('form input:not([name=company_website]), form textarea, form select')) {
    const id = await inp.getAttribute('id'); if (!id) continue
    const lbl = await pg.$eval(`label[for="${id}"]`, e => e.textContent).catch(()=>'')
    if (/optional/i.test(lbl)) continue
    const tag = await inp.evaluate(e => e.tagName)
    const t = await inp.getAttribute('type')
    if (tag === 'SELECT') { if (!(await inp.inputValue())) await inp.selectOption({ index: 1 }); continue }
    if (t === 'tel') { if (!(await inp.inputValue())) await inp.fill('0300 1234567'); continue }
    if (t === 'email') { if (!(await inp.inputValue())) await inp.fill('sales@company.com'); continue }
    if (!(await inp.inputValue())) await inp.fill('Test')
  }
}
for (const page of ['become-a-dealer.html', 'partner/index.html', 'lab/index.html']) {
  console.log(`\n${page}`)
  if (page !== 'become-a-dealer.html') await pg.goto(`http://localhost:${port}/${page}`,{waitUntil:'networkidle'})
  await pg.evaluate(() => { window.__opened = [] })
  const form = pg.locator('form').filter({ has: pg.locator('button[type=submit]') }).first()
  const note = await form.innerText()
  check('  line under the button describes the WhatsApp hand-off', /opens WhatsApp with your message already written/.test(note))
  check('  no claim that it goes straight to an inbox', !/VAN's own inbox, not a third party/.test(note))
  await fillRequired()
  const submit = form.locator('button[type=submit]').first()
  check('  Submit button present', await submit.count() > 0)
  await submit.click()
  await pg.waitForTimeout(400)
  const opened = await pg.evaluate(() => window.__opened)
  check('  main button opens the ready-written WhatsApp message', opened.length === 1 && /^https:\/\/wa\.me\/\d+\?text=/.test(opened[0]) && /Test|0300|\+92/.test(decodeURIComponent(opened[0])))
  if (opened[0]) console.log('  WhatsApp message:', decodeURIComponent(opened[0].split('text=')[1]).replace(/\n/g,' | ').slice(0,140))
  check('  hand-off panel shown', await pg.locator('text=/Your message is written and ready/').count() > 0)
  check('  no "not connected yet" wording', await pg.locator('text=/not connected yet/i').count() === 0)
  check('  no "Try again" button', await form.locator('button', { hasText: /Try again/ }).count() === 0)
  const mail = await form.locator('a[href^="mailto:"]', { hasText: /Send by email/ }).first().getAttribute('href').catch(()=>null)
  check('  email offered as the second route', !!mail)
  console.log('  email route goes to:', mail ? mail.split('?')[0] : 'NONE')
}
check('honeypot is off-screen, not display:none (present)', await pg.locator('input[name=company_website]').count() > 0)
console.log('page errors:', errs.length)
if (errs.length) fails++
console.log(fails === 0 ? '\nALL CHECKS PASSED' : `\n${fails} FAILURES`)
await b.close(); srv.close()
process.exit(fails === 0 ? 0 : 1)
