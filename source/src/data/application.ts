// D-317 (26 Oct 2026): visible text cleaned of build notes and page narration, Tahir's instruction
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
  { rank: '1 · preferred', method: 'Drill at sowing', what: 'The seed drill’s fertiliser box places the granule about 5 cm beside and below the seed row, never touching the seed.', why: 'Roots reach a drilled granule sooner than a granule placed by side-dressing or broadcasting. Of the 3 methods, drilling leaves the granule with the least contact with air, sunlight and the free calcium at the soil surface, and it places all of the fertiliser in the root zone.' },
  { rank: '2 · second choice', method: 'Side-dress', what: 'The granules are placed in a band beside the row, by hand or with a planter, at sowing or at the first irrigation, and covered with soil.', why: 'The band is still close to the root, but it is placed less deep than a drilled granule, and it may be applied later, at the first irrigation.' },
  { rank: '3 · least preferred', method: 'Broadcast', what: 'The granules are spread over the field surface before the last ploughing or before an irrigation, and mixed into the soil.', why: 'Most of the fertiliser ends up away from the root, and most of it stays near the soil surface.' },
]

// 28 Sep 2026, Tahir's ruling: this sentence no longer renders on the website (see
// components/ApplicationMethods.tsx). It stays defined here, unused by the site, because it may
// still be needed by VAN's internal sales decks / the LMS deck-generation pipeline — do not delete
// without confirming that pipeline no longer reads it.
export const OBSERVATION = 'In VAN’s own fields and partner fields, on wheat, maize and sugarcane, basal fertilizer drilled at sowing has given 7 to 9% better response than the same bag broadcast: the mean of replicated observations across regions, not a published trial.'

/** The 1 line each product adds under the table, where it needs one. */
export const PRODUCT_NOTE: Record<string, string> = {
  // Tahir 7 Nov 2026 (PR-4): the note matches the crop plan rows (side-dressing, or broadcasting where side-dressing is not possible).
  // Tahir 10 Nov 2026 (EN-7): mixed with the phosphate at sowing and drilled with it. EN-10: the drilling observation, on the
  // Vital Urea page only (this note renders only there), worded '7 to 9% more yield per acre' to match LM-N8.
  // Was: 'Drill Vital Urea beside and below the seed, never in contact with it. At germination and early growth, ... Never apply it by fertigation.'
  // L1 editor 10 Nov 2026: m3 'it' named as Vital Urea (was '... it can be mixed with the phosphate fertiliser and drilled with it.'); M1 the 7 to 9% line
  // reworded so 'observation' is not used for replicated work. Was 'In VAN’s replicated field observations on wheat, maize and sugarcane, a drilled basal
  // fertiliser gave 7 to 9% more yield per acre than a broadcast one. This is an observation, not a published trial.' Basal fertiliser in general (VAN reply 20 Oct 2026).
  // Lead 10 Nov 2026 (L3-4), from VAN's reply of 20 Oct 2026 (source wording): 'in replicated plots' now 'in replicated field observations'.
  'vital-urea': 'Drill Vital Urea beside and below the seed, never in contact with it. At sowing, Vital Urea can be mixed with the phosphate fertiliser and the mixture drilled. At germination and early growth, VAN’s crop plans give side-dressing as the method, or broadcasting where no side-dressing is possible. Never apply it by fertigation. VAN compared drilling and broadcasting a basal fertiliser in replicated field observations on wheat, maize and sugarcane. Drilling gave 7 to 9% more yield per acre than broadcasting. These are VAN’s own field observations and have not been published as a trial.',
  // Tahir 7 Nov 2026 (PR-15): the 70% WDG is the soil granule.
  'green-sulfur': 'Green Sulfur is made in 2 grades: granules (WDG) for soil application and a water-dispersible powder for fertigation. Apply the granules in the order of preference shown above: drill, side-dress, broadcast. Where the crop plan specifies fertigation, use the powder at the rate in the plan.',
  // Tahir 10 Nov 2026 (LM-N35, keeps his 27 Sep answer): was '... Where a plan applies it at sowing, drill it.'
  'v-transform': 'In the crop plans, V-Transform is side-dressed at germination. Where the grower has a seed drill, VAN prefers drilling at sowing.',
  // Tahir 7 Nov 2026 (PR-14): the sowing sentence deleted; the stage tag in catalogue.ts now reads Grand growth and Maturity.
  'crop-force': 'In the crop plans, Crop Force is applied by band placement or side-dressing at the grand growth and maturity stages.',
  // L1 7 Nov 2026 (m17): was 'This order applies when SOP ...'
  'sop': 'The order of soil application methods above applies when SOP is applied to the soil. When SOP is applied through irrigation water (fertigation), follow the method and rate in the crop plan.',
  'humi-grow': 'Humi Grow is made as pellets, so it can go through a seed drill’s fertiliser box. Where Humi Grow is broadcast, mix it into the soil before the next irrigation.',
  'v-compost': 'The common practice is to broadcast V-Compost and mix it in at land preparation. It can also be placed in the row with a seed drill whose fertiliser box is wide enough for compost.',
}

/** The programme-row wording (catalogue.ts rows at land preparation for the basal set). */
export const DRILL_ROW_METHOD = 'Drill at sowing; broadcast if no drill'
