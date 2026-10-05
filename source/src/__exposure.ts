/**
 * PRODUCT EXPOSURE — how often a farmer can actually meet each VAN product on this site.
 *
 * A product a grower never sees is a product that never sells, and until now nothing measured that.
 * This counts, for every farmer brand: how many of the 28 programmes name it, how many rows, which
 * stages and bands it appears at, whether the soil layer can ever pick it, and whether it is on the
 * home page's rail or reachable only by opening the right crop.
 *
 * It answers a question, it does not decide anything. Placement, stage and crop are Tahir's calls.
 */
import { CROP_PLANS, PRODUCTS, CROPS } from '@/data/catalogue'
import { soilMapForCrop } from '@/lib/cropSoilMap'

import { cropSlug } from '@/lib/season'

const cropName = (slug: string) => CROPS.find(c => cropSlug(c) === slug)?.name ?? slug
type Row = {
  slug: string; name: string; cat: string
  plans: string[]; rows: number; stages: string[]; bands: string[]; methods: string[]
  soilCrops: string[]; soilParams: string[]
  perPlantOnly: boolean
}
const by: Record<string, Row> = {}
for (const p of PRODUCTS) {
  if (p.family) continue
  by[p.slug] = { slug: p.slug, name: p.name, cat: p.catLabel, plans: [], rows: 0, stages: [], bands: [], methods: [], soilCrops: [], soilParams: [], perPlantOnly: true }
}
for (const [slug, cp] of Object.entries(CROP_PLANS)) {
  for (const r of cp.plan) {
    if (!r.slug || !by[r.slug]) continue
    const b = by[r.slug]
    if (!b.plans.includes(slug)) b.plans.push(slug)
    b.rows++
    if (!b.stages.includes(r.stage)) b.stages.push(r.stage)
    if (!b.bands.includes(r.band)) b.bands.push(r.band)
    if (!b.methods.includes(r.method)) b.methods.push(r.method)
    if (r.basis !== 'plant') b.perPlantOnly = false
  }
}
for (const slug of Object.keys(CROP_PLANS)) {
  for (const e of soilMapForCrop(slug)) {
    const b = by[e.slug]
    if (!b) continue
    if (!b.soilCrops.includes(slug)) b.soilCrops.push(slug)
    if (!b.soilParams.includes(e.parameter)) b.soilParams.push(e.parameter)
  }
}
const out = Object.values(by)

  .map(b => ({ ...b, planNames: b.plans.map(cropName) }))
  .sort((a, b) => a.plans.length - b.plans.length || a.rows - b.rows)
console.log(JSON.stringify(out, null, 1))
