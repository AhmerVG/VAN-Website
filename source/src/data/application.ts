/**
 * THE APPLICATION METHOD RULING — 27 September 2026, D-207.
 *
 * Tahir: "we have to make a comparison table in all decks and product pages, which shows which
 * application method is best and why. Drilling at seed is best for GP, SCU, Fusion Phosphate, Fusion
 * Potash; if not, side dressing is the 2nd option and broadcasting is the last option, and we have
 * observed a 7 to 9% basal fertilizer performance improvement if drill is chosen over broadcasting."
 * His answers the same morning: the set is every basal granular product (SOP included); the
 * observation is on wheat, maize and sugarcane, replicated observations across regions, the mean of
 * replications; the definitions below; the programme rows at land preparation read "Drill at sowing;
 * broadcast if no drill". For every urea-based product the drill places the granule beside and below
 * the seed, never with it (seed contact with urea injures seedlings; the coating reduces that, VAN
 * does not claim it removes it).
 *
 * The figure is an observation, not a trial, and the sentence says so. It is the 1 exception to the
 * 11 Sep 2026 removal of "field experience" figures, by his ruling of 27 Sep (D-207).
 */

export const BASAL_SLUGS = ['green-phosphate', 'np-range', 'vital-urea', 'fusion-phosphate', 'fusion-potash', 'crop-force', 'v-transform', 'green-sulfur', 'humi-grow', 'v-compost', 'sop'] as const

export type MethodRow = { rank: string; method: string; what: string; why: string }

export const METHOD_ROWS: MethodRow[] = [
  { rank: '1 · best', method: 'Drill at sowing', what: 'The seed drill’s fertilizer box places the granule about 5 cm beside and below the seed row, never touching the seed.', why: 'The root meets it first. Least contact with air, sun and free calcium at the surface. The whole bag is in the root zone.' },
  { rank: '2', method: 'Side-dress', what: 'A band beside the row, by hand or planter, at sowing or the first irrigation, covered with soil.', why: 'Still a band near the root, but later and shallower than a drill.' },
  { rank: '3 · last', method: 'Broadcast', what: 'Spread on the surface before the last ploughing or before an irrigation, and mixed in.', why: 'Most of the bag is away from the root, and most of it is exposed at the surface.' },
]

// 28 Sep 2026, Tahir's ruling: this sentence no longer renders on the website (see
// components/ApplicationMethods.tsx). It stays defined here, unused by the site, because it may
// still be needed by VAN's internal sales decks / the LMS deck-generation pipeline — do not delete
// without confirming that pipeline no longer reads it.
export const OBSERVATION = 'In VAN’s own fields and partner fields, on wheat, maize and sugarcane, basal fertilizer drilled at sowing has given 7 to 9% better response than the same bag broadcast: the mean of replicated observations across regions, not a published trial.'

/** The 1 line each product adds under the table, where it needs one. */
export const PRODUCT_NOTE: Record<string, string> = {
  'vital-urea': 'Drill it beside and below the seed, never in contact with it. At germination and early growth the programme rows side-dress it. Never fertigate it.',
  'green-sulfur': 'Green Sulfur comes in 2 grades: a granule for the soil, which takes this order, and a water-dispersible powder for fertigation. Where the programme row says fertigation, use the powder and follow the row.',
  'v-transform': 'The programme rows put it at germination, side-dressed beside the row. Where a plan puts it on at sowing, drill it.',
  'crop-force': 'The programme rows place it or side-dress it at grand growth and maturity. At sowing, drill it.',
  'sop': 'For the soil application. Where it goes through the water, follow the fertigation rate.',
  'humi-grow': 'Pellets. They go through a drill’s fertilizer box; where they are broadcast, mix them in before the irrigation.',
  'v-compost': 'Broadcast and mixed in at land preparation is the common practice; a drill with a wide box places it in the row.',
}

/** The programme-row wording (catalogue.ts rows at land preparation for the basal set). */
export const DRILL_ROW_METHOD = 'Drill at sowing; broadcast if no drill'
