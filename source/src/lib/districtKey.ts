import { DISTRICT_PROFILES } from '@/data/districtSoil'

/**
 * A DISTRICT FROM A LINK, MATCHED THE WAY A PERSON TYPES IT. 19 Oct 2026 (D-268).
 *
 * The district KEYs are the survey's own (SHEIKHUPURA, D.G.KHAN, RYK, TOBA TEK SINGH) and every lookup on the site
 * compares them exactly, so ?district=sheikhupura found nothing. A link's district is matched here, ignoring case and
 * every space, dot, hyphen or underscore, against each KEY and each district's name (so "dg khan", "D.G. Khan" and
 * "rahim-yar-khan" all land). The KEYs and the data are not changed: what comes back is the KEY exactly as in the data,
 * or the text unchanged when nothing matches (so an unknown district behaves as it always did).
 * Revert: delete this file and the 2 canonicalDistrict calls in router.ts.
 */
const squash = (s: string) => s.toUpperCase().replace(/[^A-Z0-9]/g, '')

const INDEX = (() => {
  const m = new Map<string, string>()
  for (const d of DISTRICT_PROFILES) {
    for (const form of [d.key, d.name]) {
      const k = squash(form)
      if (k && !m.has(k)) m.set(k, d.key)
    }
  }
  return m
})()

export function canonicalDistrict(raw: string | null): string | null {
  if (raw == null) return null
  const t = raw.trim()
  if (!t) return raw
  return INDEX.get(squash(t)) ?? raw
}
