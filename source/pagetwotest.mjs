/**
 * PAGE 2 CLEAN-UP CHECK, 21 Oct 2026 (D-286 to D-289). Run after the build: `node pagetwotest.mjs`.
 * Reads the built HTML (no browser): no "(D-207)", one nutrient separator (colon) in visible text, units
 * pluralised by quantity, canola Vital Potash reads ¾, and the live-calculator crops (19 since D-322) carry a category label.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
const OUT = process.env.OUT || path.join(path.dirname(fileURLToPath(import.meta.url)), 'out')
let passed = 0, failed = 0
const check = (label, ok, detail = '') => { if (ok) passed++; else failed++; console.log(`${ok ? '  ok  ' : '  FAIL'} ${label}${!ok && detail ? '\n         ' + detail : ''}`) }
const walk = d => fs.readdirSync(d, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(path.join(d, e.name)) : e.name.endsWith('.html') ? [path.join(d, e.name)] : [])
const files = walk(OUT)
const visible = f => fs.readFileSync(f, 'utf8').replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ')
const text = new Map(files.map(f => [f, visible(f)]))
const hits = re => [...text].filter(([, t]) => re.test(t)).map(([f]) => path.relative(OUT, f))
check('no page shows "(D-207)"', hits(/D-207/).length === 0, hits(/D-207/).slice(0, 3).join(', '))
const GRADES = /\b(10-44-0|11\.0\.44|8-8-6|6-32-0|2-0-50|10-0-40|12-44-0|17-44-0|19-19-19|10-10-10|15-15-15|12-12-18)\b/
check('no visible text uses a hyphen or dot grade', hits(GRADES).length === 0, hits(GRADES).slice(0, 4).join(', '))
const wheat = text.get(path.join(OUT, 'crops/wheat.html')) || ''
check('wheat page shows Vital Potash as 11:0:44', /11:0:44/.test(wheat))
check('V-Phosphate shows 10:44:0', /10:44:0/.test(text.get(path.join(OUT, 'brands/v-phosphate.html')) || ''))
const crops = files.filter(f => f.includes(`${path.sep}crops${path.sep}`) && !f.endsWith('index.html'))
const badPlural = crops.filter(f => { const t = text.get(f); const m = t.match(/(?<![\d./])(\d+(?:\.\d+)?[½¼¾]?|[½¼¾]) (bag|pack)\b/gi) || []; return m.some(x => { const q = x.split(' ')[0]; const v = /[½¼¾]/.test(q) ? parseFloat(q) + ({ '½': .5, '¼': .25, '¾': .75 })[q.slice(-1)] || ({ '½': .5, '¼': .25, '¾': .75 })[q] : parseFloat(q); return v >= 1.125 }) })
check('no crop page shows a quantity above 1 with a singular bag or pack', badPlural.length === 0, badPlural.slice(0, 4).join(', '))
const cap = crops.filter(f => /\b[1-9][0-9]?\s(?:Bag|Pack)\b/.test(text.get(f)))
check('no capitalised "Bag" or "Pack" after a number on crop pages', cap.length === 0, cap.slice(0, 4).join(', '))
const canola = text.get(path.join(OUT, 'crops/canola.html')) || ''
check('canola Vital Potash stage line reads ¾ bag · 15 kg', /Vital Potash 20 kg bag · Early Growth ¾ bag · 15 kg/.test(canola), (canola.match(/Vital Potash 20 kg bag[^G]{0,60}/) || [''])[0])
const idx = fs.readFileSync(path.join(OUT, 'crops/index.html'), 'utf8')
check('crops index: 19 live-calculator cards carry a category label (12, then 4 more in D-320, 3 more in D-322)', (idx.match(/data-crop-category/g) || []).length === 19, String((idx.match(/data-crop-category/g) || []).length))

// D-292 Green Sulfur: kg on the plan, one pack per crop (5 kg or less a dose = 1 kg packs, more = the 20 kg bag).
const flat = f => (text.get(path.join(OUT, f)) || '')
check('potato (10 kg in one dose): plan says 10 kg and the list is the 20 kg bag', /Green Sulfur Sulfur 70% · 10 kg · 20 kg/.test(flat('crops/potato.html')) && /Green Sulfur 20 kg bag · Land Preparation ½ bag · 10 kg/.test(flat('crops/potato.html')))
check('cotton (5 kg a dose): plan says 5 kg and the list is 10 packs of 1 kg', /Green Sulfur Sulfur 70% · 5 kg · 1 kg/.test(flat('crops/cotton.html')) && /Green Sulfur 1 kg pack · Land Preparation, Grand Growth 10 packs · 10 kg/.test(flat('crops/cotton.html')))
check('canola: 5, 1.5 and 1.5 kg, list 8 packs of 1 kg', /Green Sulfur 1 kg pack · Land Preparation, Germination, Early Growth 8 packs · 8 kg/.test(flat('crops/canola.html')) && /· 1\.5 kg · 1 kg/.test(flat('crops/canola.html')))
const noOldSulfur = crops.filter(f => /Green Sulfur Sulfur 70% · (?:[¼½¾]|[\d.]+) (?:bags?|packs?)\b/.test(text.get(f)))
check('no crop page still prints Green Sulfur as bags or packs in the plan', noOldSulfur.length === 0, noOldSulfur.slice(0, 3).join(', '))
check('Green Sulfur product page names both packs', /2 packs: 1 kg and 20 kg/.test(flat('brands/green-sulfur.html')))

// D-293 Vital Potash: 11:0:44 is always "coated with B" and never "+ Fe" (iron is V-Potash Plus).
const vp = crops.filter(f => /11:0:44/.test(text.get(f)))
const vpBare = vp.filter(f => /11:0:44(?!, coated with B)/.test(text.get(f)))
check('every crop page that shows Vital Potash 11:0:44 says "coated with B" (' + vp.length + ' pages)', vp.length > 0 && vpBare.length === 0, vpBare.slice(0, 4).join(', '))
const vpFe = crops.filter(f => /Vital Potash NPK 11:0:44.{0,60}\bFe\b/.test(text.get(f)))
check('no crop page shows Vital Potash with Fe', vpFe.length === 0, vpFe.slice(0, 4).join(', '))
check('V-Potash Plus is still on the product list with chelated Fe', /chelated Fe/.test(flat('brands/v-potash-plus.html')))
console.log(`\n${passed} passed, ${failed} failed`)
process.exit(failed ? 1 : 0)
