/**
 * THE SUPPLY HALF, CHECKED ACROSS ALL 28 PROGRAMMES.
 * Run: npx tsc -p tsconfig.enginetest.json && node run-enginetest.cjs __balancecheck
 *
 * Prints, for every crop, the kilograms of nutrient its whole published programme delivers per acre
 * — and, just as importantly, every product it could NOT count and why. The uncounted list is the
 * point of this check: a supply total that silently omits a product looks complete and is not.
 */
import { CROP_PLANS } from '@/data/catalogue'
import { programmeSupply, allStages, parseAnalysis, NUTRIENTS } from '@/lib/nutrientBalance'

console.log('=== ANALYSIS STRINGS IN THE PLANS, AND WHAT EACH PARSES TO ===')
const seen = new Map<string, string[]>()
for (const [key, cp] of Object.entries(CROP_PLANS)) {
  for (const r of cp.plan) {
    if (!seen.has(r.analysis)) seen.set(r.analysis, [])
    const l = seen.get(r.analysis)!
    if (!l.includes(r.product)) l.push(r.product)
    void key
  }
}
let unparsed = 0
for (const [a, products] of [...seen.entries()].sort()) {
  const p = parseAnalysis(a)
  const shown = p ? NUTRIENTS.filter(n => p[n]).map(n => `${n} ${p[n]}%`).join(' · ') : 'NOT A COMPOSITION. Counted as nothing, named on the page'
  if (!p) unparsed++
  console.log(`  ${JSON.stringify(a).padEnd(40)} -> ${shown}`)
  console.log(`  ${' '.repeat(40)}    (${products.slice(0, 4).join(', ')}${products.length > 4 ? ` +${products.length - 4}` : ''})`)
}
console.log(`\n  ${seen.size} distinct strings, ${seen.size - unparsed} parsed, ${unparsed} name a purpose rather than a composition\n`)

console.log('=== WHAT EACH PROGRAMME DELIVERS, PER ACRE, WHOLE SEASON ===')
const head = ['crop'.padEnd(18), ...NUTRIENTS.map(n => n.padStart(7))].join('')
console.log('  ' + head)
const problems: string[] = []
for (const key of Object.keys(CROP_PLANS)) {
  const s = programmeSupply(key, allStages(key))
  const cells = NUTRIENTS.map(n => (s.perAcre[n] ? s.perAcre[n]!.toFixed(1) : 'n/a').padStart(7)).join('')
  const notes: string[] = []
  if (s.ageBand) notes.push(`age band: ${s.ageBand}`)
  if (s.perPlantRows.length) notes.push(`per-tree rows NOT in the total: ${s.perPlantRows.map(r => r.product).join(', ')}`)
  if (s.uncounted.length) notes.push(`uncounted: ${s.uncounted.map(u => u.product).join(', ')}`)
  console.log('  ' + key.padEnd(18) + cells + (notes.length ? '   ' + notes.join(' | ') : ''))
  // Invariants. A programme that delivers no nitrogen at all is either a legume plan or a bug.
  if (!s.perAcre.N && !/chickpea|lentil|mungbean|soybean/.test(key)) problems.push(`${key}: no nitrogen counted`)
  for (const n of NUTRIENTS) if ((s.perAcre[n] ?? 0) < 0) problems.push(`${key}: negative ${n}`)
}


console.log('\n=== ONE PRODUCT, TWO ANALYSES. Where the plans disagree with each other ===')
const byProduct = new Map<string, Map<string, string[]>>()
for (const [key, cp] of Object.entries(CROP_PLANS)) {
  for (const r of cp.plan) {
    if (!byProduct.has(r.product)) byProduct.set(r.product, new Map())
    const m = byProduct.get(r.product)!
    if (!m.has(r.analysis)) m.set(r.analysis, [])
    if (!m.get(r.analysis)!.includes(key)) m.get(r.analysis)!.push(key)
  }
}
let clashes = 0
for (const [product, variants] of [...byProduct.entries()].sort()) {
  if (variants.size < 2) continue
  // Two strings that parse to the SAME composition are a wording difference, not a disagreement.
  const parsed = [...variants.keys()].map(a => JSON.stringify(parseAnalysis(a)))
  const same = parsed.every(x => x === parsed[0])
  clashes++
  console.log(`  ${same ? 'wording  ' : 'DIFFERS  '} ${product}`)
  for (const [a, crops] of variants) {
    const p = parseAnalysis(a)
    console.log(`      ${JSON.stringify(a).padEnd(44)} -> ${p ? NUTRIENTS.filter(n => p[n]).map(n => `${n} ${p[n]}%`).join(' · ') : 'not a composition'}`)
    console.log(`      ${' '.repeat(44)}    in: ${crops.join(', ')}`)
  }
}
console.log(`  ${clashes} products carry more than one analysis string across the 28 plans.`)
console.log(`  A "DIFFERS" row means the two strings describe different products, and one of them is wrong.`)

console.log('\n=== A WORKED CHECK ON WHEAT, BY HAND ===')
const w = programmeSupply('wheat', allStages('wheat'))
for (const l of w.lines) {
  const c = NUTRIENTS.filter(n => l.contributes[n]).map(n => `${n} ${l.contributes[n]!.toFixed(2)}`).join('  ')
  console.log(`  ${l.product.padEnd(38)} ${l.packs.toFixed(2)} × ${l.packKg}${l.measure || 'kg'}  [${l.analysis}]  ->  ${c}`)
}
console.log(`  ${'TOTAL'.padEnd(38)} ${NUTRIENTS.filter(n => w.perAcre[n]).map(n => `${n} ${w.perAcre[n]!.toFixed(1)}`).join('  ')}`)
if (w.uncounted.length) console.log(`  not counted: ${w.uncounted.map(u => `${u.product} ("${u.analysis}")`).join('; ')}`)
console.log(`  litre-as-kilogram assumption used: ${w.usedLitreAssumption ? 'yes' : 'no'}`)

console.log(problems.length ? `\n${problems.length} PROBLEMS:\n  ` + problems.join('\n  ') : '\nno problems')
