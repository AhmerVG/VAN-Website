import { chromium } from 'playwright'
import http from 'http'; import fs from 'fs'; import path from 'path'
const root='/root/van/demo/out'
const srv=http.createServer((req,res)=>{ let f=path.join(root, decodeURIComponent(req.url.split('?')[0]));
  if(!fs.existsSync(f)||fs.statSync(f).isDirectory()) f=path.join(f,'index.html');
  if(!fs.existsSync(f)) { res.writeHead(404); return res.end('') }
  const e=path.extname(f); const t={'.css':'text/css','.js':'text/javascript','.webp':'image/webp','.png':'image/png','.svg':'image/svg+xml','.json':'application/json','.woff2':'font/woff2'}[e]||'text/html';
  res.writeHead(200,{'Content-Type':t}); res.end(fs.readFileSync(f)) })
await new Promise(r=>srv.listen(5614,r))
const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'})
for(const url of process.argv[2].split(',')){
const ctx=await b.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true})
const p=await ctx.newPage(); await p.goto('http://localhost:5614'+url,{waitUntil:'networkidle'}); await p.waitForTimeout(1500)
const r=await p.evaluate(()=>{
  const vw=document.documentElement.clientWidth
  const docOverflow = document.documentElement.scrollWidth - vw
  const bad=[]
  document.querySelectorAll('table,pre,div,section,ul,figure').forEach(el=>{
    const r=el.getBoundingClientRect()
    if(r.width>vw+2){ const cs=getComputedStyle(el); const par=el.parentElement; const pcs=par?getComputedStyle(par):null
      bad.push({tag:el.tagName,cls:(el.className||'').toString().slice(0,60),w:Math.round(r.width),ovx:cs.overflowX,parentOvx:pcs?pcs.overflowX:'',txt:(el.innerText||'').slice(0,50).replace(/\n/g,' ')}) } })
  // tap targets
  const small=[]
  document.querySelectorAll('a,button,input,select,[role=button]').forEach(el=>{
    const r=el.getBoundingClientRect(); if(r.width===0||r.height===0) return
    if(r.height<40||r.width<40) small.push({tag:el.tagName,h:Math.round(r.height),w:Math.round(r.width),txt:(el.innerText||el.getAttribute('aria-label')||'').slice(0,40).replace(/\n/g,' ')})
  })
  return {vw,docOverflow,bad:bad.slice(0,12),smallCount:small.length,small:small.slice(0,15)}
})
console.log('=== '+url); console.log(JSON.stringify(r,null,1).slice(0,3000))
await ctx.close()
}
await b.close(); srv.close()
