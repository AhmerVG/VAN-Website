import { validateDerivedMaps, soilMapForCrop, mappedParametersForCrop, planCandidates } from '@/lib/cropSoilMap'
import { CROP_PLANS } from '@/data/catalogue'

const problems = validateDerivedMaps()
console.log(problems.length ? 'VALIDATION FAILED:\n  ' + problems.join('\n  ') : 'VALIDATION PASSED. The rules reproduce both reviewed maps exactly')

console.log('\ncrop                 params  responders')
const rows: string[] = []
for (const slug of Object.keys(CROP_PLANS)) {
  const map = soilMapForCrop(slug)
  const params = mappedParametersForCrop(slug)
  const uniq = map.filter(e => e.parameter !== 'pH')
  rows.push(`${slug.padEnd(20)} ${String(params.length).padStart(2)}      ` +
    uniq.map(e => `${e.parameter}=${e.slug}`).join(' '))
}
console.log(rows.join('\n'))

// which crops have no candidate at all
for (const slug of Object.keys(CROP_PLANS)) {
  const c = planCandidates(slug)
  if (!c.length) console.log('NO CANDIDATES:', slug)
}
