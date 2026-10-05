import { chromium } from 'playwright'
import http from 'http'; import fs from 'fs'; import path from 'path'
const root='/root/van/demo/out'
const srv=http.createServer((req,res)=>{ let f=path.join(root, decodeURIComponent(req.url.split('?')[0]));
  if(!fs.existsSync(f)||fs.statSync(f).isDirectory()) f=path.join(f,'index.html');
  if(!fs.existsSync(f)){res.writeHead(404);return res.end('')}
  const t=f.endsWith('.css')?'text/css':f.endsWith('.js')?'text/javascript':f.endsWith('.webp')?'image/webp':f.endsWith('.png')?'image/png':'text/html';
  res.writeHead(200,{'Content-Type':t}); res.end(fs.readFileSync(f)) })
await new Promise(r=>srv.listen(5620,r))
const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'})
const p=await b.newPage({viewport:{width:1440,height:900}})
await p.goto('http://localhost:5620/partner/index.html',{waitUntil:'networkidle'})
await p.waitForTimeout(800)
const m = await p.evaluate(() => {
  const vw = innerWidth, vh = innerHeight
  const inFold = el => { const r = el.getBoundingClientRect(); return r.top < vh && r.bottom > 0 }
  const clickable = [...document.querySelectorAll('button, a[href], input, select')].filter(inFold)
  // rightmost pixel any text reaches, above the fold
  let maxRight = 0
  for (const el of document.querySelectorAll('h1,h2,h3,p,span,li,div')) {
    if (!inFold(el)) continue
    if (!el.childNodes.length) continue
    const hasText = [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim())
    if (!hasText) continue
    const r = el.getBoundingClientRect(); if (r.right > maxRight) maxRight = r.right
  }
  const routeCards = [...document.querySelectorAll('button[aria-pressed]')]
  const firstRoute = routeCards[0]?.getBoundingClientRect().top ?? null
  return { vw, vh, clickableAboveFold: clickable.length, maxRight, firstRouteTop: firstRoute,
           pageHeight: document.body.scrollHeight }
})
console.log(JSON.stringify(m, null, 1))
await b.close(); srv.close()
