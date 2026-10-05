import { chromium } from 'playwright'
import http from 'http'; import fs from 'fs'; import path from 'path'
const root='/root/van/demo/out'
const srv=http.createServer((req,res)=>{ let f=path.join(root, decodeURIComponent(req.url.split('?')[0]));
  if(!fs.existsSync(f)||fs.statSync(f).isDirectory()) f=path.join(f,'index.html');
  if(!fs.existsSync(f)) { res.writeHead(404); return res.end('') }
  const e=path.extname(f);
  const t={'.css':'text/css','.js':'text/javascript','.webp':'image/webp','.png':'image/png','.svg':'image/svg+xml','.json':'application/json','.woff2':'font/woff2'}[e]||'text/html';
  res.writeHead(200,{'Content-Type':t}); res.end(fs.readFileSync(f)) })
await new Promise(r=>srv.listen(5613,r))
const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'})
for(const spec of process.argv[2].split(',')){
const [url,w] = spec.split('@')
const W=parseInt(w||'390')
const ctx=await b.newContext({viewport:{width:W,height:844},isMobile:W<500,hasTouch:W<500})
const p=await ctx.newPage()
await p.goto('http://localhost:5613'+url,{waitUntil:'networkidle'}); await p.waitForTimeout(1200)
const info = await p.evaluate(()=>{
  function bg(el){ let n=el; while(n){ const c=getComputedStyle(n).backgroundColor; if(c && c!=='rgba(0, 0, 0, 0)' && c!=='transparent') return c; n=n.parentElement } return 'none' }
  const out=[]
  document.querySelectorAll('form').forEach((f,i)=>{
    const fields=[]
    f.querySelectorAll('input,select,textarea,button').forEach(el=>{
      let lab='',lc='',lbg=''
      if(el.id){ const l=document.querySelector(`label[for="${CSS.escape(el.id)}"]`); if(l){ lab=l.innerText.trim(); lc=getComputedStyle(l).color; lbg=bg(l) } }
      const r=el.getBoundingClientRect()
      fields.push({t:el.tagName+':'+(el.type||''),name:el.name||el.id,req:el.required,ph:el.placeholder||'',label:lab,labelColor:lc,labelBg:lbg,h:Math.round(r.height),txt:(el.tagName==='BUTTON'?el.innerText.trim():'')})
    })
    out.push({form:i, formBg:bg(f), fields})
  })
  return out
})
console.log('=== '+url+' @'+W); 
for(const f of info){ console.log(' formBg='+f.formBg); for(const x of f.fields) console.log('  ', JSON.stringify(x)) }
await ctx.close()
}
await b.close(); srv.close()
