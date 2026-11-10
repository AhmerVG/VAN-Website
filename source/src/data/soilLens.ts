// D-317 (26 Oct 2026): visible text cleaned of build notes and page narration, Tahir's instruction
// The soil lens — curated narrative over SOIL / SOIL_GRID (src/data/soil.ts).
// RULES: every figure below is computed from the 36 Punjab district workbooks (770,160 valid samples).
// The dataset establishes CONDITIONS. It does not establish MECHANISM — mechanism sentences below are
// VAN's own already-published site copy (the 3 losses, the wheat page) and are labelled as such.
// Never phrase a soil figure as product performance.

export const SOIL_SOURCE = {
// Tahir 7 Nov 2026 (CO-24): "about 2016 to 2018" everywhere the survey is cited.
  short: 'Punjab soil testing programme · 36 district workbooks · 770,160 valid samples · tested in about 2016 to 2018',
  long: 'The data are 36 district workbooks from the Punjab soil testing programme. Each row is 1 georeferenced sample, with district, tehsil, markaz, union council and mauza identifiers alongside the laboratory results. Every row was read, with no sub-sampling. Records without a valid pH were excluded, leaving 770,160 samples. Province figures are weighted by the number of samples in each district.',
  caveats: [
    ['Age', 'The samples were tested in about 2016 to 2018. The figures describe the soil as it was then; the soil may have changed since.'],
    ['Observational', 'These are survey data, with no controlled treatments. They establish soil conditions with very high confidence, but they cannot show what causes them; for causes, controlled and peer-reviewed studies are the appropriate evidence.'],
    // Tahir 7 Nov 2026 (KN-9): definition added in front. Was: 'Deficiency shares use Punjab’s working thresholds: ...'
    ['Thresholds', 'Punjab’s working thresholds are the cut-offs used by Punjab’s soil laboratories to rate a result as low or adequate. Deficiency shares use them: organic matter below 0.86%, available phosphorus below 7 ppm (adequate at 15 or more), available potassium below 180 ppm, zinc below 1.0 ppm, boron below 0.5 ppm.'],
    ['Corrections', '1 column in the Sheikhupura workbook was repeated by mistake; it was corrected before the figures were worked out. Jhelum has no valid zinc data. Physically impossible values were limited to the ranges listed below before medians and means were worked out.'],
  ],
}

// Province headline (from SOIL.province) — kept here as strings for copy; numbers live in SOIL.
export const SOIL_HEADLINE = {
  samples: '770,160',
  districts: 36,
  meanPh: '8.22',
  aboveSevenFive: '96.1%',
  aboveEight: '69.1%',
  aboveEightFive: '17.8%',
  meanOm: '0.61%',
  omLow: '90.2%',
  omUnderOne: '97.6%',
  meanCaco3: '6.53%',
  meanP: '6.62 ppm',
  pBelowAdequate: '97.9%',
  pLow: '59.1%',
  meanK: '132 ppm',
  kLow: '87.8%',
  meanZn: '1.25 ppm',
  znLow: '59.0%',
  meanB: '0.59 ppm',
  bLow: '51.7%',
  meanEc: '2.07 dS/m',
  saline: '9.0%',
  sulfurTested: '0',
  belowNeutral: '979 samples',
}

// The 13 determinations, and the one that is not there
export const SOIL_ANALYTES: [string, string][] = [
  ['Saturation percentage', '%'], ['Texture class', 'class'], ['Electrical conductivity', '2.07 dS/m'], ['pH', '8.22'],
  ['Organic matter', '0.61%'], ['Phosphorus, available', '6.62 ppm'], ['Potassium, available', '132 ppm'], ['Calcium carbonate', '6.53%'],
  ['Zinc', '1.25 ppm'], ['Copper', 'ppm'], ['Iron', 'ppm'], ['Manganese', 'ppm'], ['Boron', '0.59 ppm'],
]
export const SOIL_MISSING = {
  title: 'Sulfur: not tested',
  text: 'Sulfur was left off the testing schedule, so the survey has no result for it. Because sulfur was not measured, the survey could not report a sulfur deficiency, and fertiliser plans based on the survey could not include sulfur.',
  vanLine: 'VAN’s wheat crop plan recommends applying Green Sulfur twice: at germination and at early growth.',
}

// What the data supports — verdicts, exactly as the evidence page states them. Series across pH bands 7.0–7.5 · 7.5–8.0 · 8.0–8.5 · ≥8.5 (99.9% of samples)
export type Verdict = 'Holds' | 'Holds, with a limit' | 'Observed, not explained here' | 'Does not hold'
export const SOIL_RELATIONS: { key: string; title: string; verdict: Verdict; series: string; text: string; x: 'phband' | 'omband' | 'cacoband' | 'texture'; y: 'caco3' | 'zn' | 'p' | 'k' | 'b' | 'om' }[] = [
  { key: 'caco3-ph', title: 'Calcium carbonate rises with pH', verdict: 'Holds', series: 'pH 7.0–7.5: 3.41% · 7.5–8.0: 4.86% · 8.0–8.5: 6.91% · 8.5 and above: 7.41% CaCO₃', text: 'Mean calcium carbonate rises steadily from each pH group to the next.', x: 'phband', y: 'caco3' },
  { key: 'zn-ph', title: 'Zinc falls as pH rises', verdict: 'Holds', series: 'pH 7.0–7.5: 1.45 · 7.5–8.0: 1.42 · 8.0–8.5: 1.20 · 8.5 and above: 1.20 ppm Zn', text: 'Mean available zinc falls as pH rises. The fall is small but consistent, and it is in the direction expected from micronutrient fixation.', x: 'phband', y: 'zn' },
  { key: 'k-texture', title: 'Sandy soil holds less potassium', verdict: 'Holds', series: 'loam 136 · clay loam 136 · sandy loam 102 ppm K', text: 'Available potassium is lowest on sandy loam, the coarsest common texture in the survey, and highest on the heavier loams. Texture affects how much potassium the soil can hold between applications.', x: 'texture', y: 'k' },
  { key: 'zn-caco3', title: 'Zinc is highest where calcium carbonate is lowest', verdict: 'Holds, with a limit', series: 'CaCO₃ below 3%: 1.86 · 3–6%: 1.14 · 6–10%: 1.10 · 10% and above: 1.34 ppm Zn', text: 'Below 3% calcium carbonate, mean zinc is 1.86 ppm; above 3% it drops sharply and stays low. In the band of 10% and above, mean zinc rises again, so the relationship does not run in 1 direction across the whole range.', x: 'cacoband', y: 'zn' },
  { key: 'p-ph', title: 'Phosphorus does not fall as pH rises', verdict: 'Does not hold', series: 'pH 7.0–7.5: 5.47 · 7.5–8.0: 5.82 · 8.0–8.5: 6.88 · 8.5 and above: 6.84 ppm P', text: 'In this survey, available phosphorus does not fall as pH rises; it stays flat or rises slightly. This is almost certainly because of fertiliser history: the districts with the highest pH are the most intensively fertilised. Phosphorus fixation at high pH is well established in controlled studies, but it is not visible in this data.', x: 'phband', y: 'p' },
  { key: 'zn-om', title: 'Zinc is lower where organic matter is higher', verdict: 'Observed, not explained here', series: 'OM below 0.5%: 1.28 · 0.5–0.86%: 1.27 · 0.86–1.0%: 1.08 · 1.0% and above: 0.99 ppm Zn', text: 'Mean zinc is lower in the small share of samples with higher organic matter. The survey does not show why.', x: 'omband', y: 'zn' },
]

// Mechanism sentences — VAN's own published copy (live site), the only mechanism claims the demos may make
export const SOIL_MECHANISMS = [
  { nutrient: 'Nitrogen', condition: 'pH above 8, 69.1% of samples', copy: 'Above pH 8, part of the nitrogen from urea left on the soil surface is lost to the air as ammonia before the crop can use it. Nitrogen that dissolves can be carried down by the irrigation water and lost to water.', from: 'VAN’s explanation', products: ['vital-urea'] },
  { nutrient: 'Phosphate', condition: 'Calcareous soil: mean CaCO₃ 6.53%, rising with pH', copy: 'Punjab’s soil is calcareous: it is rich in calcium carbonate (lime). In calcareous soil, free calcium binds most of the phosphate applied as fertiliser before the roots can take it up.', from: 'VAN’s explanation', products: ['green-phosphate', 'np-range', 'v-phosphate', 'fusion-phosphate'] },
// Tahir 7 Nov 2026 (CO-20): potash as K₂O, and the reason for the conclusion added.
  { nutrient: 'Potassium', condition: '87.8% below 180 ppm; lowest on sandy loam', copy: 'In 2023, Pakistan applied 83 kg of nitrogen for every 1 kg of potash (as K₂O). Because so little potash is applied compared with what crops remove, crops take most of their potassium from the potassium already in the soil.', from: 'VAN’s explanation, from FAO national data', products: ['vital-potash', 'fusion-potash', 'sop', 'vl-potash-liquid', 'v-potash-plus'] },
  // 28 Sep 2026: copy trimmed to match the wheat page's actual wording (crops/wheat.html) — it
  // never named Zn²⁺-phosphate or calcium-carbonate adsorption, chemistry this site had no source for.
  { nutrient: 'Zinc', condition: '59.0% below 1.0 ppm; falls as pH rises', copy: 'In Punjab’s alkaline soils, zinc is held in chemical forms that roots cannot take up, even when the total zinc in the soil is adequate.', from: 'VAN’s explanation', products: ['v-transform', 'v-zinc', 'vl-micro-mix'] },
  { nutrient: 'Organic matter', condition: '90.2% below 0.86%; mean 0.61%', copy: 'Organic matter holds nutrients and water in the soil. Soil with less than 1% organic matter can hold very little of either. VAN’s humate products are made for soils under 1% organic matter.', from: 'VAN’s explanation', products: ['humi-grow', 'humi-grow-plus', 'v-compost', 'tornado'] },
  { nutrient: 'Boron', condition: '51.7% below 0.5 ppm', copy: 'More than half of Punjab’s samples were low in boron, but the margin between enough boron and too much boron is small, so the dose has to be measured carefully. VAN supplies boron as a coating on Vital Potash granules, as part of Fusion Potash, and on its own as VL-Boron.', from: 'VAN’s explanation', products: ['v-boron', 'vital-potash', 'fusion-potash'] },
  { nutrient: 'Sulfur', condition: 'Not tested in any of the 770,160 samples', copy: 'The survey did not test sulfur. VAN supplies sulfur in Vital Urea (sulfur coated urea, S 13% minimum) and in Green Sulfur (sulfur 70%, water-dispersible granules).', from: 'VAN’s products', products: ['vital-urea', 'green-sulfur'] },
]

// Per-product strip: which soil condition the product page should show ("what the soil does to this")
export const PRODUCT_SOIL: Record<string, { figure: string; line: string; relation?: string }> = {
  N: { figure: '69.1% of samples above pH 8', line: 'In soil above pH 8, part of the nitrogen in urea left on the soil surface is lost to the air as ammonia', relation: 'caco3-ph' },
  P: { figure: '97.9% of samples below 15 ppm available phosphorus, the adequate level · mean calcium carbonate (lime) 6.53%', line: 'Punjab’s soil is calcareous, and its carbonate content is higher where the pH is higher. VAN’s phosphate range is designed for calcareous soil', relation: 'caco3-ph' },
  K: { figure: '87.8% of samples below 180 ppm available potassium, the level Punjab soil laboratories treat as adequate', line: 'Soil texture determines how much potassium a soil can hold. Of the soil textures tested, sandy loam had the lowest mean available potassium, 102 ppm', relation: 'k-texture' },
  NPK: { figure: '87.8% of samples below 180 ppm available potassium · 97.9% below 15 ppm available phosphorus', line: 'Most samples were low in both available phosphorus and available potassium, 2 of the 3 major plant nutrients', relation: 'k-texture' },
  MICRO: { figure: '59.0% of samples below 1.0 ppm available zinc · 51.7% below 0.5 ppm available boron', line: 'Available zinc falls as soil pH rises: mean available zinc was 1.45 ppm in samples at pH 7.0 to 7.5 and 1.20 ppm in samples at pH 8.5 and above', /* L1 7 Nov 2026 (Q9): bands named from the zn-ph series above; was '... in the lowest pH band and 1.20 ppm in the highest' */ relation: 'zn-ph' },
  SEC: { figure: 'Sulfur: not tested in any of the 770,160 samples', line: 'The Punjab soil testing programme did not test for sulfur, so its results cannot show whether soils are deficient in sulfur' },
  BIO: { figure: '90.2% of samples below 0.86% organic matter · mean of all samples 0.61%', line: 'Punjab soil laboratories treat organic matter below 0.86% as low, so 90.2% of samples were low in organic matter', /* Tahir 7 Nov 2026 (KN-9): was '0.86% is Punjab’s working threshold for low organic matter, so most samples were low in organic matter' */ relation: 'zn-om' },
}

/**
 * WHAT VAN BUILDS FOR THE SOIL — 10 September 2026.
 *
 * Tahir: "this page should start saying something deep about soil... soil is not dirt, its alive and
 * at VAN we believe feeding it as much as we care about crop, our portfolio, product and R&D is a
 * evidence. So we should say what should look like an ACTION not just a bold statement. Sulfur,
 * humic, zinc coating, micronutrients, iron, R4R, crop specific, soil specific, all is what VAN
 * believed, build and scaling."
 *
 * So the belief is one plain line and everything under it is a place to go. Every note is read off
 * the product's own catalogue entry, not written for effect: Green Sulfur is Sulfur 70% WDG, Vital
 * Urea is SCU at N 32 / S 13, V-Transform is zinc 21% granular, VL-Micromix is Zn 5 / Fe 2 / Mn 2 /
 * Cu 1, V. Ammonium Phosphate is 10:44:0 carrying iron (iron only, Tahir 27 Sep 2026, D-214).
 *
 * "Zinc coating" is written here as ZINC, and the question behind that wording is now CLOSED.
 * Tahir, 11 September 2026: THERE IS NO ZINC-COATED GRADE. VAN's coating line coats with sulfur and
 * with boron; zinc is sold as standalone products, V-Transform at 21% granular, V-Zinc, and
 * VL-Micromix. Nothing on this site should imply a zinc-coated product exists, and this note is here
 * so the question is not reopened by the next person who reads the word "coating" in a brief.
 */
export const SOIL_BELIEF = {
  line: 'VAN feeds the soil as well as the crop.',
  sub: '8 things VAN already makes or publishes against the condition these samples describe.',
  items: [
    // Tahir 7 Nov 2026 (PR-15: the 70% WDG is the soil granule; PR-7: 11:44:0).
    ['Sulfur', 'Green Sulfur, 70% sulfur as water-dispersible granules (WDG), and Vital Urea, 13% sulfur in every granule', '#/products/green-sulfur'],
    ['Humic', 'Potassium humate, for ground under 1% organic matter', '#/products/humi-grow'],
    ['Zinc', 'Zinc 21%, granular, for soil that locks it up', '#/products/v-transform'],
    ['Micronutrients', 'Zn 5 · Fe 2 · Mn 2 · Cu 1, in 1 foliar pass', '#/products/vl-micro-mix'],
    ['Iron', '11:44:0 carrying iron', '#/products/v-phosphate'],
    ['Right rate, time, place', 'How it is delivered is part of the product', '#/knowledge/application-systems'],
    ['Crop-specific', 'A plan per crop, stage by stage, per acre', '#/crops'],
    ['Soil-specific', 'Your district, and the ground inside it', '#soil-matrix'],
  ] as [string, string, string][],
}

export const SOIL_COPY = {
  kicker: 'Soil Atlas',   // 11 Sep 2026, Tahir's name for the tab and the page
  // Tahir, 10 Sep 2026: "WRITE THEM IN BOLD NUMBER... DONT BE STUPID, KEEP IT SIMPLE." The headline
  // had been spelling the figure out in words, which is the slowest possible way to deliver a number
  // to a reader who is scanning. The numeral is the headline now and the page says it once.
  h1: '770,160 soil samples from Punjab’s 36 districts, tested in about 2016 to 2018',
  lead: 'In about 2016 to 2018, Punjab’s soil testing programme tested 770,160 samples in 13 soil tests, including pH, organic matter, available phosphorus, available potassium, calcium carbonate and 5 micronutrients. Together, the results describe soil that is alkaline, calcareous and very low in organic matter. For available phosphorus, available potassium, zinc and boron, most samples were below Punjab’s working threshold for ‘low’. Sulfur was not tested.',   // L1 editor 7 Nov 2026 (m18): was 'below the level that Punjab’s working thresholds rate as low'
  // Was "The map is made of the samples." Tahir: "can't we say it, we have created the maps from
  // data, so we can see, act, and respond to soil." The old line described how the map was built.
  // This one says why anybody built it.
  mapH2: 'VAN built these maps from the Punjab soil testing data, so that the condition of the soil can be seen and acted on.',
  mapLead: 'The map is divided into squares, each 0.05 degrees across (about 5.5 by 4.8 km). Each square is coloured by the median of the samples taken inside it. Choosing another soil test re-colours the same squares.',
  distH2: 'All 36 districts, compared on each soil test',
  relH2: 'How the soil test results relate to each other, and where an expected relationship does not appear',
  relLead: 'These are observational survey data, not a controlled experiment. Zinc is highest where calcium carbonate is lowest, but this pattern does not hold across the whole range. Zinc is lower where organic matter is higher, but the survey cannot show why.',
  // L2 fact check 9 Nov 2026 (W5): VAN does not manufacture SOP (PR-1). Was 'What VAN makes for each soil condition'.
  builtH2: 'What VAN supplies for each soil condition',
  builtLead: 'Each soil condition below is a survey finding. What the condition does to the nutrient is VAN’s explanation from soil science, not a finding of the survey.',
  homeActKicker: 'The soil underneath the argument',
  homeActH2: 'Alkalinity is not a regional problem. It is the baseline.',
  // L1 editor 7 Nov 2026 (whyshift m8, m9, m6): weighting named as the tile caption names it, past tense for the survey, "below neutral" explained.
  // Was: 'Across 770,160 samples the province-weighted mean is pH 8.22. 7 samples in 10 sit above pH 8.0; the share below neutral is 979 samples out of 770,160.'
  homeActLead: 'Across 770,160 samples, the mean pH, weighted by the number of samples in each district, was 8.22. 7 samples in 10 were above pH 8.0, and only 979 samples were below neutral (pH 7).',
}
