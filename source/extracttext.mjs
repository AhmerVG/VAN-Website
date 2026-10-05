/** Extract the VISIBLE text of every built page, for audit. Rendered, not source. */
import { chromium } from 'playwright'
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path'; import { fileURLToPath } from 'node:url'
const ROOT = path.dirname(fileURLToPath(import.meta.url))
const OUT = path.join(ROOT, 'out'); const TXT = path.join(ROOT, 'audit-text')
fs.rmSync(TXT, { recursive: true, force: true }); fs.mkdirSync(TXT, { recursive: true })
const MIME = { '.html':'text/html','.js':'text/javascript','.css':'text/css','.png':'image/png','.svg':'image/svg+xml','.ico':'image/x-icon','.woff2':'font/woff2' }
const srv = http.createServer((q,r)=>{const u=decodeURIComponent(q.url.split('?')[0]);const f=path.join(OUT,u==='/'?'index.html':u);if(!fs.existsSync(f)||fs.statSync(f).isDirectory()){r.writeHead(404);r.end();return}r.writeHead(200,{'content-type':MIME[path.extname(f)]||'application/octet-stream'});fs.createReadStream(f).pipe(r)})
await new Promise(r=>srv.listen(0,r)); const port=srv.address().port
const pages=[]; (function walk(d){for(const e of fs.readdirSync(d,{withFileTypes:true})){const p=path.join(d,e.name); if(e.isDirectory())walk(p); else if(e.name.endsWith('.html'))pages.push(path.relative(OUT,p).replace(/\\/g,'/'))}})(OUT)
pages.sort()
const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'})
const ctx=await b.newContext({viewport:{width:1280,height:900},reducedMotion:'reduce'})
await ctx.route('**/*', r=> r.request().url().startsWith(`http://localhost:${port}`)||r.request().url().startsWith('data:')?r.continue():r.abort())
const pg=await ctx.newPage()
let total=0
for(const rel of pages){
  await pg.goto(`http://localhost:${port}/${rel}`,{waitUntil:'networkidle'})
  // open every <details> so folded copy is captured too
  await pg.evaluate(()=>document.querySelectorAll('details').forEach(d=>d.open=true))
  await pg.waitForTimeout(60)
  const t = await pg.evaluate(()=>{
    const skip=new Set(['SCRIPT','STYLE','NOSCRIPT'])
    const w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT)
    const out=[];let n
    while((n=w.nextNode())){ if(skip.has(n.parentElement?.tagName))continue
      const s=n.nodeValue.replace(/\s+/g,' ').trim(); if(s)out.push(s) }
    return out.join('\n')
  })
  const name = rel.replace(/\//g,'__').replace(/\.html$/,'.txt')
  fs.writeFileSync(path.join(TXT,name), `PAGE: /${rel}\n${'='.repeat(70)}\n${t}\n`)
  total += t.length
}
await b.close(); srv.close()
console.log(`extracted ${pages.length} pages, ${(total/1024).toFixed(0)} KB of visible text -> audit-text/`)
