/**
 * WHAT EACH FORMULATION CARRIES, AND HOW IT GOES ON — 10 September 2026.
 *
 * Tahir, on the Make With Us page: "The formulation library is buried in bottom and not really
 * attract attention. Two things: one, we should redesign the panel and make it more interactive and
 * add a style which match to product type, nutritions; and second, we should stitch it to the top
 * somewhere, so one can move straight to library if he want."
 *
 * PROVENANCE, and this is the whole point of keeping the table here rather than parsing it at
 * runtime: every figure below is copied from the entry's own title or text in LIBRARY, or from the
 * declared analysis already published on /partner/pipeline. Nothing is inferred from a code name,
 * and no percentage has been added that VAN has not already published. Where the library does not
 * state a figure, the nutrient is listed without one rather than given a plausible number.
 *
 * FORM is deliberately incomplete. VAN's own capability statement on this page says: "The same
 * composition is made in more than one form rather than the form dictating the composition." So the
 * form of a formulation is a decision, not a property, and it is recorded here only where the
 * library itself fixes it: "Liquid nitrogen", "fully soluble salt", "the granule's immediate soil
 * environment", "bio-fertilizer". Fourteen of the twenty-five carry no form for that reason, and they
 * are listed in the observations log for Tahir to rule on: N-22S, N-15C, NP-540, KN-44, PK-82,
 * NPK-128M, NPK-10, V-Crop series, V-Stage series, MX-Z05, MX-ZB3, MX-F05, BIO-H50F, BIO-H40. A
 * guess here would be a specification claim made to a multinational, which is the one kind of
 * mistake this page cannot afford.
 *
 * APPLY is where the library states where the product goes: pivot injection, foliar spray,
 * fertigated horticulture, seed treatment, a soil placement. Same rule. Missing means unstated.
 */

export type Nut = 'N' | 'P' | 'K' | 'S' | 'Ca' | 'Mg' | 'Zn' | 'B' | 'Fe' | 'Org'
export type Form = 'liquid' | 'soluble' | 'granular' | 'biological'
export type Apply = 'soil' | 'fertigation' | 'foliar' | 'seed'

export const NUTRIENT_LABEL: Record<Nut, string> = {
  N: 'Nitrogen', P: 'Phosphorus', K: 'Potash', S: 'Sulfur', Ca: 'Calcium', Mg: 'Magnesium',
  Zn: 'Zinc', B: 'Boron', Fe: 'Iron', Org: 'Organic matter',
}

/** One colour per nutrient, used on the chip, and the same colour wherever that nutrient appears. */
export const NUTRIENT_COL: Record<Nut, string> = {
  // D-151: text-safe shades (the chip text sits on a 9% tint). Was N #2E7D4F, K #B5522A, S #B98416.
  N: '#276B43', P: '#0E3550', K: '#9A3F1C', S: '#8A5D0F', Ca: '#1B4A6B', Mg: '#4F6373',
  Zn: '#7A5230', B: '#7A5230', Fe: '#7A5230', Org: '#5C6B3C',
}

export const FORM_LABEL: Record<Form, string> = {
  liquid: 'Liquid', soluble: 'Soluble', granular: 'Granular', biological: 'Biological',
}

export const APPLY_LABEL: Record<Apply, string> = {
  soil: 'Soil applied', fertigation: 'Fertigation', foliar: 'Foliar', seed: 'Seed treatment',
}

export type LibMeta = { n: [Nut, string?][]; form?: Form; apply?: Apply[] }

export const LIB_META: Record<string, LibMeta> = {
  // "Nitro Sulfur. N 22 · elemental S 18"
  'N-22S': { n: [['N', '22'], ['S', '18']], apply: ['soil'] },
  // "Liquid nitrogen 26% with zinc and boron" · pivot injection and foliar spray. Zn and B figures
  // are published on /partner/pipeline (Zn 0.6%, B 0.02% for N-26L); the grades differ, so the chip
  // carries the nutrient without a figure and the dossier carries the number.
  'N-26L': { n: [['N', '26'], ['Zn'], ['B']], form: 'liquid', apply: ['fertigation', 'foliar'] },
  // "VAN Liquid CAN. N 17 · Ca 7.2" · "for fertigated horticulture"
  'N-17L': { n: [['N', '17'], ['Ca', '7.2']], form: 'liquid', apply: ['fertigation'] },
  // "Calcium nitrate. N 15.5 · Ca 18.4". Form not stated.
  'N-15C': { n: [['N', '15.5'], ['Ca', '18.4']] },
  // "Liquid foliar phosphorus 44%"
  'P-44L': { n: [['P', '44']], form: 'liquid', apply: ['foliar'] },
  // "NP 5-40" · "from one placement"
  'NP-540': { n: [['N', '5'], ['P', '40']], apply: ['soil'] },
  // "NP 8-38 + sulfur" · "the granule's immediate soil environment"
  'NP-838S': { n: [['N', '8'], ['P', '38'], ['S']], form: 'granular', apply: ['soil'] },
  // "Urea phosphate · 17-44-0 and 12-44-0" · "one fully soluble salt"
  'UP-44': { n: [['N', '17'], ['P', '44']], form: 'soluble', apply: ['fertigation'] },
  // "Potassium nitrate · 3 grades" · "Chloride-free potassium with nitrate nitrogen". No figure.
  'KN-44': { n: [['K'], ['N']] },
  // "High-purity liquid foliar potash · K₂O 45%" · "foliar and drone application"
  'K-45L': { n: [['K', '45']], form: 'liquid', apply: ['foliar'] },
  // "P 42 · K 40, 82 nutrient units"
  'PK-82': { n: [['P', '42'], ['K', '40']] },
  // "NPK 12-12-18 + micronutrients"
  'NPK-128M': { n: [['N', '12'], ['P', '12'], ['K', '18'], ['Zn'], ['B']] },
  // "NPK 19-19-19 · 3 grades" · "The fully soluble balanced grade: foliar, fertigation and drone"
  'NPK-19': { n: [['N', '19'], ['P', '19'], ['K', '19']], form: 'soluble', apply: ['foliar', 'fertigation'] },
  // "NPK 10-10-10, iron-coated"
  'NPK-10': { n: [['N', '10'], ['P', '10'], ['K', '10'], ['Fe']] },
  // "V-Potato 10-5-35 · V-Citrus 16-6-28 · V-Rice 12-10-25 · V-Wheat 21-7-19 with zinc 1.5%".
  // Four grades under one code, so the chips carry the nutrients and not one grade's numbers.
  'V-Crop series': { n: [['N'], ['P'], ['K'], ['Zn']] },
  // "Vegetative 14-21-16 · Flowering Booster 8-34-14 · Fruiting Booster 12-8-32"
  'V-Stage series': { n: [['N'], ['P'], ['K']] },
  // "Chelated zinc 5%"
  'MX-Z05': { n: [['Zn', '5']] },
  // "Zinc 12% + boron 3%" · "in a single foliar pass"
  'MX-ZB3': { n: [['Zn', '12'], ['B', '3']], apply: ['foliar'] },
  // "Chelated iron". No figure stated.
  'MX-F05': { n: [['Fe']] },
  // "K-humate 50 + fulvic 10 + potash 10"
  'BIO-H50F': { n: [['Org', '50'], ['K', '10']] },
  // "K-humate 40 + fulvic 10 + potash 10"
  'BIO-H40': { n: [['Org', '40'], ['K', '10']] },
  // "PSB bio-fertilizer" · phosphorus-solubilizing bacteria
  'BIO-P01': { n: [['P']], form: 'biological', apply: ['soil'] },
  // "Liquid PSB inoculant" · "for fertigation lines and spray tanks"
  'BIO-P01L': { n: [['P']], form: 'biological', apply: ['fertigation'] },
  // "Mycorrhizal inoculant"
  'BIO-M01': { n: [], form: 'biological', apply: ['soil'] },
  // "Bio Dividend. Seed treatment"
  'BIO-S01': { n: [], form: 'biological', apply: ['seed'] },
}

/**
 * One colour per code family, used on the card, on the dot in the ladder and on the filter chip, so
 * that a reader who has looked at the ladder for three seconds already knows what the colours mean
 * by the time he reaches the grid. This is the "the colour runs all the way through to the pack"
 * line on the pipeline page, made real rather than promised.
 */
export const FAMILY_COL: Record<string, string> = {
  N: '#2E7D4F', P: '#0E3550', K: '#B5522A', PK: '#1B4A6B', MX: '#B98416', BIO: '#5C6B3C',
}
