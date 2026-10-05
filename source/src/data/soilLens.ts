// The soil lens — curated narrative over SOIL / SOIL_GRID (src/data/soil.ts).
// RULES: every figure below is computed from the 36 Punjab district workbooks (770,160 valid samples).
// The dataset establishes CONDITIONS. It does not establish MECHANISM — mechanism sentences below are
// VAN's own already-published site copy (the 3 losses, the wheat page) and are labelled as such.
// Never phrase a soil figure as product performance.

export const SOIL_SOURCE = {
  short: 'Punjab soil testing programme · 36 district workbooks · 770,160 valid samples · c. 2016–2018',
  long: '36 district workbooks from the Punjab soil testing programme, each row one georeferenced sample carrying district, tehsil, markaz, union council and mauza identifiers alongside the laboratory determinations. Every row was read; no sub-sampling. Records without a valid pH were excluded; 770,160 remained. Province figures are weighted by district sample count.',
  caveats: [
    ['Age', 'The sampling window is roughly 2016–2018. These figures describe a structural baseline, not present-day status.'],
    ['Observational', 'Survey data with no controlled treatments. It establishes conditions with very high confidence. It cannot establish mechanism, for that, controlled and peer-reviewed work is the appropriate evidence.'],
    ['Thresholds', 'Deficiency shares use Punjab’s working thresholds: organic matter below 0.86%, available phosphorus below 7 ppm (adequate at 15), available potash below 180 ppm, zinc below 1.0 ppm, boron below 0.5 ppm.'],
    ['Repairs', 'The Sheikhupura workbook carries a duplicated header column; it was re-parsed with the offset corrected. Jhelum returns no valid zinc data. Physically impossible values were bounded before averaging.'],
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
  ['Organic matter', '0.61%'], ['Phosphorus, available', '6.62 ppm'], ['Potash, available', '132 ppm'], ['Calcium carbonate', '6.53%'],
  ['Zinc', '1.25 ppm'], ['Copper', 'ppm'], ['Iron', 'ppm'], ['Manganese', 'ppm'], ['Boron', '0.59 ppm'],
]
export const SOIL_MISSING = {
  title: 'Sulfur, not determined',
  text: 'Sulfur appears in no district file, in no column, at any point in the sampling programme. Sulfur was left off the testing schedule, so no result for it exists. Because it is never measured, it is never reported as deficient and it never enters a fertiliser plan.',
  vanLine: 'Sulfur is in VAN’s published programmes. The wheat plan alone places Green Sulfur at germination and again at early growth. Sulfur appears in none of the 770,160 determinations.',
}

// What the data supports — verdicts, exactly as the evidence page states them. Series across pH bands 7.0–7.5 · 7.5–8.0 · 8.0–8.5 · ≥8.5 (99.9% of samples)
export type Verdict = 'Holds' | 'Holds, with a limit' | 'Observed, not explained here' | 'Does not hold'
export const SOIL_RELATIONS: { key: string; title: string; verdict: Verdict; series: string; text: string; x: 'phband' | 'omband' | 'cacoband' | 'texture'; y: 'caco3' | 'zn' | 'p' | 'k' | 'b' | 'om' }[] = [
  { key: 'caco3-ph', title: 'Carbonate drives alkalinity', verdict: 'Holds', series: '3.41 → 4.86 → 6.91 → 7.41 % CaCO₃', text: 'Mean calcium carbonate rises monotonically across every pH band. The alkalinity is calcareous in origin, exactly as expected.', x: 'phband', y: 'caco3' },
  { key: 'zn-ph', title: 'Zinc falls as pH rises', verdict: 'Holds', series: '1.45 → 1.42 → 1.20 → 1.20 ppm Zn', text: 'Mean available zinc declines across the gradient. Modest but consistent, and directionally correct for micronutrient fixation.', x: 'phband', y: 'zn' },
  { key: 'k-texture', title: 'Sandy soil holds less potash', verdict: 'Holds', series: 'loam 136 · clay loam 136 · sandy loam 102 ppm K', text: 'Available potash is lowest on sandy loam, the coarsest common texture in the survey, and highest on the heavier loams. Texture sets how much potash the soil can hold between applications.', x: 'texture', y: 'k' },
  { key: 'zn-caco3', title: 'Zinc is highest where carbonate is lowest', verdict: 'Holds, with a limit', series: '1.86 → 1.14 → 1.10 → 1.34 ppm Zn', text: 'Below 3% calcium carbonate, mean zinc is 1.86 ppm; above 3% it drops sharply and stays low. The ≥10% band turns back up, so the relationship is not monotonic across the whole range.', x: 'cacoband', y: 'zn' },
  { key: 'p-ph', title: 'Phosphorus vs pH', verdict: 'Does not hold', series: '5.47 → 5.82 → 6.88 → 6.84 ppm P', text: 'Available phosphorus does not fall as pH rises in this dataset; it is flat to slightly rising. Almost certainly confounded by fertiliser history, since the highest-pH districts are the most intensively fertilised. The P-fixation mechanism is real and well evidenced in controlled work, but it is not visible here, and should not be claimed from this data.', x: 'phband', y: 'p' },
  { key: 'zn-om', title: 'Zinc vs organic matter', verdict: 'Observed, not explained here', series: '1.28 → 1.27 → 1.08 → 0.99 ppm Zn', text: 'Mean zinc is lower in the small share of samples with higher organic matter. Reported because it is in the data; no mechanism is claimed for it.', x: 'omband', y: 'zn' },
]

// Mechanism sentences — VAN's own published copy (live site), the only mechanism claims the demos may make
export const SOIL_MECHANISMS = [
  { nutrient: 'Nitrogen', condition: 'pH above 8, 69.1% of samples', copy: 'Above pH 8, surface urea leaves as ammonia before the crop can use it. What dissolves moves down with the irrigation water.', from: 'van.com.pk · Home · the 3 losses', products: ['vital-urea'] },
  { nutrient: 'Phosphate', condition: 'Calcareous soil. Mean CaCO₃ 6.53%, rising with pH', copy: 'Calcareous soil binds phosphate with free calcium and takes most of it back before the root arrives.', from: 'van.com.pk · Home · the 3 losses', products: ['green-phosphate', 'np-range', 'v-phosphate', 'fusion-phosphate'] },
  { nutrient: 'Potash', condition: '87.8% below 180 ppm. Lowest on sandy loam', copy: 'Pakistan applies 83 kg of nitrogen for every 1 kg of potash, so the crop draws potash from the soil’s own reserve.', from: 'van.com.pk · Home · the 3 losses', products: ['vital-potash', 'fusion-potash', 'sop', 'vl-potash-liquid', 'v-potash-plus'] },
  // 28 Sep 2026: copy trimmed to match the wheat page's actual wording (crops/wheat.html) — it
  // never named Zn²⁺-phosphate or calcium-carbonate adsorption, chemistry this site had no source for.
  { nutrient: 'Zinc', condition: '59.0% below 1.0 ppm. Falls as pH rises', copy: 'In Punjab’s alkaline, high-pH soils, zinc is chemically fixed, making it unavailable to roots even when total soil Zn is adequate.', from: 'van.com.pk · Wheat programme · deficiency notes', products: ['v-transform', 'v-zinc', 'vl-micro-mix'] },
  { nutrient: 'Organic matter', condition: '90.2% below 0.86%. Mean 0.61%', copy: 'Concentrated humate with fulvic acid and potash for fertigation and foliar use on soils under 1% organic matter.', from: 'van.com.pk · Formulation library · BIO-H50F', products: ['humi-grow', 'humi-grow-plus', 'v-compost', 'tornado'] },
  { nutrient: 'Boron', condition: '51.7% below 0.5 ppm', copy: 'Vital Potash, N 11 · K₂O 44, coated with boron in 2 forms.', from: 'van.com.pk · Products', products: ['v-boron', 'vital-potash', 'fusion-potash'] },
  { nutrient: 'Sulfur', condition: 'Not determined in any of 770,160 samples', copy: 'Sulfur Coated Urea · N 32% min · S 13% min. Green Sulfur · Sulfur 70% WDG.', from: 'van.com.pk · Products', products: ['vital-urea', 'green-sulfur'] },
]

// Per-product strip: which soil condition the product page should show ("what the soil does to this")
export const PRODUCT_SOIL: Record<string, { figure: string; line: string; relation?: string }> = {
  N: { figure: '69.1% of Punjab samples above pH 8.0', line: 'Above pH 8, part of the surface urea is lost as ammonia', relation: 'caco3-ph' },
  P: { figure: '97.9% below adequate available phosphorus · mean CaCO₃ 6.53%', line: 'calcareous soil, carbonate rising with pH. The condition the phosphate range is built against', relation: 'caco3-ph' },
  K: { figure: '87.8% below 180 ppm available potash', line: 'lowest on sandy loam (102 ppm). Texture sets what the soil can hold', relation: 'k-texture' },
  NPK: { figure: '87.8% low potash · 97.9% below adequate phosphorus', line: '2 of 3 macronutrients short in most samples', relation: 'k-texture' },
  MICRO: { figure: '59.0% below 1.0 ppm zinc · 51.7% below 0.5 ppm boron', line: 'zinc falls as pH rises: 1.45 → 1.20 ppm across the bands', relation: 'zn-ph' },
  SEC: { figure: 'Sulfur: not determined in 770,160 samples', line: 'a nutrient that is never measured cannot appear deficient' },
  BIO: { figure: '90.2% below 0.86% organic matter · mean 0.61%', line: 'the soil has almost no carbon left to work with', relation: 'zn-om' },
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
 * Cu 1, V. Ammonium Phosphate is 10-44-0 carrying iron (iron only, Tahir 27 Sep 2026, D-214).
 *
 * "Zinc coating" is written here as ZINC, and the question behind that wording is now CLOSED.
 * Tahir, 11 September 2026: THERE IS NO ZINC-COATED GRADE. VAN's coating line coats with sulfur and
 * with boron; zinc is sold as standalone products, V-Transform at 21% granular, V-Zinc, and
 * VL-Micromix. Nothing on this site should imply a zinc-coated product exists, and this note is here
 * so the question is not reopened by the next person who reads the word "coating" in a brief.
 */
export const SOIL_BELIEF = {
  line: 'VAN feeds the soil as well as the crop.',
  sub: '8 things VAN already makes or already publishes against the condition these samples describe. Each one goes somewhere.',
  items: [
    ['Sulfur', 'Green Sulfur, 70% sulfur WDG, and Vital Urea, 13% sulfur in every granule', '#/products/green-sulfur'],
    ['Humic', 'Potassium humate, for ground under 1% carbon', '#/products/humi-grow'],
    ['Zinc', 'Zinc 21%, granular, for soil that locks it up', '#/products/v-transform'],
    ['Micronutrients', 'Zn 5 · Fe 2 · Mn 2 · Cu 1, in one foliar pass', '#/products/vl-micro-mix'],
    ['Iron', '10-44-0 carrying iron', '#/products/v-phosphate'],
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
  h1: '770,160 samples. One condition.',
  lead: 'Punjab tested 770,160 soil samples for pH, organic matter, phosphorus, potash, calcium carbonate and 5 micronutrients. Read together, they describe one soil: alkaline, calcareous, almost without carbon, short of phosphorus, potash, zinc and boron in most of them, and never tested for sulfur.',
  // Was "The map is made of the samples." Tahir: "can't we say it, we have created the maps from
  // data, so we can see, act, and respond to soil." The old line described how the map was built.
  // This one says why anybody built it.
  mapH2: 'VAN built these maps from the data, so the soil can be seen, and answered.',
  mapLead: 'Every square is the median of the georeferenced samples inside it, no boundary file, no interpolation. Switch the analyte and watch the same ground re-colour.',
  distH2: '36 districts, one gradient.',
  relH2: 'How one variable moves another, and where it does not.',
  relLead: 'These are observational district data, not a controlled experiment. 2 relationships hold cleanly, 1 holds with a limit, 1 is reported without explanation, and 1 widely-assumed relationship does not appear. Stated here because it is the one a technical reader will look for.',
  builtH2: 'What VAN builds against it.',
  builtLead: 'The survey gives the condition. The mechanism sentences are VAN’s own published copy. No performance figure is claimed for any product.',
  homeActKicker: 'The soil underneath the argument',
  homeActH2: 'Alkalinity is not a regional problem. It is the baseline.',
  homeActLead: 'Across 770,160 samples the province-weighted mean is pH 8.22. 7 samples in 10 sit above pH 8.0; the share below neutral is 979 samples out of 770,160.',
}
