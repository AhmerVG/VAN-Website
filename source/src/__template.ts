/** Emits the 26-crop soil-map template for Tahir to correct. Run: node run-enginetest.cjs __template */
import { CROP_PLANS } from '@/data/catalogue'
import { deriveSoilProductMap, costRowsForCrop, mappedParametersForCrop } from '@/lib/cropSoilMap'
import { SOIL_PARAMETER_LABEL, type SoilParameter } from '@/data/soilThresholds'
import { CROPS } from '@/data/catalogue'
import { cropSlug } from '@/lib/season'

const ALL: SoilParameter[] = ['P2O', 'K2O', 'Zn', 'B', 'Fe', 'Cu', 'Mn', 'OM']
const name = (slug: string) => CROPS.find(c => cropSlug(c) === slug)?.name ?? slug
const out: string[] = []

for (const slug of Object.keys(CROP_PLANS)) {
  if (slug === 'wheat' || slug === 'potato') continue
  const map = deriveSoilProductMap(slug)
  const rows = costRowsForCrop(slug)
  const params = mappedParametersForCrop(slug)
  const vanProducts = [...new Set(rows.filter(r => r.slug).map(r => r.product))]
  out.push(`\n### ${name(slug)}  \`${slug}\``)
  out.push('')
  out.push(`Products in this programme: ${vanProducts.join(' · ')}`)
  out.push('')
  out.push('| Soil reading | My answer | Why | **Your ruling** |')
  out.push('|---|---|---|---|')
  for (const p of ALL) {
    const e = map.find(x => x.parameter === p)
    if (e) {
      const why = e.note.replace(/^Derived from the [a-z0-9-]+ plan's own rows: /, '')
      out.push(`| ${SOIL_PARAMETER_LABEL[p]} | **${e.product}** | ${why} | |`)
    } else {
      out.push(`| ${SOIL_PARAMETER_LABEL[p]} | *not offered* | no product in this programme carries it | |`)
    }
  }
  const ph = map.filter(x => x.parameter === 'pH').map(x => x.product)
  out.push(`| pH | ${ph.length ? '**' + ph.join('** + **') + '**' : '*substitution only*'} | urea → Vital Urea at constant N, plus a real quantity effect on the phosphorus and zinc lines | |`)
  out.push('| EC (salts) | *advisory, no product* | gypsum, leaching and drainage. VAN does not sell a bag as the answer | |')
  out.push('')
  out.push(`Offered on this crop: ${params.length} of 10.`)
}
console.log(out.join('\n'))
