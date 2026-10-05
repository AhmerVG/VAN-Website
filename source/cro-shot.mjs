import { chromium } from 'playwright'
import http from 'http'; import fs from 'fs'; import path from 'path'
const OUT='/tmp/claude-0/-home-claude/11c01173-bad1-5a2d-aea5-e2b61e13fda5/scratchpad/shots'
const root='/root/van/demo/out'
const srv=http.createServer((req,res)=>{ let f=path.join(root, decodeURIComponent(req.url.split('?')[0]));
  if(!fs.existsSync(f)||fs.statSync(f).isDirectory()) f=path.join(f,'index.html');
  if(!fs.existsSync(f)) { res.writeHead(404); return res.end('') }
  const e=path.extname(f);
  const t={'.css':'text/css','.js':'text/javascript','.mjs':'text/javascript','.webp':'image/webp','.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml','.json':'application/json','.woff2':'font/woff2','.pdf':'application/pdf'}[e]||'text/html';
  res.writeHead(200,{'Content-Type':t}); res.end(fs.readFileSync(f)) })
await new Promise(r=>srv.listen(5611,r))
const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'})
const targets = JSON.parse(process.argv[2])
for(const [name,url,scrolls,vp] of targets){
  const isM = vp==='m'
  const ctx = await b.newContext({viewport: isM?{width:390,height:844}:{width:1280,height:900}, deviceScaleFactor:1, isMobile:isM, hasTouch:isM, userAgent: isM?'Mozilla/5.0 (Linux; Android 11; moto g power) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Mobile Safari/537.36':undefined})
  const p = await ctx.newPage()
  try{
    await p.goto('http://localhost:5611'+url,{waitUntil:'networkidle',timeout:30000})
  }catch(e){ console.log('nav slow',url) }
  await p.waitForTimeout(1500)
  for(const s of scrolls){
    if(s>0){ await p.evaluate(y=>window.scrollTo(0,y), s); await p.waitForTimeout(900) }
    await p.screenshot({path:`${OUT}/${name}-${vp}-${s}.png`})
  }
  const h = await p.evaluate(()=>document.body.scrollHeight)
  console.log(name, vp, 'height', h)
  await ctx.close()
}
await b.close(); srv.close()
