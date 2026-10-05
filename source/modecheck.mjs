/** The two new view states are not in the pre-rendered HTML, so the static sweep never sees them.
 *  This drives a representative page in each combination and checks the same invariants. */
import { chromium } from 'playwright'
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path'; import { fileURLToPath } from 'node:url'
// The build writes beside this script; an absolute home path breaks the moment the repo is
// unpacked anywhere else, which is exactly what happened on 9 Sep 2026.
const OUT=path.join(path.dirname(fileURLToPath(import.meta.url)),'out')
const MIME={'.html':'text/html','.js':'text/javascript','.css':'text/css','.png':'image/png','.svg':'image/svg+xml','.ico':'image/x-icon','.woff2':'font/woff2'}
const srv=http.createServer((q,r)=>{const u=decodeURIComponent(q.url.split('?')[0]);const f=path.join(OUT,u==='/'?'index.html':u);if(!fs.existsSync(f)||fs.statSync(f).isDirectory()){r.writeHead(404);r.end();return}r.writeHead(200,{'content-type':MIME[path.extname(f)]||'application/octet-stream'});fs.createReadStream(f).pipe(r)})
await new Promise(r=>srv.listen(0,r)); const port=srv.address().port
const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'})
const PAGES=['/index.html','/crops/cotton.html','/crops/wheat.html','/crops/index.html','/tools.html','/partner/index.html','/soil.html','/about.html','/verify.html','/company-profile.html','/lab/index.html']   // D-166: lab added   // D-147: company profile added
let bad=0
for (const [plain,urdu] of [[0,0],[1,0],[0,1],[1,1]]) {
  for (const w of [1280,360]) {
    for (const p of PAGES) {
      const ctx=await b.newContext({viewport:{width:w,height:900},reducedMotion:'reduce'})
      await ctx.route('**/*', r=> r.request().url().startsWith(`http://localhost:${port}`)||r.request().url().startsWith('data:') ? r.continue():r.abort())
      await ctx.addInitScript(([pl,ur])=>{try{localStorage.setItem('van.plain',pl);localStorage.setItem('van.urdu',ur)}catch{}}, [String(plain),String(urdu)])
      const pg=await ctx.newPage(); const errs=[]
      pg.on('console',e=>{if(e.type()==='error')errs.push(e.text())}); pg.on('pageerror',e=>errs.push(String(e)))
      await pg.goto(`http://localhost:${port}${p}`,{waitUntil:'networkidle'}); await pg.waitForTimeout(200)
      const r=await pg.evaluate(()=>({o:document.documentElement.scrollWidth-document.documentElement.clientWidth,
        h1:document.querySelectorAll('h1').length, chars:document.body.innerText.length,
        urdu:document.querySelectorAll('[lang="ur"]').length, det:document.querySelectorAll('details').length}))
      const tag=`plain=${plain} urdu=${urdu} ${w} ${p}`
      if (r.o>1) { console.log('✗ overflow', r.o, tag); bad++ }
      if (r.h1!==1) { console.log('✗ h1', r.h1, tag); bad++ }
      if (r.chars<400) { console.log('✗ thin', r.chars, tag); bad++ }
      if (errs.length) { console.log('✗ console', errs[0], tag); bad++ }
      // O-2, 9 Sep 2026: Tahir switched Urdu OFF on the web and kept the layer in the code.
      // So the correct behaviour is now the OPPOSITE of what this line used to assert: with the
      // flag off, a page that renders Urdu is the bug. The check is inverted rather than deleted,
      // because when URDU_ON goes back to true this has to start guarding the layer again.
      if (r.urdu > 0) { console.log('! URDU RENDERED WHILE SWITCHED OFF', tag); bad++ }
      if (plain && p==='/index.html' && r.det===0) { console.log('! plain mode folded nothing', tag); bad++ }
      await ctx.close()
    }
  }
}
console.log(bad? `${bad} PROBLEMS` : `all four view states clean across ${PAGES.length} pages x 2 viewports`)
await b.close(); srv.close()
