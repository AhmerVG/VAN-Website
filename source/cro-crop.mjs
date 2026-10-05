import { chromium } from 'playwright'
import http from 'http'; import fs from 'fs'; import path from 'path'
const root='/root/van/demo/out'
const srv=http.createServer((req,res)=>{ let f=path.join(root, decodeURIComponent(req.url.split('?')[0]));
  if(!fs.existsSync(f)||fs.statSync(f).isDirectory()) f=path.join(f,'index.html');
  if(!fs.existsSync(f)) { res.writeHead(404); return res.end('') }
  const e=path.extname(f); const t={'.css':'text/css','.js':'text/javascript','.webp':'image/webp','.png':'image/png','.svg':'image/svg+xml','.json':'application/json','.woff2':'font/woff2'}[e]||'text/html';
  res.writeHead(200,{'Content-Type':t}); res.end(fs.readFileSync(f)) })
await new Promise(r=>srv.listen(5616,r))
const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'})
const ctx=await b.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true})
const p=await ctx.newPage(); await p.goto('http://localhost:5616/crops/wheat.html',{waitUntil:'networkidle'}); await p.waitForTimeout(1500)
await p.click('text=Or leave your details here'); await p.waitForTimeout(800)
const info=await p.evaluate(()=>{ function bg(el){let n=el;while(n){const c=getComputedStyle(n).backgroundColor;if(c&&c!=='rgba(0, 0, 0, 0)')return c;n=n.parentElement}return 'none'}
 const o=[];document.querySelectorAll('form label').forEach(l=>{if(!l.htmlFor)return;o.push({l:l.innerText.trim(),c:getComputedStyle(l).color,bg:bg(l)})});
 const btn=document.querySelector('form button[type=submit]'); return {labels:o, btnDisabled: btn?btn.disabled:null, btnText: btn?btn.innerText:null}})
console.log(JSON.stringify(info,null,1))
const el=await p.$('form'); const box=await el.boundingBox(); await p.evaluate(y=>window.scrollTo(0,y-120), box.y)
await p.waitForTimeout(600)
await p.screenshot({path:'/tmp/claude-0/-home-claude/11c01173-bad1-5a2d-aea5-e2b61e13fda5/scratchpad/shots/cropform-m.png'})
await b.close(); srv.close()
