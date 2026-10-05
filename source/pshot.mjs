import { chromium } from 'playwright'
import http from 'http'; import fs from 'fs'; import path from 'path'
const root='/root/van/demo/out'
const srv=http.createServer((req,res)=>{ let f=path.join(root, decodeURIComponent(req.url.split('?')[0]));
  if(!fs.existsSync(f)||fs.statSync(f).isDirectory()) f=path.join(f,'index.html');
  if(!fs.existsSync(f)){res.writeHead(404);return res.end('')}
  const t=f.endsWith('.css')?'text/css':f.endsWith('.js')?'text/javascript':f.endsWith('.webp')?'image/webp':f.endsWith('.png')?'image/png':'text/html';
  res.writeHead(200,{'Content-Type':t}); res.end(fs.readFileSync(f)) })
await new Promise(r=>srv.listen(5610,r))
const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'})
const p=await b.newPage({viewport:{width:1440,height:1180}})
const errs=[]; p.on('pageerror',e=>errs.push(String(e).slice(0,150)))
await p.goto('http://localhost:5610/partner/index.html',{waitUntil:'networkidle'})
await p.waitForTimeout(1000)
await p.screenshot({path:'/tmp/packs3/partner-top.png'})
// click the second route
await p.evaluate(()=>{ const b=[...document.querySelectorAll('button[aria-pressed]')].find(x=>x.innerText.includes('Ready to carry')); if(b) b.click() });
await p.waitForTimeout(600)
await p.evaluate(()=>window.scrollTo(0,700)); await p.waitForTimeout(400)
await p.screenshot({path:'/tmp/packs3/partner-route2.png'})
console.log('errors:', errs.length, errs.slice(0,2))
console.log('h1:', await p.evaluate(()=>document.querySelector('h1')?.innerText))
await b.close(); srv.close()
