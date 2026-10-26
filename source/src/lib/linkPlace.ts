import { TEHSILS } from '@/data/soilTehsils'

/**
 * D-316, 26 Oct 2026 (open item C2 of the 20 Oct night handoff): the tehsil the farmer picked on the Soil Atlas
 * travels with him to the wheat calculator, so the WhatsApp message he sends VAN names it beside his district.
 * The calculator still reads the district (his ruled line: "The calculator reads your district, not your own land").
 * It rides after a second '#' (#/crops/wheat?district=KEY#tehsil=KEY, built as crops/wheat.html?district=KEY#tehsil=KEY),
 * the way the soil card rides as #card= (D-279), so the browser never sends it to the server; it reaches VAN only
 * inside the message the farmer chooses to send (G1). Review finding 2: it first rode in the query, which the
 * built site turns into a real address the server sees. The grid square is not carried: the card link carries no
 * place by design (finding 1 of the 20 Oct review). Only a tehsil of that district is accepted, by its key or
 * English name, so nothing typed into a link can reach the message.
 */
export function linkTehsilName(district: string | null | undefined): string {
  if (!district || typeof window === 'undefined') return ''
  let v = ''
  try {
    const m = /#tehsil=([^#&;]*)/.exec(window.location.hash)
    if (m) v = decodeURIComponent(m[1])
  } catch { return '' }
  if (!v) return ''
  const k = v.trim().toUpperCase()
  const t = TEHSILS.find(x => x.district === district && (x.key === k || x.en.toUpperCase() === k))
  return t ? t.en : ''
}
