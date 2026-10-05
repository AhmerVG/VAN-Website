import { chromium } from 'playwright'
import http from 'http'; import fs from 'fs'; import path from 'path'
const root='/root/van/demo/out'
const srv=http.createServer((req,res)=>{ let f=path.join(root, decodeURIComponent(req.url.split('?')[0]));
  if(!fs.existsSync(f)||fs.statSync(f).isDirectory()) f=path.join(f,'index.html');
  if(!fs.existsSync(f)) { res.writeHead(404); return res.end('') }
  const e=path.extname(f);
  const t={'.css':'text/css','.js':'text/javascript','.webp':'image/webp','.png':'image/png','.svg':'image/svg+xml','.json':'application/json','.woff2':'font/woff2'}[e]||'text/html';
  res.writeHead(200,{'Content-Type':t}); res.end(fs.readFileSync(f)) })
await new Promise(r=>srv.listen(5612,r))
const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'})
for(const url of process.argv[2].split(',')){
const ctx=await b.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true})
const p=await ctx.newPage()
await p.goto('http://localhost:5612'+url,{waitUntil:'networkidle'}); await p.waitForTimeout(1200)
const info = await p.evaluate(()=>{
  const out=[]
  document.querySelectorAll('form').forEach((f,i)=>{
    const fields=[]
    f.querySelectorAll('input,select,textarea,button').forEach(el=>{
      let lab=''
      if(el.id){ const l=document.querySelector(`label[for="${CSS.escape(el.id)}"]`); if(l){ const cs=getComputedStyle(l); lab=l.innerText.trim()+` [color:${cs.color} size:${cs.fontSize} display:${cs.display} vis:${cs.visibility} op:${cs.opacity}]` } }
      const r=el.getBoundingClientRect()
      fields.push({tag:el.tagName,type:el.type||'',name:el.name||el.id,required:el.required,placeholder:el.placeholder||'',label:lab, h:Math.round(r.height), text:(el.tagName==='BUTTON'?el.innerText.trim():'')})
    })
    out.push({form:i, action:f.action||'', fields})
  })
  return out
})
console.log('=== '+url); console.log(JSON.stringify(info,null,1))
await ctx.close()
}
await b.close(); srv.close()
