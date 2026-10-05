/**
 * SHADOW CHECK — added 9 September 2026, after this cost a night's build.
 *
 * Vite resolves an extensionless import in the order .mjs, .js, .mts, .ts, ... — so a stray
 * `foo.js` sitting beside `foo.ts` WINS, silently, and the site builds against the .js.
 *
 * Four such files were found in src/ (soilProductMap, soilThresholds, pricing, soilAdjustment),
 * left behind by a mis-pointed tsc run on 8 September. Every edit to those four TypeScript files
 * after that date had NO EFFECT on the built site, and the crop pages were crashing outright with
 * "SOIL_PRODUCT_MAPS[i] is not iterable" because the stale files were CommonJS.
 *
 * Nothing about that failure was visible: tsc passed, the bundle built, and only the static builder
 * caught it, by refusing a page that rendered almost nothing. This check makes it loud instead.
 */
import { readdirSync, statSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const SRC = join(dirname(fileURLToPath(import.meta.url)), 'src')
const bad = []
const walk = d => {
  for (const e of readdirSync(d)) {
    const p = join(d, e)
    if (statSync(p).isDirectory()) { walk(p); continue }
    if (!e.endsWith('.js')) continue
    const ts = p.slice(0, -3) + '.ts'
    try { statSync(ts); bad.push(p) } catch { /* a .js with no .ts twin is a real source file */ }
  }
}
walk(SRC)

if (bad.length) {
  console.error('SHADOW CHECK FAILED — these compiled .js files shadow their TypeScript sources:')
  for (const b of bad) console.error('  ' + b)
  console.error('\nVite loads the .js and ignores the .ts. Delete them. If a build step wrote them,')
  console.error('point its outDir somewhere outside src/ (see tsconfig.enginetest.json).')
  process.exit(1)
}
console.log('shadow check: clean — no .js shadowing a .ts in src/')
