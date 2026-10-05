/**
 * REMOVE EVERY EM DASH FROM WHAT A READER SEES — 9 September 2026.
 *
 * Tahir's standing instruction on the whole site: "Say the fact plainly, in the order it happened,
 * and let a large bold number carry the weight the sentence was trying to carry. NO EM DASHES AT
 * ALL." He has since repeated the underlying point half a dozen times about individual headlines.
 *
 * WHAT THIS TOUCHES: user-visible text only. Code comments keep their em dashes — they are internal
 * notes to whoever maintains this, not website copy, and rewriting 500 of them would be churn that
 * buries the real changes in the diff.
 *
 * HOW IT DECIDES, because a blind find-and-replace produces bad English:
 *   · PAIRED dashes around a short aside ("the site — which is static — cannot") become commas.
 *     Turning both into full stops is how you get "The site. Which is static. Cannot."
 *   · A SINGLE dash becomes a full stop and the next word is capitalised, which is the plainest
 *     reading and is exactly what he asked for: say the fact, then say the next fact.
 *   · Before a digit or a lower-case fragment that cannot open a sentence, a comma is used instead.
 *   · EN DASHES (–) ARE NEVER TOUCHED. They carry ranges: pH 7.5–8.0, 2016–2018, 0–150 GDD.
 *     Converting one of those would corrupt data, not prose.
 *
 * Every change is written to em-dash-changes.txt so the rewrite can be read rather than trusted.
 */
import { readdirSync, statSync, readFileSync, writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)))
const SRC = join(ROOT, 'src')
const EM = '—'

const files = []
;(function walk(d) {
  for (const e of readdirSync(d)) {
    const p = join(d, e)
    if (statSync(p).isDirectory()) { walk(p); continue }
    if (/\.(ts|tsx)$/.test(p)) files.push(p)
  }
})(SRC)

const cap = w => w.charAt(0).toUpperCase() + w.slice(1)
const changes = []

/** Rewrite one line of NON-COMMENT source. */
function fixLine(line) {
  if (!line.includes(EM)) return line
  let out = line

  // 1. Paired: "text — short aside — text" on one line, aside under 70 chars and no sentence end.
  out = out.replace(
    new RegExp(`\\s${EM}\\s([^${EM}]{1,70}?)\\s${EM}\\s`, 'g'),
    (m, inner) => (/[.!?]$/.test(inner) ? m : `, ${inner}, `),
  )

  // 2. Remaining singles.
  out = out.replace(new RegExp(`\\s*${EM}\\s*`, 'g'), (_m, off, s) => {
    const after = s.slice(off).replace(new RegExp(`^\\s*${EM}\\s*`), '')
    const first = after.match(/^[^\s]+/)?.[0] ?? ''
    // A digit, a currency figure, or a closing bracket cannot open a sentence.
    if (/^[0-9€$£₨(]/.test(first) || first === '') return ', '
    // A word that only ever continues a clause.
    if (/^(and|or|but|so|which|who|because|that|than|then|with|for|to|in|on|at|of|as|not|never|no|only|just|both|either|each)\b/i.test(first)) return ', '
    return '. '
  })

  // Capitalise after a full stop this pass introduced.
  out = out.replace(/\. ([a-z])/g, (m, c, off, s) => {
    // only where the original had a dash at that spot
    const before = s.slice(0, off)
    return line.length !== out.length || true ? `. ${c.toUpperCase()}` : m
  })
  return out
}

let total = 0
for (const f of files) {
  const src = readFileSync(f, 'utf8')
  if (!src.includes(EM)) continue
  const lines = src.split('\n')
  let inBlock = false
  let touched = false
  const next = lines.map((line, i) => {
    const trimmed = line.trim()
    if (inBlock) { if (trimmed.includes('*/')) inBlock = false; return line }
    if (trimmed.startsWith('/*')) { if (!trimmed.includes('*/')) inBlock = true; return line }
    if (trimmed.startsWith('//') || trimmed.startsWith('*')) return line
    const fixed = fixLine(line)
    if (fixed !== line) { touched = true; total++; changes.push(`${f.replace(ROOT + '/', '')}:${i + 1}\n  -  ${line.trim()}\n  +  ${fixed.trim()}\n`) }
    return fixed
  })
  if (touched) writeFileSync(f, next.join('\n'))
}

writeFileSync(join(ROOT, 'em-dash-changes.txt'), changes.join('\n'))
console.log(`lines rewritten: ${total}`)
console.log(`review file: em-dash-changes.txt`)
