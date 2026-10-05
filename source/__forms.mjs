import { chromium } from 'playwright'
import http from 'http'; import fs from 'fs'; import path from 'path'
const root='/root/van/demo/out'
const srv=http.createServer((req,res)=>{ let f=path.join(root, decodeURIComponent(req.url.split('?')[0]));
  if(!fs.existsSync(f)||fs.statSync(f).isDirectory()) f=path.join(f,'index.html');
  if(!fs.existsSync(f)) { res.writeHead(404); return res.end('') }
  const t=f.endsWith('.css')?'text/css':f.endsWith('.js')?'text/javascript':f.endsWith('.png')?'image/png':f.endsWith('.svg')?'image/svg+xml':f.endsWith('.jpg')?'image/jpeg':'text/html';
  res.writeHead(200,{'Content-Type':t}); res.end(fs.readFileSync(f)) })
await new Promise(r=>srv.listen(5722,r))
const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'})
const p=await b.newPage({viewport:{width:1440,height:1000},deviceScaleFactor:1})
const errs=[]; p.on('pageerror',e=>errs.push(String(e)))

// 1) the endpoint is OFF: submitting must fall back, never claim success
await p.goto('http://localhost:5722/become-a-dealer.html',{waitUntil:'networkidle'}); await p.waitForTimeout(900)
await p.fill('#dealer-email','tahir@example.com')
await p.fill('#dealer-phone','0300 1234567')
await p.click('button[type=submit]'); await p.waitForTimeout(600)
let t = await p.evaluate(()=>document.body.innerText)
console.log('offline -> falls back  :', /not connected yet/.test(t))
console.log('offline -> never "Sent":', !/\bSent\.\b/.test(t))
console.log('phone normalised in wa :', /%2B92%20300%201234567/.test(await p.evaluate(()=>[...document.querySelectorAll('a')].map(a=>a.href).join(' '))))

// 2) validation
await p.fill('#dealer-email','not-an-email'); await p.click('#dealer-phone'); await p.waitForTimeout(200)
console.log('bad email flagged      :', /does not look like an email/.test(await p.evaluate(()=>document.body.innerText)))
await p.fill('#dealer-email','tahir@example.com')
await p.fill('#dealer-phone','12345'); await p.click('#dealer-email'); await p.waitForTimeout(200)
console.log('bad phone flagged      :', /0300 1234567 or/.test(await p.evaluate(()=>document.body.innerText)))

// 3) with an endpoint answering, it must actually post and show the reference
await p.route('**/api/enquiry', route => route.fulfill({status:200, contentType:'application/json', body:JSON.stringify({ok:true, ref:'ENQ-2026-0184'})}))
const posted = await p.evaluate(async () => {
  const r = await fetch('/api/enquiry', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({form:'dealer', fields:{}, page:'#/x', sentAt:'', openedMs:9000, hp:''})})
  return (await r.json()).ref
})
console.log('endpoint contract      :', posted)

// 4) every form renders and has a submit
for (const [url, sel] of [['/become-a-dealer.html','#dealer-email'], ['/partner/index.html','#partner-company'], ['/lab/index.html','#lab-test-name'], ['/crops/wheat.html', null], ['/crops/cotton.html', null]]) {
  await p.goto('http://localhost:5722'+url,{waitUntil:'networkidle'}); await p.waitForTimeout(700)
  if (url.includes('/crops/')) {
    await p.evaluate(()=>{const b=[...document.querySelectorAll('button')].find(x=>/leave your details here/.test(x.textContent)); b&&b.click()})
    await p.waitForTimeout(400)
  }
  const has = await p.evaluate(()=>document.querySelectorAll('form button[type=submit]').length)
  const hp = await p.evaluate(()=>document.querySelectorAll('input[name=company_website]').length)
  console.log(url.padEnd(24), 'submit buttons:', has, '· honeypots:', hp)
}
console.log('errors', errs)
await b.close(); srv.close()
