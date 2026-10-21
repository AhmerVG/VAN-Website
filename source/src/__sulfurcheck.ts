/**
 * D-292 check: Green Sulfur is one quantity in kg and one pack per crop (lib/sulfurPack.ts).
 * Run: npx tsc -p tsconfig.enginetest.json && node run-enginetest.cjs __sulfurcheck
 * EXPECTED_KG is each crop's season total of Green Sulfur as the plans printed it BEFORE the rule
 * (read with the same rateUnits and packInfo), so the check proves no kilogram moved.
 */
import { CROP_PLANS } from '@/data/catalogue'
import { rateUnits, packInfo, buildList } from '@/lib/season'
import { COST_PLANS } from '@/data/costPlans'
const EXPECTED_KG: Record<string, number> = {"wheat": 2, "maize": 10, "rice-basmati": 4, "rice-hybrid": 4, "cotton": 10, "sugarcane": 10, "sugarcane-ratoon": 10, "canola": 8, "sesame": 5, "soybean": 5, "sunflower": 10, "chickpea": 2, "lentil": 2, "mungbean-mash": 2, "potato": 10, "chili": 4, "garlic": 10, "turmeric": 5, "onion": 6, "banana-year1": 10, "banana-year2": 6.25, "strawberry": 8}
let fail = 0
const check = (label: string, ok: boolean, detail = '') => { if (!ok) fail++; console.log(`${ok ? '  ok  ' : '  FAIL'} ${label}${!ok && detail ? ' :: ' + detail : ''}`) }
const kgOf = (r: { rate: string; pack: string }) => rateUnits(r.rate, r.pack) * packInfo(r.pack).size
for (const [slug, cp] of Object.entries(CROP_PLANS)) {
  const rows = cp.plan.filter(r => r.product === 'Green Sulfur')
  if (!rows.length) { check(`${slug}: no Green Sulfur expected`, !(slug in EXPECTED_KG)); continue }
  const apps = rows.map(kgOf)
  const total = apps.reduce((a, b) => a + b, 0)
  const big = Math.max(...apps) > 5
  check(`${slug}: season total unchanged at ${EXPECTED_KG[slug]} kg`, Math.abs(total - EXPECTED_KG[slug]) < 1e-6, `${total}`)
  check(`${slug}: every row says kg and uses ${big ? 'the 20 kg bag' : '1 kg packs'}`, rows.every(r => /^[\d.]+ kg( in [A-Za-z]+)?$/.test(r.rate) && r.pack === (big ? 'Bag - 20 kg' : 'Pack - 1 kg')), rows.map(r => r.rate + '/' + r.pack).join('; '))
  const lines = buildList(new Set(cp.stages), 1, cp.plan).filter(l => l.product === 'Green Sulfur')
  check(`${slug}: one shopping line`, lines.length === 1, String(lines.length))
  const calc = COST_PLANS[slug]?.filter(r => r.product === 'Green Sulfur')
  if (calc?.length) check(`${slug}: calculator row in the same pack, same kg`, calc.every(c => c.packKg === (big ? 20 : 1)) && Math.abs(calc.reduce((a, c) => a + c.packKg * c.qtyPerAcre, 0) - total) < 1e-3, JSON.stringify(calc))
}
console.log(fail ? `\n${fail} FAILED` : '\nall passed')
if (fail) throw new Error(`${fail} Green Sulfur checks failed`)
