/** Emits the 26-crop soil-map data as JSON, for the Excel template builder. */
import { CROP_PLANS, CROPS } from '@/data/catalogue'
import { deriveSoilProductMap, costRowsForCrop, mappedParametersForCrop, planCandidates, ruledBy } from '@/lib/cropSoilMap'
import { SOIL_PARAMETER_LABEL, type SoilParameter } from '@/data/soilThresholds'
import { cropSlug } from '@/lib/season'

const ALL: SoilParameter[] = ['P2O', 'K2O', 'Zn', 'B', 'Fe', 'Cu', 'Mn', 'OM']
const name = (slug: string) => CROPS.find(c => cropSlug(c) === slug)?.name ?? slug
const out: unknown[] = []
for (const slug of Object.keys(CROP_PLANS)) {
  if (slug === 'wheat' || slug === 'potato') continue
  const map = deriveSoilProductMap(slug)
  const rows = costRowsForCrop(slug)
  const products = [...new Set(rows.filter(r => r.slug).map(r => r.product))]
  // Every other product in this crop's plan that carries the same nutrient — the real alternatives,
  // so a ruling can be made from what is actually there rather than from memory.
  const cands = planCandidates(slug) as unknown as { slug: string; product: string; pct: number; deliveredKg: number; nutrient: string }[]
  const KEYS: Record<string, string[]> = { P2O: ['P'], K2O: ['K'], Zn: ['Zn'], B: ['B'], Fe: ['Fe'], Cu: ['Cu'], Mn: ['Mn'], OM: ['HA', 'OM'] }
  const params = ALL.map(p => {
    const e = map.find(x => x.parameter === p)
    const ruling = ruledBy(slug, p)
    const others = [...new Set(cands.filter(c => KEYS[p].includes(c.nutrient)).map(c => c.product))]
      .filter(n => n !== (e ? e.product : ''))
    return {
      key: p, label: SOIL_PARAMETER_LABEL[p],
      answer: e ? e.product : '',
      why: e ? e.note.replace(/^Derived from the [a-z0-9-]+ plan's own rows: /, '').replace(/\.$/, '') : 'no product in this programme carries it',
      offered: !!e,
      ruled: !!(ruling && e && e.slug === ruling.slug),
      others,
    }
  })
  out.push({
    slug, name: name(slug), products,
    params,
    ph: map.filter(x => x.parameter === 'pH').map(x => x.product),
    offeredCount: mappedParametersForCrop(slug).length,
  })
}
console.log(JSON.stringify(out, null, 1))
