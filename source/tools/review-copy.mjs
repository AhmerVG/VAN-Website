/**
 * THE SINGLE-FILE REVIEW COPY — one HTML file Tahir can open from his own disk, with no server.
 *
 * The static build in out/ is 79 real files sharing one external bundle, which is right for a web
 * server and useless from a file:// double-click: the browser refuses the module script. This
 * inlines the bundle and the stylesheet into index.html so the whole site runs from one file.
 *
 * The routes are hash routes inside it, so every page is reachable exactly as it will be live.
 */
import { readFileSync, writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)))
const DIST = join(ROOT, 'dist')

let html = readFileSync(join(DIST, 'index.html'), 'utf8')

const js = html.match(/<script[^>]+src="([^"]+)"[^>]*>\s*<\/script>/)
const css = html.match(/<link[^>]+href="([^"]+\.css)"[^>]*>/)

if (js) {
  const code = readFileSync(join(DIST, js[1].replace(/^\//, '')), 'utf8')
  // A replacer FUNCTION, not a replacement string. String.replace expands $` and $' inside a
  // replacement string to "everything before the match" and "everything after the match" — and a
  // minified bundle is full of both, so passing the code as a string spliced chunks of the page into
  // the middle of the JavaScript and nothing parsed. A function is taken literally.
  html = html.replace(js[0], () => `<script type="module">
${code}
</script>`)
}
if (css) {
  const sheet = readFileSync(join(DIST, css[1].replace(/^\//, '')), 'utf8')
  html = html.replace(css[0], () => `<style>\n${sheet}\n</style>`)
}

// A quiet line at the top so nobody mistakes the review copy for the live site.
html = html.replace('<body>', `<body>
<div style="background:#0E3550;color:#fff;font:600 13px/1.4 system-ui,sans-serif;padding:7px 14px;text-align:center">
  Review copy, built ${new Date().toISOString().slice(0, 16).replace('T', ' ')}. Not live. Everything works except the parts that need a server.
</div>`)

const out = join(ROOT, 'review-copy.html')
writeFileSync(out, html)
console.log(`review copy: ${out} (${(html.length / 1024 / 1024).toFixed(2)} MB)`)
