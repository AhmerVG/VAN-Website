import { chromium } from 'playwright'
import http from 'http'; import fs from 'fs'; import path from 'path'
const root = '/root/van/demo/dist'
const srv = http.createServer((req,res)=>{ let f = path.join(root, req.url.split('?')[0]); if(!fs.existsSync(f)||fs.statSync(f).isDirectory()) f = path.join(root,'index.html'); res.writeHead(200,{'Content-Type': f.endsWith('.css')?'text/css':f.endsWith('.js')?'text/javascript':'text/html'}); res.end(fs.readFileSync(f)) })
await new Promise(r=>srv.listen(5599,r))
const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'}); const p = await b.newPage()
p.on('console', m=>{ if(m.type()==='error') console.log('CONSOLE:', m.text().slice(0,400)) })
p.on('pageerror', e=>console.log('PAGEERROR:', String(e).slice(0,600)))
await p.goto('http://localhost:5599/#/crops/maize', {waitUntil:'networkidle'})
await p.waitForTimeout(1500)
console.log('LEN', (await p.content()).length)
await b.close(); srv.close()
