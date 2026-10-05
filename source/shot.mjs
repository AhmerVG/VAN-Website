import { chromium } from 'playwright'
import http from 'http'; import fs from 'fs'; import path from 'path'
const root='/root/van/demo/out'
const srv=http.createServer((req,res)=>{ let f=path.join(root, decodeURIComponent(req.url.split('?')[0]));
  if(!fs.existsSync(f)||fs.statSync(f).isDirectory()) f=path.join(f,'index.html');
  if(!fs.existsSync(f)) { res.writeHead(404); return res.end('') }
  const t=f.endsWith('.css')?'text/css':f.endsWith('.js')?'text/javascript':f.endsWith('.webp')?'image/webp':f.endsWith('.png')?'image/png':'text/html';
  res.writeHead(200,{'Content-Type':t}); res.end(fs.readFileSync(f)) })
await new Promise(r=>srv.listen(5601,r))
const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'})
const p=await b.newPage({viewport:{width:1440,height:1000}})
await p.goto('http://localhost:5601/brands/index.html',{waitUntil:'networkidle'})
await p.waitForTimeout(1200)
await p.screenshot({path:'/tmp/packs2/products-page.png', fullPage:false})
await b.close(); srv.close()
