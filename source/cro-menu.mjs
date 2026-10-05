import { chromium } from 'playwright'
import http from 'http'; import fs from 'fs'; import path from 'path'
const OUT='/tmp/claude-0/-home-claude/11c01173-bad1-5a2d-aea5-e2b61e13fda5/scratchpad/shots'
const root='/root/van/demo/out'
const srv=http.createServer((req,res)=>{ let f=path.join(root, decodeURIComponent(req.url.split('?')[0]));
  if(!fs.existsSync(f)||fs.statSync(f).isDirectory()) f=path.join(f,'index.html');
  if(!fs.existsSync(f)) { res.writeHead(404); return res.end('') }
  const e=path.extname(f); const t={'.css':'text/css','.js':'text/javascript','.webp':'image/webp','.png':'image/png','.svg':'image/svg+xml','.json':'application/json','.woff2':'font/woff2'}[e]||'text/html';
  res.writeHead(200,{'Content-Type':t}); res.end(fs.readFileSync(f)) })
await new Promise(r=>srv.listen(5615,r))
const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'})
const ctx=await b.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true})
const p=await ctx.newPage(); await p.goto('http://localhost:5615/index.html',{waitUntil:'networkidle'}); await p.waitForTimeout(1200)
await p.click('text=Menu')
await p.waitForTimeout(900)
await p.screenshot({path:OUT+'/menu-m-0.png'})
await p.evaluate(()=>{const el=document.querySelector('[role=dialog], .menu-panel, aside'); if(el) el.scrollTop=600; else window.scrollTo(0,600)})
await p.waitForTimeout(500)
await p.screenshot({path:OUT+'/menu-m-1.png'})
// sticky bar targets
const links=await p.evaluate(()=>Array.from(document.querySelectorAll('a')).filter(a=>/Find a dealer|My crop|Verify a bag/.test(a.innerText)).map(a=>({t:a.innerText.trim(),href:a.getAttribute('href')})))
console.log(JSON.stringify(links))
await b.close(); srv.close()
