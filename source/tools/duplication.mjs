/**
 * WHAT IS SAID TWICE — 10 September 2026.
 *
 * Tahir: "make sure no duplication on the website."
 *
 * Measured rather than remembered. Every built page is stripped to its sentences; any sentence of
 * real length appearing on more than one page is reported with the pages it appears on. Boilerplate
 * that SHOULD repeat — the masthead, the footer, the source line under a figure, a nav label — is
 * excluded by name, because a footer appearing on 79 pages is not duplication, it is a footer.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
const OUT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'out')

const files = []
;(function walk(d, rel = '') {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name), r = rel ? `${rel}/${e.name}` : e.name
    if (e.isDirectory()) walk(p, r)
    else if (e.name.endsWith('.html') && e.name !== 'site map.html' && e.name !== '404.html') files.push(r)
  }
})(OUT)

/** Chrome that is supposed to be on every page. Matching is on a normalised prefix. */
const CHROME = [
  'products crop plans soil tools', 'vital agri nutrients', 'privacy', 'all rights',
  'read this before quoting', 'punjab soil testing programme', 'source ·',
  'find a dealer', 'my crop', 'verify a bag', 'make with us', 'for farmers',
  'head office', 'plant ·', 'whatsapp', 'lahore', 'accreditation no',
]

const text = f => fs.readFileSync(path.join(OUT, f), 'utf8')
  .replace(/<script[\s\S]*?<\/script>/g, ' ')
  .replace(/<style[\s\S]*?<\/style>/g, ' ')
  .replace(/<[^>]+>/g, ' ')
  .replace(/&[a-z]+;/g, ' ')
  .replace(/\s+/g, ' ')

const norm = s => s.toLowerCase().replace(/[^a-z0-9 ]/g, '').replace(/\s+/g, ' ').trim()

const map = new Map()
for (const f of files) {
  const seen = new Set()
  for (const raw of text(f).split(/(?<=[.!?])\s+/)) {
    const s = raw.trim()
    if (s.length < 60) continue                       // short lines repeat legitimately
    const n = norm(s)
    if (n.length < 60) continue
    if (CHROME.some(c => n.startsWith(c) || n.includes(c))) continue
    if (seen.has(n)) continue
    seen.add(n)
    if (!map.has(n)) map.set(n, { text: s, pages: [] })
    map.get(n).pages.push(f)
  }
}

const dupes = [...map.values()].filter(d => d.pages.length > 1)

/**
 * A sentence rendered by ONE shared component on 29 crop pages is not authored duplication —
 * it is one component. Those sentences all carry the SAME page list, so grouping by that list
 * collapses a component into a single cluster and leaves genuine repetition visible: the same
 * paragraph typed twice on two unrelated pages.
 */
const clusters = new Map()
for (const d of dupes) {
  const key = d.pages.join('|')
  if (!clusters.has(key)) clusters.set(key, { pages: d.pages, lines: [] })
  clusters.get(key).lines.push(d.text)
}
const list = [...clusters.values()].sort((a, b) => a.pages.length - b.pages.length || b.lines.length - a.lines.length)

console.log(`${files.length} pages read · ${map.size} distinct sentences of 60+ characters`)
console.log(`${dupes.length} repeated sentences, in ${list.length} clusters (same sentence set, same pages)\n`)

const SMALL = Number(process.env.MAX_PAGES || 6)
for (const c of list) {
  const big = c.pages.length > SMALL
  console.log(`── ${c.lines.length} sentence${c.lines.length > 1 ? 's' : ''} on ${c.pages.length} page${c.pages.length > 1 ? 's' : ''}${big ? '  (likely one shared component)' : ''}`)
  console.log(`   ${c.pages.slice(0, 10).join('  ')}${c.pages.length > 10 ? `  +${c.pages.length - 10} more` : ''}`)
  for (const t of c.lines.slice(0, big ? 2 : 12)) console.log(`   · ${t.slice(0, 160)}${t.length > 160 ? '…' : ''}`)
  if (c.lines.length > (big ? 2 : 12)) console.log(`   · …${c.lines.length - (big ? 2 : 12)} more`)
  console.log('')
}

/**
 * SAID TWICE ON ONE PAGE — D-166, 25 Sep 2026.
 *
 * Everything above checks across pages, and it skipped repeats inside a page on purpose
 * (`seen.has(n)`). That is exactly how /lab went live telling the blind chain twice and booking four
 * times: 4 old pages were merged into one and no check read the result as one page. This pass
 * reports, per page, any sentence of 60+ characters that appears twice, and any two sentences that
 * share at least 75% of their words (the same point reworded).
 */
const words = n => new Set(n.split(' ').filter(w => w.length > 2))
const jac = (a, b) => { let i = 0; for (const w of a) if (b.has(w)) i++; return i / (a.size + b.size - i) }
let within = 0
for (const f of files) {
  const sents = text(f).split(/(?<=[.!?])\s+/).map(s => s.trim()).filter(s => s.length >= 60)
    .map(s => ({ s, n: norm(s) })).filter(x => x.n.length >= 60 && !CHROME.some(c => x.n.startsWith(c) || x.n.includes(c)))
  const hits = []
  const ws = sents.map(x => words(x.n))
  for (let i = 0; i < sents.length; i++) for (let j = i + 1; j < sents.length; j++) {
    const same = sents[i].n === sents[j].n
    if (same || jac(ws[i], ws[j]) >= 0.75) hits.push([same ? 'same' : 'near', sents[i].s, sents[j].s])
  }
  if (hits.length) {
    within += hits.length
    console.log(`── ${f}: ${hits.length} sentence pair${hits.length > 1 ? 's' : ''} said twice on the page`)
    for (const [k, a, b] of hits.slice(0, 8)) console.log(`   ${k === 'same' ? '=' : '≈'} ${a.slice(0, 110)}${a.length > 110 ? '…' : ''}${k === 'near' ? `\n     ${b.slice(0, 110)}${b.length > 110 ? '…' : ''}` : ''}`)
    if (hits.length > 8) console.log(`   · …${hits.length - 8} more`)
  }
}
console.log(`\nWITHIN-PAGE: ${within} sentence pairs said twice on the same page`)
